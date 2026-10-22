import {
  CardCategory,
  CardProgress,
  DailyActivity,
  Flashcard,
  LeitnerBox,
  LearningStatus,
  PersistedAppState,
  UserSettings,
  WeekNumber,
} from '../types';

export const STORAGE_KEY = 'wix1001_active_recall_state_v2';
export const LEGACY_STORAGE_KEY = 'wix1001_active_recall_state_v1';
export const CURRENT_SCHEMA_VERSION = 2;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  soundEnabled: true,
  dailyReviewGoal: 20,
  preferredStartingWeek: 1,
  sidebarCollapsed: false,
};

const memoryFallbackStore = new Map<string, string>();

export interface StorageDiagnostics {
  usingMemoryFallback: boolean;
  recoveredFromCorruption: boolean;
  warningMessage: string | null;
}

let diagnostics: StorageDiagnostics = {
  usingMemoryFallback: false,
  recoveredFromCorruption: false,
  warningMessage: null,
};

export function getStorageDiagnostics(): StorageDiagnostics {
  return { ...diagnostics };
}

export function safeGetRaw(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    diagnostics = {
      ...diagnostics,
      usingMemoryFallback: true,
      warningMessage:
        'Browser LocalStorage is restricted in this environment; using temporary in-session storage.',
    };
  }
  return memoryFallbackStore.get(key) ?? null;
}

export function safeSetRaw(key: string, value: string): boolean {
  memoryFallbackStore.set(key, value);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return true;
    }
  } catch {
    diagnostics = {
      ...diagnostics,
      usingMemoryFallback: true,
      warningMessage:
        'Unable to write to browser LocalStorage (storage full or disabled); keeping progress in memory for this session.',
    };
  }
  return false;
}

export function safeRemoveRaw(key: string): void {
  memoryFallbackStore.delete(key);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

export function isValidWeekNumber(value: unknown): value is WeekNumber {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 14;
}

const VALID_CATEGORIES = new Set<CardCategory>([
  'definition',
  'formula',
  'worked-example',
  'proof',
  'concept',
]);

export function sanitizeFlashcard(raw: unknown): Flashcard | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== 'string' || obj.id.trim().length === 0) return null;
  if (!isValidWeekNumber(obj.week)) return null;
  if (typeof obj.question !== 'string' || obj.question.trim().length === 0) return null;
  if (typeof obj.answer !== 'string' || obj.answer.trim().length === 0) return null;

  const category: CardCategory = VALID_CATEGORIES.has(obj.category as CardCategory)
    ? (obj.category as CardCategory)
    : 'concept';

  const acceptedVariants = Array.isArray(obj.acceptedVariants)
    ? obj.acceptedVariants.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];

  return {
    id: obj.id.trim(),
    week: obj.week,
    topic: typeof obj.topic === 'string' && obj.topic.trim() ? obj.topic.trim() : `Week ${obj.week} Topic`,
    category,
    question: obj.question.trim(),
    answer: obj.answer.trim(),
    answerLatex: typeof obj.answerLatex === 'string' && obj.answerLatex.trim() ? obj.answerLatex.trim() : undefined,
    acceptedVariants,
    caseSensitive: typeof obj.caseSensitive === 'boolean' ? obj.caseSensitive : true,
    formatHint:
      typeof obj.formatHint === 'string' && obj.formatHint.trim()
        ? obj.formatHint.trim()
        : 'Type exact mathematical expression',
    explanation:
      typeof obj.explanation === 'string' ? obj.explanation.trim() : '',
    isCustom: typeof obj.isCustom === 'boolean' ? obj.isCustom : undefined,
  };
}

export function sanitizeCardProgress(cardId: string, raw: unknown): CardProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const rawBox = typeof obj.box === 'number' ? Math.trunc(obj.box) : 0;
  const box: LeitnerBox = (rawBox >= 0 && rawBox <= 5 ? rawBox : 0) as LeitnerBox;

  const rawStatus = obj.status;
  let status: LearningStatus =
    rawStatus === 'new' || rawStatus === 'learning' || rawStatus === 'mastered'
      ? rawStatus
      : box >= 1
        ? 'mastered'
        : 'new';

  const needsRemediationDrill =
    typeof obj.needsRemediationDrill === 'boolean' ? obj.needsRemediationDrill : false;

  if (needsRemediationDrill && status === 'mastered') {
    status = 'learning';
  }

  const clampNonNeg = (v: unknown, max?: number) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return 0;
    const intVal = Math.trunc(v);
    return max !== undefined ? Math.min(max, intVal) : intVal;
  };

  return {
    cardId: typeof obj.cardId === 'string' && obj.cardId.trim() ? obj.cardId.trim() : cardId,
    box,
    status,
    needsRemediationDrill,
    currentStreak: clampNonNeg(obj.currentStreak, 3),
    totalAttempts: clampNonNeg(obj.totalAttempts),
    totalMistakes: clampNonNeg(obj.totalMistakes),
    totalSuccessfulRepetitions: clampNonNeg(obj.totalSuccessfulRepetitions),
    nextReviewDate:
      typeof obj.nextReviewDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(obj.nextReviewDate)
        ? obj.nextReviewDate
        : null,
    lastReviewDate: typeof obj.lastReviewDate === 'string' ? obj.lastReviewDate : null,
    completionDate: typeof obj.completionDate === 'string' ? obj.completionDate : null,
  };
}

