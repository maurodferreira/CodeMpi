import type { AppPreferences } from './preferences';
import type { ThemeKey, StoreData } from '../types';

export const CLOUD_SNAPSHOT_VERSION = 1;

export interface CloudUserProfile {
  id: string;
  kind: 'cloud';
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface AuthenticatedSession {
  userId: string;
  kind: 'cloud';
  accessToken: string;
  expiresAt: string;
}

export interface CloudSnapshot {
  version: typeof CLOUD_SNAPSHOT_VERSION;
  userId: string;
  progress: StoreData;
  preferences: AppPreferences;
  theme: ThemeKey;
  updatedAt: string;
}

export interface LocalToCloudBootstrapPayload {
  version: typeof CLOUD_SNAPSHOT_VERSION;
  sourceLocalUserId: string;
  progress: StoreData;
  preferences: AppPreferences;
  theme: ThemeKey;
  exportedAt: string;
}
