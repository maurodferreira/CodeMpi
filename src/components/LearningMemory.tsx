import type { ConceptSummary } from '../types';

interface LearningMemoryProps {
  concepts: ConceptSummary[];
  onReview: (concept: ConceptSummary) => void;
}

const STATE_META = {
  review: {
    label: 'VALE REVISAR',
    description: 'Você encontrou algumas dificuldades aqui. Uma nova tentativa guiada pode consolidar a base.',
  },
  developing: {
    label: 'EM DESENVOLVIMENTO',
    description: 'Você já começou a praticar este conceito e está construindo consistência.',
  },
  solid: {
    label: 'DOMINADO',
    description: 'Você concluiu os desafios ligados a este conceito com poucas dificuldades registradas.',
  },
  new: {
    label: 'AINDA NÃO PRATICADO',
    description: 'Este conceito ainda não entrou de forma prática na sua jornada.',
  },
} as const;

const STATE_ORDER = {
  review: 0,
  developing: 1,
  new: 2,
  solid: 3,
} as const;

export function LearningMemory({ concepts, onReview }: LearningMemoryProps) {
  const orderedConcepts = [...concepts].sort((a, b) => (
    STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
    b.progress - a.progress ||
    a.name.localeCompare(b.name)
  ));

  const counts = {
    review: concepts.filter((concept) => concept.state === 'review').length,
    developing: concepts.filter((concept) => concept.state === 'developing').length,
    solid: concepts.filter((concept) => concept.state === 'solid').length,
    new: concepts.filter((concept) => concept.state === 'new').length,
  };

  return (
    <section className="learning-memory">
      <div className="section-heading learning-memory-heading">
        <div>
          <span className="section-kicker">MEMÓRIA DE APRENDIZADO</span>
          <h2>Como estão suas habilidades</h2>
          <p className="learning-memory-intro">
            O CodeMpi observa o que você pratica, onde encontra dificuldade e quais conceitos já ficaram consistentes.
          </p>
        </div>
        <span className="concept-count">{concepts.length} conceitos acompanhados</span>
      </div>

      <div className="memory-summary" aria-label="Resumo da memória de aprendizado">
        <span className="memory-summary-item review">
          <b>{counts.review}</b> para revisar
        </span>
        <span className="memory-summary-item developing">
          <b>{counts.developing}</b> em desenvolvimento
        </span>
        <span className="memory-summary-item solid">
          <b>{counts.solid}</b> dominados
        </span>
        <span className="memory-summary-item new">
          <b>{counts.new}</b> ainda não praticados
        </span>
      </div>

      <div className="memory-grid">
        {orderedConcepts.map((concept) => {
          const meta = STATE_META[concept.state];

          return (
            <article className={`memory-card state-${concept.state}`} key={concept.id}>
              <div className="memory-card-top">
                <span className="memory-state">{meta.label}</span>
                <span className="memory-percent">{concept.progress}%</span>
              </div>

              <h3>{concept.name}</h3>
              <p>{concept.description || meta.description}</p>

              <div className="memory-progress">
                <span style={{ width: `${concept.progress}%` }} />
              </div>

              <div className="memory-meta">
                <span>{concept.completed}/{concept.total} desafios</span>
                {concept.attempts > 0 && <span>{concept.attempts} tentativas</span>}
                {concept.failures > 0 && <span>{concept.failures} dificuldades</span>}
              </div>

              {concept.state !== 'new' && (
                <button className="memory-action" onClick={() => onReview(concept)}>
                  {concept.state === 'review' ? 'Revisar conceito →' : concept.state === 'solid' ? 'Praticar novamente →' : 'Continuar praticando →'}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
