import { useEffect, useRef, useState } from 'react';
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
  const [selectedConcept, setSelectedConcept] = useState<ConceptSummary | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!selectedConcept) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedConcept(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedConcept]);

  const scrollCarousel = (direction: 'prev' | 'next') => {
    const element = carouselRef.current;
    if (!element) return;

    const amount = Math.max(element.clientWidth * 0.82, 320);
    element.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const getRelatedExercises = (concept: ConceptSummary) => LEVELS.flatMap((level, levelIndex) =>
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

  const selectedMeta = selectedConcept ? STATE_META[selectedConcept.state] : null;
  const selectedExercises = selectedConcept ? getRelatedExercises(selectedConcept) : [];
  const recommendedConcept = orderedConcepts.find((concept) => concept.state !== 'new') || null;
  const recommendedReason = recommendedConcept
    ? recommendedConcept.failures >= 2
      ? `${recommendedConcept.failures} erros em ${recommendedConcept.attempts} tentativas — este conceito merece uma nova passada.`
      : recommendedConcept.failures === 1
        ? 'Houve um erro durante a prática. Uma revisão curta pode ajudar a fixar o padrão.'
        : recommendedConcept.completed > 0
          ? 'Você já praticou este conceito. Reforçar enquanto ele ainda está fresco ajuda a consolidar.'
          : 'Você começou a praticar este conceito, mas ainda há espaço para avançar.'
    : null;

  const handleReview = () => {
    if (!selectedConcept) return;
    const concept = selectedConcept;
    setSelectedConcept(null);
    onReview(concept);
  };

  return (
    <>
      <section className="learning-memory">
        <div className="section-heading learning-memory-heading">
          <div>
            <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
            <h2>Como estão suas habilidades</h2>
            <p className="learning-memory-intro">
              O CodeMpi usa seus exercícios concluídos, tentativas e erros para acompanhar cada conceito.
            </p>
          </div>

          <div className="learning-memory-tools">
            <span className="concept-count">{concepts.length} conceitos acompanhados</span>
            <div className="memory-carousel-actions" aria-label="Navegar pelos conceitos">
              <button type="button" onClick={() => scrollCarousel('prev')} aria-label="Conceitos anteriores">←</button>
              <button type="button" onClick={() => scrollCarousel('next')} aria-label="Próximos conceitos">→</button>
            </div>
          </div>
        </div>

        {recommendedConcept ? (
          <div className={`memory-recommendation state-${recommendedConcept.state}`}>
            <div className="memory-recommendation-icon">↻</div>
            <div className="memory-recommendation-copy">
              <span className="section-kicker">REVISÃO INTELIGENTE · PRÓXIMO FOCO</span>
              <strong>{recommendedConcept.name}</strong>
              <p>{recommendedReason}</p>
            </div>
            <button type="button" className="memory-recommendation-action" onClick={() => onReview(recommendedConcept)}>
              Revisar agora →
            </button>
          </div>
        ) : (
          <div className="memory-recommendation memory-recommendation-empty">
            <div className="memory-recommendation-icon">◎</div>
            <div className="memory-recommendation-copy">
              <span className="section-kicker">REVISÃO INTELIGENTE</span>
              <strong>Faça alguns desafios para começar a personalizar suas revisões.</strong>
              <p>O CodeMpi vai usar suas tentativas e erros para identificar o próximo conceito que merece atenção.</p>
            </div>
          </div>
        )}

        <div className="memory-summary" aria-label="Resumo da memória de aprendizado">
          <span className="memory-summary-item review"><b>{counts.review}</b><span>para revisar</span></span>
          <span className="memory-summary-item developing"><b>{counts.developing}</b><span>em desenvolvimento</span></span>
          <span className="memory-summary-item solid"><b>{counts.solid}</b><span>dominados</span></span>
          <span className="memory-summary-item new"><b>{counts.new}</b><span>ainda não praticados</span></span>
        </div>

        <div
          ref={carouselRef}
          className="memory-grid"
          aria-label="Conceitos acompanhados"
        >
          {orderedConcepts.map((concept) => {
            const meta = STATE_META[concept.state];

            return (
              <article className={`memory-card state-${concept.state}`} key={concept.id}>
                <div className="memory-card-top">
                  <span className="memory-state">{meta.label}</span>
                  {orderedConcepts[0]?.id === concept.id && concept.state !== 'new' ? (
                    <span className="memory-recommended">PRÓXIMO FOCO</span>
                  ) : (
                    <span className="memory-percent">{concept.progress}%</span>
                  )}
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

                <button
                  className="memory-details-trigger"
                  type="button"
                  onClick={() => setSelectedConcept(concept)}
                >
                  <span>Ver como foi calculado</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {selectedConcept && selectedMeta && (
        <div
          className="memory-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedConcept(null);
          }}
        >
          <div
            className="memory-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-modal-title"
          >
            <div className="memory-modal-head">
              <div>
                <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
                <h2 id="memory-modal-title">{selectedConcept.name}</h2>
                <p>{selectedConcept.description}</p>
              </div>

              <button
                type="button"
                className="memory-modal-close"
                onClick={() => setSelectedConcept(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="memory-modal-status">
              <div className={`memory-modal-state state-${selectedConcept.state}`}>
                <span>ESTADO ATUAL</span>
                <strong>{selectedMeta.label}</strong>
                <small>{selectedMeta.short}.</small>
              </div>

              <div className="memory-modal-metric">
                <span>PROGRESSO</span>
                <strong>{selectedConcept.progress}%</strong>
                <small>{selectedConcept.completed}/{selectedConcept.total} desafios concluídos</small>
              </div>

              <div className="memory-modal-metric">
                <span>PRÁTICA</span>
                <strong>{selectedConcept.attempts}</strong>
                <small>{selectedConcept.failures} tentativas com erro</small>
              </div>
            </div>

            <div className="memory-modal-section">
              <div className="memory-modal-section-heading">
                <div>
                  <span className="section-kicker">EVIDÊNCIAS</span>
                  <h3>O que entrou no cálculo</h3>
                </div>
                <span>{selectedExercises.length} desafios relacionados</span>
              </div>

              <div className="memory-proof-list">
                {selectedExercises.map((exercise) => (
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
                <div>
                  <span>PROGRESSO</span>
                  <b>{selectedConcept.completed}/{selectedConcept.total} desafios concluídos</b>
                </div>
                <div>
                  <span>REGRA</span>
                  <b>{selectedMeta.short}</b>
                </div>
              </div>
            </div>

            <div className="memory-modal-footer">
              <button
                type="button"
                className="memory-modal-secondary"
                onClick={() => setSelectedConcept(null)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="memory-modal-primary"
                onClick={handleReview}
              >
                {selectedConcept.state === 'review'
                  ? 'Revisar conceito →'
                  : selectedConcept.state === 'solid'
                    ? 'Praticar novamente →'
                    : selectedConcept.state === 'developing'
                      ? 'Continuar praticando →'
                      : 'Praticar conceito →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
