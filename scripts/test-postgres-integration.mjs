import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, test } from 'node:test';

const databaseUrl = process.env.CODEMPI_TEST_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'CODEMPI_TEST_DATABASE_URL é obrigatória para os testes PostgreSQL.',
  );
}

const {
  createPostgresDatabase,
} = await import('../dist-server/server/database/postgres.js');

const {
  runDatabaseMigrations,
} = await import('../dist-server/server/database/migrations.js');

const {
  createPostgresProgressSnapshotRepository,
  createPostgresSessionRepository,
  createPostgresUserRepository,
  ProgressSnapshotConflictError,
} = await import('../dist-server/server/database/postgresRepositories.js');

const {
  createPostgresAuthDataStore,
} = await import('../dist-server/server/auth/authDataStore.js');

const {
  createAuthService,
} = await import('../dist-server/server/auth/authService.js');

const {
  createApiServer,
} = await import('../dist-server/server/server.js');

const database = createPostgresDatabase(databaseUrl, {
  maxConnections: 4,
  connectionTimeoutMs: 5_000,
});

before(async () => {
  await database.query(`
DROP TABLE IF EXISTS
  codempi_progress_snapshots,
  codempi_sessions,
  codempi_users,
  codempi_schema_migrations
CASCADE;
`.trim());
});

after(async () => {
  await database.close();
});

test('PostgreSQL runtime applies migrations idempotently', async () => {
  await database.ping();

  const firstRun = await runDatabaseMigrations(database);
  const secondRun = await runDatabaseMigrations(database);

  assert.deepEqual(firstRun, ['001_initial_cloud_schema']);
  assert.deepEqual(secondRun, []);

  const tables = await database.query(
    `
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'codempi_%'
ORDER BY table_name;
`.trim(),
  );

  assert.deepEqual(
    tables.rows.map((row) => row.table_name),
    [
      'codempi_progress_snapshots',
      'codempi_schema_migrations',
      'codempi_sessions',
      'codempi_users',
    ],
  );
});

test('PostgreSQL repositories persist user session and progress with revision conflicts', async () => {
  const users = createPostgresUserRepository(database);
  const sessions = createPostgresSessionRepository(database);
  const snapshots = createPostgresProgressSnapshotRepository(database);

  const userId = randomUUID();
  const sessionId = randomUUID();
  const email = `Aluno.${userId}@CodeMpi.dev`;
  const tokenHash = `sha256:${randomUUID()}`;
  const expiresAt = '2099-01-01T00:00:00.000Z';

  const user = await users.create({
    id: userId,
    email,
    passwordHash: 'scrypt:test-password-hash',
    displayName: 'Aluno Teste',
  });

  assert.equal(user.id, userId);
  assert.equal(user.email, email.toLowerCase());

  const byEmail = await users.findByEmail(email.toUpperCase());
  assert.equal(byEmail?.id, userId);

  const session = await sessions.create({
    id: sessionId,
    userId,
    tokenHash,
    expiresAt,
  });

  assert.equal(session.userId, userId);

  const active = await sessions.findActiveByTokenHash(
    tokenHash,
    '2026-09-24T19:00:00.000Z',
  );

  assert.equal(active?.id, sessionId);

  const createdSnapshot = await snapshots.save({
    userId,
    snapshotVersion: 1,
    sourceLocalUserId: 'local_test',
    progress: {
      done: {
        '0-0': 100,
      },
    },
    preferences: {
      interfaceScale: 'comfortable',
    },
    theme: 'green',
    expectedRevision: 0,
  });

  assert.equal(createdSnapshot.revision, 1);
  assert.equal(createdSnapshot.sourceLocalUserId, 'local_test');

  const updatedSnapshot = await snapshots.save({
    userId,
    snapshotVersion: 1,
    sourceLocalUserId: 'local_test',
    progress: {
      done: {
        '0-0': 100,
        '0-1': 120,
      },
    },
    preferences: {
      interfaceScale: 'large',
    },
    theme: 'violet',
    expectedRevision: 1,
  });

  assert.equal(updatedSnapshot.revision, 2);
  assert.equal(updatedSnapshot.theme, 'violet');

  await assert.rejects(
    () => snapshots.save({
      userId,
      snapshotVersion: 1,
      sourceLocalUserId: 'local_test',
      progress: {},
      preferences: {},
      theme: 'green',
      expectedRevision: 1,
    }),
    ProgressSnapshotConflictError,
  );

  await sessions.revoke(
    sessionId,
    '2026-09-24T19:30:00.000Z',
  );

  const revoked = await sessions.findActiveByTokenHash(
    tokenHash,
    '2026-09-24T19:31:00.000Z',
  );

  assert.equal(revoked, null);

  await database.query(
    'DELETE FROM codempi_users WHERE id = $1;',
    [userId],
  );

  const relatedRows = await database.query(
    `
SELECT
  (SELECT COUNT(*)::int FROM codempi_sessions WHERE user_id = $1) AS sessions,
  (SELECT COUNT(*)::int FROM codempi_progress_snapshots WHERE user_id = $1) AS snapshots;
`.trim(),
    [userId],
  );

  assert.deepEqual(relatedRows.rows[0], {
    sessions: 0,
    snapshots: 0,
  });
});