export function sanitizeDailyActivity(dateKey: string, raw: unknown): DailyActivity | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const obj = raw as Record<string, unknown>;
  const nonNeg = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.trunc(v) : 0;

  return {
    date: dateKey,
    attempts: nonNeg(obj.attempts),
    successfulRepetitions: nonNeg(obj.successfulRepetitions),
    mistakes: nonNeg(obj.mistakes),
    cardsMastered: nonNeg(obj.cardsMastered),
    reviewsCompleted: nonNeg(obj.reviewsCompleted),
  };
}

export function sanitizeSettings(raw: unknown): UserSettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }
  const obj = raw as Record<string, unknown>;

  const goal =
    typeof obj.dailyReviewGoal === 'number' && Number.isFinite(obj.dailyReviewGoal)
      ? Math.max(1, Math.min(500, Math.trunc(obj.dailyReviewGoal)))
      : DEFAULT_SETTINGS.dailyReviewGoal;

  return {
    theme: obj.theme === 'dark' ? 'dark' : 'light',
    soundEnabled:
      typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
    dailyReviewGoal: goal,
    preferredStartingWeek: isValidWeekNumber(obj.preferredStartingWeek)
      ? obj.preferredStartingWeek
      : DEFAULT_SETTINGS.preferredStartingWeek,
    sidebarCollapsed:
      typeof obj.sidebarCollapsed === 'boolean'
        ? obj.sidebarCollapsed
        : DEFAULT_SETTINGS.sidebarCollapsed,
  };
}

export function createDefaultAppState(): PersistedAppState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    progress: {},
    dailyHistory: {},
    customCards: [],
    replacedCurriculumCards: null,
    settings: { ...DEFAULT_SETTINGS },
    lastActiveCardId: null,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Migrates older or partial persisted objects safely into current schema v2.
 */
export function migrateAndSanitizeState(parsed: unknown): PersistedAppState {
  const base = createDefaultAppState();
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return base;
  }

  const obj = parsed as Record<string, unknown>;

  // Support v1 legacy shape where `cardsProgress` or `records` was used instead of `progress`
  const rawProgressMap =
    (obj.progress as Record<string, unknown> | undefined) ??
    (obj.cardsProgress as Record<string, unknown> | undefined) ??
    (obj.records as Record<string, unknown> | undefined);

  const sanitizedProgress: Record<string, CardProgress> = {};
  if (rawProgressMap && typeof rawProgressMap === 'object' && !Array.isArray(rawProgressMap)) {
    for (const [cardId, record] of Object.entries(rawProgressMap)) {
      const clean = sanitizeCardProgress(cardId, record);
      if (clean) {
        sanitizedProgress[clean.cardId] = clean;
      }
    }
  }

  const sanitizedHistory: Record<string, DailyActivity> = {};
  if (obj.dailyHistory && typeof obj.dailyHistory === 'object' && !Array.isArray(obj.dailyHistory)) {
    for (const [dateKey, entry] of Object.entries(obj.dailyHistory as Record<string, unknown>)) {
      const clean = sanitizeDailyActivity(dateKey, entry);
      if (clean) {
        sanitizedHistory[dateKey] = clean;
      }
    }
  }

  const customCards: Flashcard[] = Array.isArray(obj.customCards)
    ? obj.customCards
        .map(sanitizeFlashcard)
        .filter((c): c is Flashcard => c !== null)
    : [];

  const replacedCurriculumCards: Flashcard[] | null = Array.isArray(obj.replacedCurriculumCards)
    ? obj.replacedCurriculumCards
        .map(sanitizeFlashcard)
        .filter((c): c is Flashcard => c !== null)
    : null;

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    progress: sanitizedProgress,
    dailyHistory: sanitizedHistory,
    customCards,
    replacedCurriculumCards:
      replacedCurriculumCards && replacedCurriculumCards.length > 0
        ? replacedCurriculumCards
        : null,
    settings: sanitizeSettings(obj.settings),
    lastActiveCardId: typeof obj.lastActiveCardId === 'string' ? obj.lastActiveCardId : null,
    lastUpdated: typeof obj.lastUpdated === 'string' ? obj.lastUpdated : new Date().toISOString(),
  };
}

/**
 * Loads application state defensively from LocalStorage, migrating legacy data and recovering
 * cleanly from corrupted or malformed JSON without crashing.
 */
export function loadPersistedState(): PersistedAppState {
  const rawCurrent = safeGetRaw(STORAGE_KEY);
  const rawLegacy = rawCurrent === null ? safeGetRaw(LEGACY_STORAGE_KEY) : null;
  const rawSource = rawCurrent ?? rawLegacy;

  if (!rawSource) {
    return createDefaultAppState();
  }

  try {
    const parsed: unknown = JSON.parse(rawSource);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Root state must be a JSON object.');
    }
    const migrated = migrateAndSanitizeState(parsed);
    if (rawLegacy !== null && rawCurrent === null) {
      savePersistedState(migrated);
    }
    return migrated;
  } catch {
    diagnostics = {
      ...diagnostics,
      recoveredFromCorruption: true,
      warningMessage:
        'Saved browser storage contained corrupted JSON and was safely reset to a clean state.',
    };
    safeSetRaw(`${STORAGE_KEY}_corrupted_backup`, rawSource);
    const fresh = createDefaultAppState();
    savePersistedState(fresh);
    return fresh;
  }
}

export function savePersistedState(state: PersistedAppState): void {
  const next: PersistedAppState = {
    ...state,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
  };
  safeSetRaw(STORAGE_KEY, JSON.stringify(next));
}
