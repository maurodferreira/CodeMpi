import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import './styles/dashboard-refinement.css';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { CompletionPage } from './components/CompletionPage';
import { Dashboard } from './components/Dashboard';
import { JourneyMap } from './components/JourneyMap';
import { LearningMemoryPage } from './components/LearningMemoryPage';
import { LessonPage } from './components/LessonPage';
import { MissionPage } from './components/MissionPage';
import { SearchPage } from './components/SearchPage';
import { SettingsPage } from './components/SettingsPage';
import { useAppPreferences } from './hooks/useAppPreferences';
import { useAppRouter } from './hooks/useAppRouter';
import { useMissionRunner } from './hooks/useMissionRunner';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useProgressStore } from './hooks/useProgressStore';
import { useTheme } from './hooks/useTheme';
import { LEVELS } from './data/levels';
import { LEVEL_LESSONS } from './data/lessons';
import { getActivityStreak, getLocalDateKey } from './utils/progress';
import { HINT_MULTIPLIERS } from './utils/xp';
import { findConceptMissionTarget, getNextExerciseIndex } from './utils/missionTargets';
import type { ConceptSummary, View } from './types';

export default function App() {
  const {
    route,
    navigateView,
    navigateLevel,
    navigateLesson,
    navigateMission,
    navigateCompletion,
  } = useAppRouter();
  const view = route.view;
  const initialLevelIndex = route.levelIndex ?? 0;
  const initialExerciseIndex = route.exerciseIndex ?? 0;
  const [levelIndex, setLevelIndex] = useState(
    LEVELS[initialLevelIndex] ? initialLevelIndex : 0,
  );
  const [exerciseIndex, setExerciseIndex] = useState(initialExerciseIndex);
  const { store, setStore, registerActivity } = useProgressStore();
  const currentLevel = LEVELS[levelIndex] || LEVELS[0];
  const hasExercises = Boolean(currentLevel.exercises?.length);
  const currentExercise = hasExercises ? currentLevel.exercises![exerciseIndex] || null : null;

  const [code, setCode] = useState(currentExercise?.starter || '');
  const [lessonStep, setLessonStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completionLevel, setCompletionLevel] = useState<number | null>(null);
  const processedRoutePath = useRef<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { preferences, setPreferences } = useAppPreferences();

  const {
    getKey,
    levelDoneCount,
    levelComplete,
    levelUnlocked,
    exUnlocked,
    totalEarned,
    totalMax,
    levelsDoneTotal,
    completedExercises,
    continuePoint,
    activeLevel,
    activeLevelDone,
    activeLevelTotal,
    lessonsEarnedXp,
    reviewConcepts,
    concepts,
    reviewTarget,
  } = useLearningProgress(store);

  const currentLesson = LEVEL_LESSONS[levelIndex];
  const currentLessonStep = currentLesson?.steps[lessonStep];
  const lessonReward = currentLesson?.rewardXp || 25;
  const lessonCompletion = currentLesson ? Boolean(store.lessonDone[levelIndex]) : false;
  const overallProgress = totalMax ? (totalEarned / totalMax) * 100 : 0;
  const activityStreak = getActivityStreak(store.activityDates || []);
  const todayKey = getLocalDateKey();

  const hintsShown = store.hints[getKey(levelIndex, exerciseIndex)] || 0;
  const alreadyDoneXP = store.done[getKey(levelIndex, exerciseIndex)];

  const {
    consoleLogs,
    isPassed,
    lastTest,
    freeInputs,
    setFreeInputs,
    freeResult,
    setFreeResult,
    showFreeTest,
    setShowFreeTest,
    learningFeedback,
    resetMissionState,
    handleEvaluate,
    handleResetCode,
    handleFreeTest,
  } = useMissionRunner({
    currentExercise,
    levelIndex,
    exerciseIndex,
    code,
    setCode,
    hintsShown,
    store,
    setStore,
    registerActivity,
    getKey,
  });

  const setView: Dispatch<SetStateAction<View>> = (nextValue) => {
    const nextView = typeof nextValue === 'function' ? nextValue(view) : nextValue;

    if (nextView === 'lesson') {
      navigateLesson(levelIndex);
      return;
    }

    if (nextView === 'mission') {
      if (currentLevel.exercises?.length) {
        navigateMission(levelIndex, exerciseIndex);
      } else {
        navigateLevel(levelIndex);
      }
      return;
    }

    if (nextView === 'completion') {
      navigateCompletion(completionLevel ?? levelIndex);
      return;
    }

    navigateView(nextView);
  };

  useEffect(() => {
    if (processedRoutePath.current === route.pathname) return;

    processedRoutePath.current = route.pathname;

    const li = route.levelIndex;

    if (li === undefined) return;

    const level = LEVELS[li];

    if (!level || !levelUnlocked(li)) {
      navigateView('map', { replace: true });
      return;
    }

    setLevelIndex(li);
    setLessonStep(0);
    setQuizAnswer(null);

    if (route.view === 'lesson') {
      if (!LEVEL_LESSONS[li]) {
        navigateLevel(li, { replace: true });
        return;
      }

      setExerciseIndex(getNextExerciseIndex(li, store));
      return;
    }

    if (route.view === 'completion') {
      if (!levelComplete(li)) {
        navigateView('map', { replace: true });
        return;
      }

      setCompletionLevel(li);
      return;
    }

    if (route.view !== 'mission') return;

    if (!level.exercises?.length) {
      if (route.exerciseIndex !== undefined) {
        navigateLevel(li, { replace: true });
        return;
      }

      setExerciseIndex(0);
      resetMissionState(null);
      return;
    }

    if (LEVEL_LESSONS[li] && !store.lessonDone[li]) {
      navigateLesson(li, { replace: true });
      return;
    }

    const target = route.exerciseIndex ?? getNextExerciseIndex(li, store);

    if (!level.exercises[target] || !exUnlocked(li, target)) {
      const fallback = getNextExerciseIndex(li, store);

      if (!level.exercises[fallback] || !exUnlocked(li, fallback)) {
        navigateView('map', { replace: true });
        return;
      }

      navigateMission(li, fallback, { replace: true });
      return;
    }

    setExerciseIndex(target);
    resetMissionState(level.exercises[target]);
  }, [
    exUnlocked,
    levelComplete,
    levelUnlocked,
    navigateLevel,
    navigateLesson,
    navigateMission,
    navigateView,
    resetMissionState,
    route.exerciseIndex,
    route.levelIndex,
    route.pathname,
    route.view,
    store,
  ]);

  const handleReviewConcept = (concept: ConceptSummary) => {
    const target = findConceptMissionTarget(concept, store, exUnlocked);

    if (!target) return;

    resetMissionState(target.exercise);
    setLevelIndex(target.levelIndex);
    setExerciseIndex(target.exerciseIndex);
    setLessonStep(0);
    setQuizAnswer(null);
    navigateMission(target.levelIndex, target.exerciseIndex);
  };

  const openMission = (li: number, ei?: number) => {
    if (!levelUnlocked(li)) return;

    const level = LEVELS[li];

    if (!level.exercises?.length) {
      resetMissionState(null);
      setLevelIndex(li);
      setExerciseIndex(0);
      setLessonStep(0);
      setQuizAnswer(null);
      navigateLevel(li);
      return;
    }

    if (ei !== undefined && (!level.exercises[ei] || !exUnlocked(li, ei))) return;

    const target = ei ?? getNextExerciseIndex(li, store);

    resetMissionState(level.exercises[target] || null);
    setLevelIndex(li);
    setExerciseIndex(target);
    setLessonStep(0);
    setQuizAnswer(null);

    if (LEVEL_LESSONS[li] && !store.lessonDone[li]) {
      navigateLesson(li);
      return;
    }

    navigateMission(li, target);
  };

  const handleOpenMissionNavigation = () => {
    openMission(continuePoint.li, continuePoint.ei);
  };

  const handleShowHint = () => {
    if (!currentExercise || hintsShown >= currentExercise.hints.length) return;

    setStore((prev) => ({
      ...prev,
      hints: { ...prev.hints, [getKey(levelIndex, exerciseIndex)]: hintsShown + 1 },
    }));
  };

  const handleResetCodeWithPreference = () => {
    if (preferences.confirmReset && !window.confirm('Reiniciar o código? O conteúdo atual será substituído pelo código inicial.')) {
      return;
    }

    handleResetCode();
  };

  const handleLevelCompletion = (li: number) => {
    setCompletionLevel(li);
    navigateCompletion(li);
  };

  const handleLessonFinish = () => {
    registerActivity();
    if (!store.lessonDone[levelIndex] && currentLesson) {
      setStore((prev) => ({
        ...prev,
        lessonDone: { ...prev.lessonDone, [levelIndex]: true },
      }));
    }
    navigateMission(levelIndex, exerciseIndex);
  };

  const handleNext = () => {
    if (!currentLevel.exercises) return;

    const isLastInLevel = exerciseIndex === currentLevel.exercises.length - 1;

    if (!isLastInLevel) {
      const nextExerciseIndex = exerciseIndex + 1;
      resetMissionState(currentLevel.exercises[nextExerciseIndex]);
      setExerciseIndex(nextExerciseIndex);
      navigateMission(levelIndex, nextExerciseIndex);
      return;
    }

    handleLevelCompletion(levelIndex);
  };

  return (
    <div className="wrap">
      <AppHeader
        view={view}
        setView={setView}
        totalEarned={totalEarned}
        totalMax={totalMax}
        overallProgress={overallProgress}
        levelsDoneTotal={levelsDoneTotal}
        onOpenMission={handleOpenMissionNavigation}
      />

      {view === 'settings' && (
        <SettingsPage
          theme={theme}
          setTheme={setTheme}
          preferences={preferences}
          setPreferences={setPreferences}
          setView={setView}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          completedExercises={completedExercises}
          totalEarned={totalEarned}
          levelsDoneTotal={levelsDoneTotal}
          lessonsEarnedXp={lessonsEarnedXp}
          activeLevel={activeLevel}
          activeLevelDone={activeLevelDone}
          activeLevelTotal={activeLevelTotal}
          reviewConcepts={reviewConcepts}
          concepts={concepts}
          reviewTarget={reviewTarget}
          activityStreak={activityStreak}
          todayKey={todayKey}
          continuePoint={continuePoint}
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          openMission={openMission}
          handleReviewConcept={handleReviewConcept}
          setView={setView}
        />
      )}

      {view === 'map' && (
        <JourneyMap
          overallProgress={overallProgress}
          completedExercises={completedExercises}
          levelsDoneTotal={levelsDoneTotal}
          continuePoint={continuePoint}
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          openMission={openMission}
        />
      )}

      {view === 'search' && (
        <SearchPage
          concepts={concepts}
          openMission={openMission}
          onReview={handleReviewConcept}
          levelUnlocked={levelUnlocked}
          exUnlocked={exUnlocked}
        />
      )}

      {view === 'memory' && (
        <LearningMemoryPage
          concepts={concepts}
          store={store}
          onReview={handleReviewConcept}
        />
      )}

      {view === 'lesson' && currentLesson && currentLessonStep && (
        <LessonPage
          currentLesson={currentLesson}
          currentLessonStep={currentLessonStep}
          lessonStep={lessonStep}
          lessonReward={lessonReward}
          lessonCompletion={lessonCompletion}
          quizAnswer={quizAnswer}
          setLessonStep={setLessonStep}
          setQuizAnswer={setQuizAnswer}
          handleLessonFinish={handleLessonFinish}
          setView={setView}
        />
      )}

      {view === 'completion' && completionLevel !== null && (
        <CompletionPage
          completionLevel={completionLevel}
          getKey={getKey}
          levelDoneCount={levelDoneCount}
          done={store.done}
          openMission={openMission}
          setView={(nextView) => setView(nextView)}
        />
      )}

      {view === 'mission' && (
        <MissionPage
          currentLevel={currentLevel}
          currentExercise={currentExercise}
          levelIndex={levelIndex}
          exerciseIndex={exerciseIndex}
          store={store}
          code={code}
          preferences={preferences}
          hintsShown={hintsShown}
          alreadyDoneXP={alreadyDoneXP}
          isPassed={isPassed}
          consoleLogs={consoleLogs}
          lastTest={lastTest}
          learningFeedback={learningFeedback}
          freeInputs={freeInputs}
          freeResult={freeResult}
          showFreeTest={showFreeTest}
          hMult={HINT_MULTIPLIERS}
          getKey={getKey}
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          exUnlocked={exUnlocked}
          selectExercise={(ei) => {
            resetMissionState(currentLevel.exercises?.[ei] || null);
            setExerciseIndex(ei);
            navigateMission(levelIndex, ei);
          }}
          setView={setView}
          openMission={openMission}
          setCode={setCode}
          setFreeInputs={setFreeInputs}
          setFreeResult={setFreeResult}
          setShowFreeTest={setShowFreeTest}
          handleEvaluate={handleEvaluate}
          handleResetCode={handleResetCodeWithPreference}
          handleFreeTest={handleFreeTest}
          handleShowHint={handleShowHint}
          handleNext={handleNext}
        />
      )}

      <AppFooter view={view} setView={setView} onOpenMission={handleOpenMissionNavigation} />
    </div>
  );
}
