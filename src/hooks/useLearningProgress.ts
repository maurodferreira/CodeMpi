import { useMemo } from 'react';
import { LEVELS } from '../data/levels';
import { LEVEL_LESSONS } from '../data/lessons';
import { getConcept } from '../data/concepts';
import { getHintMultiplier } from '../utils/xp';
import { getProgressKey } from '../utils/progress';
import type { ConceptSummary, StoreData } from '../types';

export function getLevelDoneCount(store: StoreData, levelIndex: number): number {
  const level = LEVELS[levelIndex];

  if (!level.exercises) return 0;

  return level.exercises.filter((_, exerciseIndex) => (
    store.done[getProgressKey(levelIndex, exerciseIndex)]
  )).length;
}

export function isLevelComplete(store: StoreData, levelIndex: number): boolean {
  const level = LEVELS[levelIndex];

  return Boolean(
    level.exercises?.length &&
    getLevelDoneCount(store, levelIndex) === level.exercises.length,
  );
}

export function isLevelUnlocked(store: StoreData, levelIndex: number): boolean {
  return levelIndex === 0 || isLevelComplete(store, levelIndex - 1);
}

export function isExerciseUnlocked(
  store: StoreData,
  levelIndex: number,
  exerciseIndex: number,
): boolean {
  if (!isLevelUnlocked(store, levelIndex)) return false;
  if (exerciseIndex === 0) return true;

  return Boolean(store.done[getProgressKey(levelIndex, exerciseIndex - 1)]);
}

export function getStoredHintMultiplier(
  store: StoreData,
  levelIndex: number,
  exerciseIndex: number,
): number {
  const shown = Math.min(store.hints[getProgressKey(levelIndex, exerciseIndex)] || 0, 4);
  return getHintMultiplier(shown);
}

