import { useEffect, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LEVELS } from './levels';
import { LEVEL_LESSONS } from './lessons';

const DIFF_LABEL: Record<string, string> = {
  facil: 'FÁCIL',
  medio: 'MÉDIO',
  dificil: 'DIFÍCIL',
  boss: 'BOSS',
};

const HINT_MULT = [1, 0.9, 0.75, 0.5];

type View = 'dashboard' | 'map' | 'lesson' | 'mission';

interface StoreData {
  done: Record<string, number>;
  hints: Record<string, number>;
}

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [levelIndex, setLevelIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [store, setStore] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem('circuito_v2');
      return saved ? JSON.parse(saved) : { done: {}, hints: {} };
    } catch {
      return { done: {}, hints: {} };
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

  useEffect(() => {
    localStorage.setItem('circuito_v2', JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starter);
      setConsoleLogs([]);
      setIsPassed(false);
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
  const overallProgress = totalMax ? (totalEarned / totalMax) * 100 : 0;

  const openMission = (li: number, ei?: number) => {
    if (!levelUnlocked(li)) return;

    setLevelIndex(li);

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
    setView(currentLesson ? 'lesson' : 'mission');
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
  };

  const handleEvaluate = () => {
    if (!currentExercise) return;

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
      setConsoleLogs([
        {
          tag: 'erro',
          msg: 'Seu código não pôde ser interpretado: ' + error.message,
          ok: false,
        },
      ]);
      setIsPassed(false);
      return;
    }

    if (typeof userFn !== 'function') {
      setConsoleLogs([
        {
          tag: 'dica',
          msg: `Crie a função ${currentExercise.fn} exatamente como ela aparece na missão.`,
        },
      ]);
      setIsPassed(false);
      return;
    }

    let allPass = true;

    currentExercise.tests.forEach((test, index) => {
      let result: any;
      let error: string | null = null;

      try {
        result = userFn(...test.args);
      } catch (caught: any) {
        error = caught.message;
      }

      const argsStr = test.args.map((arg) => JSON.stringify(arg)).join(', ');

      if (error) {
        allPass = false;
        logs.push({
          tag: `teste ${index + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) lançou um erro: ${error}`,
          ok: false,
        });
        return;
      }

      const pass = JSON.stringify(result) === JSON.stringify(test.exp);
      if (!pass) allPass = false;

      logs.push({
        tag: `teste ${index + 1}`,
        msg: `${currentExercise.fn}(${argsStr}) → obtido ${JSON.stringify(result)}, esperado ${JSON.stringify(test.exp)}`,
        ok: pass,
      });
    });

    if (allPass) {
      const earnedXp = Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex));

      logs.push({
        tag: 'info',
        msg: `${currentExercise.tests.length} de ${currentExercise.tests.length} testes passaram.`,
      });

      if (!store.done[getKey(levelIndex, exerciseIndex)]) {
        setStore((prev) => ({
          ...prev,
          done: { ...prev.done, [getKey(levelIndex, exerciseIndex)]: earnedXp },
        }));
      }

      setIsPassed(true);
    } else {
      setIsPassed(false);
    }

    setConsoleLogs(logs);
  };

  const handleNext = () => {
    if (!currentLevel.exercises) return;

    const isLastInLevel = exerciseIndex === currentLevel.exercises.length - 1;

    if (!isLastInLevel) {
      setExerciseIndex((prev) => prev + 1);
      return;
    }

    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((prev) => prev + 1);
      setExerciseIndex(0);
    }
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
                <small>de {totalMax} XP disponíveis</small>
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
                  <button className="btn primary" onClick={() => setView('mission')}>
                    Começar meu primeiro desafio →
                  </button>
                )}
              </div>
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

                      {exerciseIndex < currentLevel.exercises!.length - 1 || levelIndex < LEVELS.length - 1 ? (
                        <button className="btn primary" onClick={handleNext}>
                          {exerciseIndex === currentLevel.exercises!.length - 1 ? 'Próximo nível →' : 'Próximo exercício →'}
                        </button>
                      ) : (
                        <button className="btn primary" disabled>Circuito completo 🎉</button>
                      )}
                    </div>
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
                        <div key={index} className="row">
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
