import { THEMES } from '../data/themes';
import type { Dispatch, SetStateAction } from 'react';
import type { AppPreferences, EditorFontSize, InterfaceScale, IndentSize } from '../hooks/useAppPreferences';
import type { LocalUserProfile, UserSession } from '../domain/user';
import type { ThemeKey, View } from '../types';

interface SettingsPageProps {
  theme: ThemeKey;
  setTheme: Dispatch<SetStateAction<ThemeKey>>;
  preferences: AppPreferences;
  setPreferences: Dispatch<SetStateAction<AppPreferences>>;
  setView: Dispatch<SetStateAction<View>>;
  canInstall: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
  user: LocalUserProfile;
  session: UserSession;
}

const interfaceOptions: Array<{ value: InterfaceScale; label: string; description: string }> = [
  { value: 'compact', label: 'Compacta', description: 'Mais conteúdo na tela.' },
  { value: 'comfortable', label: 'Confortável', description: 'Equilíbrio entre espaço e leitura.' },
  { value: 'large', label: 'Grande', description: 'Mais espaço para tocar e ler.' },
];

const editorFontOptions: Array<{ value: EditorFontSize; label: string }> = [
  { value: 'small', label: 'Pequena' },
  { value: 'medium', label: 'Média' },
  { value: 'large', label: 'Grande' },
];

const indentOptions: Array<{ value: IndentSize; label: string }> = [
  { value: 2, label: '2 espaços' },
  { value: 4, label: '4 espaços' },
];

