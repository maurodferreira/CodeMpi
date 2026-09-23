import { useMemo } from 'react';
import { LEVELS } from '../levels';
import { LEVEL_LESSONS } from '../lessons';
import { getHintMultiplier } from '../utils/xp';
import type { ConceptSummary, StoreData } from '../types';

export function getProgressKey(levelIndex: number, exerciseIndex: number): string {
  return `${levelIndex}-${exerciseIndex}`;
}

export function useLearningProgress(store: StoreData) {
  const getKey = getProgressKey;

  const levelDoneCount = (levelIndex: number) => {
    const level = LEVELS[levelIndex];

    if (!level.exercises) return 0;

    return level.exercises.filter((_, exerciseIndex) => (
      store.done[getKey(levelIndex, exerciseIndex)]
    )).length;
  };

  const levelComplete = (levelIndex: number) => {
    const level = LEVELS[levelIndex];

    return Boolean(
      level.exercises?.length &&
      levelDoneCount(levelIndex) === level.exercises.length,
    );
  };

  const levelUnlocked = (levelIndex: number) => (
    levelIndex === 0 || levelComplete(levelIndex - 1)
  );

  const exUnlocked = (levelIndex: number, exerciseIndex: number) => {
    if (!levelUnlocked(levelIndex)) return false;
    if (exerciseIndex === 0) return true;

    return Boolean(store.done[getKey(levelIndex, exerciseIndex - 1)]);
  };

  const getMult = (levelIndex: number, exerciseIndex: number) => {
    const shown = Math.min(store.hints[getKey(levelIndex, exerciseIndex)] || 0, 3);
    return getHintMultiplier(shown);
  };

  const { totalEarned, totalMax } = useMemo(() => {
    let earned = 0;
    let max = 0;

    LEVELS.forEach((level, levelIndex) => {
      level.exercises?.forEach((exercise, exerciseIndex) => {
        max += exercise.xp;

        const earnedXp = store.done[getKey(levelIndex, exerciseIndex)];
        if (earnedXp) earned += earnedXp;
      });
    });

    Object.entries(LEVEL_LESSONS).forEach(([levelIndex, lesson]) => {
      max += lesson.rewardXp || 0;

      if (store.lessonDone[Number(levelIndex)]) {
        earned += lesson.rewardXp || 0;
      }
    });

    return {
      totalEarned: earned,
      totalMax: max,
    };
  }, [store.done, store.lessonDone]);

  const levelsDoneTotal = useMemo(
    () => LEVELS.filter((_, levelIndex) => levelComplete(levelIndex)).length,
    [store.done],
  );

  const completedExercises = Object.keys(store.done).length;

  const continuePoint = useMemo(() => {
    for (let levelIndex = 0; levelIndex < LEVELS.length; levelIndex += 1) {
      if (!levelUnlocked(levelIndex) || !LEVELS[levelIndex].exercises?.length) continue;

      for (let exerciseIndex = 0; exerciseIndex < LEVELS[levelIndex].exercises!.length; exerciseIndex += 1) {
        if (!store.done[getKey(levelIndex, exerciseIndex)]) {
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
  }, [store.done]);

  const activeLevel = LEVELS[continuePoint.li];
  const activeLevelDone = levelDoneCount(continuePoint.li);
  const activeLevelTotal = activeLevel.exercises?.length || 0;

  const currentLesson = LEVEL_LESSONS;
  const lessonsEarnedXp = Object.entries(store.lessonDone).reduce((sum, [levelIndex, done]) => {
    if (!done) return sum;

    return sum + (LEVEL_LESSONS[Number(levelIndex)]?.rewardXp || 0);
  }, 0);

  const conceptStats = useMemo<Record<string, ConceptSummary>>(() => {
    const stats = LEVELS.flatMap((level, levelIndex) =>
      (level.exercises || []).map((exercise, exerciseIndex) => ({
        skill: exercise.skill || level.name,
        title: exercise.title,
        levelIndex,
        exerciseIndex,
        done: Boolean(store.done[getKey(levelIndex, exerciseIndex)]),
        performance: store.performance[getKey(levelIndex, exerciseIndex)] || { attempts: 0, failures: 0 },
      })),
    ).reduce<Record<string, ConceptSummary>>((acc, item) => {
      const current = acc[item.skill] || {
        skill: item.skill,
        completed: 0,
        total: 0,
        failures: 0,
        attempts: 0,
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

      acc[item.skill] = current;
      return acc;
    }, {});

    return stats;
  }, [store.done, store.performance]);

  const concepts = Object.values(conceptStats);

  const masteredConcepts = concepts.filter(
    (concept) => concept.completed === concept.total && concept.failures < 2,
  );

  const reviewConcepts = concepts
    .filter((concept) => (
      (concept.failures >= 2 && concept.completed < concept.total) ||
      concept.failures >= 3
    ))
    .sort((a, b) => b.failures - a.failures);

  const inProgressConcepts = concepts
    .filter((concept) => concept.completed > 0 && concept.completed < concept.total)
    .sort((a, b) => b.completed - a.completed);

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
    currentLesson,
    lessonsEarnedXp,
    concepts,
    masteredConcepts,
    reviewConcepts,
    inProgressConcepts,
    reviewTarget,
  };
}
