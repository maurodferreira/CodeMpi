import type { Dispatch, SetStateAction } from 'react';
import { LEVELS } from '../data/levels';
import type { View } from '../types';

interface AppHeaderProps {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  totalEarned: number;
  totalMax: number;
  overallProgress: number;
  levelsDoneTotal: number;
  onOpenMission: () => void;
}

export function AppHeader({
  view,
  setView,
  totalEarned,
  totalMax,
  overallProgress,
  levelsDoneTotal,
  onOpenMission,
}: AppHeaderProps) {
  const builtLevels = LEVELS.filter((level) => Boolean(level.exercises?.length)).length;

  return (
    <header className="top app-header">
      <button className="header-brand-button" onClick={() => setView('dashboard')} aria-label="Ir para o início">
        <div className="top-brand">
          <div className="logo-shell">
            <div className="logo">
              <img src="/logo.png" alt="CodeMpi" />
            </div>
          </div>
          <div className="brand-copy">
            <div className="brand-status">
              <span className="dot" /> SISTEMA ONLINE
            </div>
            <div className="brand-context">TRILHA DE PROGRAMAÇÃO</div>
          </div>
        </div>
      </button>

      <nav className="main-nav" aria-label="Navegação principal">
        <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          Início
        </button>
        <button className={`nav-link ${view === 'search' ? 'active' : ''}`} onClick={() => setView('search')}>
          Buscar
        </button>
        <button className={`nav-link ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
          Jornada
        </button>
        <button className={`nav-link ${view === 'memory' ? 'active' : ''}`} onClick={() => setView('memory')}>
          Memória
        </button>
        <button className={`nav-link ${view === 'mission' ? 'active' : ''}`} onClick={onOpenMission}>
          Missão
        </button>
        <button className="settings-trigger nav-settings" onClick={() => setView('settings')} aria-label="Abrir configurações" title="Configurações">
          ⚙
        </button>
      </nav>

      <div className="header-actions">
        <button
          className="mobile-settings"
          type="button"
          onClick={() => setView('settings')}
          aria-label="Abrir configurações"
          title="Configurações"
        >
          ⚙
        </button>
        <div className="score-box">
          <div className="score-meta">
            <span className="score-label">XP TOTAL</span>
            <span className="score-max">
              META <span id="maxscore">{totalMax}</span>
            </span>
          </div>
          <div className="score-value" id="score">{totalEarned}</div>
          <div className="score-track" aria-hidden={true}>
            <span style={{ width: `${Math.min(100, overallProgress)}%` }} />
          </div>
          <div className="sub" id="lvlprog">
            {levelsDoneTotal} / {builtLevels} níveis disponíveis
          </div>
        </div>
      </div>

      <nav className="mobile-tabbar" aria-label="Navegação mobile">
        <button className={view === 'dashboard' ? 'active' : ''} type="button" onClick={() => setView('dashboard')}>
          <span>⌂</span>
          Início
        </button>
        <button className={view === 'search' ? 'active' : ''} type="button" onClick={() => setView('search')}>
          <span>⌕</span>
          Buscar
        </button>
        <button className={view === 'map' ? 'active' : ''} type="button" onClick={() => setView('map')}>
          <span>◌</span>
          Jornada
        </button>
        <button className={view === 'memory' ? 'active' : ''} type="button" onClick={() => setView('memory')}>
          <span>✦</span>
          Memória
        </button>
        <button className={view === 'mission' ? 'active' : ''} type="button" onClick={onOpenMission}>
          <span>›_</span>
          Missão
        </button>
      </nav>
    </header>
  );
}
