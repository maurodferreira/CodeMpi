import type { StoreData } from '../types';

export const CURRENT_PROGRESS_VERSION = 2;

const CHANGED_EXERCISE_KEYS_BY_VERSION: Record<number, string[]> = {
  2: ['0-5', '1-7'],
};

export function createEmptyStore(): StoreData {
  return {
    done: {},
    hints: {},
    lessonDone: {},
    performance: {},
    activityDates: [],
    progressVersion: CURRENT_PROGRESS_VERSION,
  };
}

export function migrateStore(parsed?: Partial<StoreData> | null): StoreData {
  if (!parsed) return createEmptyStore();

  const savedVersion = parsed.progressVersion ?? 1;

  const migratedStore: StoreData = {
    ...createEmptyStore(),
    ...parsed,
    done: { ...(parsed.done ?? {}) },
    hints: { ...(parsed.hints ?? {}) },
    lessonDone: { ...(parsed.lessonDone ?? {}) },
    performance: { ...(parsed.performance ?? {}) },
    activityDates: Array.isArray(parsed.activityDates) ? [...parsed.activityDates] : [],
    progressVersion: savedVersion,
  };

  for (
    let targetVersion = savedVersion + 1;
    targetVersion <= CURRENT_PROGRESS_VERSION;
    targetVersion += 1
  ) {
    const changedExerciseKeys = CHANGED_EXERCISE_KEYS_BY_VERSION[targetVersion] ?? [];

    changedExerciseKeys.forEach((key) => {
      delete migratedStore.done[key];
      delete migratedStore.hints[key];
      delete migratedStore.performance[key];
    });
  }

  migratedStore.progressVersion = CURRENT_PROGRESS_VERSION;

  return migratedStore;
}
