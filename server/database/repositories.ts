import type {
  DatabaseProgressSnapshot,
  DatabaseSession,
  DatabaseUser,
} from './models.js';

export interface CreateUserInput {
  id: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
}

export interface UserDatabaseRepository {
  create(input: CreateUserInput): Promise<DatabaseUser>;
  findById(id: string): Promise<DatabaseUser | null>;
  findByEmail(email: string): Promise<DatabaseUser | null>;
}

export interface CreateSessionInput {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}

export interface SessionDatabaseRepository {
  create(input: CreateSessionInput): Promise<DatabaseSession>;
  findActiveByTokenHash(
    tokenHash: string,
    now: string,
  ): Promise<DatabaseSession | null>;
  revoke(id: string, revokedAt: string): Promise<void>;
}

export interface SaveProgressSnapshotInput {
  userId: string;
  snapshotVersion: number;
  sourceLocalUserId?: string | null;
  progress: unknown;
  preferences: unknown;
  theme: DatabaseProgressSnapshot['theme'];
  expectedRevision?: number;
}

export interface ProgressSnapshotDatabaseRepository {
  findByUserId(
    userId: string,
  ): Promise<DatabaseProgressSnapshot | null>;

  save(
    input: SaveProgressSnapshotInput,
  ): Promise<DatabaseProgressSnapshot>;
}
