import type { Dispatch, SetStateAction } from 'react';
import { LEVELS } from '../levels';
import { getActivityStreak } from '../progress';
import type { ConceptSummary, View } from '../types';

interface DashboardProps {
  completedExercises: number;
  totalEarned: number;
  levelsDoneTotal: number;
  lessonsEarnedXp: number;
  activeLevel: (typeof LEVELS)[number];
  activeLevelDone: number;
  activeLevelTotal: number;
  overallProgress: number;
  masteredConcepts: ConceptSummary[];
  reviewConcepts: ConceptSummary[];
  reviewTarget: ConceptSummary | null;
  activityStreak: ReturnType<typeof getActivityStreak>;
  todayKey: string;
  continuePoint: { li: number; ei: number };
  levelUnlocked: (li: number) => boolean;
  levelComplete: (li: number) => boolean;
  levelDoneCount: (li: number) => number;
  openMission: (li: number, ei?: number) => void;
  handleReviewConcept: (concept: ConceptSummary) => void;
  setView: Dispatch<SetStateAction<View>>;
}

export function Dashboard({
  completedExercises,
  totalEarned,
  levelsDoneTotal,
  lessonsEarnedXp,
  activeLevel,
  activeLevelDone,
  activeLevelTotal,
  overallProgress,
  masteredConcepts,
  reviewConcepts,
  reviewTarget,
  activityStreak,
  todayKey,
  continuePoint,
  levelUnlocked,
  levelComplete,
  levelDoneCount,
  openMission,
  handleReviewConcept,
  setView,
}: DashboardProps) {
  return (
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
  );
}
