import type {
  CloudSnapshot,
  CloudSnapshotUpdate,
  LocalToCloudBootstrapPayload,
} from '../domain/cloud';
import type { ApiClient } from './apiClient';

export interface SyncRepository {
  bootstrapLocalProfile(
    accessToken: string,
    payload: LocalToCloudBootstrapPayload,
  ): Promise<CloudSnapshot>;

  downloadSnapshot(accessToken: string): Promise<CloudSnapshot>;

  uploadSnapshot(
    accessToken: string,
    snapshot: CloudSnapshotUpdate,
  ): Promise<CloudSnapshot>;
}

export function createSyncRepository(api: ApiClient): SyncRepository {
  return {
    bootstrapLocalProfile(accessToken, payload) {
      return api.request<CloudSnapshot>('sync/bootstrap', {
        method: 'POST',
        accessToken,
        body: payload,
      });
    },

    downloadSnapshot(accessToken) {
      return api.request<CloudSnapshot>('sync/snapshot', {
        accessToken,
      });
    },

    uploadSnapshot(accessToken, snapshot) {
      return api.request<CloudSnapshot>('sync/snapshot', {
        method: 'PUT',
        accessToken,
        body: snapshot,
      });
    },
  };
}
