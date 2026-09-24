export function getProgressKey(levelIndex: number, exerciseIndex: number): string {
  return `${levelIndex}-${exerciseIndex}`;
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getActivityStreak(activityDates: string[], today = getLocalDateKey()) {
  const uniqueDates = Array.from(new Set(activityDates)).sort();

  if (uniqueDates.length === 0) {
    return { current: 0, best: 0, activeToday: false };
  }

  const dates = new Set(uniqueDates);

  const toDateNumber = (key: string) => {
    const [year, month, day] = key.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };

  const previousDay = (key: string) => {
    const date = new Date(toDateNumber(key));
    date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  };

  const activeToday = dates.has(today);

  let current = 0;
  let cursor = activeToday ? today : previousDay(today);

  while (dates.has(cursor)) {
    current += 1;
    cursor = previousDay(cursor);
  }

  let best = 0;
  let run = 0;
  let previous: string | null = null;

  for (const key of uniqueDates) {
    if (previous && key === previousDay(previous)) {
      run += 1;
    } else {
      run = 1;
    }

    best = Math.max(best, run);
    previous = key;
  }

  return { current, best, activeToday };
}

export function addTodayActivity(activityDates: string[]): string[] {
  const today = getLocalDateKey();
  return Array.from(new Set([...activityDates, today])).sort();
}
