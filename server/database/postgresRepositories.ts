import type {
  DatabaseProgressSnapshot,
  DatabaseSession,
  DatabaseUser,
} from './models.js';
import type {
  CreateSessionInput,
  CreateUserInput,
  ProgressSnapshotDatabaseRepository,
  SaveProgressSnapshotInput,
  SessionDatabaseRepository,
  UserDatabaseRepository,
} from './repositories.js';
import type { DatabaseClient } from './types.js';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  display_name: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  created_at: Date | string;
  expires_at: Date | string;
  revoked_at: Date | string | null;
}

interface ProgressSnapshotRow {
  user_id: string;
  snapshot_version: number;
  revision: number | string;
  source_local_user_id: string | null;
  progress: unknown;
  preferences: unknown;
  theme: DatabaseProgressSnapshot['theme'];
  created_at: Date | string;
  updated_at: Date | string;
}

export class ProgressSnapshotConflictError extends Error {
  constructor() {
    super('O snapshot foi alterado desde a última leitura.');
    this.name = 'ProgressSnapshotConflictError';
  }
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapUser(row: UserRow): DatabaseUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    displayName: row.display_name,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function mapSession(row: SessionRow): DatabaseSession {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    createdAt: toIsoString(row.created_at),
    expiresAt: toIsoString(row.expires_at),
    revokedAt: row.revoked_at
      ? toIsoString(row.revoked_at)
      : null,
  };
}

function mapSnapshot(
  row: ProgressSnapshotRow,
): DatabaseProgressSnapshot {
  const revision = Number(row.revision);

  if (!Number.isSafeInteger(revision) || revision < 1) {
    throw new Error('Revision inválida retornada pelo PostgreSQL.');
  }

  return {
    userId: row.user_id,
    snapshotVersion: row.snapshot_version,
    revision,
    sourceLocalUserId: row.source_local_user_id,
    progress: row.progress,
    preferences: row.preferences,
    theme: row.theme,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

const USER_COLUMNS = `
id,
email,
password_hash,
display_name,
created_at,
updated_at
`.trim();

const SESSION_COLUMNS = `
id,
user_id,
token_hash,
created_at,
expires_at,
revoked_at
`.trim();

const SNAPSHOT_COLUMNS = `
user_id,
snapshot_version,
revision,
source_local_user_id,
progress,
preferences,
theme,
created_at,
updated_at
`.trim();

export function createPostgresUserRepository(
  database: DatabaseClient,
): UserDatabaseRepository {
  return {
    async create(input: CreateUserInput) {
      const result = await database.query<UserRow>(
        `
INSERT INTO codempi_users (
  id,
  email,
  password_hash,
  display_name
)
VALUES ($1, $2, $3, $4)
RETURNING ${USER_COLUMNS};
`.trim(),
        [
          input.id,
          input.email.trim().toLowerCase(),
          input.passwordHash,
          input.displayName ?? null,
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error('O PostgreSQL não retornou o usuário criado.');
      }

      return mapUser(row);
    },

    async findById(id: string) {
      const result = await database.query<UserRow>(
        `
SELECT ${USER_COLUMNS}
FROM codempi_users
WHERE id = $1
LIMIT 1;
`.trim(),
        [id],
      );

      return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
    },

    async findByEmail(email: string) {
      const normalizedEmail = email.trim().toLowerCase();

      const result = await database.query<UserRow>(
        `
SELECT ${USER_COLUMNS}
FROM codempi_users
WHERE email = $1
LIMIT 1;
`.trim(),
        [normalizedEmail],
      );

      return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
    },
  };
}

export function createPostgresSessionRepository(
  database: DatabaseClient,
): SessionDatabaseRepository {
  return {
    async create(input: CreateSessionInput) {
      const result = await database.query<SessionRow>(
        `
INSERT INTO codempi_sessions (
  id,
  user_id,
  token_hash,
  expires_at
)
VALUES ($1, $2, $3, $4)
RETURNING ${SESSION_COLUMNS};
`.trim(),
        [
          input.id,
          input.userId,
          input.tokenHash,
          input.expiresAt,
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new Error('O PostgreSQL não retornou a sessão criada.');
      }

      return mapSession(row);
    },

    async findActiveByTokenHash(
      tokenHash: string,
      now: string,
    ) {
      const result = await database.query<SessionRow>(
        `
SELECT ${SESSION_COLUMNS}
FROM codempi_sessions
WHERE token_hash = $1
  AND revoked_at IS NULL
  AND expires_at > $2
LIMIT 1;
`.trim(),
        [tokenHash, now],
      );

      return result.rows[0]
        ? mapSession(result.rows[0])
        : null;
    },

    async revoke(id: string, revokedAt: string) {
      await database.query(
        `
UPDATE codempi_sessions
SET revoked_at = COALESCE(revoked_at, $2)
WHERE id = $1;
`.trim(),
        [id, revokedAt],
      );
    },
  };
}

export function createPostgresProgressSnapshotRepository(
  database: DatabaseClient,
): ProgressSnapshotDatabaseRepository {
  return {
    async findByUserId(userId: string) {
      const result = await database.query<ProgressSnapshotRow>(
        `
SELECT ${SNAPSHOT_COLUMNS}
FROM codempi_progress_snapshots
WHERE user_id = $1
LIMIT 1;
`.trim(),
        [userId],
      );

      return result.rows[0]
        ? mapSnapshot(result.rows[0])
        : null;
    },

    async save(input: SaveProgressSnapshotInput) {
      const expectedRevision = input.expectedRevision ?? null;

      const result = await database.query<ProgressSnapshotRow>(
        `
WITH updated AS (
  UPDATE codempi_progress_snapshots
  SET
    snapshot_version = $2,
    revision = codempi_progress_snapshots.revision + 1,
    source_local_user_id = $3,
    progress = $4::jsonb,
    preferences = $5::jsonb,
    theme = $6,
    updated_at = NOW()
  WHERE user_id = $1
    AND (
      $7::bigint IS NULL
      OR revision = $7::bigint
    )
  RETURNING ${SNAPSHOT_COLUMNS}
),
inserted AS (
  INSERT INTO codempi_progress_snapshots (
    user_id,
    snapshot_version,
    revision,
    source_local_user_id,
    progress,
    preferences,
    theme
  )
  SELECT
    $1,
    $2,
    1,
    $3,
    $4::jsonb,
    $5::jsonb,
    $6
  WHERE
    ($7::bigint IS NULL OR $7::bigint = 0)
    AND NOT EXISTS (
      SELECT 1
      FROM codempi_progress_snapshots
      WHERE user_id = $1
    )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING ${SNAPSHOT_COLUMNS}
)
SELECT * FROM updated
UNION ALL
SELECT * FROM inserted
LIMIT 1;
`.trim(),
        [
          input.userId,
          input.snapshotVersion,
          input.sourceLocalUserId ?? null,
          JSON.stringify(input.progress),
          JSON.stringify(input.preferences),
          input.theme,
          expectedRevision,
        ],
      );

      const row = result.rows[0];

      if (!row) {
        throw new ProgressSnapshotConflictError();
      }

      return mapSnapshot(row);
    },
  };
}
