import type { AuthService } from '../auth/authService.js';
import type { DatabaseProgressSnapshot } from '../database/models.js';
import {
  ProgressSnapshotConflictError,
} from '../database/postgresRepositories.js';
import type {
  ProgressSnapshotDatabaseRepository,
} from '../database/repositories.js';
import {
  parseBootstrapSyncInput,
  parseUpdateSyncInput,
  SyncPayloadError,
  type SyncPreferences,
  type SyncProgressData,
  type SyncTheme,
} from './syncValidation.js';

export interface CloudSyncSnapshot {
  version: 1;
  revision: number;
  userId: string;
  sourceLocalUserId?: string;
  progress: SyncProgressData;
  preferences: SyncPreferences;
  theme: SyncTheme;
  updatedAt: string;
}

export type SyncServiceErrorCode =
  | 'INVALID_SYNC_PAYLOAD'
  | 'SNAPSHOT_NOT_FOUND'
  | 'SYNC_CONFLICT';

export class SyncServiceError extends Error {
  readonly code: SyncServiceErrorCode;
  readonly status: 400 | 404 | 409;
  readonly currentSnapshot?: CloudSyncSnapshot;

  constructor(
    code: SyncServiceErrorCode,
    status: 400 | 404 | 409,
    message: string,
    currentSnapshot?: CloudSyncSnapshot,
  ) {
    super(message);
    this.name = 'SyncServiceError';
    this.code = code;
    this.status = status;
    this.currentSnapshot = currentSnapshot;
  }
}

export interface SyncService {
  bootstrap(
    accessToken: string,
    payload: unknown,
  ): Promise<CloudSyncSnapshot>;

  download(
    accessToken: string,
  ): Promise<CloudSyncSnapshot>;

  upload(
    accessToken: string,
    payload: unknown,
  ): Promise<CloudSyncSnapshot>;
}

interface CreateSyncServiceOptions {
  auth: AuthService;
  snapshots: ProgressSnapshotDatabaseRepository;
}

function toCloudSnapshot(
  snapshot: DatabaseProgressSnapshot,
): CloudSyncSnapshot {
  return {
    version: 1,
    revision: snapshot.revision,
    userId: snapshot.userId,
    ...(snapshot.sourceLocalUserId
      ? { sourceLocalUserId: snapshot.sourceLocalUserId }
      : {}),
    progress: snapshot.progress as SyncProgressData,
    preferences: snapshot.preferences as SyncPreferences,
    theme: snapshot.theme,
    updatedAt: snapshot.updatedAt,
  };
}

function invalidPayload(
  error: unknown,
): never {
  if (error instanceof SyncPayloadError) {
    throw new SyncServiceError(
      'INVALID_SYNC_PAYLOAD',
      400,
      error.message,
    );
  }

  throw error;
}

export function createSyncService({
  auth,
  snapshots,
}: CreateSyncServiceOptions): SyncService {
  async function getUserId(
    accessToken: string,
  ): Promise<string> {
    const user = await auth.getCurrentUser(accessToken);
    return user.id;
  }

  async function requireSnapshot(
    userId: string,
  ): Promise<DatabaseProgressSnapshot> {
    const snapshot = await snapshots.findByUserId(userId);

    if (!snapshot) {
      throw new SyncServiceError(
        'SNAPSHOT_NOT_FOUND',
        404,
        'Ainda não existe um snapshot cloud para esta conta.',
      );
    }

    return snapshot;
  }

  return {
    async bootstrap(accessToken, payload) {
      let input;

      try {
        input = parseBootstrapSyncInput(payload);
      } catch (error) {
        return invalidPayload(error);
      }

      const userId = await getUserId(accessToken);
      const existing = await snapshots.findByUserId(userId);

      if (existing) {
        return toCloudSnapshot(existing);
      }

      try {
        const created = await snapshots.save({
          userId,
          snapshotVersion: input.version,
          sourceLocalUserId: input.sourceLocalUserId,
          progress: input.progress,
          preferences: input.preferences,
          theme: input.theme,
          expectedRevision: 0,
        });

        return toCloudSnapshot(created);
      } catch (error) {
        if (error instanceof ProgressSnapshotConflictError) {
          const racedSnapshot = await snapshots.findByUserId(userId);

          if (racedSnapshot) {
            return toCloudSnapshot(racedSnapshot);
          }
        }

        throw error;
      }
    },

    async download(accessToken) {
      const userId = await getUserId(accessToken);
      const snapshot = await requireSnapshot(userId);

      return toCloudSnapshot(snapshot);
    },

    async upload(accessToken, payload) {
      let input;

      try {
        input = parseUpdateSyncInput(payload);
      } catch (error) {
        return invalidPayload(error);
      }

      const userId = await getUserId(accessToken);
      const current = await requireSnapshot(userId);

      if (current.revision !== input.revision) {
        const currentSnapshot = toCloudSnapshot(current);

        throw new SyncServiceError(
          'SYNC_CONFLICT',
          409,
          'O progresso cloud foi alterado em outro lugar.',
          currentSnapshot,
        );
      }

      try {
        const saved = await snapshots.save({
          userId,
          snapshotVersion: input.version,
          sourceLocalUserId: current.sourceLocalUserId,
          progress: input.progress,
          preferences: input.preferences,
          theme: input.theme,
          expectedRevision: input.revision,
        });

        return toCloudSnapshot(saved);
      } catch (error) {
        if (error instanceof ProgressSnapshotConflictError) {
          const latest = await requireSnapshot(userId);

          throw new SyncServiceError(
            'SYNC_CONFLICT',
            409,
            'O progresso cloud foi alterado em outro lugar.',
            toCloudSnapshot(latest),
          );
        }

        throw error;
      }
    },
  };
}
