import type { CloudConfig } from '../config/cloud';
import { createApiClient, type ApiClient } from './apiClient';
import {
  createAuthRepository,
  type AuthRepository,
} from './authRepository';
import {
  createSyncRepository,
  type SyncRepository,
} from './syncRepository';

export interface CloudServices {
  api: ApiClient;
  auth: AuthRepository;
  sync: SyncRepository;
}

export function createCloudServices(
  config: CloudConfig,
): CloudServices | null {
  if (!config.enabled || !config.apiBaseUrl) {
    return null;
  }

  const api = createApiClient({
    baseUrl: config.apiBaseUrl,
  });

  return {
    api,
    auth: createAuthRepository(api),
    sync: createSyncRepository(api),
  };
}
