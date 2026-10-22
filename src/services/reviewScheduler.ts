import { CardProgress, DailyActivity, LeitnerBox } from '../types';

export const REQUIRED_STREAK = 3;

export const LEITNER_INTERVALS: Record<Exclude<LeitnerBox, 0>, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

/**
 * Formats a Date object as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Deterministically adds `days` calendar days to a YYYY-MM-DD date string.
 */
export function addDaysToDateString(baseDateStr: string, days: number): string {
  const [y, m, d] = baseDateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
  dt.setDate(dt.getDate() + days);
  return getLocalDateString(dt);
}

/**
 * Creates a clean initial progress record for an unseen card.
 */
export function createInitialCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    box: 0,
    status: 'new',
    needsRemediationDrill: false,
    currentStreak: 0,
    totalAttempts: 0,
    totalMistakes: 0,
    totalSuccessfulRepetitions: 0,
    nextReviewDate: null,
    lastReviewDate: null,
    completionDate: null,
  };
}

/**
 * Determines whether a card is currently eligible and due in the spaced-repetition review queue.
 * Note: Cards with `needsRemediationDrill === true` are strictly excluded from the review queue
 * until their mandatory 3-consecutive-correct drill is completed.
 */
export function isCardDueForReview(
  progress: CardProgress | undefined,
  todayStr: string = getLocalDateString()
): boolean {
  if (!progress) return false;
  if (progress.box < 1) return false;
  if (progress.needsRemediationDrill) return false;
  if (!progress.nextReviewDate) return false;
  return progress.nextReviewDate <= todayStr;
}

/**
 * Transitions a brand-new card into active learning state when the user clicks Start Drill.
 */
export function startCardDrill(progress: CardProgress): CardProgress {
  if (progress.status === 'new') {
    return {
      ...progress,
      status: 'learning',
      currentStreak: 0,
    };
  }
  return {
    ...progress,
    currentStreak: progress.status === 'mastered' && !progress.needsRemediationDrill ? 0 : progress.currentStreak,
  };
}

export type TransitionEvent =
  | 'streak-increment'
  | 'drill-complete'
  | 'mistake-reset'
  | 'review-passed'
  | 'review-failed-remediation';

export interface TransitionOutcome {
  nextProgress: CardProgress;
  event: TransitionEvent;
  previousBox: LeitnerBox;
  newBox: LeitnerBox;
  intervalDays: number | null;
  newlyMastered: boolean;
  reviewCompleted: boolean;
}

/**
 * Applies a single submission during the mandatory 3-consecutive-correct Active-Recall Drill
 * (initial learning, failed-review remediation, or extra drill practice).
 */
export function applyDrillSubmission(
  progress: CardProgress,
  isCorrect: boolean,
  now: Date = new Date()
): TransitionOutcome {
  const isoNow = now.toISOString();
  const todayStr = getLocalDateString(now);
  const previousBox = progress.box;

  if (!isCorrect) {
    const wasMasteredOrBoxed = progress.box >= 1 || progress.status === 'mastered';
    const nextBox: LeitnerBox = wasMasteredOrBoxed ? 1 : 0;

    return {
      nextProgress: {
        ...progress,
        box: nextBox,
        status: 'learning',
        needsRemediationDrill: wasMasteredOrBoxed ? true : progress.needsRemediationDrill,
        currentStreak: 0,
        totalAttempts: progress.totalAttempts + 1,
        totalMistakes: progress.totalMistakes + 1,
        nextReviewDate: wasMasteredOrBoxed ? null : progress.nextReviewDate,
        lastReviewDate: isoNow,
      },
      event: 'mistake-reset',
      previousBox,
      newBox: nextBox,
      intervalDays: null,
      newlyMastered: false,
      reviewCompleted: false,
    };
  }

  // Correct answer in drill
  const updatedStreak = progress.currentStreak + 1;
  const updatedSuccesses = progress.totalSuccessfulRepetitions + 1;
  const updatedAttempts = progress.totalAttempts + 1;

  if (updatedStreak < REQUIRED_STREAK) {
    const keepMastered = progress.status === 'mastered' && !progress.needsRemediationDrill && progress.box >= 1;
    return {
      nextProgress: {
        ...progress,
        status: keepMastered ? 'mastered' : 'learning',
        currentStreak: updatedStreak,
        totalAttempts: updatedAttempts,
        totalSuccessfulRepetitions: updatedSuccesses,
        lastReviewDate: isoNow,
      },
      event: 'streak-increment',
      previousBox,
      newBox: previousBox,
      intervalDays: null,
      newlyMastered: false,
      reviewCompleted: false,
    };
  }

  // Completed 3 / 3 consecutive correct repetitions!
  const isAlreadyGraduatedExtraPractice =
    progress.status === 'mastered' && !progress.needsRemediationDrill && progress.box >= 1;

  if (isAlreadyGraduatedExtraPractice) {
    const existingBox = progress.box as Exclude<LeitnerBox, 0>;
    const existingInterval = LEITNER_INTERVALS[existingBox];
    return {
      nextProgress: {
        ...progress,
        status: 'mastered',
        needsRemediationDrill: false,
        currentStreak: REQUIRED_STREAK,
        totalAttempts: updatedAttempts,
        totalSuccessfulRepetitions: updatedSuccesses,
        lastReviewDate: isoNow,
        nextReviewDate: progress.nextReviewDate ?? addDaysToDateString(todayStr, existingInterval),
      },
      event: 'drill-complete',
      previousBox,
      newBox: existingBox,
      intervalDays: existingInterval,
      newlyMastered: false,
      reviewCompleted: false,
    };
  }

  const firstTimeCompletion = progress.completionDate === null;
  const nextReview = addDaysToDateString(todayStr, LEITNER_INTERVALS[1]);

  return {
    nextProgress: {
      ...progress,
      box: 1,
      status: 'mastered',
      needsRemediationDrill: false,
      currentStreak: REQUIRED_STREAK,
      totalAttempts: updatedAttempts,
      totalSuccessfulRepetitions: updatedSuccesses,
      nextReviewDate: nextReview,
      lastReviewDate: isoNow,
      completionDate: progress.completionDate ?? isoNow,
    },
    event: 'drill-complete',
    previousBox,
    newBox: 1,
    intervalDays: LEITNER_INTERVALS[1],
    newlyMastered: firstTimeCompletion,
    reviewCompleted: progress.needsRemediationDrill,
  };
}

