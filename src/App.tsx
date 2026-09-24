import { useState } from 'react';
import './styles/dashboard-refinement.css';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { CompletionPage } from './components/CompletionPage';
import { Dashboard } from './components/Dashboard';
import { JourneyMap } from './components/JourneyMap';
import { LearningMemoryPage } from './components/LearningMemoryPage';
import { LessonPage } from './components/LessonPage';
import { MissionPage } from './components/MissionPage';
import { SettingsPage } from './components/SettingsPage';
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
  const [view, setView] = useState<View>('dashboard');
  const [levelIndex, setLevelIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const { store, setStore, registerActivity } = useProgressStore();
  const currentLevel = LEVELS[levelIndex];
  const hasExercises = Boolean(currentLevel.exercises?.length);
  const currentExercise = hasExercises ? currentLevel.exercises![exerciseIndex] : null;

  const [code, setCode] = useState(currentExercise?.starter || '');
  const [lessonStep, setLessonStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completionLevel, setCompletionLevel] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();

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

  const handleReviewConcept = (concept: ConceptSummary) => {
    const target = findConceptMissionTarget(concept, store);

    if (!target) {
      resetMissionState(null);
      setLevelIndex(concept.levelIndex);
      setExerciseIndex(concept.exerciseIndex);
    } else {
      resetMissionState(target.exercise);
      setLevelIndex(target.levelIndex);
      setExerciseIndex(target.exerciseIndex);
    }

    setLessonStep(0);
    setQuizAnswer(null);
    setView('mission');
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
      setView('mission');
      return;
    }

    const target = ei ?? getNextExerciseIndex(li, store);

    resetMissionState(level.exercises[target] || null);
    setLevelIndex(li);
    setExerciseIndex(target);
    setLessonStep(0);
    setQuizAnswer(null);
    setView(LEVEL_LESSONS[li] && !store.lessonDone[li] ? 'lesson' : 'mission');
  };

  const handleShowHint = () => {
    if (!currentExercise || hintsShown >= currentExercise.hints.length) return;

    setStore((prev) => ({
      ...prev,
      hints: { ...prev.hints, [getKey(levelIndex, exerciseIndex)]: hintsShown + 1 },
    }));
  };

  const handleLevelCompletion = (li: number) => {
    setCompletionLevel(li);
    setView('completion');
  };

  const handleLessonFinish = () => {
    registerActivity();
    if (!store.lessonDone[levelIndex] && currentLesson) {
      setStore((prev) => ({
        ...prev,
        lessonDone: { ...prev.lessonDone, [levelIndex]: true },
      }));
    }
    setView('mission');
  };

  const handleNext = () => {
    if (!currentLevel.exercises) return;

    const isLastInLevel = exerciseIndex === currentLevel.exercises.length - 1;

    if (!isLastInLevel) {
      const nextExerciseIndex = exerciseIndex + 1;
      resetMissionState(currentLevel.exercises[nextExerciseIndex]);
      setExerciseIndex(nextExerciseIndex);
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
      />

      {view === 'settings' && (
        <SettingsPage theme={theme} setTheme={setTheme} setView={setView} />
      )}

      {view === 'dashboard' && (
        <Dashboard
          store={store}
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
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          openMission={openMission}
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
          }}
          setView={setView}
          openMission={openMission}
          setCode={setCode}
          setFreeInputs={setFreeInputs}
          setFreeResult={setFreeResult}
          setShowFreeTest={setShowFreeTest}
          handleEvaluate={handleEvaluate}
          handleResetCode={handleResetCode}
          handleFreeTest={handleFreeTest}
          handleShowHint={handleShowHint}
          handleNext={handleNext}
        />
      )}

      <AppFooter view={view} setView={setView} />
    </div>
  );
}
