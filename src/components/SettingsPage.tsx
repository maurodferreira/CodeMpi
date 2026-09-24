import { THEMES } from '../data/themes';
import type { Dispatch, SetStateAction } from 'react';
import type { ThemeKey, View } from '../types';

interface SettingsPageProps {
  theme: ThemeKey;
  setTheme: Dispatch<SetStateAction<ThemeKey>>;
  setView: Dispatch<SetStateAction<View>>;
}

export function SettingsPage({ theme, setTheme, setView }: SettingsPageProps) {
  return (
    <main className="settings-page">
      <div className="settings-toolbar">
        <button className="text-action" onClick={() => setView('dashboard')}>← Voltar para o início</button>
        <span>CONFIGURAÇÕES</span>
      </div>

      <section className="settings-shell">
        <div className="settings-intro">
          <span className="eyebrow">CODEMPI / PREFERÊNCIAS</span>
          <h1>Deixe a jornada com a sua cara.</h1>
          <p>Escolha um tema para mudar a atmosfera do CodeMpi. Suas escolhas ficam salvas neste navegador.</p>
        </div>

        <section className="settings-section">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">APARÊNCIA</span>
              <h2>Tema da interface</h2>
            </div>
            <span className="settings-meta">{THEMES.find((item) => item.id === theme)?.name}</span>
          </div>

          <div className="theme-grid">
            {THEMES.map((item) => {
              const selected = theme === item.id;

              return (
                <button
                  key={item.id}
                  className={`theme-card ${selected ? 'selected' : ''} theme-${item.id}`}
                  onClick={() => setTheme(item.id)}
                >
                  <div className="theme-preview">
                    <div className="theme-preview-top">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="theme-preview-body">
                      <div className="theme-preview-main" />
                      <div className="theme-preview-side">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="theme-swatches">
                      {item.colors.map((color) => <span key={color} style={{ background: color }} />)}
                    </div>
                  </div>

                  <div className="theme-copy">
                    <div>
                      <strong>{item.name}</strong>
                      {selected && <span className="theme-selected">✓ ATIVO</span>}
                    </div>
                    <p>{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="settings-section account-preview">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">PRÓXIMA FASE</span>
              <h2>Conta e sincronização</h2>
            </div>
            <span className="coming-badge">EM BREVE</span>
          </div>

          <div className="account-preview-card">
            <div className="account-placeholder">◌</div>
            <div>
              <strong>Leve seu progresso com você.</strong>
              <p>Futuramente, uma conta CodeMpi permitirá sincronizar XP, níveis, histórico e preferências entre dispositivos.</p>
            </div>
            <span className="account-arrow">→</span>
          </div>
        </section>
      </section>
    </main>
  );
}
