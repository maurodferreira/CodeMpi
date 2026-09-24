import type { Dispatch, SetStateAction } from 'react';
import { CodeEditor } from './CodeEditor';
import { LEVELS } from '../data/levels';
import type { ConsoleLog, LastTest, LearningFeedback, StoreData, View } from '../types';

const DIFF_LABEL: Record<string, string> = {
  facil: 'FÁCIL',
  medio: 'MÉDIO',
  dificil: 'DIFÍCIL',
  boss: 'BOSS',
};

interface MissionPageProps {
  currentLevel: (typeof LEVELS)[number];
  currentExercise: NonNullable<(typeof LEVELS)[number]['exercises']>[number] | null;
  levelIndex: number;
  exerciseIndex: number;
  store: StoreData;
  code: string;
  hintsShown: number;
  alreadyDoneXP: number | undefined;
  isPassed: boolean;
  consoleLogs: ConsoleLog[];
  lastTest: LastTest | null;
  learningFeedback: LearningFeedback | null;
  freeInputs: string[];
  freeResult: { ok: boolean; value?: string; error?: string } | null;
  showFreeTest: boolean;
  hMult: readonly number[];
  getKey: (li: number, ei: number) => string;
  getMult: (li: number, ei: number) => number;
  levelUnlocked: (li: number) => boolean;
  levelComplete: (li: number) => boolean;
  levelDoneCount: (li: number) => number;
  exUnlocked: (li: number, ei: number) => boolean;
  selectExercise: (exerciseIndex: number) => void;
  setView: Dispatch<SetStateAction<View>>;
  setCode: Dispatch<SetStateAction<string>>;
  setFreeInputs: Dispatch<SetStateAction<string[]>>;
  setFreeResult: Dispatch<SetStateAction<{ ok: boolean; value?: string; error?: string } | null>>;
  setShowFreeTest: Dispatch<SetStateAction<boolean>>;
  openMission: (li: number) => void;
  handleEvaluate: () => void;
  handleResetCode: () => void;
  handleFreeTest: () => void;
  handleShowHint: () => void;
  handleNext: () => void;
}

