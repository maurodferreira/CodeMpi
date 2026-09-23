export type View = 'dashboard' | 'map' | 'lesson' | 'mission' | 'completion' | 'settings';
export type ThemeKey = 'green' | 'carbon' | 'violet' | 'crimson' | 'ocean';

export interface ThemeOption {
  id: ThemeKey;
  name: string;
  description: string;
  colors: string[];
}

export interface PerformanceData {
  attempts: number;
  failures: number;
}

export interface StoreData {
  done: Record<string, number>;
  hints: Record<string, number>;
  lessonDone: Record<number, boolean>;
  performance: Record<string, PerformanceData>;
  activityDates: string[];
}

export interface ConceptSummary {
  skill: string;
  completed: number;
  total: number;
  failures: number;
  attempts: number;
  levelIndex: number;
  exerciseIndex: number;
  title: string;
}

export interface TestFailure {
  args: string;
  got: string;
  expected: string;
  error?: string;
}

export interface LastTest {
  passed: number;
  total: number;
  firstFailure?: TestFailure;
}

export interface ConsoleLog {
  tag: string;
  msg: string;
  ok?: boolean;
}

export interface LearningFeedback {
  tone: 'success' | 'focus' | 'error';
  title: string;
  body: string;
}
