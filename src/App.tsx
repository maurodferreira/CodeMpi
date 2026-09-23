import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { CompletionPage } from './components/CompletionPage';
import { Dashboard } from './components/Dashboard';
import { JourneyMap } from './components/JourneyMap';
import { LessonPage } from './components/LessonPage';
import { MissionPage } from './components/MissionPage';
import { SettingsPage } from './components/SettingsPage';
import { useTheme } from './hooks/useTheme';
import { LEVELS } from './levels';
import { LEVEL_LESSONS } from './lessons';
import { addTodayActivity, getActivityStreak, getLocalDateKey } from './progress';
import { calculateExerciseXp, getHintMultiplier, HINT_MULTIPLIERS } from './utils/xp';
import type { LastTest, StoreData, View } from './types';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [levelIndex, setLevelIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [store, setStore] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem('circuito_v2');
      return saved
        ? { done: {}, hints: {}, lessonDone: {}, performance: {}, activityDates: [], ...JSON.parse(saved) }
        : { done: {}, hints: {}, lessonDone: {}, performance: {}, activityDates: [] };
    } catch {
      return { done: {}, hints: {}, lessonDone: {}, performance: {}, activityDates: [] };
    }
  });

  const currentLevel = LEVELS[levelIndex];
  const hasExercises = Boolean(currentLevel.exercises?.length);
  const currentExercise = hasExercises ? currentLevel.exercises![exerciseIndex] : null;

  const [code, setCode] = useState(currentExercise?.starter || '');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ tag: string; msg: string; ok?: boolean }>>([]);
  const [isPassed, setIsPassed] = useState(false);
  const [lessonStep, setLessonStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [lastTest, setLastTest] = useState<{ passed: number; total: number; firstFailure?: { args: string; got: string; expected: string; error?: string } } | null>(null);
  const [completionLevel, setCompletionLevel] = useState<number | null>(null);
  const [freeInputs, setFreeInputs] = useState<string[]>([]);
  const [freeResult, setFreeResult] = useState<{ ok: boolean; value?: string; error?: string } | null>(null);
  const [showFreeTest, setShowFreeTest] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('circuito_v2', JSON.stringify(store));
  }, [store]);


  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starter);
      setConsoleLogs([]);
      setIsPassed(false);
      setLastTest(null);
      setFreeInputs((currentExercise?.tests[0]?.args || []).map((arg) => JSON.stringify(arg)));
      setFreeResult(null);
      setShowFreeTest(false);
    }
  }, [levelIndex, exerciseIndex, currentExercise]);

  const getKey = (li: number, ei: number) => `${li}-${ei}`;
  const hintsShown = store.hints[getKey(levelIndex, exerciseIndex)] || 0;
  const alreadyDoneXP = store.done[getKey(levelIndex, exerciseIndex)];

  const levelDoneCount = (li: number) => {
    const level = LEVELS[li];
    if (!level.exercises) return 0;
    return level.exercises.filter((_, ei) => store.done[getKey(li, ei)]).length;
  };

  const levelComplete = (li: number) => {
    const level = LEVELS[li];
    return Boolean(level.exercises?.length && levelDoneCount(li) === level.exercises.length);
  };

  const levelUnlocked = (li: number) => li === 0 || levelComplete(li - 1);

  const exUnlocked = (li: number, ei: number) => {
    if (!levelUnlocked(li)) return false;
    if (ei === 0) return true;
    return Boolean(store.done[getKey(li, ei - 1)]);
  };

  const getMult = (li: number, ei: number) => {
    const shown = Math.min(store.hints[getKey(li, ei)] || 0, 3);
    return getHintMultiplier(shown);
  };

  const calcTotalXp = () => {
    let earned = 0;
    let max = 0;

    LEVELS.forEach((level, li) => {
      level.exercises?.forEach((exercise, ei) => {
        max += exercise.xp;
        const doneXp = store.done[getKey(li, ei)];
        if (doneXp) earned += doneXp;
      });
    });

    Object.entries(LEVEL_LESSONS).forEach(([li, lesson]) => {
      max += lesson.rewardXp || 0;
      if (store.lessonDone[Number(li)]) earned += lesson.rewardXp || 0;
    });

    return { earned, max };
  };

  const { earned: totalEarned, max: totalMax } = calcTotalXp();
  const levelsDoneTotal = LEVELS.filter((_, index) => levelComplete(index)).length;
  const completedExercises = Object.keys(store.done).length;

  const findContinuePoint = () => {
    for (let li = 0; li < LEVELS.length; li += 1) {
      if (!levelUnlocked(li) || !LEVELS[li].exercises?.length) continue;

      for (let ei = 0; ei < LEVELS[li].exercises!.length; ei += 1) {
        if (!store.done[getKey(li, ei)]) return { li, ei };
      }
    }

    const lastBuilt = LEVELS.reduce((last, level, index) => (level.exercises?.length ? index : last), 0);
    return { li: lastBuilt, ei: Math.max(0, (LEVELS[lastBuilt].exercises?.length || 1) - 1) };
  };

  const continuePoint = findContinuePoint();
  const activeLevel = LEVELS[continuePoint.li];
  const activeLevelDone = levelDoneCount(continuePoint.li);
  const activeLevelTotal = activeLevel.exercises?.length || 0;
  const currentLesson = LEVEL_LESSONS[levelIndex];
  const currentLessonStep = currentLesson?.steps[lessonStep];
  const lessonReward = currentLesson?.rewardXp || 25;
  const lessonsEarnedXp = Object.entries(store.lessonDone).reduce((sum, [li, done]) => {
    if (!done) return sum;
    return sum + (LEVEL_LESSONS[Number(li)]?.rewardXp || 0);
  }, 0);
  const lessonCompletion = currentLesson ? Boolean(store.lessonDone[levelIndex]) : false;
  const overallProgress = totalMax ? (totalEarned / totalMax) * 100 : 0;
  const activityStreak = getActivityStreak(store.activityDates || []);
  const todayKey = getLocalDateKey();

  const conceptStats = LEVELS.flatMap((level, li) =>
    (level.exercises || []).map((exercise, ei) => ({
      skill: exercise.skill || level.name,
      title: exercise.title,
      levelIndex: li,
      exerciseIndex: ei,
      done: Boolean(store.done[getKey(li, ei)]),
      performance: store.performance[getKey(li, ei)] || { attempts: 0, failures: 0 },
    })),
  ).reduce<Record<string, {
    skill: string;
    completed: number;
    total: number;
    failures: number;
    attempts: number;
    levelIndex: number;
    exerciseIndex: number;
    title: string;
  }>>((acc, item) => {
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

    if (item.levelIndex < current.levelIndex || (item.levelIndex === current.levelIndex && item.exerciseIndex < current.exerciseIndex)) {
      current.levelIndex = item.levelIndex;
      current.exerciseIndex = item.exerciseIndex;
      current.title = item.title;
    }

    acc[item.skill] = current;
    return acc;
  }, {});

  const concepts = Object.values(conceptStats);
  const masteredConcepts = concepts.filter((concept) => concept.completed === concept.total && concept.failures < 2);
  const reviewConcepts = concepts
    .filter((concept) => concept.failures >= 2 && concept.completed < concept.total || concept.failures >= 3)
    .sort((a, b) => b.failures - a.failures);
  const inProgressConcepts = concepts
    .filter((concept) => concept.completed > 0 && concept.completed < concept.total)
    .sort((a, b) => b.completed - a.completed);

  const reviewTarget = reviewConcepts[0] || inProgressConcepts[0] || masteredConcepts[0] || null;

  const handleReviewConcept = (concept: (typeof concepts)[number]) => {
    setLevelIndex(concept.levelIndex);
    setExerciseIndex(concept.exerciseIndex);
    setLessonStep(0);
    setQuizAnswer(null);
    setView('mission');
  };

  const registerActivity = () => {
    setStore((prev) => ({
      ...prev,
      activityDates: addTodayActivity(prev.activityDates || []),
    }));
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

  const handleResetCode = () => {
    if (!currentExercise) return;
    setCode(currentExercise.starter);
    setConsoleLogs([]);
    setIsPassed(false);
    setLastTest(null);
    setFreeInputs((currentExercise.tests[0]?.args || []).map((arg) => JSON.stringify(arg)));
    setFreeResult(null);
    setShowFreeTest(false);
  };

  const handleFreeTest = () => {
    if (!currentExercise) return;

    let userFn: any;

    try {
      const wrapper = new Function(
        code + `\nreturn typeof ${currentExercise.fn} === "function" ? ${currentExercise.fn} : undefined;`,
      );

      userFn = wrapper({
        log: () => {},
        warn: () => {},
        error: () => {},
      });
    } catch (error: any) {
      setFreeResult({
        ok: false,
        error: error?.message || 'Erro de sintaxe no código.',
      });
      return;
    }

    if (typeof userFn !== 'function') {
      setFreeResult({
        ok: false,
        error: `Função ${currentExercise.fn} não encontrada.`,
      });
      return;
    }

    try {
      const args = freeInputs.map((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return undefined;
        try {
          return JSON.parse(trimmed);
        } catch {
          return trimmed;
        }
      });

      const result = userFn(...args);
      setFreeResult({ ok: true, value: JSON.stringify(result) ?? String(result) });
    } catch (error: any) {
      setFreeResult({
        ok: false,
        error: error?.message || 'Erro durante a execução.',
      });
    }
  };

  const handleEvaluate = () => {
    if (!currentExercise) return;

    const key = getKey(levelIndex, exerciseIndex);
    registerActivity();
    setStore((prev) => ({
      ...prev,
      performance: {
        ...prev.performance,
        [key]: {
          attempts: (prev.performance[key]?.attempts || 0) + 1,
          failures: prev.performance[key]?.failures || 0,
        },
      },
    }));

    const logs: Array<{ tag: string; msg: string; ok?: boolean }> = [];
    let userFn: any;

    try {
      const wrapper = new Function(
        'console',
        code + `\nreturn typeof ${currentExercise.fn} === "function" ? ${currentExercise.fn} : undefined;`,
      );

      userFn = wrapper({
        log: () => {},
        warn: () => {},
        error: () => {},
      });
    } catch (error: any) {
      const message = error?.message || 'Erro de sintaxe';
      setConsoleLogs([{ tag: 'sintaxe', msg: 'O JavaScript encontrou um problema antes de conseguir executar sua função.', ok: false }]);
      setLastTest({
        passed: 0,
        total: currentExercise.tests.length,
        firstFailure: { args: '', got: '', expected: '', error: message },
      });
      setIsPassed(false);
      return;
    }

    if (typeof userFn !== 'function') {
      setStore((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          [key]: {
            attempts: prev.performance[key]?.attempts || 1,
            failures: (prev.performance[key]?.failures || 0) + 1,
          },
        },
      }));

      const expectedFn = currentExercise.fn;
      setConsoleLogs([{ tag: 'estrutura', msg: `Ainda não encontrei uma função chamada ${expectedFn}. Confira o nome e a estrutura pedidos na missão.`, ok: false }]);
      setLastTest({
        passed: 0,
        total: currentExercise.tests.length,
        firstFailure: { args: '', got: '', expected: '', error: `Função ${expectedFn} não encontrada.` },
      });
      setIsPassed(false);
      return;
    }

    let passed = 0;
    let firstFailure: { args: string; got: string; expected: string; error?: string } | undefined;

    currentExercise.tests.forEach((test, index) => {
      let result: any;
      let error: string | null = null;

      try {
        result = userFn(...test.args);
      } catch (caught: any) {
        error = caught?.message || 'Erro durante a execução';
      }

      const argsStr = test.args.map((arg) => JSON.stringify(arg)).join(', ');
      const expectedStr = JSON.stringify(test.exp);

      if (error) {
        logs.push({
          tag: `teste ${index + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) encontrou um erro durante a execução.`,
          ok: false,
        });
        if (!firstFailure) firstFailure = { args: argsStr, got: '', expected: expectedStr, error };
        return;
      }

      const gotStr = JSON.stringify(result);
      const pass = gotStr === expectedStr;
      if (pass) {
        passed += 1;
      } else if (!firstFailure) {
        firstFailure = { args: argsStr, got: gotStr, expected: expectedStr };
      }

      logs.push({
        tag: `teste ${index + 1}`,
        msg: pass
          ? `${currentExercise.fn}(${argsStr}) → resultado correto: ${gotStr}`
          : `${currentExercise.fn}(${argsStr}) → seu resultado: ${gotStr}; esperado: ${expectedStr}`,
        ok: pass,
      });
    });

    setLastTest({ passed, total: currentExercise.tests.length, firstFailure });

    if (passed === currentExercise.tests.length) {
      const earnedXp = calculateExerciseXp(currentExercise.xp, hintsShown);

      logs.push({
        tag: 'info',
        msg: `${passed} de ${currentExercise.tests.length} testes passaram. Você dominou este desafio.`,
      });

      if (!store.done[getKey(levelIndex, exerciseIndex)]) {
        setStore((prev) => ({
          ...prev,
          done: { ...prev.done, [getKey(levelIndex, exerciseIndex)]: earnedXp },
        }));
      }

      setIsPassed(true);
    } else {
      setStore((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          [key]: {
            attempts: prev.performance[key]?.attempts || 1,
            failures: (prev.performance[key]?.failures || 0) + 1,
          },
        },
      }));
      setIsPassed(false);
    }

    setConsoleLogs(logs);
  };

  const getLearningFeedback = () => {
    if (!lastTest || !currentExercise) return null;
    if (lastTest.passed === lastTest.total) {
      return {
        tone: 'success',
        title: 'Você acertou a lógica.',
        body: 'Os testes confirmaram o comportamento esperado. Observe o que você fez funcionar — esse padrão vai aparecer de novo em desafios mais difíceis.',
      };
    }

    const failure = lastTest.firstFailure;
    if (!failure) {
      return {
        tone: 'focus',
        title: 'Você está perto.',
        body: 'Alguns testes ainda não passaram. Compare seu código com o que a missão pede e tente novamente.',
      };
    }

    if (failure.error) {
      return {
        tone: 'error',
        title: 'O problema aconteceu durante a execução.',
        body: `O teste ${failure.args ? `com os valores ${failure.args}` : ''} encontrou: ${failure.error}. Procure a linha que pode estar usando uma variável ou operação de forma diferente do que você imaginou.`,
      };
    }

    return {
      tone: 'focus',
      title: 'A lógica ainda precisa de um ajuste.',
      body: `Para a entrada ${failure.args}, seu código devolveu ${failure.got}, mas a missão espera ${failure.expected}. Isso significa que a função executou, mas a regra que transforma a entrada em resultado ainda não está correta.`,
    };
  };

  const learningFeedback = getLearningFeedback();

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
          hMult={HINT_MULTIPLIERS as unknown as number[]}
          getKey={getKey}
          getMult={getMult}
          levelUnlocked={levelUnlocked}
          levelComplete={levelComplete}
          levelDoneCount={levelDoneCount}
          exUnlocked={exUnlocked}
          setExerciseIndex={setExerciseIndex}
          setView={setView}
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
