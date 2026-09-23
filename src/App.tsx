import { useState, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import { LEVELS } from './levels';

const DIFF_LABEL: Record<string, string> = {
  facil: 'FÁCIL',
  medio: 'MÉDIO',
  dificil: 'DIFÍCIL',
  boss: 'BOSS'
};

const HINT_MULT = [1, 0.9, 0.75, 0.5];

interface StoreData {
  done: Record<string, number>;
  hints: Record<string, number>;
}

export default function App() {
  // 1. Estados principais do jogo
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [store, setStore] = useState<StoreData>(() => {
    try {
      const saved = localStorage.getItem('circuito_v2');
      return saved ? JSON.parse(saved) : { done: {}, hints: {} };
    } catch {
      return { done: {}, hints: {} };
    }
  });

  const currentLevel = LEVELS[levelIndex];
  const hasExercises = Boolean(currentLevel.exercises && currentLevel.exercises.length > 0);
  const currentExercise = hasExercises ? currentLevel.exercises![exerciseIndex] : null;

  const [code, setCode] = useState<string>(currentExercise?.starter || '');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ tag: string; msg: string; ok?: boolean }>>([]);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Persistence no localStorage
  useEffect(() => {
    localStorage.setItem('circuito_v2', JSON.stringify(store));
  }, [store]);

  // Atualiza o editor quando o usuário troca de exercício
  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starter);
      setConsoleLogs([]);
      setIsPassed(false);
    }
  }, [levelIndex, exerciseIndex]);

  // Helpers de chaves e métricas
  const exKey = `${levelIndex}-${exerciseIndex}`;
  const hintsShown = store.hints[exKey] || 0;
  const alreadyDoneXP = store.done[exKey];

  const getKey = (li: number, ei: number) => `${li}-${ei}`;

  const levelDoneCount = (li: number) => {
    const lvl = LEVELS[li];
    if (!lvl.exercises) return 0;
    return lvl.exercises.filter((_, ei) => store.done[getKey(li, ei)]).length;
  };

  const levelComplete = (li: number) => {
    const lvl = LEVELS[li];
    return Boolean(lvl.exercises && levelDoneCount(li) === lvl.exercises.length);
  };

  const levelUnlocked = (li: number) => {
    return li === 0 || levelComplete(li - 1);
  };

  const exUnlocked = (li: number, ei: number) => {
    if (!levelUnlocked(li)) return false;
    if (ei === 0) return true;
    return Boolean(store.done[getKey(li, ei - 1)]);
  };

  const calcTotalXp = () => {
    let earned = 0;
    let max = 0;
    LEVELS.forEach((lvl, li) => {
      if (!lvl.exercises) return;
      lvl.exercises.forEach((ex, ei) => {
        max += ex.xp;
        const d = store.done[getKey(li, ei)];
        if (d) earned += d;
      });
    });
    return { earned, max };
  };

  const { earned: totalEarned, max: totalMax } = calcTotalXp();
  const levelsDoneTotal = LEVELS.filter((_, i) => levelComplete(i)).length;

  const getMult = (li: number, ei: number) => {
    const shown = Math.min(store.hints[getKey(li, ei)] || 0, 3);
    return HINT_MULT[shown];
  };

  // Funções de Ação (Rodar testes, Dicas, Next, Reset)
  const handleShowHint = () => {
    if (!currentExercise || hintsShown >= currentExercise.hints.length) return;
    setStore(prev => ({
      ...prev,
      hints: { ...prev.hints, [exKey]: hintsShown + 1 }
    }));
  };

  const handleResetCode = () => {
    if (currentExercise) {
      setCode(currentExercise.starter);
      setConsoleLogs([]);
      setIsPassed(false);
    }
  };

  const handleEvaluate = () => {
    if (!currentExercise) return;

    const logs: Array<{ tag: string; msg: string; ok?: boolean }> = [];
    let userFn: any;

    try {
      const wrapper = new Function(
        'console',
        code + `\nreturn typeof ${currentExercise.fn} === "function" ? ${currentExercise.fn} : undefined;`
      );
      userFn = wrapper({ log: () => {}, warn: () => {}, error: () => {} });
    } catch (e: any) {
      setConsoleLogs([{ tag: 'erro', msg: 'Seu código não pôde ser interpretado: ' + e.message, ok: false }]);
      setIsPassed(false);
      return;
    }

    if (typeof userFn !== 'function') {
      setConsoleLogs([]);
      setIsPassed(false);
      return;
    }

    let allPass = true;
    currentExercise.tests.forEach((t, idx) => {
      let result: any;
      let error: string | null = null;
      try {
        result = userFn(...t.args);
      } catch (e: any) {
        error = e.message;
      }

      const argsStr = t.args.map(a => JSON.stringify(a)).join(', ');
      if (error) {
        allPass = false;
        logs.push({
          tag: `teste ${idx + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) lançou um erro: ${error}`,
          ok: false
        });
      } else {
        const pass = JSON.stringify(result) === JSON.stringify(t.exp);
        if (!pass) allPass = false;
        logs.push({
          tag: `teste ${idx + 1}`,
          msg: `${currentExercise.fn}(${argsStr}) → obtido ${JSON.stringify(result)}, esperado ${JSON.stringify(t.exp)}`,
          ok: pass
        });
      }
    });

    if (allPass) {
      logs.push({
        tag: 'info',
        msg: `${currentExercise.tests.length} de ${currentExercise.tests.length} testes passaram.`
      });

      if (!store.done[exKey]) {
        const earnedXp = Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex));
        setStore(prev => ({
          ...prev,
          done: { ...prev.done, [exKey]: earnedXp }
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
      setExerciseIndex(prev => prev + 1);
    } else if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setExerciseIndex(0);
    }
  };

  const handleSelectLevel = (li: number) => {
    if (!levelUnlocked(li)) return;
    setLevelIndex(li);
    const lvl = LEVELS[li];
    if (!lvl.exercises) return;

    let targetEi = 0;
    for (let i = 0; i < lvl.exercises.length; i++) {
      if (!store.done[getKey(li, i)]) {
        targetEi = i;
        break;
      }
      if (i === lvl.exercises.length - 1) targetEi = i;
    }
    setExerciseIndex(targetEi);
  };

  return (
    <div className="wrap">
      {/* HEADER SUPERIOR */}
      <header className="top">
        <div className="top-brand">
          <div className="logo-shell">
            <div className="logo">
              <img src="../codempi-assets/logo/codempi-logo.png" alt="CodeMpi" />
            </div>
          </div>
          <div className="brand-copy">
            <div className="brand-status">
              <span className="dot"></span> SISTEMA ONLINE · TRILHA DE PROGRAMAÇÃO
            </div>
            <div className="tagline">
              Uma trilha de 10 níveis para treinar lógica de programação escrevendo JavaScript de verdade. Resolva, rode os testes, ganhe XP, avance no circuito.
            </div>
          </div>
        </div>
        <div className="score-box">
          <div className="score-meta">
            <span className="score-label">XP TOTAL</span>
            <span className="score-max">
              META <span id="maxscore">{totalMax}</span>
            </span>
          </div>
          <div className="score-value" id="score">
            {totalEarned}
          </div>
          <div className="score-track" aria-hidden={true}></div>
          <div className="sub" id="lvlprog">
            {levelsDoneTotal} / {LEVELS.length} níveis fechados
          </div>
        </div>
      </header>

      {/* GRID DA APLICAÇÃO */}
      <div className="grid">
        {/* BARRA LATERAL (CIRCUITO DE NÍVEIS) */}
        <nav className="circuit" id="circuit" aria-label="Mapa de progressão dos níveis">
          {LEVELS.map((lvl, li) => {
            const unlocked = levelUnlocked(li);
            const built = Boolean(lvl.exercises);
            const done = built && levelComplete(li);
            const prog = built
              ? `${levelDoneCount(li)}/${lvl.exercises!.length}`
              : unlocked
              ? 'em breve'
              : 'bloqueado';

            const nodeClass = [
              'node',
              done ? 'done' : '',
              li === levelIndex ? 'active' : '',
              !unlocked ? 'locked' : '',
              unlocked && !built ? 'soon' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={lvl.tag}
                className={nodeClass}
                onClick={() => handleSelectLevel(li)}
              >
                <span className="lvl-title">
                  {lvl.tag}. {lvl.name}
                </span>
                <span className="lvl-tag">{prog}</span>
              </button>
            );
          })}
        </nav>

        {/* PAINEL CENTRAL (EXERCÍCIO ATUAL OU MENSAGEM 'EM BREVE') */}
        <main className="panel">
          <div className="panel-head">
            <div className="kicker" id="kicker">
              {currentLevel.tag} · {currentLevel.name}
              {currentExercise ? ` · EXERCÍCIO ${exerciseIndex + 1}/${currentLevel.exercises!.length}` : ''}
            </div>
            <h2 id="lvl-title">{currentExercise ? currentExercise.title : currentLevel.name}</h2>
            <p id="lvl-desc">
              {currentExercise ? currentExercise.desc : 'Este nível ainda está sendo construído — chegando em breve.'}
            </p>
            <div className="badges" id="badges">
              {currentExercise && (
                <>
                  <span className={`badge diff-${currentExercise.difficulty}`}>
                    {DIFF_LABEL[currentExercise.difficulty]}
                  </span>
                  <span className="badge xp" id="xpBadge">
                    XP {Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex))} / {currentExercise.xp}
                  </span>
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
            </div>
          ) : (
            <div id="exBody">
              {/* BARRINHA DE SELEÇÃO DE EXERCÍCIO (BOLINHAS/DOTS) */}
              <div className="ex-strip">
                {currentLevel.exercises!.map((ex, ei) => {
                  const isDone = Boolean(store.done[getKey(levelIndex, ei)]);
                  const isUnlocked = exUnlocked(levelIndex, ei);
                  const isActive = ei === exerciseIndex;

                  const dotClass = [
                    'ex-dot',
                    `diff-${ex.difficulty}`,
                    isDone ? 'done' : '',
                    isActive ? 'active' : '',
                    !isUnlocked ? 'locked' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div
                      key={ei}
                      className={dotClass}
                      title={ex.title}
                      onClick={() => {
                        if (isUnlocked) setExerciseIndex(ei);
                      }}
                    >
                      {isDone ? '✓' : ei + 1}
                    </div>
                  );
                })}
              </div>

              {/* EDITOR CODEMIRROR SUBSTUINDO O TEXTAREA */}
              <div className="editor-wrap">
                <CodeEditor code={code} onChange={setCode} />

                <div className="actions">
                  <button className="btn primary" id="run" onClick={handleEvaluate}>
                    ▶ Rodar testes
                  </button>
                  <button className="btn ghost" id="reset" onClick={handleResetCode}>
                    Reiniciar código
                  </button>
                  <button
                    className="btn ghost"
                    id="hint"
                    onClick={handleShowHint}
                    disabled={!currentExercise || hintsShown >= currentExercise.hints.length}
                  >
                    {!currentExercise || hintsShown >= currentExercise.hints.length
                      ? 'Todas as dicas exibidas'
                      : `Mostrar dica (${hintsShown + 1}/${currentExercise.hints.length}) — XP cai p/ ${Math.round(
                          HINT_MULT[hintsShown + 1] * 100
                        )}%`}
                  </button>
                  <span className="xp-live" id="xpLive">
                    {!alreadyDoneXP && hintsShown > 0
                      ? `${hintsShown} dica(s) usada(s) — XP reduzido para ${Math.round(
                          getMult(levelIndex, exerciseIndex) * 100
                        )}%`
                      : ''}
                  </span>
                </div>

                {/* CAIXA DE DICAS */}
                <div className="hints-box" id="hintsBox">
                  {currentExercise &&
                    currentExercise.hints.slice(0, hintsShown).map((hintText, idx) => (
                      <div key={idx} className="hint-line">
                        <b>Dica {idx + 1}</b> {hintText}
                      </div>
                    ))}
                </div>
              </div>

              {/* BANNER DE VITÓRIA */}
              {(isPassed || alreadyDoneXP) && (
                <div className="win-banner show" id="winBanner">
                  <span>
                    {alreadyDoneXP
                      ? `Exercício já concluído — você ganhou ${alreadyDoneXP} XP aqui.`
                      : `Todos os testes passaram! Você ganhou ${Math.round(
                          currentExercise!.xp * getMult(levelIndex, exerciseIndex)
                        )} XP.`}
                  </span>
                  {exerciseIndex < currentLevel.exercises!.length - 1 || levelIndex < LEVELS.length - 1 ? (
                    <button className="btn primary" id="nextBtn" onClick={handleNext}>
                      {exerciseIndex === currentLevel.exercises!.length - 1
                        ? 'Próximo nível →'
                        : 'Próximo exercício →'}
                    </button>
                  ) : (
                    <button className="btn primary" disabled>
                      Circuito completo 🎉
                    </button>
                  )}
                </div>
              )}

              {/* CONSOLE DE RESULTADOS */}
              <div className="section-label">
                Resultados dos testes{' '}
                <span style={{ color: 'var(--muted-2)', fontWeight: 'normal' }}>
                  — rode para verificar a resposta
                </span>
              </div>
              <div className="console" id="console">
                {consoleLogs.length === 0 ? (
                  <div className="console-empty">
                    // o resultado dos testes aparece aqui<span className="cursor"></span>
                  </div>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div key={i} className="row">
                      <span className={`tag ${log.ok === undefined ? 'info' : log.ok ? 'ok' : 'err'}`}>
                        {log.tag}
                      </span>
                      <span className="msg">{log.msg}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="note">
        seu progresso (XP, dicas usadas e exercícios concluídos) fica salvo neste navegador
      </footer>
    </div>
  );
}