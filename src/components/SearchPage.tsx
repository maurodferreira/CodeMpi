import { useEffect, useMemo, useRef, useState } from 'react';
import { LEVELS } from '../data/levels';
import type { ConceptSummary } from '../types';

interface SearchPageProps {
  concepts: ConceptSummary[];
  openMission: (levelIndex: number, exerciseIndex?: number) => void;
  onReview: (concept: ConceptSummary) => void;
  levelUnlocked: (levelIndex: number) => boolean;
  exUnlocked: (levelIndex: number, exerciseIndex: number) => boolean;
}

type SearchFilter = 'all' | 'challenge' | 'concept' | 'level';

interface SearchItem {
  id: string;
  type: Exclude<SearchFilter, 'all'>;
  title: string;
  description: string;
  meta: string;
  levelIndex?: number;
  exerciseIndex?: number;
  concept?: ConceptSummary;
  locked?: boolean;
}

const TYPE_LABELS = {
  challenge: 'DESAFIO',
  concept: 'CONCEITO',
  level: 'NÍVEL',
} as const;

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function SearchPage({
  concepts,
  openMission,
  onReview,
  levelUnlocked,
  exUnlocked,
}: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const items = useMemo<SearchItem[]>(() => {
    const challenges = LEVELS.flatMap((level, levelIndex) =>
      (level.exercises || []).map((exercise, exerciseIndex) => ({
        id: `challenge-${levelIndex}-${exerciseIndex}`,
        type: 'challenge' as const,
        title: exercise.title,
        description: exercise.desc,
        meta: `${level.tag} · ${exercise.difficulty.toUpperCase()} · ${exercise.xp} XP`,
        levelIndex,
        exerciseIndex,
        locked: !exUnlocked(levelIndex, exerciseIndex),
      })),
    );

    const conceptItems = concepts.map((concept) => ({
      id: `concept-${concept.id}`,
      type: 'concept' as const,
      title: concept.name,
      description: concept.description,
      meta: `${concept.progress}% praticado · ${concept.state === 'solid' ? 'dominado' : concept.state === 'review' ? 'vale revisar' : concept.state === 'developing' ? 'em desenvolvimento' : 'novo'}`,
      concept,
      locked: !exUnlocked(concept.levelIndex, concept.exerciseIndex),
    }));

    const levelItems = LEVELS.map((level, levelIndex) => ({
      id: `level-${levelIndex}`,
      type: 'level' as const,
      title: level.name,
      description: level.topics || 'Etapa da jornada de programação.',
      meta: level.tag,
      levelIndex,
      locked: !levelUnlocked(levelIndex),
    }));

    return [...challenges, ...conceptItems, ...levelItems];
  }, [concepts, exUnlocked, levelUnlocked]);

  const normalizedQuery = normalize(query.trim());

  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      if (!matchesFilter) return false;
      if (!normalizedQuery) return true;

      return normalize([item.title, item.description, item.meta].join(' ')).includes(normalizedQuery);
    });

    return filtered.slice(0, normalizedQuery ? 30 : 8);
  }, [filter, items, normalizedQuery]);

  const handleOpen = (item: SearchItem) => {
    if (item.locked) return;

    if (item.type === 'concept' && item.concept) {
      onReview(item.concept);
      return;
    }

    if (item.levelIndex !== undefined) {
      openMission(item.levelIndex, item.exerciseIndex);
    }
  };

  const filterLabel = filter === 'all' ? 'Tudo' : filter === 'challenge' ? 'Desafios' : filter === 'concept' ? 'Conceitos' : 'Níveis';

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-copy">
          <span className="eyebrow">CODEMPI / EXPLORE</span>
          <h1>Encontre o que<br /><em>você quer praticar.</em></h1>
          <p>Busque por conceito, desafio ou nível e vá direto para o ponto da jornada que procura.</p>
        </div>

        <div className="search-input-shell">
          <span className="search-input-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar “for”, “média”, “N2”..."
            aria-label="Buscar no CodeMpi"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Limpar busca">
              ×
            </button>
          )}
          <span className="search-shortcut">CTRL K</span>
        </div>

        <div className="search-filters" aria-label="Filtrar resultados">
          {([
            ['all', 'Tudo'],
            ['challenge', 'Desafios'],
            ['concept', 'Conceitos'],
            ['level', 'Níveis'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'active' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="search-results" aria-live="polite">
        <div className="search-results-head">
          <div>
            <span className="section-kicker">{normalizedQuery ? 'RESULTADOS' : 'EXPLORE'}</span>
            <h2>{normalizedQuery ? `Resultados para “${query}”` : 'Continue explorando'}</h2>
          </div>
          <span className="search-result-count">
            {visibleItems.length}{normalizedQuery ? '+' : ''} em {filterLabel}
          </span>
        </div>

        {!visibleItems.length ? (
          <div className="search-empty">
            <span>⌕</span>
            <strong>Nada encontrado ainda.</strong>
            <p>Tente um termo como “return”, “condição”, “for” ou o nome de um desafio.</p>
          </div>
        ) : (
          <div className="search-result-list">
            {visibleItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`search-result-card ${item.type} ${item.locked ? 'locked' : ''}`}
                onClick={() => handleOpen(item)}
                disabled={item.locked}
              >
                <span className="search-result-type">{TYPE_LABELS[item.type]}</span>
                <span className="search-result-title">{item.title}</span>
                <span className="search-result-description">{item.description}</span>
                <span className="search-result-meta">{item.meta}</span>
                <span className="search-result-action">
                  {item.locked ? 'Bloqueado' : item.type === 'concept' ? 'Revisar conceito →' : 'Abrir →'}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
