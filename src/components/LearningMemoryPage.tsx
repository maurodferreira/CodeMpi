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
      </section>

      <section className="memory-overview-strip" aria-label="Resumo da memória">
        <div className="memory-overview-main">
          <span className="memory-overview-kicker">SUA MEMÓRIA</span>
          <strong>{concepts.length} conceitos</strong>
          <span>acompanhados na sua jornada</span>
        </div>

        <div className="memory-overview-stat review">
          <span className="memory-overview-stat-label">VALE REVISAR</span>
          <strong>{reviewCount}</strong>
          <span>conceitos</span>
        </div>

        <div className="memory-overview-stat developing">
          <span className="memory-overview-stat-label">EM DESENVOLVIMENTO</span>
          <strong>{developingCount}</strong>
          <span>conceitos</span>
        </div>
      </section>

      <LearningMemory concepts={concepts} store={store} onReview={onReview} />
    </main>
  );
}
