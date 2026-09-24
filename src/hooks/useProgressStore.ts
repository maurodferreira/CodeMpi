import { useEffect, useState } from 'react';
import { addTodayActivity } from '../utils/progress';
import { progressRepository } from '../services/progressRepository';
import type { StoreData } from '../types';

export function useProgressStore() {
  const [store, setStore] = useState<StoreData>(() => progressRepository.load());

  useEffect(() => {
    progressRepository.save(store);
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
