import { LEVELS } from '../data/levels';

interface JourneyMapProps {
  overallProgress: number;
  completedExercises: number;
  levelsDoneTotal: number;
  continuePoint: { li: number; ei: number };
  levelUnlocked: (li: number) => boolean;
  levelComplete: (li: number) => boolean;
  levelDoneCount: (li: number) => number;
  openMission: (li: number, ei?: number) => void;
}

export function JourneyMap({
  overallProgress,
  completedExercises,
  levelsDoneTotal,
  continuePoint,
  levelUnlocked,
  levelComplete,
  levelDoneCount,
  openMission,
}: JourneyMapProps) {
  const builtLevels = LEVELS.filter((level) => Boolean(level.exercises?.length)).length;
  const continueLevel = LEVELS[continuePoint.li];
  const continueExercise = continueLevel.exercises?.[continuePoint.ei];
  const allBuiltLevelsComplete = levelsDoneTotal >= builtLevels && builtLevels > 0;
  const continueProgress = continueLevel.exercises?.length
    ? Math.round((levelDoneCount(continuePoint.li) / continueLevel.exercises.length) * 100)
    : 0;

  return (
    <main className="map-page">
      <div className="journey-desktop">
        <section className="map-hero">
          <div>
            <span className="eyebrow">CODEMPI / JOURNEY MAP</span>
            <h1>Sua jornada começa no básico.<br /><em>E fica mais interessante a cada nível.</em></h1>
            <p>Complete um nível para liberar o próximo. Cada etapa introduz uma ideia nova e aumenta o desafio gradualmente.</p>
          </div>
          <div className="map-summary">
            <span>PROGRESSO GERAL</span>
            <strong>{Math.round(overallProgress)}%</strong>
            <div className="progress-bar"><span style={{ width: String(Math.min(100, overallProgress)) + '%' }} /></div>
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
            const rowClass = ['map-level-row', complete ? 'complete' : '', inProgress ? 'current' : '', !unlocked ? 'locked' : '', !built ? 'soon' : ''].filter(Boolean).join(' ');
            const statusClass = ['map-status', complete ? 'done' : inProgress ? 'current' : !unlocked ? 'locked' : 'soon'].join(' ');

            return (
              <div className={rowClass} key={level.tag}>
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
                    <span className={statusClass}>
                      {complete ? 'CONCLUÍDO' : inProgress ? 'EM ANDAMENTO' : unlocked ? 'EM BREVE' : 'BLOQUEADO'}
                    </span>
                  </div>
                  <h2>{level.name}</h2>
                  <p>{built ? String(level.exercises!.length) + ' desafios para dominar este tema.' : 'Conteúdo planejado para a próxima etapa do CodeMpi.'}</p>
                  {built ? (
                    <div className="map-progress-row">
                      <div className="progress-bar"><span style={{ width: String(progress * 100) + '%' }} /></div>
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
      </div>

      <div className="journey-mobile">
        <section className="journey-mobile-intro">
          <span className="eyebrow">CODEMPI / JOURNEY</span>
          <h1>Sua próxima missão está aqui.</h1>
          <p>Veja onde você parou, continue um exercício e acompanhe seu caminho sem precisar procurar pelo mapa.</p>
        </section>

        <section className="journey-continue-card" aria-label="Continuar jornada">
          <div className="journey-continue-head">
            <div>
              <span className="section-kicker">{allBuiltLevelsComplete ? 'REVISAR SUA JORNADA' : 'CONTINUE DE ONDE PAROU'}</span>
              <strong>{continueLevel.tag} · {continueLevel.name}</strong>
            </div>
            <span className="journey-continue-progress">{continueProgress}%</span>
          </div>

          <h2>{continueExercise?.title || 'Último exercício concluído'}</h2>
          <div className="journey-progress">
            <div className="progress-bar large">
              <span style={{ width: String(Math.min(100, continueProgress)) + '%' }} />
            </div>
            <span>{levelDoneCount(continuePoint.li)}/{continueLevel.exercises?.length || 0} desafios</span>
          </div>

          <button className="btn primary journey-continue-button" onClick={() => openMission(continuePoint.li, continuePoint.ei)}>
            {allBuiltLevelsComplete ? 'Revisar último desafio →' : completedExercises === 0 ? 'Começar minha jornada →' : 'Continuar →'}
          </button>
        </section>

        <section className="journey-mobile-section">
          <div className="journey-mobile-section-head">
            <div>
              <span className="section-kicker">SEU CAMINHO</span>
              <h2>Níveis</h2>
            </div>
            <span>{levelsDoneTotal}/{builtLevels} concluídos</span>
          </div>

          <div className="journey-level-scroller" aria-label="Níveis da jornada">
            {LEVELS.map((level, li) => {
              const unlocked = levelUnlocked(li);
              const complete = levelComplete(li);
              const current = li === continuePoint.li;
              const built = Boolean(level.exercises?.length);
              const chipClass = ['journey-level-chip', complete ? 'complete' : '', current ? 'current' : '', !unlocked ? 'locked' : '', !built ? 'soon' : ''].filter(Boolean).join(' ');

              return (
                <button
                  key={level.tag}
                  className={chipClass}
                  onClick={() => unlocked && openMission(li)}
                  disabled={!unlocked}
                >
                  <span>{complete ? '✓' : !unlocked ? '×' : level.tag}</span>
                  <strong>{level.name}</strong>
                  <small>{built ? String(levelDoneCount(li)) + '/' + String(level.exercises!.length) : 'em breve'}</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="journey-mobile-section">
          <div className="journey-mobile-section-head">
            <div>
              <span className="section-kicker">EXERCÍCIOS</span>
              <h2>{continueLevel.tag} · {continueLevel.name}</h2>
            </div>
            <span>{continueLevel.exercises?.length || 0} no nível</span>
          </div>

          <div className="journey-exercise-scroller" aria-label="Exercícios do nível atual">
            {(continueLevel.exercises || []).map((exercise, ei) => {
              const done = ei < levelDoneCount(continuePoint.li);
              const current = ei === continuePoint.ei && !done;
              const locked = ei > levelDoneCount(continuePoint.li);
              const exerciseClass = ['journey-exercise-chip', done ? 'done' : '', current ? 'current' : '', locked ? 'locked' : ''].filter(Boolean).join(' ');

              return (
                <button
                  key={continueLevel.tag + '-' + ei}
                  className={exerciseClass}
                  onClick={() => !locked && openMission(continuePoint.li, ei)}
                  disabled={locked}
                >
                  <span>{done ? '✓' : locked ? '×' : ei + 1}</span>
                  <strong>{exercise.title}</strong>
                  <small>{done ? 'concluído' : current ? 'próximo' : 'disponível'}</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="journey-mobile-footer-card">
          <div>
            <span className="section-kicker">PROGRESSO GERAL</span>
            <strong>{Math.round(overallProgress)}%</strong>
            <p>{completedExercises} desafios concluídos na sua jornada.</p>
          </div>
          <span className="journey-mobile-footer-mark">CODEMPI</span>
        </section>
      </div>
    </main>
  );
}