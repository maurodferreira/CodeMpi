import { useCallback, useEffect, useRef, useState } from 'react';
import type { View } from '../types';

export interface NavigationOptions {
  replace?: boolean;
}

export interface AppRoute {
  view: View;
  pathname: string;
  levelIndex?: number;
  exerciseIndex?: number;
}

interface UseAppRouterOptions {
  resolveRoute?: (route: AppRoute) => AppRoute;
  onRouteChange?: (route: AppRoute) => void;
}

const STATIC_PATHS = {
  dashboard: '/',
  map: '/jornada',
  search: '/buscar',
  memory: '/memoria',
  settings: '/configuracoes',
} as const;

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';

  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}

function toLevelIndex(value: string): number | undefined {
  const levelNumber = Number(value);

  if (!Number.isInteger(levelNumber) || levelNumber < 1) return undefined;

  return levelNumber - 1;
}

function toExerciseIndex(value: string): number | undefined {
  const exerciseNumber = Number(value);

  if (!Number.isInteger(exerciseNumber) || exerciseNumber < 1) return undefined;

  return exerciseNumber - 1;
}

export function parseAppRoute(pathname: string): AppRoute {
  const normalized = normalizePathname(pathname);

  const staticEntry = Object.entries(STATIC_PATHS).find(([, path]) => path === normalized);

  if (staticEntry) {
    return {
      view: staticEntry[0] as keyof typeof STATIC_PATHS,
      pathname: normalized,
    };
  }

  const lessonMatch = normalized.match(/^\/nivel\/n(\d+)\/aula$/i);

  if (lessonMatch) {
    const levelIndex = toLevelIndex(lessonMatch[1]);

    if (levelIndex === undefined) {
      return { view: 'dashboard', pathname: '/' };
    }

    return {
      view: 'lesson',
      pathname: normalized,
      levelIndex,
    };
  }

  const missionMatch = normalized.match(/^\/nivel\/n(\d+)\/desafio\/(\d+)$/i);

  if (missionMatch) {
    const levelIndex = toLevelIndex(missionMatch[1]);
    const exerciseIndex = toExerciseIndex(missionMatch[2]);

    if (levelIndex === undefined || exerciseIndex === undefined) {
      return { view: 'dashboard', pathname: '/' };
    }

    return {
      view: 'mission',
      pathname: normalized,
      levelIndex,
      exerciseIndex,
    };
  }

  const completionMatch = normalized.match(/^\/nivel\/n(\d+)\/concluido$/i);

  if (completionMatch) {
    const levelIndex = toLevelIndex(completionMatch[1]);

    if (levelIndex === undefined) {
      return { view: 'dashboard', pathname: '/' };
    }

    return {
      view: 'completion',
      pathname: normalized,
      levelIndex,
    };
  }

  const levelMatch = normalized.match(/^\/nivel\/n(\d+)$/i);

  if (levelMatch) {
    const levelIndex = toLevelIndex(levelMatch[1]);

    if (levelIndex === undefined) {
      return { view: 'dashboard', pathname: '/' };
    }

    return {
      view: 'mission',
      pathname: normalized,
      levelIndex,
    };
  }

  return {
    view: 'dashboard',
    pathname: '/',
  };
}

export function getViewPath(view: View): string {
  if (view in STATIC_PATHS) {
    return STATIC_PATHS[view as keyof typeof STATIC_PATHS];
  }

  return '/';
}

export function getLevelPath(levelIndex: number): string {
  return `/nivel/n${levelIndex + 1}`;
}

export function getLessonPath(levelIndex: number): string {
  return `${getLevelPath(levelIndex)}/aula`;
}

export function getMissionPath(levelIndex: number, exerciseIndex: number): string {
  return `${getLevelPath(levelIndex)}/desafio/${exerciseIndex + 1}`;
}

export function getCompletionPath(levelIndex: number): string {
  return `${getLevelPath(levelIndex)}/concluido`;
}

export function useAppRouter({
  resolveRoute = (route) => route,
  onRouteChange,
}: UseAppRouterOptions = {}) {
  const resolveRouteRef = useRef(resolveRoute);
  const onRouteChangeRef = useRef(onRouteChange);

  resolveRouteRef.current = resolveRoute;
  onRouteChangeRef.current = onRouteChange;

  const [route, setRoute] = useState<AppRoute>(() => (
    resolveRoute(parseAppRoute(window.location.pathname))
  ));

  useEffect(() => {
    if (normalizePathname(window.location.pathname) !== route.pathname) {
      window.history.replaceState({}, '', route.pathname);
    }

    const handlePopState = () => {
      const nextRoute = resolveRouteRef.current(parseAppRoute(window.location.pathname));

      if (normalizePathname(window.location.pathname) !== nextRoute.pathname) {
        window.history.replaceState({}, '', nextRoute.pathname);
      }

      setRoute(nextRoute);
      onRouteChangeRef.current?.(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [route.pathname]);

  const navigatePath = useCallback((pathname: string, options: NavigationOptions = {}) => {
    const nextRoute = resolveRouteRef.current(parseAppRoute(pathname));
    const nextPath = nextRoute.pathname;

    if (window.location.pathname !== nextPath) {
      if (options.replace) {
        window.history.replaceState({}, '', nextPath);
      } else {
        window.history.pushState({}, '', nextPath);
      }
    }

    setRoute(nextRoute);
    onRouteChangeRef.current?.(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateView = useCallback((view: View, options?: NavigationOptions) => {
    navigatePath(getViewPath(view), options);
  }, [navigatePath]);

  const navigateLevel = useCallback((levelIndex: number, options?: NavigationOptions) => {
    navigatePath(getLevelPath(levelIndex), options);
  }, [navigatePath]);

  const navigateLesson = useCallback((levelIndex: number, options?: NavigationOptions) => {
    navigatePath(getLessonPath(levelIndex), options);
  }, [navigatePath]);

  const navigateMission = useCallback((
    levelIndex: number,
    exerciseIndex: number,
    options?: NavigationOptions,
  ) => {
    navigatePath(getMissionPath(levelIndex, exerciseIndex), options);
  }, [navigatePath]);

  const navigateCompletion = useCallback((levelIndex: number, options?: NavigationOptions) => {
    navigatePath(getCompletionPath(levelIndex), options);
  }, [navigatePath]);

  return {
    route,
    navigatePath,
    navigateView,
    navigateLevel,
    navigateLesson,
    navigateMission,
    navigateCompletion,
  };
}
