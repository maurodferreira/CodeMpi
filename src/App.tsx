import { lazy, Suspense, useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import './styles/dashboard-refinement.css';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { Dashboard } from './components/Dashboard';
import { LEVELS } from './data/levels';
import { LEVEL_LESSONS } from './data/lessons';
import { useAppPreferences } from './hooks/useAppPreferences';
import { useCloudAccount } from './hooks/useCloudAccount';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import {
  getLessonPath,
  getLevelPath,
  getMissionPath,
  parseAppRoute,
  useAppRouter,
  type AppRoute,
} from './hooks/useAppRouter';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useMissionRunner } from './hooks/useMissionRunner';
import { useProgressStore } from './hooks/useProgressStore';
import { useTheme } from './hooks/useTheme';
import { useUserSession } from './hooks/useUserSession';
import type { ConceptSummary, View } from './types';
import { findConceptMissionTarget, getNextExerciseIndex } from './utils/missionTargets';
import { getActivityStreak, getLocalDateKey } from './utils/progress';
import { HINT_MULTIPLIERS } from './utils/xp';

const CompletionPage = lazy(() => import('./components/CompletionPage').then((module) => ({
  default: module.CompletionPage,
})));

const JourneyMap = lazy(() => import('./components/JourneyMap').then((module) => ({
  default: module.JourneyMap,
})));

const LearningMemoryPage = lazy(() => import('./components/LearningMemoryPage').then((module) => ({
  default: module.LearningMemoryPage,
})));

const LessonPage = lazy(() => import('./components/LessonPage').then((module) => ({
  default: module.LessonPage,
})));

const MissionPage = lazy(() => import('./components/MissionPage').then((module) => ({
  default: module.MissionPage,
})));

const SearchPage = lazy(() => import('./components/SearchPage').then((module) => ({
  default: module.SearchPage,
})));

const SettingsPage = lazy(() => import('./components/SettingsPage').then((module) => ({
  default: module.SettingsPage,
})));

function ScreenFallback() {
  return (
    <main aria-busy="true" aria-live="polite">
      <section className="panel">
        <div className="console-empty">Carregando interface…</div>
      </section>
    </main>
  );
}

