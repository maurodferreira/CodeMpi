import { LEVELS } from '../levels';

interface JourneyMapProps {
  overallProgress: number;
  completedExercises: number;
  levelsDoneTotal: number;
  levelUnlocked: (li: number) => boolean;
  levelComplete: (li: number) => boolean;
  levelDoneCount: (li: number) => number;
  openMission: (li: number) => void;
}

export function JourneyMap({
  overallProgress,
  completedExercises,
  levelsDoneTotal,
  levelUnlocked,
  levelComplete,
  levelDoneCount,
  openMission,
}: JourneyMapProps) {
  return (
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
  );
}
