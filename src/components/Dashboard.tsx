import type { Dispatch, SetStateAction } from 'react';
import { LEVELS } from '../data/levels';
import { getActivityStreak } from '../utils/progress';
import type { ConceptSummary, View } from '../types';

interface DashboardProps {
  completedExercises: number;
  totalEarned: number;
  levelsDoneTotal: number;
  lessonsEarnedXp: number;
  activeLevel: (typeof LEVELS)[number];
  activeLevelDone: number;
  activeLevelTotal: number;
  reviewConcepts: ConceptSummary[];
  concepts: ConceptSummary[];
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
  reviewConcepts,
  concepts,
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
  const continueExercise = activeLevel.exercises?.[continuePoint.ei];
  const builtLevels = LEVELS.filter((level) => Boolean(level.exercises?.length)).length;
  const reviewCount = concepts.filter((concept) => concept.state === 'review').length;
  const developingCount = concepts.filter((concept) => concept.state === 'developing').length;
  const solidCount = concepts.filter((concept) => concept.state === 'solid').length;

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
            <button
              className="btn primary hero-button"
              onClick={() => openMission(continuePoint.li, continuePoint.ei)}
            >
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

        <aside className="hero-status-card" aria-label="Seu ponto atual na jornada">
          <div className="hero-status-head">
            <span className="section-kicker">SEU PONTO ATUAL</span>
            <span className="hero-status-online"><i /> ATIVO</span>
          </div>

          <span className="hero-status-level">{activeLevel.tag}</span>
          <h2>{activeLevel.name}</h2>
          <p>{continueExercise?.title || 'Nível concluído'}</p>

          <div className="hero-status-progress">
            <div>
              <span>{activeLevelDone}/{activeLevelTotal} desafios</span>
              <strong>{activeLevelTotal ? Math.round((activeLevelDone / activeLevelTotal) * 100) : 0}%</strong>
            </div>
            <div className="progress-bar">
              <span
                style={{
                  width: `${activeLevelTotal ? Math.round((activeLevelDone / activeLevelTotal) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="hero-status-xp">
            <div>
              <span>XP TOTAL</span>
              <strong>{totalEarned}</strong>
            </div>
            <div>
              <span>DE AULAS</span>
              <strong>{lessonsEarnedXp}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="stats-grid dashboard-stats" aria-label="Resumo da jornada">
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
            <small>{builtLevels} níveis já disponíveis</small>
          </div>
        </article>
      </section>

      <section className="daily-grid dashboard-daily">
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
                  ? 'Um exercício direcionado ajuda a consolidar esse conceito com base no seu histórico.'
                  : 'Um exercício curto ajuda a manter esse conceito ativo.'}
              </p>
              <button className="btn ghost" onClick={() => handleReviewConcept(reviewTarget)}>
                Praticar agora →
              </button>
            </>
          ) : (
            <>
              <h2>Seu primeiro foco está esperando.</h2>
              <p>Complete uma missão para o CodeMpi começar a identificar quais conceitos merecem atenção.</p>
              <button className="btn ghost" onClick={() => openMission(continuePoint.li, continuePoint.ei)}>
                Começar uma missão →
              </button>
            </>
          )}
        </article>
      </section>

      <section className="memory-preview">
        <div className="memory-preview-copy">
          <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
          <h2>Seu progresso também aprende com você.</h2>
          <p>
            Veja quais conceitos estão em desenvolvimento, quais merecem revisão e quais já estão sólidos.
          </p>
        </div>

        <div className="memory-preview-stats" aria-label="Resumo dos conceitos">
          <span className="memory-preview-stat state-review">
            <b>{reviewCount}</b>
            <small>para revisar</small>
          </span>
          <span className="memory-preview-stat state-developing">
            <b>{developingCount}</b>
            <small>em desenvolvimento</small>
          </span>
          <span className="memory-preview-stat state-solid">
            <b>{solidCount}</b>
            <small>dominados</small>
          </span>
        </div>

        <button className="text-action memory-preview-action" onClick={() => setView('memory')}>
          Abrir memória completa →
        </button>
      </section>

      <section className="dashboard-section dashboard-journey">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SUA JORNADA</span>
            <h2>Próximas etapas</h2>
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
