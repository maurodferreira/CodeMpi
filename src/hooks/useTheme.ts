import { useEffect, useState } from 'react';
import { themeRepository } from '../services/themeRepository';
import type { ThemeKey } from '../types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeKey>(() => themeRepository.load());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeRepository.save(theme);
  }, [theme]);

  return { theme, setTheme };
}