export function MissionPage({
  currentLevel,
  currentExercise,
  levelIndex,
  exerciseIndex,
  store,
  code,
  hintsShown,
  alreadyDoneXP,
  isPassed,
  consoleLogs,
  lastTest,
  learningFeedback,
  freeInputs,
  freeResult,
  showFreeTest,
  hMult,
  getKey,
  getMult,
  levelUnlocked,
  levelComplete,
  levelDoneCount,
  exUnlocked,
  selectExercise,
  setView,
  setCode,
  setFreeInputs,
  setFreeResult,
  setShowFreeTest,
  openMission,
  handleEvaluate,
  handleResetCode,
  handleFreeTest,
  handleShowHint,
  handleNext,
}: MissionPageProps) {
  const hasExercises = Boolean(currentLevel.exercises?.length);

  return (
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
              <div className="panel-head mission-level-head">
                <div className="kicker">
                  {currentLevel.tag}
                  {currentExercise ? ` · EXERCÍCIO ${exerciseIndex + 1}/${currentLevel.exercises!.length}` : ''}
                </div>
                <h2>{currentLevel.name}</h2>
                <p>{currentExercise ? 'Escolha um desafio, entenda o objetivo e escreva a solução no editor.' : 'Este nível ainda está sendo construído — chegando em breve.'}</p>
              </div>

              {!hasExercises || !currentExercise ? (
                <div className="soon-panel">
                  <div className="big">🔧 {currentLevel.count} exercícios em construção</div>
                  Temas planejados:
                  <div className="topics">{currentLevel.topics}</div>
                  <button className="btn ghost soon-back" onClick={() => setView('map')}>Voltar para a jornada</button>
                </div>
              ) : (
                <div id="exBody">
                  <section className={`challenge-card challenge-${currentExercise.difficulty}`} aria-labelledby="challenge-title">
                    <div className="challenge-card-top">
                      <div className="challenge-title-wrap">
                        <span className="challenge-eyebrow">DESAFIO {String(exerciseIndex + 1).padStart(2, '0')}</span>
                        <h3 id="challenge-title">{currentExercise.title}</h3>
                      </div>

                      <div className="challenge-badges">
                        <span className={`badge diff-${currentExercise.difficulty}`}>{DIFF_LABEL[currentExercise.difficulty]}</span>
                        <span className="badge xp">XP {Math.round(currentExercise.xp * getMult(levelIndex, exerciseIndex))} / {currentExercise.xp}</span>
                      </div>
                    </div>

                    <div className="challenge-prompt">
                      <span className="challenge-label">O QUE FAZER</span>
                      <p>{currentExercise.desc}</p>
                    </div>

                    <div className="challenge-specs">
                      <div className="challenge-spec">
                        <span>ASSINATURA</span>
                        <code>{currentExercise.sig}</code>
                      </div>
                      <div className="challenge-spec">
                        <span>HABILIDADE</span>
                        <strong>{currentExercise.skill}</strong>
                      </div>
                      <div className="challenge-spec">
                        <span>VALIDAÇÃO</span>
                        <strong>{currentExercise.tests.length} casos de teste</strong>
                      </div>
                    </div>
                  </section>

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
                          onClick={() => isUnlocked && selectExercise(ei)}
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
                          ? '3 dicas + solução exibidas'
                          : hintsShown === 3
                            ? `Mostrar solução completa — XP cai p/ ${Math.round(hMult[hintsShown + 1] * 100)}%`
                            : `Mostrar dica (${hintsShown + 1}/3) — XP cai p/ ${Math.round(hMult[hintsShown + 1] * 100)}%`}
                      </button>
                      <span className="xp-live">
                        {!alreadyDoneXP && hintsShown > 0
                          ? hintsShown >= 4
                            ? `Solução completa usada — XP reduzido para ${Math.round(getMult(levelIndex, exerciseIndex) * 100)}%`
                            : `${hintsShown} dica(s) usada(s) — XP reduzido para ${Math.round(getMult(levelIndex, exerciseIndex) * 100)}%`
                          : ''}
                      </span>
                    </div>

                    <div className="hints-box">
                      {currentExercise.hints.slice(0, hintsShown).map((hintText, index) => (
                        <div key={index} className={`hint-line ${index === 3 ? 'solution' : ''}`}>
                          <b>{index === 3 ? 'Solução completa' : `Dica ${index + 1}`}</b>
                          {index === 3 ? <code>{hintText}</code> : <span>{hintText}</span>}
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

                  {learningFeedback && (
                    <div className={`learning-feedback ${learningFeedback.tone}`}>
                      <span className="learning-feedback-icon">
                        {learningFeedback.tone === 'success' ? '✓' : learningFeedback.tone === 'error' ? '!' : '↻'}
                      </span>

                      <div className="learning-feedback-content">
                        <strong>{learningFeedback.title}</strong>
                        <p>{learningFeedback.body}</p>

                        {lastTest && lastTest.firstFailure && lastTest.passed < lastTest.total && (
                          lastTest.firstFailure.error ? (
                            <div className="diagnostic-error">
                              <span>ERRO DURANTE A EXECUÇÃO</span>
                              <code>{lastTest.firstFailure.error}</code>
                            </div>
                          ) : (
                            <div className="diagnostic-grid">
                              <div className="diagnostic-item">
                                <span>ENTRADA</span>
                                <code>{lastTest.firstFailure.args || '—'}</code>
                              </div>
                              <div className="diagnostic-item">
                                <span>SEU RESULTADO</span>
                                <code>{lastTest.firstFailure.got}</code>
                              </div>
                              <div className="diagnostic-item expected">
                                <span>ESPERADO</span>
                                <code>{lastTest.firstFailure.expected}</code>
                              </div>
                            </div>
                          )
                        )}

                        {learningFeedback.tone !== 'success' && (
                          <div className="diagnostic-tip">
                            <span>O QUE OBSERVAR</span>
                            <strong>{learningFeedback.tone === 'error'
                              ? 'O código precisa conseguir executar antes de os testes avaliarem a lógica.'
                              : 'Compare a entrada com o resultado produzido e procure a operação ou condição que transforma um no outro.'}
                            </strong>
                          </div>
                        )}
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
  );
}
