import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { CompletionPage } from './components/CompletionPage';
import { Dashboard } from './components/Dashboard';
import { JourneyMap } from './components/JourneyMap';
import { LessonPage } from './components/LessonPage';
import { MissionPage } from './components/MissionPage';
import { SettingsPage } from './components/SettingsPage';
import { useMissionRunner } from './hooks/useMissionRunner';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useProgressStore } from './hooks/useProgressStore';
import { useTheme } from './hooks/useTheme';
import { LEVELS } from './levels';
import { LEVEL_LESSONS } from './lessons';
import { getActivityStreak, getLocalDateKey } from './progress';
import { getHintMultiplier, HINT_MULTIPLIERS } from './utils/xp';
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
    masteredConcepts,
    reviewConcepts,
    reviewTarget,
  } = useLearningProgress(store);

  const currentLesson = LEVEL_LESSONS[levelIndex];
  const currentLessonStep = currentLesson?.steps[lessonStep];
  const lessonReward = currentLesson?.rewardXp || 25;
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
    setLevelIndex(concept.levelIndex);
    setExerciseIndex(concept.exerciseIndex);
    setLessonStep(0);
    setQuizAnswer(null);
    setView('mission');
  };

  const openMission = (li: number, ei?: number) => {
    if (!levelUnlocked(li)) return;

    setLevelIndex(li);
    setLessonStep(0);
    setQuizAnswer(null);

    const level = LEVELS[li];
    if (!level.exercises?.length) {
      setExerciseIndex(0);
      setView('mission');
      return;
    }

    let target = ei ?? 0;
    if (ei === undefined) {
      target = 0;
      for (let i = 0; i < level.exercises.length; i += 1) {
        if (!store.done[getKey(li, i)]) {
          target = i;
          break;
        }
        target = i;
      }
    }

    setExerciseIndex(target);
    setView(LEVEL_LESSONS[li] ? 'lesson' : 'mission');
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
      setExerciseIndex((prev) => prev + 1);
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
          completedExercises={completedExercises}
          totalEarned={totalEarned}
          levelsDoneTotal={levelsDoneTotal}
          lessonsEarnedXp={lessonsEarnedXp}
          activeLevel={activeLevel}
          activeLevelDone={activeLevelDone}
          activeLevelTotal={activeLevelTotal}
          overallProgress={overallProgress}
          masteredConcepts={masteredConcepts}
          reviewConcepts={reviewConcepts}
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
          getMult={getMult}
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          exUnlocked={exUnlocked}
          setExerciseIndex={setExerciseIndex}
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

      <footer className="note">
        seu progresso (XP, dicas usadas e exercícios concluídos) fica salvo neste navegador
      </footer>
    </div>
  );
}
