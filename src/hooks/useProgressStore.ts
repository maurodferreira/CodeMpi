import { useEffect, useState } from 'react';
import { addTodayActivity } from '../utils/progress';
import type { StoreData } from '../types';

const STORAGE_KEY = 'circuito_v2';

const EMPTY_STORE: StoreData = {
  done: {},
  hints: {},
  lessonDone: {},
  performance: {},
  activityDates: [],
};

export function useProgressStore() {
  const [store, setStore] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return EMPTY_STORE;

      const parsed = JSON.parse(saved) as Partial<StoreData>;

      return {
        ...EMPTY_STORE,
        ...parsed,
      };
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
