import { useEffect, useState } from 'react';
import type { ThemeKey } from '../types';

const STORAGE_KEY = 'codempi_settings_v1';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.theme || 'green';
    } catch {
      return 'green';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
  }, [theme]);

  return { theme, setTheme };
}