export function SettingsPage({
  theme,
  setTheme,
  preferences,
  setPreferences,
  setView,
  canInstall,
  isInstalled,
  onInstall,
  user,
  session,
}: SettingsPageProps) {
  const updatePreference = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

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
          <p>Personalize a interface, o editor e a experiência de prática. Suas escolhas ficam salvas neste dispositivo.</p>
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

          <div className="settings-option-grid">
            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">INTERFACE</span>
                <strong>Tamanho da interface</strong>
                <small>Defina o nível de espaço visual.</small>
              </div>
              <div className="settings-segmented">
                {interfaceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={preferences.interfaceScale === option.value ? 'active' : ''}
                    onClick={() => updatePreference('interfaceScale', option.value)}
                    title={option.description}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">ACESSIBILIDADE</span>
                <strong>Reduzir animações</strong>
                <small>Evite transições quando prefere uma interface mais estável.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.reduceMotion}
                className={`settings-toggle ${preferences.reduceMotion ? 'active' : ''}`}
                onClick={() => updatePreference('reduceMotion', !preferences.reduceMotion)}
              >
                <span />
                {preferences.reduceMotion ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">ACESSIBILIDADE</span>
                <strong>Alto contraste</strong>
                <small>Reforce bordas e separações para facilitar a leitura.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.highContrast}
                className={`settings-toggle ${preferences.highContrast ? 'active' : ''}`}
                onClick={() => updatePreference('highContrast', !preferences.highContrast)}
              >
                <span />
                {preferences.highContrast ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">EDITOR</span>
              <h2>Como você prefere programar?</h2>
            </div>
            <span className="settings-meta">SALVO NESTE DISPOSITIVO</span>
          </div>

          <div className="settings-option-grid">
            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">LEITURA</span>
                <strong>Tamanho da fonte</strong>
                <small>Escolha o tamanho do código no editor.</small>
              </div>
              <div className="settings-segmented">
                {editorFontOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={preferences.editorFontSize === option.value ? 'active' : ''}
                    onClick={() => updatePreference('editorFontSize', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">LAYOUT</span>
                <strong>Quebra de linha</strong>
                <small>Permite visualizar linhas longas sem rolagem lateral.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.editorLineWrapping}
                className={`settings-toggle ${preferences.editorLineWrapping ? 'active' : ''}`}
                onClick={() => updatePreference('editorLineWrapping', !preferences.editorLineWrapping)}
              >
                <span />
                {preferences.editorLineWrapping ? 'Ativada' : 'Desativada'}
              </button>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">NAVEGAÇÃO</span>
                <strong>Números das linhas</strong>
                <small>Mostra a coluna de linhas no código.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.editorLineNumbers}
                className={`settings-toggle ${preferences.editorLineNumbers ? 'active' : ''}`}
                onClick={() => updatePreference('editorLineNumbers', !preferences.editorLineNumbers)}
              >
                <span />
                {preferences.editorLineNumbers ? 'Ativados' : 'Desativados'}
              </button>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">INDENTAÇÃO</span>
                <strong>Espaçamento</strong>
                <small>Define a largura visual da indentação.</small>
              </div>
              <div className="settings-segmented">
                {indentOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={preferences.editorIndentSize === option.value ? 'active' : ''}
                    onClick={() => updatePreference('editorIndentSize', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">APRENDIZADO</span>
              <h2>Como o CodeMpi te acompanha</h2>
            </div>
          </div>

          <div className="settings-option-grid">
            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">FEEDBACK</span>
                <strong>Mostrar XP nos desafios</strong>
                <small>Exibe o valor do XP enquanto você pratica.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.showXp}
                className={`settings-toggle ${preferences.showXp ? 'active' : ''}`}
                onClick={() => updatePreference('showXp', !preferences.showXp)}
              >
                <span />
                {preferences.showXp ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            <div className="settings-control-card">
              <div>
                <span className="settings-control-kicker">EDITOR</span>
                <strong>Confirmar antes de reiniciar</strong>
                <small>Evita apagar o código atual por toque acidental.</small>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.confirmReset}
                className={`settings-toggle ${preferences.confirmReset ? 'active' : ''}`}
                onClick={() => updatePreference('confirmReset', !preferences.confirmReset)}
              >
                <span />
                {preferences.confirmReset ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section app-install-section">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">APLICATIVO</span>
              <h2>Instale o CodeMpi</h2>
            </div>
            <span className={`install-status-badge ${isInstalled ? 'installed' : canInstall ? 'available' : ''}`}>
              {isInstalled ? 'INSTALADO' : canInstall ? 'DISPONÍVEL' : 'PELO NAVEGADOR'}
            </span>
          </div>

          <div className="app-install-card">
            <div className="app-install-mark" aria-hidden="true">⌁</div>
            <div className="app-install-copy">
              <strong>
                {isInstalled
                  ? 'CodeMpi instalado neste dispositivo.'
                  : canInstall
                    ? 'Use o CodeMpi como um aplicativo.'
                    : 'A instalação é gerenciada pelo navegador.'}
              </strong>
              <p>
                {isInstalled
                  ? 'Abra pelo atalho do sistema para usar a experiência standalone e continuar com seu progresso local.'
                  : canInstall
                    ? 'Instale para abrir em uma janela própria e manter acesso ao conteúdo que já foi carregado mesmo sem conexão.'
                    : 'Se o Chrome mostrar “Abrir no app” na barra, o CodeMpi já está instalado. Use esse atalho para abrir a versão standalone. Caso contrário, a opção de instalação pode aparecer pelo menu do navegador quando estiver disponível.'}
              </p>
            </div>

            {canInstall && !isInstalled && (
              <button
                type="button"
                className="btn primary app-install-button"
                onClick={() => void onInstall()}
              >
                Instalar aplicativo
              </button>
            )}

            {isInstalled && (
              <span className="app-install-ready">✓ PRONTO</span>
            )}
          </div>
        </section>

        <section className="settings-section account-preview">
          <div className="settings-section-head">
            <div>
              <span className="section-kicker">SEUS DADOS</span>
              <h2>Perfil local</h2>
            </div>
            <span className="install-status-badge installed">ATIVO</span>
          </div>

          <div className="account-preview-card">
            <div className="account-placeholder">⌁</div>
            <div>
              <strong>Este dispositivo já possui uma identidade CodeMpi.</strong>
              <p>
                Seu perfil local foi criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}.
                O progresso continua salvo neste dispositivo por enquanto.
              </p>
              <small className="account-session-note">
                Sessão local iniciada em {new Date(session.startedAt).toLocaleDateString('pt-BR')}.
              </small>
            </div>
            <span className="account-arrow">✓</span>
          </div>

          <div className="account-cloud-note">
            <strong>Conta e sincronização vêm depois.</strong>
            <p>
              Esta identidade local será a base para conectar autenticação, recuperação de progresso
              e sincronização entre dispositivos sem apagar o que você já conquistou.
            </p>
            <span className="coming-badge">EM BREVE</span>
          </div>
        </section>
      </section>
    </main>
  );
}
