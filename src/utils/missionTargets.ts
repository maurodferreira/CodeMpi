import { LEVELS, type Exercise } from '../data/levels';
import { getProgressKey } from './progress';
import type { ConceptSummary, StoreData } from '../types';

export interface MissionTarget {
  exercise: Exercise;
  levelIndex: number;
  exerciseIndex: number;
  done: boolean;
  attempts: number;
  failures: number;
}

export function findConceptMissionTarget(
  concept: ConceptSummary,
  store: StoreData,
  canOpen: (levelIndex: number, exerciseIndex: number) => boolean = () => true,
): MissionTarget | null {
  const candidates = LEVELS.flatMap((level, levelIndex) =>
    (level.exercises || []).flatMap((exercise, exerciseIndex) => {
      if (!exercise.conceptIds?.includes(concept.id) || !canOpen(levelIndex, exerciseIndex)) return [];

      const key = getProgressKey(levelIndex, exerciseIndex);
      const performance = store.performance[key] || { attempts: 0, failures: 0 };

      return [{
        exercise,
        levelIndex,
        exerciseIndex,
        done: Boolean(store.done[key]),
        attempts: performance.attempts,
        failures: performance.failures,
      }];
    }),
  );

  candidates.sort((a, b) => {
    if (concept.state === 'review') {
      return (
        b.failures - a.failures ||
        b.attempts - a.attempts ||
        Number(a.done) - Number(b.done) ||
        a.levelIndex - b.levelIndex ||
        a.exerciseIndex - b.exerciseIndex
      );
    }

    return (
      Number(a.done) - Number(b.done) ||
      b.failures - a.failures ||
      b.attempts - a.attempts ||
      a.levelIndex - b.levelIndex ||
      a.exerciseIndex - b.exerciseIndex
    );
  });

  return candidates[0] || null;
}

export function getNextExerciseIndex(
  levelIndex: number,
  store: StoreData,
): number {
  const exercises = LEVELS[levelIndex].exercises;
  if (!exercises?.length) return 0;

  for (let exerciseIndex = 0; exerciseIndex < exercises.length; exerciseIndex += 1) {
    if (!store.done[getProgressKey(levelIndex, exerciseIndex)]) {
      return exerciseIndex;
    }
  }

  return exercises.length - 1;
}
