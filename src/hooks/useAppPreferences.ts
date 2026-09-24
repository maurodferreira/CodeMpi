import { useEffect, useState } from 'react';
import { browserPersistence, STORAGE_KEYS } from '../services/persistence';

export type InterfaceScale = 'compact' | 'comfortable' | 'large';
export type EditorFontSize = 'small' | 'medium' | 'large';
export type IndentSize = 2 | 4;

export interface AppPreferences {
  interfaceScale: InterfaceScale;
  reduceMotion: boolean;
  highContrast: boolean;
  editorFontSize: EditorFontSize;
  editorLineWrapping: boolean;
  editorLineNumbers: boolean;
  editorIndentSize: IndentSize;
  showXp: boolean;
  confirmReset: boolean;
}

const DEFAULT_PREFERENCES: AppPreferences = {
  interfaceScale: 'comfortable',
  reduceMotion: false,
  highContrast: false,
  editorFontSize: 'medium',
  editorLineWrapping: true,
  editorLineNumbers: true,
  editorIndentSize: 2,
  showXp: true,
  confirmReset: true,
};

function loadPreferences(): AppPreferences {
  const parsed = browserPersistence.read<Partial<AppPreferences>>(STORAGE_KEYS.preferences);

  if (!parsed) return DEFAULT_PREFERENCES;

  return {
    ...DEFAULT_PREFERENCES,
    ...parsed,
    interfaceScale: parsed.interfaceScale === 'compact' || parsed.interfaceScale === 'large'
      ? parsed.interfaceScale
      : 'comfortable',
    editorFontSize: parsed.editorFontSize === 'small' || parsed.editorFontSize === 'large'
      ? parsed.editorFontSize
      : 'medium',
    editorIndentSize: parsed.editorIndentSize === 4 ? 4 : 2,
    reduceMotion: Boolean(parsed.reduceMotion),
    highContrast: Boolean(parsed.highContrast),
    editorLineWrapping: parsed.editorLineWrapping !== false,
    editorLineNumbers: parsed.editorLineNumbers !== false,
    showXp: parsed.showXp !== false,
    confirmReset: parsed.confirmReset !== false,
  };
}

export function useAppPreferences() {
  const [preferences, setPreferences] = useState<AppPreferences>(loadPreferences);

  useEffect(() => {
    document.documentElement.dataset.uiScale = preferences.interfaceScale;
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
    document.documentElement.dataset.highContrast = String(preferences.highContrast);
    browserPersistence.write(STORAGE_KEYS.preferences, preferences);
  }, [preferences]);

  return { preferences, setPreferences };
}
