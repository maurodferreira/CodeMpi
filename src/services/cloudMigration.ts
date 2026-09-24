import {
  CLOUD_SNAPSHOT_VERSION,
  type LocalToCloudBootstrapPayload,
} from '../domain/cloud';
import type { AppPreferences } from '../domain/preferences';
import type { LocalIdentity } from '../domain/user';
import type { StoreData, ThemeKey } from '../types';

interface CreateBootstrapPayloadOptions {
  identity: LocalIdentity;
  progress: StoreData;
  preferences: AppPreferences;
  theme: ThemeKey;
  now?: () => string;
}

export function createLocalToCloudBootstrapPayload({
  identity,
  progress,
  preferences,
  theme,
  now = () => new Date().toISOString(),
}: CreateBootstrapPayloadOptions): LocalToCloudBootstrapPayload {
  return {
    version: CLOUD_SNAPSHOT_VERSION,
    sourceLocalUserId: identity.user.id,
    progress: structuredClone(progress),
    preferences: structuredClone(preferences),
    theme,
    exportedAt: now(),
  };
}