/**
 * Applies a scheduled review check for a due card in Boxes 1–5.
 * - If `needsRemediationDrill` is active, routes strictly through the 3-streak drill engine.
 * - On pass: advances Box k -> min(5, k + 1) and schedules +interval days.
 * - On fail: demotes to Box 1, sets `needsRemediationDrill = true` and `currentStreak = 0`.
 */
export function applyScheduledReviewSubmission(
  progress: CardProgress,
  isCorrect: boolean,
  now: Date = new Date()
): TransitionOutcome {
  if (progress.box < 1 || progress.needsRemediationDrill) {
    return applyDrillSubmission(progress, isCorrect, now);
  }

  const isoNow = now.toISOString();
  const todayStr = getLocalDateString(now);
  const previousBox = progress.box;

  if (isCorrect) {
    const newBox = Math.min(5, progress.box + 1) as Exclude<LeitnerBox, 0>;
    const intervalDays = LEITNER_INTERVALS[newBox];
    const nextReviewDate = addDaysToDateString(todayStr, intervalDays);

    return {
      nextProgress: {
        ...progress,
        box: newBox,
        status: 'mastered',
        needsRemediationDrill: false,
        currentStreak: REQUIRED_STREAK,
        totalAttempts: progress.totalAttempts + 1,
        totalSuccessfulRepetitions: progress.totalSuccessfulRepetitions + 1,
        nextReviewDate,
        lastReviewDate: isoNow,
        completionDate: progress.completionDate ?? isoNow,
      },
      event: 'review-passed',
      previousBox,
      newBox,
      intervalDays,
      newlyMastered: false,
      reviewCompleted: true,
    };
  }

  // Failed review: demote immediately to Box 1 & lock into mandatory 3-consecutive-correct drill!
  return {
    nextProgress: {
      ...progress,
      box: 1,
      status: 'learning',
      needsRemediationDrill: true,
      currentStreak: 0,
      totalAttempts: progress.totalAttempts + 1,
      totalMistakes: progress.totalMistakes + 1,
      nextReviewDate: null,
      lastReviewDate: isoNow,
    },
    event: 'review-failed-remediation',
    previousBox,
    newBox: 1,
    intervalDays: null,
    newlyMastered: false,
    reviewCompleted: false,
  };
}

/**
 * Updates daily activity logs after a submission outcome.
 */
export function updateDailyHistory(
  history: Record<string, DailyActivity>,
  outcome: TransitionOutcome,
  isCorrect: boolean,
  now: Date = new Date()
): Record<string, DailyActivity> {
  const key = getLocalDateString(now);
  const existing: DailyActivity = history[key] ?? {
    date: key,
    attempts: 0,
    successfulRepetitions: 0,
    mistakes: 0,
    cardsMastered: 0,
    reviewsCompleted: 0,
  };

  return {
    ...history,
    [key]: {
      date: key,
      attempts: existing.attempts + 1,
      successfulRepetitions: existing.successfulRepetitions + (isCorrect ? 1 : 0),
      mistakes: existing.mistakes + (isCorrect ? 0 : 1),
      cardsMastered: existing.cardsMastered + (outcome.newlyMastered ? 1 : 0),
      reviewsCompleted: existing.reviewsCompleted + (outcome.reviewCompleted ? 1 : 0),
    },
  };
}

/**
 * Computes current and longest consecutive daily study streaks from actual daily activity records.
 */
export function computeStudyStreaks(
  history: Record<string, DailyActivity>,
  todayStr: string = getLocalDateString()
): { currentStreak: number; longestStreak: number } {
  const activeDates = Object.values(history)
    .filter((entry) => entry && entry.attempts > 0)
    .map((entry) => entry.date)
    .sort();

  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const activeSet = new Set(activeDates);

  // Longest streak across all recorded history
  let longest = 1;
  let running = 1;
  for (let i = 1; i < activeDates.length; i++) {
    if (addDaysToDateString(activeDates[i - 1], 1) === activeDates[i]) {
      running += 1;
      if (running > longest) longest = running;
    } else {
      running = 1;
    }
  }

  // Current streak: active today or yesterday
  const yesterdayStr = addDaysToDateString(todayStr, -1);
  let cursor: string | null = activeSet.has(todayStr)
    ? todayStr
    : activeSet.has(yesterdayStr)
      ? yesterdayStr
      : null;

  let current = 0;
  while (cursor && activeSet.has(cursor)) {
    current += 1;
    cursor = addDaysToDateString(cursor, -1);
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}
