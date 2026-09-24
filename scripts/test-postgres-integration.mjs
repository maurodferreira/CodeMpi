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
