import type { ConceptSummary, StoreData } from '../types';
import { LearningMemory } from './LearningMemory';

interface LearningMemoryPageProps {
  concepts: ConceptSummary[];
  store: StoreData;
  onReview: (concept: ConceptSummary) => void;
}

export function LearningMemoryPage({ concepts, store, onReview }: LearningMemoryPageProps) {
  const reviewCount = concepts.filter((concept) => concept.state === 'review').length;
  const developingCount = concepts.filter((concept) => concept.state === 'developing').length;

  return (
    <main className="memory-page">
      <section className="memory-page-intro">
        <div className="memory-page-intro-copy">
          <span className="eyebrow">CODEMPI / LEARNING MEMORY</span>
          <h1>Memória de aprendizado.</h1>
          <p>
            Entenda o que já está sólido, o que está em formação e onde sua próxima prática pode
            render mais. Esses sinais servem para orientar o estudo, não para dar uma nota.
          </p>
        </div>

        <aside className="memory-page-context" aria-label="Resumo da memória">
          <span className="memory-page-context-label">VISÃO GERAL</span>
          <strong>{concepts.length} conceitos</strong>
          <small>acompanhados na sua jornada</small>
          <div className="memory-page-context-stats">
            <span><b>{reviewCount}</b> para revisar</span>
            <span><b>{developingCount}</b> em desenvolvimento</span>
          </div>
        </aside>
      </section>

      <LearningMemory concepts={concepts} store={store} onReview={onReview} />
    </main>
  );
}
