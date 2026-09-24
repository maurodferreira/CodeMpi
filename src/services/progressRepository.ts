import type { StoreData } from '../types';
import { migrateStore } from '../utils/storeMigration';
import {
  browserPersistence,
  STORAGE_KEYS,
  type PersistenceAdapter,
} from './persistence';

export interface ProgressRepository {
  load(): StoreData;
  save(store: StoreData): boolean;
}

export function createProgressRepository(
  persistence: PersistenceAdapter = browserPersistence,
): ProgressRepository {
  return {
    load() {
      const parsed = persistence.read<Partial<StoreData>>(STORAGE_KEYS.progress);
      return migrateStore(parsed);
    },

    save(store) {
      return persistence.write(STORAGE_KEYS.progress, store);
    },
  };
}

export const progressRepository = createProgressRepository();
