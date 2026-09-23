import { useEffect, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LEVELS } from './levels';
import { LEVEL_LESSONS } from './lessons';
import { addTodayActivity, getActivityStreak, getLocalDateKey } from './progress';

const DIFF_LABEL: Record<string, string> = {
  facil: 'FÁCIL',
  medio: 'MÉDIO',
  dificil: 'DIFÍCIL',
  boss: 'BOSS',
};

const HINT_MULT = [1, 0.9, 0.75, 0.5];

type View = 'dashboard' | 'map' | 'lesson' | 'mission' | 'completion';

interface PerformanceData {
  attempts: number;
  failures: number;
}

interface StoreData {
  done: Record<string, number>;
  hints: Record<string, number>;
  lessonDone: Record<number, boolean>;
  performance: Record<string, PerformanceData>;
  activityDates: string[];
}

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
    return HINT_MULT[shown];
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
      const earnedXp = Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex));

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
      <header className="top app-header">
        <button className="header-brand-button" onClick={() => setView('dashboard')} aria-label="Ir para o início">
          <div className="top-brand">
            <div className="logo-shell">
              <div className="logo">
                <img src="/codempi-assets/logo/codempi-logo.png" alt="CodeMpi" />
              </div>
            </div>
            <div className="brand-copy">
              <div className="brand-status">
                <span className="dot" /> SISTEMA ONLINE · TRILHA DE PROGRAMAÇÃO
              </div>
              <div className="tagline">
                Aprenda programação na prática, sem medo de errar. Resolva desafios, ganhe XP e avance no seu ritmo.
              </div>
            </div>
          </div>
        </button>

        <nav className="main-nav" aria-label="Navegação principal">
          <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            Início
          </button>
          <button className={`nav-link ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
            Jornada
          </button>
          <button className={`nav-link ${view === 'mission' ? 'active' : ''}`} onClick={() => setView('mission')}>
            Missão
          </button>
        </nav>

        <div className="score-box">
          <div className="score-meta">
            <span className="score-label">XP TOTAL</span>
            <span className="score-max">
              META <span id="maxscore">{totalMax}</span>
            </span>
          </div>
          <div className="score-value" id="score">{totalEarned}</div>
          <div className="score-track" aria-hidden={true}>
            <span style={{ width: `${Math.min(100, overallProgress)}%` }} />
          </div>
          <div className="sub" id="lvlprog">
            {levelsDoneTotal} / {LEVELS.length} níveis fechados
          </div>
        </div>
      </header>

      {view === 'dashboard' && (
        <main className="dashboard">
          <section className="dashboard-hero">
            <div className="hero-copy">
              <span className="eyebrow">CODEMPI / LEARNING SYSTEM</span>
              <h1>Aprenda a programar.<br /><em>Um desafio por vez.</em></h1>
              <p>
                Uma jornada do básico ao pensamento algorítmico, feita para você praticar, errar,
                entender e continuar.
              </p>
              <div className="hero-actions">
                <button className="btn primary hero-button" onClick={() => openMission(continuePoint.li, continuePoint.ei)}>
                  {completedExercises === 0 ? 'Começar minha jornada →' : 'Continuar de onde parei →'}
                </button>
                <button className="btn ghost hero-button" onClick={() => setView('map')}>
                  Ver mapa da jornada
                </button>
              </div>
              <div className="hero-microcopy">
                <span>✓ sem pressão</span>
                <span>✓ feedback imediato</span>
                <span>✓ progresso salvo</span>
              </div>
            </div>

            <div className="hero-console">
              <div className="hero-console-head">
                <span><i /> codempi-session</span>
                <span>ONLINE</span>
              </div>
              <div className="hero-console-body">
                <div><span className="prompt">&gt;</span> init learning_path</div>
                <div className="success">✓ 10 níveis carregados</div>
                <div className="success">✓ {completedExercises} desafios concluídos</div>
                <div><span className="prompt">&gt;</span> current_level</div>
                <div className="current-line">{activeLevel.tag} / {activeLevel.name}</div>
                <div><span className="prompt">&gt;</span> status</div>
                <div className="status-line">READY<span className="cursor" /></div>
              </div>
            </div>
          </section>

          <section className="stats-grid" aria-label="Estatísticas do jogador">
            <article className="stat-card">
              <span className="stat-icon">✦</span>
              <div>
                <span className="stat-label">XP acumulado</span>
                <strong>{totalEarned}</strong>
                <small>{lessonsEarnedXp} XP vindos das aulas</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon">◎</span>
              <div>
                <span className="stat-label">Desafios concluídos</span>
                <strong>{completedExercises}</strong>
                <small>missões resolvidas</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon">◇</span>
              <div>
                <span className="stat-label">Níveis concluídos</span>
                <strong>{levelsDoneTotal}/{LEVELS.length}</strong>
                <small>sua jornada até aqui</small>
              </div>
            </article>
          </section>

          <section className="concepts-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
                <h2>O que você já domina</h2>
              </div>
              <span className="concept-count">{masteredConcepts.length} dominados</span>
            </div>

            <div className="concepts-grid">
              {masteredConcepts.length > 0 ? masteredConcepts.slice(0, 6).map((concept) => (
                <article className="concept-card mastered" key={concept.skill}>
                  <div className="concept-card-top">
                    <span className="concept-state">✓ DOMINADO</span>
                    <span>{concept.completed}/{concept.total}</span>
                  </div>
                  <h3>{concept.skill}</h3>
                  <p>Você já resolveu os desafios desse conceito sem precisar voltar para o básico.</p>
                </article>
              )) : (
                <div className="concept-empty">
                  <span>◎</span>
                  <div>
                    <strong>Seu primeiro conceito está esperando.</strong>
                    <p>Conclua uma missão para começar a construir seu histórico de domínio.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="concepts-section review-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PROFESSOR DO CODEMPI</span>
                <h2>Conceitos para revisar</h2>
              </div>
              {reviewConcepts.length > 0 && <span className="concept-count review">{reviewConcepts.length} para revisar</span>}
            </div>

            {reviewConcepts.length > 0 ? (
              <div className="review-list">
                {reviewConcepts.slice(0, 4).map((concept) => (
                  <article className="review-card" key={concept.skill}>
                    <div className="review-copy">
                      <span className="concept-state">↻ VALE REVISAR</span>
                      <h3>{concept.skill}</h3>
                      <p>Você encontrou dificuldade {concept.failures} vezes em {concept.attempts} tentativas. Isso não é fracasso — é um sinal de onde podemos reforçar a base.</p>
                    </div>
                    <button className="btn ghost" onClick={() => handleReviewConcept(concept)}>Revisar →</button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="review-clear">
                <span>✦</span>
                <div>
                  <strong>Nenhum conceito precisa de revisão agora.</strong>
                  <p>Continue praticando. O CodeMpi observa sua evolução e avisa quando algum assunto merece uma nova passada.</p>
                </div>
              </div>
            )}
          </section>

          <section className="daily-grid">
            <article className={`streak-card ${activityStreak.activeToday ? 'active' : ''}`}>
              <div className="daily-card-top">
                <span className="section-kicker">CONTINUIDADE</span>
                <span className="daily-date">{todayKey.split('-').reverse().join('/')}</span>
              </div>
              <div className="streak-main">
                <span className="streak-flame">⌁</span>
                <div>
                  <strong>{activityStreak.current}</strong>
                  <span>{activityStreak.current === 1 ? 'dia de sequência' : 'dias de sequência'}</span>
                </div>
              </div>
              <p>
                {activityStreak.activeToday
                  ? 'Você já fez sua atividade hoje. Seu progresso continua do seu jeito.'
                  : activityStreak.current > 0
                    ? 'Você ainda pode praticar hoje e manter sua sequência.'
                    : 'Comece uma missão hoje. Não precisa ser longo para contar.'}
              </p>
              <div className="streak-best">Melhor sequência: <b>{activityStreak.best} dias</b></div>
            </article>

            <article className="daily-review-card">
              <div className="daily-card-top">
                <span className="section-kicker">FOCO DE HOJE</span>
                <span className="daily-review-icon">↻</span>
              </div>
              {reviewTarget ? (
                <>
                  <h2>{reviewTarget.skill}</h2>
                  <p>
                    {reviewConcepts.length > 0
                      ? 'Esse conceito apareceu algumas vezes nas suas dificuldades. Uma revisão curta pode ajudar a consolidar a base.'
                      : 'Você já avançou nesse assunto. Uma passada rápida ajuda a manter o conhecimento ativo.'}
                  </p>
                  <button className="btn ghost" onClick={() => handleReviewConcept(reviewTarget)}>
                    Revisar agora →
                  </button>
                </>
              ) : (
                <>
                  <h2>Seu primeiro foco está esperando.</h2>
                  <p>Complete uma missão para o CodeMpi começar a identificar quais conceitos você domina e quais merecem reforço.</p>
                  <button className="btn ghost" onClick={() => openMission(continuePoint.li, continuePoint.ei)}>
                    Começar uma missão →
                  </button>
                </>
              )}
            </article>
          </section>

          <section className="continue-grid">
            <article className="continue-card">
              <div className="section-kicker">CONTINUE SUA JORNADA</div>
              <div className="continue-title-row">
                <div>
                  <h2>{activeLevel.tag} · {activeLevel.name}</h2>
                  <p>{activeLevel.exercises ? `${activeLevelDone} de ${activeLevelTotal} desafios concluídos.` : 'O próximo nível da jornada está sendo preparado.'}</p>
                </div>
                <span className="continue-badge">{activeLevel.exercises ? `${activeLevelDone}/${activeLevelTotal}` : 'EM BREVE'}</span>
              </div>
              <div className="progress-bar large">
                <span style={{ width: `${activeLevelTotal ? (activeLevelDone / activeLevelTotal) * 100 : 0}%` }} />
              </div>
              <button className="text-action" onClick={() => openMission(continuePoint.li, continuePoint.ei)}>
                {activeLevel.exercises ? 'Abrir próxima missão →' : 'Ver detalhes do nível →'}
              </button>
            </article>

            <article className="philosophy-card">
              <div className="section-kicker">COMO O CODEMPI FUNCIONA</div>
              <h2>Errar não tira você do caminho.</h2>
              <p>Os testes mostram onde sua lógica precisa melhorar. As pistas ajudam sem entregar tudo. Você tenta de novo, entende e segue.</p>
              <div className="mini-steps">
                <span>01 · entender</span>
                <span>02 · tentar</span>
                <span>03 · corrigir</span>
                <span>04 · dominar</span>
              </div>
            </article>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PRÓXIMAS ETAPAS</span>
                <h2>Sua jornada de programação</h2>
              </div>
              <button className="text-action" onClick={() => setView('map')}>Abrir mapa completo →</button>
            </div>

            <div className="path-preview">
              {LEVELS.slice(0, 5).map((level, index) => {
                const unlocked = levelUnlocked(index);
                const complete = levelComplete(index);
                const inProgress = unlocked && !complete && Boolean(level.exercises?.length);

                return (
                  <button
                    key={level.tag}
                    className={`path-card ${complete ? 'complete' : ''} ${inProgress ? 'current' : ''} ${!unlocked ? 'locked' : ''}`}
                    onClick={() => unlocked && openMission(index)}
                    disabled={!unlocked}
                  >
                    <span className="path-number">{complete ? '✓' : level.tag}</span>
                    <span className="path-name">{level.name}</span>
                    <span className="path-meta">
                      {level.exercises ? `${levelDoneCount(index)}/${level.exercises.length} desafios` : 'Em breve'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {view === 'map' && (
        <main className="map-page">
          <section className="map-hero">
            <div>
              <span className="eyebrow">CODEMPI / JOURNEY MAP</span>
              <h1>Sua jornada começa no básico.<br /><em>E fica mais interessante a cada nível.</em></h1>
              <p>Complete um nível para liberar o próximo. Cada etapa introduz uma ideia nova e aumenta o desafio gradualmente.</p>
            </div>
            <div className="map-summary">
              <span>PROGRESSO GERAL</span>
              <strong>{Math.round(overallProgress)}%</strong>
              <div className="progress-bar"><span style={{ width: `${Math.min(100, overallProgress)}%` }} /></div>
              <small>{completedExercises} desafios · {levelsDoneTotal} níveis</small>
            </div>
          </section>

          <section className="level-map" aria-label="Mapa de progressão dos níveis">
            {LEVELS.map((level, li) => {
              const unlocked = levelUnlocked(li);
              const complete = levelComplete(li);
              const inProgress = unlocked && !complete && Boolean(level.exercises?.length);
              const built = Boolean(level.exercises?.length);
              const progress = built ? levelDoneCount(li) / level.exercises!.length : 0;

              return (
                <div className={`map-level-row ${complete ? 'complete' : ''} ${inProgress ? 'current' : ''} ${!unlocked ? 'locked' : ''} ${!built ? 'soon' : ''}`} key={level.tag}>
                  <div className="map-connector" />
                  <div className="map-node">
                    <span>{complete ? '✓' : unlocked ? level.tag : '×'}</span>
                  </div>
                  <button
                    className="map-level-card"
                    onClick={() => unlocked && openMission(li)}
                    disabled={!unlocked}
                  >
                    <div className="map-level-top">
                      <span className="map-level-tag">{level.tag}</span>
                      <span className={`map-status ${complete ? 'done' : inProgress ? 'current' : !unlocked ? 'locked' : 'soon'}`}>
                        {complete ? 'CONCLUÍDO' : inProgress ? 'EM ANDAMENTO' : unlocked ? 'EM BREVE' : 'BLOQUEADO'}
                      </span>
                    </div>
                    <h2>{level.name}</h2>
                    <p>{built ? `${level.exercises!.length} desafios para dominar este tema.` : 'Conteúdo planejado para a próxima etapa do CodeMpi.'}</p>
                    {built ? (
                      <div className="map-progress-row">
                        <div className="progress-bar"><span style={{ width: `${progress * 100}%` }} /></div>
                        <span>{levelDoneCount(li)}/{level.exercises!.length}</span>
                      </div>
                    ) : (
                      <div className="map-topics">{level.topics}</div>
                    )}
                    <span className="map-action">{unlocked ? (built ? 'Abrir nível →' : 'Explorar nível →') : 'Complete o nível anterior para liberar'}</span>
                  </button>
                </div>
              );
            })}
          </section>
        </main>
      )}

      {view === 'lesson' && currentLesson && currentLessonStep && (
        <main className="lesson-page">
          <div className="lesson-toolbar">
            <button className="text-action" onClick={() => setView('map')}>← Voltar para a jornada</button>
            <span>{currentLesson.levelTag} · AULA GUIADA</span>
          </div>

          <section className="lesson-card">
            <div className="lesson-progress">
              <span>PASSO {lessonStep + 1} DE {currentLesson.steps.length}</span>
              <div className="progress-bar"><span style={{ width: `${((lessonStep + 1) / currentLesson.steps.length) * 100}%` }} /></div>
            </div>

            <div className="lesson-reward-strip">
              <span className="lesson-reward-icon">✦</span>
              <div>
                <strong>{lessonCompletion ? `Aula concluída · +${lessonReward} XP recebidos` : `Conclua a aula e receba +${lessonReward} XP`}</strong>
                <small>{lessonCompletion ? 'Você pode revisitar esta aula quando quiser.' : 'Uma pequena recompensa por completar a preparação antes da prática.'}</small>
              </div>
              {lessonCompletion && <span className="lesson-reward-check">✓</span>}
            </div>

            <div className="lesson-content">
              <span className="eyebrow">{currentLessonStep.eyebrow}</span>
              <h1>{currentLessonStep.title}</h1>
              <p className="lesson-body">{currentLessonStep.body}</p>

              {currentLessonStep.code && (
                <pre className="lesson-code"><code>{currentLessonStep.code}</code></pre>
              )}

              {currentLessonStep.explanation && (
                <div className="lesson-explanation">
                  <span>💡</span>
                  <div><strong>Por que isso funciona?</strong><p>{currentLessonStep.explanation}</p></div>
                </div>
              )}

              {currentLessonStep.quiz && (
                <div className="lesson-quiz">
                  <strong>{currentLessonStep.quiz.question}</strong>
                  <div className="quiz-options">
                    {currentLessonStep.quiz.options.map((option, index) => {
                      const selected = quizAnswer === index;
                      const answered = quizAnswer !== null;
                      const correct = index === currentLessonStep.quiz!.answer;
                      return (
                        <button
                          key={option}
                          className={`quiz-option ${selected ? 'selected' : ''} ${answered && correct ? 'correct' : ''} ${answered && selected && !correct ? 'wrong' : ''}`}
                          onClick={() => setQuizAnswer(index)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>{option}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswer !== null && (
                    <div className={`quiz-feedback ${quizAnswer === currentLessonStep.quiz.answer ? 'correct' : 'wrong'}`}>
                      {quizAnswer === currentLessonStep.quiz.answer ? '✓ Acertou! ' : '↻ Ainda não. '}
                      {currentLessonStep.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lesson-footer">
              <span>{lessonStep === 0 ? 'Começando pelo básico' : 'Você está avançando'}</span>
              <div>
                {lessonStep > 0 && (
                  <button className="btn ghost" onClick={() => { setLessonStep((prev) => prev - 1); setQuizAnswer(null); }}>
                    ← Voltar
                  </button>
                )}
                {lessonStep < currentLesson.steps.length - 1 ? (
                  <button
                    className="btn primary"
                    disabled={currentLessonStep.type === 'quiz' && quizAnswer === null}
                    onClick={() => {
                      if (currentLessonStep.type === 'quiz' && quizAnswer !== currentLessonStep.quiz?.answer) {
                        setQuizAnswer(null);
                        return;
                      }
                      setLessonStep((prev) => prev + 1);
                      setQuizAnswer(null);
                    }}
                  >
                    {currentLessonStep.type === 'quiz' && quizAnswer !== currentLessonStep.quiz?.answer ? 'Tentar novamente →' : 'Continuar →'}
                  </button>
                ) : (
                  <button className="btn primary" onClick={handleLessonFinish}>
                    {lessonCompletion ? 'Voltar para a missão →' : `Concluir aula · +${lessonReward} XP`}
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'completion' && completionLevel !== null && (
        <main className="completion-page">
          <section className="completion-card">
            <div className="completion-orbit"><span>✦</span><span>✦</span><span>✦</span></div>
            <span className="eyebrow">NÍVEL CONCLUÍDO · {LEVELS[completionLevel].tag}</span>
            <h1>Você fechou <em>{LEVELS[completionLevel].name}.</em></h1>
            <p className="completion-intro">Você não só passou pelos desafios. Você praticou, encontrou erros, corrigiu sua lógica e construiu uma base nova.</p>

            <div className="completion-stats">
              <div><strong>{levelDoneCount(completionLevel)}</strong><span>desafios concluídos</span></div>
              <div><strong>+{LEVELS[completionLevel].exercises?.reduce((sum, ex, ei) => sum + (store.done[getKey(completionLevel, ei)] || 0), 0) || 0}</strong><span>XP nos desafios</span></div>
              <div><strong>+{LEVEL_LESSONS[completionLevel]?.rewardXp || 0}</strong><span>XP da aula</span></div>
            </div>

            <div className="completion-learned">
              <span className="section-kicker">VOCÊ PRATICOU</span>
              <div className="completion-tags">
                {(completionLevel === 0
                  ? ['Variáveis', 'Operadores', 'Funções']
                  : ['if / else', 'Comparações', '&& e ||', 'Múltiplas condições']
                ).map((item) => <span key={item}>✓ {item}</span>)}
              </div>
            </div>

            <div className="completion-actions">
              <button className="btn ghost" onClick={() => setView('map')}>Ver jornada</button>
              {completionLevel < LEVELS.length - 1 ? (
                <button className="btn primary" onClick={() => openMission(completionLevel + 1)}>
                  Desbloqueado: {LEVELS[completionLevel + 1].tag} →
                </button>
              ) : (
                <button className="btn primary" onClick={() => setView('dashboard')}>Voltar ao Dashboard</button>
              )}
            </div>
          </section>
        </main>
      )}

      {view === 'mission' && (
        <main className="mission-shell">
          <div className="mission-toolbar">
            <button className="text-action" onClick={() => setView('map')}>← Voltar para o mapa</button>
            <span>MISSÃO ATUAL · {currentLevel.tag}</span>
          </div>

          <div className="grid">
            <nav className="circuit" id="circuit" aria-label="Mapa de níveis da missão">
              {LEVELS.map((level, li) => {
                const unlocked = levelUnlocked(li);
                const built = Boolean(level.exercises?.length);
                const done = built && levelComplete(li);
                const progressLabel = built ? `${levelDoneCount(li)}/${level.exercises!.length}` : unlocked ? 'em breve' : 'bloqueado';

                const nodeClass = [
                  'node',
                  done ? 'done' : '',
                  li === levelIndex ? 'active' : '',
                  !unlocked ? 'locked' : '',
                  unlocked && !built ? 'soon' : '',
                ].filter(Boolean).join(' ');

                return (
                  <button key={level.tag} className={nodeClass} onClick={() => unlocked && openMission(li)}>
                    <span className="lvl-title">{level.tag}. {level.name}</span>
                    <span className="lvl-tag">{progressLabel}</span>
                  </button>
                );
              })}
            </nav>

            <section className="panel">
              <div className="panel-head">
                <div className="kicker">
                  {currentLevel.tag} · {currentLevel.name}
                  {currentExercise ? ` · EXERCÍCIO ${exerciseIndex + 1}/${currentLevel.exercises!.length}` : ''}
                </div>
                <h2>{currentExercise ? currentExercise.title : currentLevel.name}</h2>
                <p>{currentExercise ? currentExercise.desc : 'Este nível ainda está sendo construído — chegando em breve.'}</p>

                <div className="badges">
                  {currentExercise && (
                    <>
                      <span className={`badge diff-${currentExercise.difficulty}`}>{DIFF_LABEL[currentExercise.difficulty]}</span>
                      <span className="badge xp">XP {Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex))} / {currentExercise.xp}</span>
                      <span className="sig">{currentExercise.sig}</span>
                    </>
                  )}
                </div>
              </div>

              {!hasExercises ? (
                <div className="soon-panel">
                  <div className="big">🔧 {currentLevel.count} exercícios em construção</div>
                  Temas planejados:
                  <div className="topics">{currentLevel.topics}</div>
                  <button className="btn ghost soon-back" onClick={() => setView('map')}>Voltar para a jornada</button>
                </div>
              ) : (
                <div id="exBody">
                  <div className="ex-strip">
                    {currentLevel.exercises!.map((exercise, ei) => {
                      const isDone = Boolean(store.done[getKey(levelIndex, ei)]);
                      const isUnlocked = exUnlocked(levelIndex, ei);
                      const isActive = ei === exerciseIndex;

                      const dotClass = [
                        'ex-dot',
                        `diff-${exercise.difficulty}`,
                        isDone ? 'done' : '',
                        isActive ? 'active' : '',
                        !isUnlocked ? 'locked' : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <button
                          key={ei}
                          className={dotClass}
                          title={exercise.title}
                          onClick={() => isUnlocked && setExerciseIndex(ei)}
                          disabled={!isUnlocked}
                        >
                          {isDone ? '✓' : ei + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="editor-wrap">
                    <CodeEditor code={code} onChange={setCode} />

                    <div className="learning-note">
                      <span>💡</span>
                      <span>Errar faz parte. Você pode testar quantas vezes precisar. As dicas reduzem o XP, mas não impedem seu progresso.</span>
                    </div>

                    <div className="actions">
                      <button className="btn primary" onClick={handleEvaluate}>▶ Rodar testes</button>
                      <button className="btn ghost" onClick={handleResetCode}>Reiniciar código</button>
                      <button
                        className={`btn ${showFreeTest ? 'secondary active' : 'ghost'}`}
                        onClick={() => {
                          setShowFreeTest((prev) => !prev);
                          setFreeResult(null);
                        }}
                      >
                        {showFreeTest ? '× Fechar teste de mesa' : '◇ Abrir teste de mesa'}
                      </button>
                      <button className="btn ghost" onClick={handleShowHint} disabled={hintsShown >= currentExercise.hints.length}>
                        {hintsShown >= currentExercise.hints.length
                          ? 'Todas as dicas exibidas'
                          : `Mostrar dica (${hintsShown + 1}/${currentExercise.hints.length}) — XP cai p/ ${Math.round(HINT_MULT[hintsShown + 1] * 100)}%`}
                      </button>
                      <span className="xp-live">
                        {!alreadyDoneXP && hintsShown > 0
                          ? `${hintsShown} dica(s) usada(s) — XP reduzido para ${Math.round(getMult(levelIndex, exerciseIndex) * 100)}%`
                          : ''}
                      </span>
                    </div>

                    <div className="hints-box">
                      {currentExercise.hints.slice(0, hintsShown).map((hintText, index) => (
                        <div key={index} className="hint-line">
                          <b>Dica {index + 1}</b> {hintText}
                        </div>
                      ))}
                    </div>
                  </div>

                  {(isPassed || alreadyDoneXP) && (
                    <div className="win-banner show">
                      <span>
                        {alreadyDoneXP
                          ? `Exercício já concluído — você ganhou ${alreadyDoneXP} XP aqui.`
                          : `Todos os testes passaram! Você ganhou ${Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex))} XP.`}
                      </span>

                      {(
                        <button className="btn primary" onClick={handleNext}>
                          {exerciseIndex === currentLevel.exercises!.length - 1 ? 'Ver resumo do nível →' : 'Próximo exercício →'}
                        </button>
                      )}
                    </div>
                  )}

                  {getLearningFeedback() && (
                    <div className={`learning-feedback ${getLearningFeedback()!.tone}`}>
                      <span className="learning-feedback-icon">{getLearningFeedback()!.tone === 'success' ? '✓' : getLearningFeedback()!.tone === 'error' ? '!' : '↻'}</span>
                      <div>
                        <strong>{getLearningFeedback()!.title}</strong>
                        <p>{getLearningFeedback()!.body}</p>
                      </div>
                    </div>
                  )}

                  <div className="test-summary">
                    {consoleLogs.length > 0 ? (
                      <>
                        <span>{consoleLogs.filter((log) => log.ok === true).length}/{currentExercise.tests.length} testes passaram</span>
                        {isPassed ? <b>✓ Missão concluída</b> : <small>Você pode tentar novamente</small>}
                      </>
                    ) : (
                      <span>Pronto para testar seu código</span>
                    )}
                  </div>

                                    {showFreeTest && (
<section className="free-test-panel">
                    <div className="free-test-head">
                      <div>
                        <span>TESTE DE MESA</span>
                        <strong>Experimente seus próprios valores</strong>
                      </div>
                      <small>não afeta XP nem o progresso</small>
                    </div>

                    <div className="free-test-grid">
                      {freeInputs.map((value, index) => (
                        <label className="free-input" key={index}>
                          <span>{currentExercise.tests[0]?.args.length > 1 ? String.fromCharCode(97 + index) : 'valor'}</span>
                          <input
                            value={value}
                            onChange={(event) => {
                              const nextInputs = [...freeInputs];
                              nextInputs[index] = event.target.value;
                              setFreeInputs(nextInputs);
                              setFreeResult(null);
                            }}
                            spellCheck={false}
                            aria-label={`Valor da entrada ${index + 1}`}
                          />
                        </label>
                      ))}
                      <button className="btn secondary free-test-button" onClick={handleFreeTest}>Testar entrada →</button>
                    </div>

                    {freeResult && (
                      <div className={`free-result ${freeResult.ok ? 'ok' : 'error'}`}>
                        <span>{freeResult.ok ? 'RESULTADO' : 'ERRO'}</span>
                        <strong>{freeResult.ok ? freeResult.value : freeResult.error}</strong>
                      </div>
                    )}
                  </section>
                  )}

                  <div className="section-label">
                    Resultados dos testes
                    <span style={{ color: 'var(--muted-2)', fontWeight: 'normal' }}>— rode para verificar a resposta</span>
                  </div>

                  <div className="console">
                    {consoleLogs.length === 0 ? (
                      <div className="console-empty">// o resultado dos testes aparece aqui<span className="cursor" /></div>
                    ) : (
                      consoleLogs.map((log, index) => (
                        <div key={index} className={`row ${log.ok === true ? 'row-ok' : log.ok === false ? 'row-err' : 'row-info'}`}>
                          <span className={`tag ${log.ok === undefined ? 'info' : log.ok ? 'ok' : 'err'}`}>{log.tag}</span>
                          <span className="msg">{log.msg}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      )}

      <footer className="note">
        seu progresso (XP, dicas usadas e exercícios concluídos) fica salvo neste navegador
      </footer>
    </div>
  );
}
