import type { Dispatch, SetStateAction } from 'react';
import type { View } from '../types';

interface AppFooterProps {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}

export function AppFooter({ view, setView }: AppFooterProps) {
  const goTo = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="app-footer-main">
        <button className="app-footer-brand" type="button" onClick={() => goTo('dashboard')} aria-label="Voltar ao início">
          <div className="app-footer-logo">
            <img src="/logo.png" alt="CodeMpi" />
          </div>
          <div>
            <strong>CodeMpi</strong>
            <span>TRILHA DE PROGRAMAÇÃO</span>
          </div>
        </button>

        <nav className="app-footer-nav" aria-label="Navegação do rodapé">
          <span className="app-footer-label">ATALHOS</span>
          <div>
            <button type="button" className={view === 'dashboard' ? 'active' : ''} onClick={() => goTo('dashboard')}>Início</button>
            <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => goTo('map')}>Jornada</button>
            <button type="button" className={view === 'memory' ? 'active' : ''} onClick={() => goTo('memory')}>Memória</button>
            <button type="button" className={view === 'mission' ? 'active' : ''} onClick={() => goTo('mission')}>Missão</button>
            <button type="button" className={view === 'settings' ? 'active' : ''} onClick={() => goTo('settings')}>Configurações</button>
          </div>
        </nav>

        <div className="app-footer-status">
          <span className="app-footer-label">SISTEMA</span>
          <strong><i /> ONLINE</strong>
          <p>Seu progresso fica salvo neste navegador.</p>
        </div>
      </div>

      <div className="app-footer-bottom">
        <span>CODEMPI · APRENDER É PRATICAR</span>
        <span>XP pessoal · sem competição</span>
      </div>
    </footer>
  );
}