export default function App() {
  const { store, setStore, registerActivity } = useProgressStore();
  const { theme, setTheme } = useTheme();
  const { preferences, setPreferences } = useAppPreferences();
  const { canInstall, isInstalled, requestInstall } = useInstallPrompt();
  const { user, session } = useUserSession();
  const localIdentity = useMemo(() => ({ user, session }), [session, user]);
  const cloudAccount = useCloudAccount({
    localIdentity,
    progress: store,
    preferences,
    theme,
  });

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

  const resolveRoute = useCallback((nextRoute: AppRoute): AppRoute => {
    const li = nextRoute.levelIndex;

    if (li === undefined) return nextRoute;

    const level = LEVELS[li];

    if (!level || !levelUnlocked(li)) {
      return parseAppRoute('/jornada');
    }

    if (nextRoute.view === 'lesson') {
      return LEVEL_LESSONS[li]
        ? nextRoute
        : parseAppRoute(getLevelPath(li));
    }

    if (nextRoute.view === 'completion') {
      return levelComplete(li)
        ? nextRoute
        : parseAppRoute('/jornada');
    }

    if (nextRoute.view !== 'mission') return nextRoute;

    if (!level.exercises?.length) {
      return nextRoute.exerciseIndex === undefined
        ? nextRoute
        : parseAppRoute(getLevelPath(li));
    }

    if (LEVEL_LESSONS[li] && !store.lessonDone[li]) {
      return parseAppRoute(getLessonPath(li));
    }

    const requestedExercise = nextRoute.exerciseIndex ?? getNextExerciseIndex(li, store);

    if (!level.exercises[requestedExercise] || !exUnlocked(li, requestedExercise)) {
      const fallback = getNextExerciseIndex(li, store);

      if (!level.exercises[fallback] || !exUnlocked(li, fallback)) {
        return parseAppRoute('/jornada');
      }

      return parseAppRoute(getMissionPath(li, fallback));
    }

    const canonicalPath = getMissionPath(li, requestedExercise);

    return nextRoute.pathname === canonicalPath
      ? nextRoute
      : parseAppRoute(canonicalPath);
  }, [exUnlocked, levelComplete, levelUnlocked, store]);

  const initialRoute = resolveRoute(parseAppRoute(window.location.pathname));
  const initialLevelIndex = initialRoute.levelIndex ?? continuePoint.li;
  const initialLevel = LEVELS[initialLevelIndex] || LEVELS[0];
  const initialExerciseIndex = initialRoute.exerciseIndex
    ?? (initialLevel.exercises?.length ? getNextExerciseIndex(initialLevelIndex, store) : 0);

  const [levelIndex, setLevelIndex] = useState(initialLevelIndex);
  const [exerciseIndex, setExerciseIndex] = useState(initialExerciseIndex);
  const currentLevel = LEVELS[levelIndex] || LEVELS[0];
  const hasExercises = Boolean(currentLevel.exercises?.length);
  const currentExercise = hasExercises ? currentLevel.exercises![exerciseIndex] || null : null;

  const [code, setCode] = useState(currentExercise?.starter || '');
  const [lessonStep, setLessonStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completionLevel, setCompletionLevel] = useState<number | null>(
    initialRoute.view === 'completion' ? initialRoute.levelIndex ?? null : null,
  );

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
    isRunning,
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

  const applyRouteState = useCallback((nextRoute: AppRoute) => {
    const li = nextRoute.levelIndex;

    if (li === undefined) return;

    const level = LEVELS[li];

    if (!level) return;

    setLevelIndex(li);
    setLessonStep(0);
    setQuizAnswer(null);

    if (nextRoute.view === 'completion') {
      setCompletionLevel(li);
      return;
    }

    setCompletionLevel(null);

    if (nextRoute.view === 'lesson') {
      const target = level.exercises?.length ? getNextExerciseIndex(li, store) : 0;
      setExerciseIndex(target);
      return;
    }

    if (nextRoute.view !== 'mission') return;

    if (!level.exercises?.length) {
      setExerciseIndex(0);
      resetMissionState(null);
      return;
    }

    const target = nextRoute.exerciseIndex ?? getNextExerciseIndex(li, store);
    setExerciseIndex(target);
    resetMissionState(level.exercises[target] || null);
  }, [resetMissionState, store]);

  const {
    route,
    navigateView,
    navigateLevel,
    navigateLesson,
    navigateMission,
    navigateCompletion,
  } = useAppRouter({
    resolveRoute,
    onRouteChange: applyRouteState,
  });

  const view = route.view;

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

  const handleReviewConcept = (concept: ConceptSummary) => {
    const target = findConceptMissionTarget(concept, store, exUnlocked);

    if (!target) return;

    navigateMission(target.levelIndex, target.exerciseIndex);
  };

  const openMission = (li: number, ei?: number) => {
    if (!levelUnlocked(li)) return;

    const level = LEVELS[li];

    if (!level.exercises?.length) {
      navigateLevel(li);
      return;
    }

    if (ei !== undefined && (!level.exercises[ei] || !exUnlocked(li, ei))) return;

    const target = ei ?? getNextExerciseIndex(li, store);

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

    navigateMission(levelIndex, exerciseIndex, { skipResolve: true });
  };

  const handleNext = () => {
    if (!currentLevel.exercises) return;

    const isLastInLevel = exerciseIndex === currentLevel.exercises.length - 1;

    if (!isLastInLevel) {
      navigateMission(levelIndex, exerciseIndex + 1);
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

      <Suspense fallback={<ScreenFallback />}>
      {view === 'settings' && (
        <SettingsPage
          theme={theme}
          setTheme={setTheme}
          preferences={preferences}
          setPreferences={setPreferences}
          setView={setView}
          canInstall={canInstall}
          isInstalled={isInstalled}
          onInstall={requestInstall}
          user={user}
          session={session}
          cloudAccount={cloudAccount}
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
          isRunning={isRunning}
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
          selectExercise={(ei) => navigateMission(levelIndex, ei)}
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

      </Suspense>

      <AppFooter view={view} setView={setView} onOpenMission={handleOpenMissionNavigation} />
    </div>
  );
}
