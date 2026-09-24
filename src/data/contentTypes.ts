export interface ExerciseTest {
  args: unknown[];
  exp: unknown;
}

export interface Exercise {
  title: string;
  desc: string;
  sig: string;
  starter: string;
  fn: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'boss';
  xp: number;
  skill: string;
  conceptIds?: string[];
  hints: string[];
  tests: ExerciseTest[];
}

export interface Level {
  name: string;
  tag: string;
  exercises: Exercise[] | null;
  count?: number;
  topics?: string;
}

export interface LessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LessonStep {
  id: string;
  type: 'concept' | 'example' | 'quiz' | 'checkpoint';
  eyebrow: string;
  title: string;
  body: string;
  code?: string;
  explanation?: string;
  quiz?: LessonQuiz;
}

export interface LevelLesson {
  levelTag: string;
  title: string;
  subtitle: string;
  rewardXp: number;
  steps: LessonStep[];
}
