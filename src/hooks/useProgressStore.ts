import { useEffect, useState } from 'react';
import { browserPersistence, STORAGE_KEYS } from '../services/persistence';
import { addTodayActivity } from '../utils/progress';
import { migrateStore } from '../utils/storeMigration';
import type { StoreData } from '../types';

export function useProgressStore() {
  const [store, setStore] = useState<StoreData>(() => {
    const parsed = browserPersistence.read<Partial<StoreData>>(STORAGE_KEYS.progress);
    return migrateStore(parsed);
  });

  useEffect(() => {
    browserPersistence.write(STORAGE_KEYS.progress, store);
  }, [store]);

  const registerActivity = () => {
    setStore((previous) => ({
      ...previous,
      activityDates: addTodayActivity(previous.activityDates),
    }));
  };

  return {
    store,
    setStore,
    registerActivity,
  };
}
