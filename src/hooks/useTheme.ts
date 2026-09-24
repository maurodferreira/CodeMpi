import { useEffect, useState } from 'react';
import { browserPersistence, STORAGE_KEYS } from '../services/persistence';
import type { ThemeKey } from '../types';

const THEME_KEYS: ThemeKey[] = ['green', 'carbon', 'violet', 'crimson', 'ocean'];

function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === 'string' && THEME_KEYS.includes(value as ThemeKey);
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const saved = browserPersistence.read<{ theme?: unknown }>(STORAGE_KEYS.settings);
    return isThemeKey(saved?.theme) ? saved.theme : 'green';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    browserPersistence.write(STORAGE_KEYS.settings, { theme });
  }, [theme]);

  return { theme, setTheme };
}
