import type {
  Database,
  DatabaseClient,
} from './types.js';

export interface DatabaseMigration {
  id: string;
  description: string;
  sql: string;
}

export const DATABASE_MIGRATIONS: readonly DatabaseMigration[] = [
  {
    id: '001_initial_cloud_schema',
    description: 'Cria usuários, sessões e snapshots de progresso.',
    sql: `
CREATE TABLE IF NOT EXISTS codempi_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT codempi_users_email_normalized
    CHECK (email = LOWER(BTRIM(email))),
  CONSTRAINT codempi_users_email_not_empty
    CHECK (LENGTH(email) > 3)
);

CREATE UNIQUE INDEX IF NOT EXISTS codempi_users_email_unique
  ON codempi_users (email);

CREATE TABLE IF NOT EXISTS codempi_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL
    REFERENCES codempi_users(id)
    ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT codempi_sessions_expiry_after_creation
    CHECK (expires_at > created_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS codempi_sessions_token_hash_unique
  ON codempi_sessions (token_hash);

CREATE INDEX IF NOT EXISTS codempi_sessions_user_id_index
  ON codempi_sessions (user_id);

CREATE INDEX IF NOT EXISTS codempi_sessions_expires_at_index
  ON codempi_sessions (expires_at);

CREATE TABLE IF NOT EXISTS codempi_progress_snapshots (
  user_id UUID PRIMARY KEY
    REFERENCES codempi_users(id)
    ON DELETE CASCADE,
  snapshot_version INTEGER NOT NULL,
  revision BIGINT NOT NULL DEFAULT 1,
  source_local_user_id TEXT,
  progress JSONB NOT NULL,
  preferences JSONB NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT codempi_progress_snapshot_version_positive
    CHECK (snapshot_version > 0),
  CONSTRAINT codempi_progress_revision_positive
    CHECK (revision > 0),
  CONSTRAINT codempi_progress_theme_valid
    CHECK (theme IN ('green', 'carbon', 'violet', 'crimson', 'ocean'))
);

CREATE INDEX IF NOT EXISTS codempi_progress_updated_at_index
  ON codempi_progress_snapshots (updated_at);
`.trim(),
  },
];

interface AppliedMigrationRow {
  id: string;
}

async function ensureMigrationTable(
  database: DatabaseClient,
): Promise<void> {
  await database.query(`
CREATE TABLE IF NOT EXISTS codempi_schema_migrations (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`.trim());
}

async function getAppliedMigrationIds(
  database: DatabaseClient,
): Promise<Set<string>> {
  const result = await database.query<AppliedMigrationRow>(
    'SELECT id FROM codempi_schema_migrations ORDER BY id;',
  );

  return new Set(result.rows.map((row) => row.id));
}

export async function runDatabaseMigrations(
  database: Database,
): Promise<string[]> {
  return database.transaction(async (client) => {
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('codempi_schema_migrations'));",
    );

    await ensureMigrationTable(client);

    const applied = await getAppliedMigrationIds(client);
    const executed: string[] = [];

    for (const migration of DATABASE_MIGRATIONS) {
      if (applied.has(migration.id)) continue;

      await client.query(migration.sql);
      await client.query(
        `
INSERT INTO codempi_schema_migrations (id, description)
VALUES ($1, $2);
`.trim(),
        [migration.id, migration.description],
      );

      executed.push(migration.id);
    }

    return executed;
  });
}
