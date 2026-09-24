import { useEffect, useState } from 'react';
import type { AppPreferences } from '../domain/preferences';
import { preferencesRepository } from '../services/preferencesRepository';

export type {
  AppPreferences,
  EditorFontSize,
  InterfaceScale,
  IndentSize,
} from '../domain/preferences';

export function useAppPreferences() {
  const [preferences, setPreferences] = useState<AppPreferences>(
    () => preferencesRepository.load(),
  );

  useEffect(() => {
    document.documentElement.dataset.uiScale = preferences.interfaceScale;
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
    document.documentElement.dataset.highContrast = String(preferences.highContrast);
    preferencesRepository.save(preferences);
  }, [preferences]);

  return { preferences, setPreferences };
}
