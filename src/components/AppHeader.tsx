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
}

export function AppHeader({
  view,
  setView,
  totalEarned,
  totalMax,
  overallProgress,
  levelsDoneTotal,
}: AppHeaderProps) {
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
        <button className={`nav-link ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
          Jornada
        </button>
        <button className={`nav-link ${view === 'memory' ? 'active' : ''}`} onClick={() => setView('memory')}>
          Memória
        </button>
        <button className={`nav-link ${view === 'mission' ? 'active' : ''}`} onClick={() => setView('mission')}>
          Missão
        </button>
        <button className="settings-trigger nav-settings" onClick={() => setView('settings')} aria-label="Abrir configurações" title="Configurações">
          ⚙
        </button>
      </nav>

      <div className="header-actions">
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
            {levelsDoneTotal} / {LEVELS.length} níveis fechados
          </div>
        </div>
      </div>
    </header>
  );
}