export function useLearningProgress(store: StoreData) {
  const getKey = getProgressKey;

  const levelDoneCount = (levelIndex: number) => getLevelDoneCount(store, levelIndex);
  const levelComplete = (levelIndex: number) => isLevelComplete(store, levelIndex);
  const levelUnlocked = (levelIndex: number) => isLevelUnlocked(store, levelIndex);
  const exUnlocked = (levelIndex: number, exerciseIndex: number) => (
    isExerciseUnlocked(store, levelIndex, exerciseIndex)
  );
  const getMult = (levelIndex: number, exerciseIndex: number) => (
    getStoredHintMultiplier(store, levelIndex, exerciseIndex)
  );

  const { totalEarned, totalMax } = useMemo(() => {
    let earned = 0;
    let max = 0;

    LEVELS.forEach((level, levelIndex) => {
      level.exercises?.forEach((exercise, exerciseIndex) => {
        max += exercise.xp;

        const earnedXp = store.done[getProgressKey(levelIndex, exerciseIndex)];
        if (earnedXp) earned += earnedXp;
      });
    });

    Object.entries(LEVEL_LESSONS).forEach(([levelIndex, lesson]) => {
      max += lesson.rewardXp || 0;

      if (store.lessonDone[Number(levelIndex)]) {
        earned += lesson.rewardXp || 0;
      }
    });

    return { totalEarned: earned, totalMax: max };
  }, [store]);

  const levelsDoneTotal = useMemo(
    () => LEVELS.filter((_, levelIndex) => isLevelComplete(store, levelIndex)).length,
    [store],
  );

  const completedExercises = Object.keys(store.done).length;

  const continuePoint = (() => {
    for (let levelIndex = 0; levelIndex < LEVELS.length; levelIndex += 1) {
      if (!isLevelUnlocked(store, levelIndex) || !LEVELS[levelIndex].exercises?.length) continue;

      for (let exerciseIndex = 0; exerciseIndex < LEVELS[levelIndex].exercises!.length; exerciseIndex += 1) {
        if (!store.done[getProgressKey(levelIndex, exerciseIndex)]) {
          return { li: levelIndex, ei: exerciseIndex };
        }
      }
    }

    const lastBuilt = LEVELS.reduce(
      (last, level, levelIndex) => level.exercises?.length ? levelIndex : last,
      0,
    );

    return {
      li: lastBuilt,
      ei: Math.max(0, (LEVELS[lastBuilt].exercises?.length || 1) - 1),
    };
  })();

  const activeLevel = LEVELS[continuePoint.li];
  const activeLevelDone = getLevelDoneCount(store, continuePoint.li);
  const activeLevelTotal = activeLevel.exercises?.length || 0;

  const lessonsEarnedXp = Object.entries(store.lessonDone).reduce((sum, [levelIndex, done]) => {
    if (!done) return sum;

    return sum + (LEVEL_LESSONS[Number(levelIndex)]?.rewardXp || 0);
  }, 0);

  const conceptStats = useMemo<Record<string, ConceptSummary>>(() => {
    const stats = LEVELS.flatMap((level, levelIndex) =>
      (level.exercises || []).flatMap((exercise, exerciseIndex) => {
        const ids = exercise.conceptIds?.length ? exercise.conceptIds : [`skill:${exercise.skill}`];

        return ids.map((conceptId) => ({
          conceptId,
          title: exercise.title,
          levelIndex,
          exerciseIndex,
          done: Boolean(store.done[getProgressKey(levelIndex, exerciseIndex)]),
          performance: store.performance[getProgressKey(levelIndex, exerciseIndex)] || { attempts: 0, failures: 0 },
        }));
      }),
    ).reduce<Record<string, ConceptSummary>>((acc, item) => {
      const definition = item.conceptId.startsWith('skill:')
        ? getConcept(undefined, item.conceptId.replace('skill:', ''))
        : getConcept(item.conceptId);

      const current = acc[item.conceptId] || {
        id: item.conceptId,
        skill: definition.name,
        name: definition.name,
        description: definition.description,
        state: 'new',
        completed: 0,
        total: 0,
        failures: 0,
        attempts: 0,
        progress: 0,
        levelIndex: item.levelIndex,
        exerciseIndex: item.exerciseIndex,
        title: item.title,
      };

      current.total += 1;
      current.completed += item.done ? 1 : 0;
      current.failures += item.performance.failures;
      current.attempts += item.performance.attempts;

      if (
        item.levelIndex < current.levelIndex ||
        (item.levelIndex === current.levelIndex && item.exerciseIndex < current.exerciseIndex)
      ) {
        current.levelIndex = item.levelIndex;
        current.exerciseIndex = item.exerciseIndex;
        current.title = item.title;
      }

      current.progress = current.total ? Math.round((current.completed / current.total) * 100) : 0;

      if (current.failures >= 2) {
        current.state = 'review';
      } else if (current.completed === current.total && current.total > 0) {
        current.state = 'solid';
      } else if (current.completed > 0 || current.attempts > 0) {
        current.state = 'developing';
      } else {
        current.state = 'new';
      }

      acc[item.conceptId] = current;
      return acc;
    }, {});

    return stats;
  }, [store]);

  const concepts = Object.values(conceptStats);

  const masteredConcepts = concepts
    .filter((concept) => concept.state === 'solid')
    .sort((a, b) => b.progress - a.progress);

  const reviewConcepts = concepts
    .filter((concept) => concept.state === 'review')
    .sort((a, b) => b.failures - a.failures);

  const inProgressConcepts = concepts
    .filter((concept) => concept.state === 'developing')
    .sort((a, b) => b.progress - a.progress);

  const reviewTarget = reviewConcepts[0] || inProgressConcepts[0] || masteredConcepts[0] || null;

  return {
    getKey,
    levelDoneCount,
    levelComplete,
    levelUnlocked,
    exUnlocked,
    getMult,
    totalEarned,
    totalMax,
    levelsDoneTotal,
    completedExercises,
    continuePoint,
    activeLevel,
    activeLevelDone,
    activeLevelTotal,
    lessonsEarnedXp,
    concepts,
    masteredConcepts,
    reviewConcepts,
    inProgressConcepts,
    reviewTarget,
  };
}
