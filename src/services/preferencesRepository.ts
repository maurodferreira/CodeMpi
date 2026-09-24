import {
  normalizePreferences,
  type AppPreferences,
} from '../domain/preferences';
import {
  browserPersistence,
  STORAGE_KEYS,
  type PersistenceAdapter,
} from './persistence';

export interface PreferencesRepository {
  load(): AppPreferences;
  save(preferences: AppPreferences): boolean;
}

export function createPreferencesRepository(
  persistence: PersistenceAdapter = browserPersistence,
): PreferencesRepository {
  return {
    load() {
      const parsed = persistence.read<Partial<AppPreferences>>(STORAGE_KEYS.preferences);
      return normalizePreferences(parsed);
    },

    save(preferences) {
      return persistence.write(STORAGE_KEYS.preferences, preferences);
    },
  };
}

export const preferencesRepository = createPreferencesRepository();
