import { LEVELS } from '../data/levels';
import { LEVEL_LESSONS } from '../data/lessons';

interface CompletionPageProps {
  completionLevel: number;
  getKey: (li: number, ei: number) => string;
  levelDoneCount: (li: number) => number;
  done: Record<string, number>;
  openMission: (li: number) => void;
  setView: (view: 'map' | 'dashboard') => void;
}

const COMPLETION_LEARNED: Record<number, string[]> = {
  0: ['Variáveis', 'Operadores', 'Funções'],
  1: ['if / else', 'Comparações', '&& e ||', 'Múltiplas condições'],
  2: ['for', 'Contadores', 'Acumuladores', 'Percorrer listas'],
  3: ['Strings', 'length e índices', 'Transformação de texto', 'Percorrer strings', 'Comparação', 'Palíndromos'],
  4: ['Arrays', 'Índices e length', 'Percorrer arrays', 'Busca', 'Filtros', 'Construir novas listas', 'Remover duplicados'],
  5: ['Funções reutilizáveis', 'Parâmetros', 'Validação', 'Retorno antecipado', 'Porcentagens', 'Estado em sequência', 'Composição de funções', 'Lógica em etapas'],
};

export function CompletionPage({
  completionLevel,
  getKey,
  levelDoneCount,
  done,
  openMission,
  setView,
}: CompletionPageProps) {
  const learnedItems = COMPLETION_LEARNED[completionLevel] || [];
  const nextLevel = LEVELS[completionLevel + 1];
  const nextLevelBuilt = Boolean(nextLevel?.exercises?.length);

  return (
    <main className="completion-page">
      <section className="completion-card">
        <div className="completion-orbit"><span>✦</span><span>✦</span><span>✦</span></div>
        <span className="eyebrow">NÍVEL CONCLUÍDO · {LEVELS[completionLevel].tag}</span>
        <h1>Você fechou <em>{LEVELS[completionLevel].name}.</em></h1>
        <p className="completion-intro">Você não só passou pelos desafios. Você praticou, encontrou erros, corrigiu sua lógica e construiu uma base nova.</p>

        <div className="completion-stats">
          <div><strong>{levelDoneCount(completionLevel)}</strong><span>desafios concluídos</span></div>
          <div><strong>+{LEVELS[completionLevel].exercises?.reduce((sum, _, ei) => sum + (done[getKey(completionLevel, ei)] || 0), 0) || 0}</strong><span>XP nos desafios</span></div>
          <div><strong>+{LEVEL_LESSONS[completionLevel]?.rewardXp || 0}</strong><span>XP da aula</span></div>
        </div>

        {learnedItems.length > 0 && (
          <div className="completion-learned">
            <span className="section-kicker">VOCÊ PRATICOU</span>
            <div className="completion-tags">
              {learnedItems.map((item) => <span key={item}>✓ {item}</span>)}
            </div>
          </div>
        )}

        {nextLevel && (
          <div className={`completion-next ${nextLevelBuilt ? '' : 'soon'}`.trim()}>
            <div>
              <span className="section-kicker">{nextLevelBuilt ? 'PRÓXIMO PASSO' : 'PRÓXIMA ETAPA'}</span>
              <strong>{nextLevel.tag} · {nextLevel.name}</strong>
              <p>{nextLevelBuilt ? 'Continue praticando e avance para o próximo conjunto de desafios.' : 'O próximo nível ainda está sendo construído. Sua conclusão já fica registrada.'}</p>
            </div>
            <span className="completion-next-status">{nextLevelBuilt ? 'PRONTO' : 'EM BREVE'}</span>
          </div>
        )}

        <div className="completion-actions">
          <button className="btn ghost" onClick={() => setView('map')}>Ver jornada</button>
          {nextLevelBuilt ? (
            <button className="btn primary" onClick={() => openMission(completionLevel + 1)}>
              Continuar para {nextLevel.tag} →
            </button>
          ) : (
            <button className="btn primary" onClick={() => setView('dashboard')}>
              Voltar ao Dashboard
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
