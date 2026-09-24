import { useEffect, useState } from 'react';
import { browserPersistence, STORAGE_KEYS } from '../services/persistence';
import { addTodayActivity } from '../utils/progress';
import type { StoreData } from '../types';
const CURRENT_PROGRESS_VERSION = 2;

const createEmptyStore = (): StoreData => ({
  done: {},
  hints: {},
  lessonDone: {},
  performance: {},
  activityDates: [],
  progressVersion: CURRENT_PROGRESS_VERSION,
});

export function useProgressStore() {
  const [store, setStore] = useState<StoreData>(() => {
    const parsed = browserPersistence.read<Partial<StoreData>>(STORAGE_KEYS.progress);

    if (!parsed) return createEmptyStore();

    const savedVersion = parsed.progressVersion ?? 1;

    const migratedStore: StoreData = {
      ...createEmptyStore(),
      ...parsed,
      done: parsed.done ?? {},
      hints: parsed.hints ?? {},
      lessonDone: parsed.lessonDone ?? {},
      performance: parsed.performance ?? {},
      activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
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
