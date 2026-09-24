import { useEffect, useState } from 'react';
import { addTodayActivity } from '../utils/progress';
import type { StoreData } from '../types';

const STORAGE_KEY = 'circuito_v2';
const CURRENT_PROGRESS_VERSION = 2;

const EMPTY_STORE: StoreData = {
  done: {},
  hints: {},
  lessonDone: {},
  performance: {},
  activityDates: [],
  progressVersion: CURRENT_PROGRESS_VERSION,
};

export function useProgressStore() {
  const [store, setStore] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return EMPTY_STORE;

      const parsed = JSON.parse(saved) as Partial<StoreData>;
      const savedVersion = parsed.progressVersion ?? 1;

      const migratedStore: StoreData = {
        ...EMPTY_STORE,
        ...parsed,
        progressVersion: savedVersion,
      };

      if (savedVersion < CURRENT_PROGRESS_VERSION) {
        const changedExerciseKeys = ['0-5', '1-7'];

        changedExerciseKeys.forEach((key) => {
          delete migratedStore.done[key];
          delete migratedStore.hints[key];
          delete migratedStore.performance[key];
        });

        migratedStore.progressVersion = CURRENT_PROGRESS_VERSION;
      }

      return migratedStore;
    } catch {
      return EMPTY_STORE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
