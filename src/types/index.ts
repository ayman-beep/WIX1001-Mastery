export type WeekNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type LeitnerBox = 0 | 1 | 2 | 3 | 4 | 5;

export type LearningStatus = 'new' | 'learning' | 'mastered';

export type CardCategory =
  | 'definition'
  | 'formula'
  | 'worked-example'
  | 'proof'
  | 'concept';

export interface Flashcard {
  id: string;
  week: WeekNumber;
  topic: string;
  category: CardCategory;
  question: string; // Supports $...$ and $$...$$ KaTeX delimiters
  answer: string; // Exact canonical answer typed by student
  answerLatex?: string; // Rendered KaTeX display for the expected answer
  acceptedVariants?: string[]; // Explicitly configured equivalent forms
  caseSensitive?: boolean; // Defaults to true for math symbols/variables; false when explicitly prose/classification
  formatHint: string; // Clear notation prompt e.g. "Formula in terms of n", "Set roster { ... }"
  explanation: string; // Supports $...$ and $$...$$ KaTeX delimiters; worked example or proof walkthrough
  isCustom?: boolean;
}

export interface WeekDefinition {
  week: WeekNumber;
  title: string;
  shortTitle: string;
  summary: string;
  learningObjectives: string[];
  assessmentTag?: 'test-1' | 'test-2' | 'final';
  milestoneNote?: string;
}

export interface CardProgress {
  cardId: string;
  box: LeitnerBox;
  status: LearningStatus;
  /** True when a card failed a scheduled review and must complete 3/3 consecutive repetitions before returning to the review queue */
  needsRemediationDrill: boolean;
  /** Current consecutive exact repetitions in active learning/relearning drill (0..3) */
  currentStreak: number;
  totalAttempts: number;
  totalMistakes: number;
  totalSuccessfulRepetitions: number;
  nextReviewDate: string | null; // YYYY-MM-DD in local time
  lastReviewDate: string | null; // ISO timestamp
  completionDate: string | null; // ISO timestamp when initial 3/3 learning drill first completed
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD local date
  attempts: number;
  successfulRepetitions: number;
  mistakes: number;
  cardsMastered: number;
  reviewsCompleted: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  dailyReviewGoal: number;
  preferredStartingWeek: WeekNumber;
  sidebarCollapsed: boolean;
}

export interface PersistedAppState {
  schemaVersion: number;
  progress: Record<string, CardProgress>;
  dailyHistory: Record<string, DailyActivity>;
  customCards: Flashcard[];
  replacedCurriculumCards: Flashcard[] | null;
  settings: UserSettings;
  lastActiveCardId: string | null;
  lastUpdated: string;
}

export type StudyMode =
  | 'daily-review'
  | 'continue'
  | 'week-learn'
  | 'week-review'
  | 'week-practice'
  | 'consolidation-all'
  | 'consolidation-missed'
  | 'consolidation-overdue'
  | 'consolidation-box1'
  | 'test-1'
  | 'test-2'
  | 'final-all'
  | 'final-due'
  | 'final-failed'
  | 'final-formulas'
  | 'final-definitions'
  | 'final-proofs'
  | 'final-examples'
  | 'single-card';

export type AppRoute =
  | { page: 'dashboard' }
  | { page: 'study'; mode: StudyMode; week?: WeekNumber; cardId?: string }
  | { page: 'courses' }
  | { page: 'week'; week: WeekNumber }
  | { page: 'consolidation' }
  | { page: 'test-1' }
  | { page: 'test-2' }
  | { page: 'final-exam' }
  | { page: 'statistics' }
  | { page: 'import-export' }
  | { page: 'settings' };

export interface DiffSegment {
  type: 'equal' | 'missing' | 'unexpected';
  text: string;
}

export interface AnswerCheckResult {
  isCorrect: boolean;
  normalizedSubmitted: string;
  normalizedExpected: string;
  matchedVariant?: string;
  expectedSegments: DiffSegment[];
  submittedSegments: DiffSegment[];
}

export interface WeekStats {
  week: WeekNumber;
  totalCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;
  dueCards: number;
  masteryPercentage: number;
  learnedCount: number;
  completionPercentage: number;
}

export type ExportKind = 'full-deck' | 'week-deck' | 'progress' | 'complete-backup';

export type ImportConflictStrategy = 'merge' | 'replace';

export interface ImportValidationPreview {
  valid: boolean;
  errors: string[];
  warnings: string[];
  detectedType: 'deck' | 'progress' | 'complete-backup' | 'unknown';
  cards: Flashcard[];
  weeksCovered: WeekNumber[];
  duplicateIdsWithExisting: string[];
  internalDuplicateIds: string[];
  progressEntriesCount: number;
  hasSettings: boolean;
  rawPayload?: Partial<PersistedAppState>;
}
