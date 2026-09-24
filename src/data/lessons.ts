import { N1_LESSON } from './lessons/n1';
import { N2_LESSON } from './lessons/n2';
import { N3_LESSON } from './lessons/n3';
import { N4_LESSON } from './lessons/n4';
import { N5_LESSON } from './lessons/n5';
import { N6_LESSON } from './lessons/n6';
import { N7_LESSON } from './lessons/n7';
import type { LevelLesson } from './contentTypes';

export type { LessonQuiz, LessonStep, LevelLesson } from './contentTypes';

export const LEVEL_LESSONS: Record<number, LevelLesson> = {
  0: N1_LESSON,
  1: N2_LESSON,
  2: N3_LESSON,
  3: N4_LESSON,
  4: N5_LESSON,
  5: N6_LESSON,
  6: N7_LESSON,
};
