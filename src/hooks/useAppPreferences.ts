import { useEffect, useState } from 'react';

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

const STORAGE_KEY = 'codempi_preferences_v1';

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
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(saved) as Partial<AppPreferences>;

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
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useAppPreferences() {
  const [preferences, setPreferences] = useState<AppPreferences>(loadPreferences);

  useEffect(() => {
    document.documentElement.dataset.uiScale = preferences.interfaceScale;
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
    document.documentElement.dataset.highContrast = String(preferences.highContrast);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return { preferences, setPreferences };
}
