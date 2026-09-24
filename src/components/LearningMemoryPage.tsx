import type { ConceptSummary, StoreData } from '../types';
import { LearningMemory } from './LearningMemory';

interface LearningMemoryPageProps {
  concepts: ConceptSummary[];
  store: StoreData;
  onReview: (concept: ConceptSummary) => void;
}

export function LearningMemoryPage({ concepts, store, onReview }: LearningMemoryPageProps) {
  return (
    <main className="memory-page">
      <section className="memory-page-intro">
        <div>
          <span className="eyebrow">CODEMPI / LEARNING MEMORY</span>
          <h1>Entenda como você está aprendendo.</h1>
          <p>
            Aqui ficam os sinais de sua prática: conceitos novos, em desenvolvimento, para revisar
            e já consolidados. A memória serve para orientar sua próxima tentativa, não para dar uma nota.
          </p>
        </div>
      </section>

      <LearningMemory concepts={concepts} store={store} onReview={onReview} />
    </main>
  );
}
