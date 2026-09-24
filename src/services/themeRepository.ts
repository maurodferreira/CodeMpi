import type { ThemeKey } from '../types';
import {
  browserPersistence,
  STORAGE_KEYS,
  type PersistenceAdapter,
} from './persistence';

const THEME_KEYS: ThemeKey[] = ['green', 'carbon', 'violet', 'crimson', 'ocean'];

function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === 'string' && THEME_KEYS.includes(value as ThemeKey);
}

export interface ThemeRepository {
  load(): ThemeKey;
  save(theme: ThemeKey): boolean;
}

export function createThemeRepository(
  persistence: PersistenceAdapter = browserPersistence,
): ThemeRepository {
  return {
    load() {
      const saved = persistence.read<{ theme?: unknown }>(STORAGE_KEYS.settings);
      return isThemeKey(saved?.theme) ? saved.theme : 'green';
    },

    save(theme) {
      return persistence.write(STORAGE_KEYS.settings, { theme });
    },
  };
}

export const themeRepository = createThemeRepository();
