export const HINT_MULTIPLIERS = [1, 0.9, 0.75, 0.5, 0.25] as const;

export function getHintMultiplier(hintsShown: number): number {
  return HINT_MULTIPLIERS[Math.min(Math.max(hintsShown, 0), HINT_MULTIPLIERS.length - 1)];
}

export function calculateExerciseXp(baseXp: number, hintsShown: number): number {
  return Math.round(baseXp * getHintMultiplier(hintsShown));
}