test('HTTP auth flow persists hashed credentials and revokes sessions in PostgreSQL', async () => {
  const auth = createAuthService({
    store: createPostgresAuthDataStore(database),
    sessionTtlHours: 24,
  });

  const config = {
    host: '127.0.0.1',
    port: 3001,
    webOrigin: 'http://localhost:5173',
    bodyLimitBytes: 65536,
    nodeEnv: 'test',
    databaseUrl,
    sessionTtlHours: 24,
  };

  const server = createApiServer(config, {
    database,
    auth,
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, config.host, resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === 'object');

  const baseUrl = `http://${config.host}:${address.port}`;
  const email = `auth.${randomUUID()}@codempi.dev`;
  const password = 'senha-segura-123';

  try {
    const signUpResponse = await fetch(
      `${baseUrl}/auth/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName: 'Aluno Auth',
        }),
      },
    );

    assert.equal(signUpResponse.status, 201);

    const signUp = await signUpResponse.json();

    assert.equal(signUp.user.email, email);
    assert.equal(signUp.user.displayName, 'Aluno Auth');
    assert.equal(signUp.session.kind, 'cloud');
    assert.ok(signUp.session.accessToken.length >= 40);

    const storedUser = await database.query(
      `
SELECT password_hash
FROM codempi_users
WHERE id = $1;
`.trim(),
      [signUp.user.id],
    );

    assert.equal(storedUser.rowCount, 1);
    assert.match(
      storedUser.rows[0].password_hash,
      /^scrypt\$/,
    );
    assert.notEqual(
      storedUser.rows[0].password_hash,
      password,
    );

    const storedSession = await database.query(
      `
SELECT token_hash
FROM codempi_sessions
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 1;
`.trim(),
      [signUp.user.id],
    );

    assert.equal(storedSession.rowCount, 1);
    assert.match(
      storedSession.rows[0].token_hash,
      /^[a-f0-9]{64}$/,
    );
    assert.notEqual(
      storedSession.rows[0].token_hash,
      signUp.session.accessToken,
    );

    const meResponse = await fetch(
      `${baseUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${signUp.session.accessToken}`,
        },
      },
    );

    assert.equal(meResponse.status, 200);

    const me = await meResponse.json();
    assert.equal(me.id, signUp.user.id);
    assert.equal(me.email, email);

    const duplicateResponse = await fetch(
      `${baseUrl}/auth/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toUpperCase(),
          password,
        }),
      },
    );

    assert.equal(duplicateResponse.status, 409);
    assert.equal(
      (await duplicateResponse.json()).error.code,
      'EMAIL_ALREADY_EXISTS',
    );

    const wrongPasswordResponse = await fetch(
      `${baseUrl}/auth/sign-in`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: 'senha-incorreta',
        }),
      },
    );

    assert.equal(wrongPasswordResponse.status, 401);
    assert.equal(
      (await wrongPasswordResponse.json()).error.code,
      'INVALID_CREDENTIALS',
    );

    const signOutResponse = await fetch(
      `${baseUrl}/auth/sign-out`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${signUp.session.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    assert.equal(signOutResponse.status, 200);
    assert.deepEqual(
      await signOutResponse.json(),
      { signedOut: true },
    );

    const revokedMeResponse = await fetch(
      `${baseUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${signUp.session.accessToken}`,
        },
      },
    );

    assert.equal(revokedMeResponse.status, 401);
    assert.equal(
      (await revokedMeResponse.json()).error.code,
      'UNAUTHORIZED',
    );

    const signInResponse = await fetch(
      `${baseUrl}/auth/sign-in`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toUpperCase(),
          password,
        }),
      },
    );

    assert.equal(signInResponse.status, 200);

    const signIn = await signInResponse.json();
    assert.equal(signIn.user.id, signUp.user.id);
    assert.notEqual(
      signIn.session.accessToken,
      signUp.session.accessToken,
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});
