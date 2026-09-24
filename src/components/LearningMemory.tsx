import { useEffect, useState } from 'react';
import { LEVELS } from '../data/levels';
import { getProgressKey } from '../utils/progress';
import { getConceptReview } from '../data/conceptReviews';
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
    short: 'todos os desafios concluídos',
  },
  new: {
    label: 'AINDA NÃO PRATICADO',
    short: 'nenhum desafio concluído',
  },
} as const;

type MemoryFilter = 'all' | 'review' | 'developing' | 'solid' | 'new';

const STATE_ORDER = {
  review: 0,
  developing: 1,
  new: 2,
  solid: 3,
} as const;

export function LearningMemory({ concepts, store, onReview }: LearningMemoryProps) {
  const [selectedConcept, setSelectedConcept] = useState<ConceptSummary | null>(null);
  const [reviewingConcept, setReviewingConcept] = useState<ConceptSummary | null>(null);
  const [reviewAnswer, setReviewAnswer] = useState<number | null>(null);
  const [filter, setFilter] = useState<MemoryFilter>('all');

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
    if (!selectedConcept && !reviewingConcept) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (reviewingConcept) {
          setReviewingConcept(null);
          setReviewAnswer(null);
        } else {
          setSelectedConcept(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedConcept, reviewingConcept]);

  const visibleConcepts = filter === 'all'
    ? orderedConcepts
    : orderedConcepts.filter((concept) => concept.state === filter);

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
  const reviewData = reviewingConcept ? getConceptReview(reviewingConcept.id) : null;
  const recommendedConcept = [...concepts]
    .filter((concept) => concept.state === 'review' || concept.state === 'developing')
    .sort((a, b) => (
      (a.state === 'review' ? 0 : 1) -
      (b.state === 'review' ? 0 : 1) ||
      b.failures - a.failures ||
      b.attempts - a.attempts ||
      a.progress - b.progress ||
      a.name.localeCompare(b.name)
    ))[0] || null;
  const hasPracticedConcepts = concepts.some((concept) => concept.attempts > 0);
  const recommendedReason = recommendedConcept
    ? recommendedConcept.failures >= 2
      ? `${recommendedConcept.failures} erros em ${recommendedConcept.attempts} tentativas — este conceito merece uma nova passada.`
      : recommendedConcept.failures === 1
        ? 'Houve um erro durante a prática. Uma revisão curta pode ajudar a fixar o padrão.'
        : 'Você já praticou este conceito, mas ainda pode consolidá-lo com uma revisão curta.'
    : null;

  const handleQuickReview = (concept: ConceptSummary) => {
    setSelectedConcept(null);
    setReviewingConcept(concept);
    setReviewAnswer(null);
  };

  const handleReviewFromModal = () => {
    if (!selectedConcept) return;
    handleQuickReview(selectedConcept);
  };

  const handleFinishReview = () => {
    if (!reviewingConcept) return;
    const concept = reviewingConcept;
    setReviewingConcept(null);
    setReviewAnswer(null);
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
            <button type="button" className="memory-recommendation-action" onClick={() => handleQuickReview(recommendedConcept)}>
              Revisar agora →
            </button>
          </div>
        ) : (
          <div className="memory-recommendation memory-recommendation-empty">
            <div className="memory-recommendation-icon">◎</div>
            <div className="memory-recommendation-copy">
              <span className="section-kicker">REVISÃO INTELIGENTE</span>
              <strong>{hasPracticedConcepts ? 'Nenhum conceito precisa de revisão agora.' : 'Faça alguns desafios para começar a personalizar suas revisões.'}</strong>
              <p>{hasPracticedConcepts
                ? 'Sua memória está em dia. Continue a jornada e novas dificuldades serão identificadas automaticamente.'
                : 'O CodeMpi vai usar suas tentativas e erros para identificar o próximo conceito que merece atenção.'}</p>
            </div>
          </div>
        )}

        <div className="memory-summary" aria-label="Resumo da memória de aprendizado">
          <button type="button" className={`memory-summary-item review ${filter === 'review' ? 'selected' : ''}`} onClick={() => setFilter('review')} aria-pressed={filter === 'review'}>
            <b>{counts.review}</b><span>para revisar</span>
          </button>
          <button type="button" className={`memory-summary-item developing ${filter === 'developing' ? 'selected' : ''}`} onClick={() => setFilter('developing')} aria-pressed={filter === 'developing'}>
            <b>{counts.developing}</b><span>em desenvolvimento</span>
          </button>
          <button type="button" className={`memory-summary-item solid ${filter === 'solid' ? 'selected' : ''}`} onClick={() => setFilter('solid')} aria-pressed={filter === 'solid'}>
            <b>{counts.solid}</b><span>dominados</span>
          </button>
          <button type="button" className={`memory-summary-item new ${filter === 'new' ? 'selected' : ''}`} onClick={() => setFilter('new')} aria-pressed={filter === 'new'}>
            <b>{counts.new}</b><span>ainda não praticados</span>
          </button>
        </div>

        <div className="memory-concepts-toolbar">
          <div>
            <span className="section-kicker">CONCEITOS</span>
            <strong>{filter === 'all' ? 'Todos os conceitos' : STATE_META[filter].label}</strong>
          </div>
          <button
            type="button"
            className={`memory-filter-clear ${filter === 'all' ? 'hidden' : ''}`}
            onClick={() => setFilter('all')}
            disabled={filter === 'all'}
          >
            Ver todos →
          </button>
        </div>

        <div className="memory-grid" aria-label="Conceitos acompanhados">
          {visibleConcepts.map((concept) => {
            const meta = STATE_META[concept.state];

            return (
              <article className={`memory-card state-${concept.state}`} key={concept.id}>
                <div className="memory-card-top">
                  <span className="memory-state">{meta.label}</span>
                  {recommendedConcept?.id === concept.id ? (
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

        {visibleConcepts.length === 0 && (
          <div className="memory-empty-filter">
            <span>◎</span>
            <div>
              <strong>Nenhum conceito nesta categoria ainda.</strong>
              <p>Continue praticando para preencher esta parte da sua memória de aprendizado.</p>
            </div>
          </div>
        )}
      </section>

      {reviewingConcept && reviewData && (
        <div
          className="memory-review-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setReviewingConcept(null);
              setReviewAnswer(null);
            }
          }}
        >
          <div
            className="memory-review"
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-review-title"
          >
            <div className="memory-review-head">
              <div>
                <span className="section-kicker">REVISÃO RÁPIDA · SEM XP</span>
                <h2 id="memory-review-title">{reviewingConcept.name}</h2>
                <p>Uma pergunta curta para ativar o conceito antes de você voltar à prática.</p>
              </div>

              <button
                type="button"
                className="memory-modal-close"
                onClick={() => {
                  setReviewingConcept(null);
                  setReviewAnswer(null);
                }}
                aria-label="Fechar revisão"
              >
                ×
              </button>
            </div>

            <div className="memory-review-body">
              <span className="memory-review-label">CHECKPOINT</span>
              <h3>{reviewData.question}</h3>

              {reviewData.code && (
                <pre className="memory-review-code"><code>{reviewData.code}</code></pre>
              )}

              <div className="memory-review-options">
                {reviewData.options.map((option, index) => {
                  const answered = reviewAnswer !== null;
                  const isCorrect = index === reviewData.answer;
                  const isWrongSelection = index === reviewAnswer && !isCorrect;

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`memory-review-option ${answered && isCorrect ? 'correct' : ''} ${answered && isWrongSelection ? 'wrong' : ''}`}
                      onClick={() => setReviewAnswer(index)}
                      disabled={answered}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      <strong>{option}</strong>
                    </button>
                  );
                })}
              </div>

              {reviewAnswer !== null && (
                <div className={`memory-review-feedback ${reviewAnswer === reviewData.answer ? 'correct' : 'wrong'}`}>
                  <strong>
                    {reviewAnswer === reviewData.answer ? '✓ Conceito recuperado.' : '↻ Quase. Vamos rever.'}
                  </strong>
                  <p>{reviewData.explanation}</p>
                </div>
              )}
            </div>

            <div className="memory-review-footer">
              <span>1 pergunta · sem alterar XP ou progresso</span>
              <div>
                <button
                  type="button"
                  className="memory-modal-secondary"
                  onClick={() => {
                    setReviewingConcept(null);
                    setReviewAnswer(null);
                  }}
                >
                  Fechar
                </button>

                {reviewAnswer === reviewData.answer ? (
                  <button
                    type="button"
                    className="memory-modal-primary"
                    onClick={handleFinishReview}
                  >
                    Ir para o exercício →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="memory-modal-primary"
                    disabled={reviewAnswer === null}
                    onClick={() => setReviewAnswer(null)}
                  >
                    Tentar novamente →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                onClick={handleReviewFromModal}
              >
                Revisão rápida →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
