import { useState } from 'react';
import { LEVELS } from '../data/levels';
import { getProgressKey } from '../hooks/useLearningProgress';
import type { ConceptSummary, StoreData } from '../types';

interface LearningMemoryProps {
  concepts: ConceptSummary[];
  store: StoreData;
  onReview: (concept: ConceptSummary) => void;
}

const STATE_META = {
  review: {
    label: 'VALE REVISAR',
    short: '2+ tentativas com erro',
  },
  developing: {
    label: 'EM DESENVOLVIMENTO',
    short: 'prática em andamento',
  },
  solid: {
    label: 'DOMINADO',
    short: 'concluído com consistência',
  },
  new: {
    label: 'AINDA NÃO PRATICADO',
    short: 'nenhum desafio concluído',
  },
} as const;

const STATE_ORDER = {
  review: 0,
  developing: 1,
  new: 2,
  solid: 3,
} as const;

export function LearningMemory({ concepts, store, onReview }: LearningMemoryProps) {
  const [showAll, setShowAll] = useState(false);

  const orderedConcepts = [...concepts].sort((a, b) => (
    STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
    b.progress - a.progress ||
    b.attempts - a.attempts ||
    a.name.localeCompare(b.name)
  ));

  const counts = {
    review: concepts.filter((concept) => concept.state === 'review').length,
    developing: concepts.filter((concept) => concept.state === 'developing').length,
    solid: concepts.filter((concept) => concept.state === 'solid').length,
    new: concepts.filter((concept) => concept.state === 'new').length,
  };

  const visibleConcepts = showAll ? orderedConcepts : orderedConcepts.slice(0, 6);
  const hiddenCount = Math.max(0, orderedConcepts.length - visibleConcepts.length);

  return (
    <section className="learning-memory">
      <div className="section-heading learning-memory-heading">
        <div>
          <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
          <h2>Como estão suas habilidades</h2>
          <p className="learning-memory-intro">
            O CodeMpi usa seus exercícios concluídos, tentativas e erros para acompanhar cada conceito.
          </p>
        </div>
        <span className="concept-count">{concepts.length} conceitos acompanhados</span>
      </div>

      <div className="memory-summary" aria-label="Resumo da memória de aprendizado">
        <span className="memory-summary-item review"><b>{counts.review}</b><span>para revisar</span></span>
        <span className="memory-summary-item developing"><b>{counts.developing}</b><span>em desenvolvimento</span></span>
        <span className="memory-summary-item solid"><b>{counts.solid}</b><span>dominados</span></span>
        <span className="memory-summary-item new"><b>{counts.new}</b><span>ainda não praticados</span></span>
      </div>

      <div className="memory-grid">
        {visibleConcepts.map((concept) => {
          const meta = STATE_META[concept.state];
          const relatedExercises = LEVELS.flatMap((level, levelIndex) =>
            (level.exercises || []).flatMap((exercise, exerciseIndex) => {
              if (!exercise.conceptIds?.includes(concept.id)) return [];

              const key = getProgressKey(levelIndex, exerciseIndex);
              const performance = store.performance[key] || { attempts: 0, failures: 0 };

              return [{
                title: exercise.title,
                done: Boolean(store.done[key]),
                attempts: performance.attempts,
                failures: performance.failures,
              }];
            }),
          );

          return (
            <article className={`memory-card state-${concept.state}`} key={concept.id}>
              <div className="memory-card-top">
                <span className="memory-state">{meta.label}</span>
                <span className="memory-percent">{concept.progress}%</span>
              </div>

              <h3>{concept.name}</h3>
              <p className="memory-description">{concept.description}</p>

              <div className="memory-progress" aria-label={`Progresso: ${concept.progress}%`}>
                <span style={{ width: `${concept.progress}%` }} />
              </div>

              <div className="memory-meta">
                <span>{concept.completed}/{concept.total} desafios</span>
                <span>{concept.attempts} tentativas</span>
                <span>{concept.failures} com erro</span>
              </div>

              {concept.state !== 'new' && (
                <button className="memory-action" onClick={() => onReview(concept)}>
                  {concept.state === 'review' ? 'Revisar conceito →' : concept.state === 'solid' ? 'Praticar novamente →' : 'Continuar praticando →'}
                </button>
              )}

              <details className="memory-details">
                <summary>Ver como foi calculado</summary>
                <div className="memory-proof">
                  <p className="memory-rule">
                    Estado atual: <b>{meta.label.toLowerCase()}</b> · {meta.short}.
                  </p>
                  <div className="memory-proof-list">
                    {relatedExercises.map((exercise) => (
                      <div className="memory-proof-row" key={exercise.title}>
                        <span className={exercise.done ? 'proof-status done' : 'proof-status'}>
                          {exercise.done ? '✓' : '○'}
                        </span>
                        <div>
                          <strong>{exercise.title}</strong>
                          <small>
                            {exercise.done ? 'concluído' : 'não concluído'} · {exercise.attempts} {exercise.attempts === 1 ? 'tentativa' : 'tentativas'}
                            {exercise.failures > 0 ? ` · ${exercise.failures} com erro` : ''}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="memory-proof-formula">
                    <span>PROGRESSO</span>
                    <b>{concept.completed}/{concept.total} desafios concluídos</b>
                  </div>
                </div>
              </details>
            </article>
          );
        })}
      </div>

      {orderedConcepts.length > 6 && (
        <button className="memory-toggle" onClick={() => setShowAll((value) => !value)}>
          {showAll ? 'Mostrar menos ↑' : `Mostrar mais ${hiddenCount} conceitos ↓`}
        </button>
      )}
    </section>
  );
}
