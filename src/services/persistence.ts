export const STORAGE_KEYS = {
  progress: 'circuito_v2',
  preferences: 'codempi_preferences_v1',
  settings: 'codempi_settings_v1',
  user: 'codempi_user_v1',
  session: 'codempi_session_v1',
  cloudUser: 'codempi_cloud_user_v1',
  cloudSession: 'codempi_cloud_session_v1',
} as const;

export interface PersistenceAdapter {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): boolean;
  remove(key: string): boolean;
}

type StorageGetter = () => Storage | null;

function createWebStoragePersistence(
  getStorage: StorageGetter,
): PersistenceAdapter {
  return {
    read<T>(key: string): T | null {
      try {
        const storage = getStorage();
        const raw = storage?.getItem(key);

        if (!raw) return null;

        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },

    write<T>(key: string, value: T): boolean {
      try {
        const storage = getStorage();

        if (!storage) return false;

        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove(key: string): boolean {
      try {
        const storage = getStorage();

        if (!storage) return false;

        storage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function getSessionStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export const browserPersistence = createWebStoragePersistence(getLocalStorage);
export const browserSessionPersistence = createWebStoragePersistence(getSessionStorage);
