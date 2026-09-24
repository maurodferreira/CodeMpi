export const STORAGE_KEYS = {
  progress: 'circuito_v2',
  preferences: 'codempi_preferences_v1',
  settings: 'codempi_settings_v1',
  user: 'codempi_user_v1',
  session: 'codempi_session_v1',
} as const;

export interface PersistenceAdapter {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): boolean;
  remove(key: string): boolean;
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export const browserPersistence: PersistenceAdapter = {
  read<T>(key: string): T | null {
    try {
      const storage = getLocalStorage();
      const raw = storage?.getItem(key);

      if (!raw) return null;

      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  write<T>(key: string, value: T): boolean {
    try {
      const storage = getLocalStorage();

      if (!storage) return false;

      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      const storage = getLocalStorage();

      if (!storage) return false;

      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
