import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CARDS, getCardsByWeek } from '../data/cardDefinitions';
import { CURRICULUM_WEEKS } from '../data/curriculum';
import {
  computeAnswerDiff,
  evaluateCardAnswer,
  normalizeAnswer,
} from '../services/answerNormalizer';
import {
  applyValidatedImport,
  EXAMPLE_CUSTOM_DECK,
  validateImportJson,
} from '../services/importExportService';
import {
  applyDrillSubmission,
  applyScheduledReviewSubmission,
  computeStudyStreaks,
  createInitialCardProgress,
  isCardDueForReview,
  startCardDrill,
} from '../services/reviewScheduler';
import {
  createDefaultAppState,
  LEGACY_STORAGE_KEY,
  loadPersistedState,
  migrateAndSanitizeState,
  STORAGE_KEY,
} from '../services/storageService';
import { WeekNumber } from '../types';

describe('1. Complete 14-Week WIX1001 Curriculum Integrity', () => {
  it('populates all 14 weeks with unique, valid, self-consistent flashcards', () => {
    expect(CURRICULUM_WEEKS).toHaveLength(14);
    expect(DEFAULT_CARDS.length).toBeGreaterThanOrEqual(130);

    const seenIds = new Set<string>();
    for (let w = 1; w <= 14; w++) {
      const weekCards = getCardsByWeek(DEFAULT_CARDS, w as WeekNumber);
      expect(weekCards.length).toBeGreaterThan(0);

      for (const card of weekCards) {
        expect(seenIds.has(card.id)).toBe(false);
        seenIds.add(card.id);

        // Verify canonical answer always passes evaluation
        const canonicalResult = evaluateCardAnswer(card.answer, card);
        expect(canonicalResult.isCorrect).toBe(true);

        // Verify every configured variant also passes evaluation
        for (const variant of card.acceptedVariants ?? []) {
          const variantResult = evaluateCardAnswer(variant, card);
          expect(variantResult.isCorrect).toBe(true);
        }
      }
    }
  });
});

describe('2. Deterministic Answer Normalization & Diff Engine', () => {
  it('normalizes harmless whitespace and configured math symbol aliases', () => {
    expect(normalizeAnswer('  A   ∩   B  ')).toBe(normalizeAnswer('A∩B'));
    expect(normalizeAnswer('A \\cap B')).toBe(normalizeAnswer('A ∩ B'));
    expect(normalizeAnswer('\\forall x \\in \\mathbb{N}, P(x)')).toBe(
      normalizeAnswer('∀x ∈ ℕ, P(x)')
    );
    expect(normalizeAnswer('p -> q')).toBe(normalizeAnswer('p → q'));
    expect(normalizeAnswer('p <-> q')).toBe(normalizeAnswer('p ↔ q'));
  });

  it('canonicalizes Unicode superscripts and subscripts without conflating x² with x2', () => {
    expect(normalizeAnswer('b² - 4ac')).toBe(normalizeAnswer('b^2 - 4ac'));
    expect(normalizeAnswer('b²')).not.toBe(normalizeAnswer('b2'));
    expect(normalizeAnswer('A⁻¹B')).toBe(normalizeAnswer('A^(-1)B'));
    expect(normalizeAnswer('x₁ + x₂')).toBe(normalizeAnswer('x_1 + x_2'));
  });

  it('strictly rejects mathematically different operators, variables, signs, and empty inputs', () => {
    const sampleCard = {
      answer: '|A| + |B| - |A ∩ B|',
      acceptedVariants: [],
      caseSensitive: true,
    };

    expect(evaluateCardAnswer('|A| + |B| + |A ∩ B|', sampleCard).isCorrect).toBe(false);
    expect(evaluateCardAnswer('|A| + |B| - |A ∪ B|', sampleCard).isCorrect).toBe(false);
    expect(evaluateCardAnswer('|a| + |b| - |a ∩ b|', sampleCard).isCorrect).toBe(false);
    expect(evaluateCardAnswer('   ', sampleCard).isCorrect).toBe(false);
  });

  it('highlights unexpected and missing segments on incorrect answers', () => {
    const diff = computeAnswerDiff('A ∪ B', 'A ∩ B');
    expect(diff.submittedSegments.some((s) => s.type === 'unexpected' && s.text.includes('∪'))).toBe(
      true
    );
    expect(diff.expectedSegments.some((s) => s.type === 'missing' && s.text.includes('∩'))).toBe(
      true
    );
  });
});

describe('3. Strict 3-Streak Active-Recall Drill & Mistake Reset', () => {
  const fixedNow = new Date('2026-10-22T10:00:00');

  it('requires three consecutive exact repetitions and schedules Box 1 review for +1 day', () => {
    let prog = startCardDrill(createInitialCardProgress('w01-01'));
    expect(prog.status).toBe('learning');
    expect(prog.currentStreak).toBe(0);

    const r1 = applyDrillSubmission(prog, true, fixedNow);
    expect(r1.event).toBe('streak-increment');
    expect(r1.nextProgress.currentStreak).toBe(1);
    expect(r1.nextProgress.box).toBe(0);

    const r2 = applyDrillSubmission(r1.nextProgress, true, fixedNow);
    expect(r2.event).toBe('streak-increment');
    expect(r2.nextProgress.currentStreak).toBe(2);
    expect(r2.nextProgress.box).toBe(0);

    const r3 = applyDrillSubmission(r2.nextProgress, true, fixedNow);
    expect(r3.event).toBe('drill-complete');
    expect(r3.nextProgress.status).toBe('mastered');
    expect(r3.nextProgress.box).toBe(1);
    expect(r3.nextProgress.nextReviewDate).toBe('2026-10-23');
    expect(r3.nextProgress.totalSuccessfulRepetitions).toBe(3);
  });

  it('resets streak immediately to 0 / 3 upon any mistake and requires 3 fresh consecutive hits', () => {
    let prog = startCardDrill(createInitialCardProgress('w02-06'));
    prog = applyDrillSubmission(prog, true, fixedNow).nextProgress;
    prog = applyDrillSubmission(prog, true, fixedNow).nextProgress;
    expect(prog.currentStreak).toBe(2);

    // Mistake on attempt 3!
    const failOutcome = applyDrillSubmission(prog, false, fixedNow);
    expect(failOutcome.event).toBe('mistake-reset');
    expect(failOutcome.nextProgress.currentStreak).toBe(0);
    expect(failOutcome.nextProgress.box).toBe(0);
    expect(failOutcome.nextProgress.totalMistakes).toBe(1);

    // Next single correct hit only reaches 1/3, not complete
    const retry1 = applyDrillSubmission(failOutcome.nextProgress, true, fixedNow);
    expect(retry1.nextProgress.currentStreak).toBe(1);
    expect(retry1.event).toBe('streak-increment');
  });
});

describe('4. Leitner Box 1–5 Scheduling & Failed-Review Remediation Lock', () => {
  it('advances through intervals 1d → 3d → 7d → 14d → 30d → 30d and demotes failed reviews', () => {
    let prog = createInitialCardProgress('w04-04');
    const day0 = new Date('2026-10-01T09:00:00');

    // Complete initial 3/3 learning drill -> Box 1 (+1d = 2026-10-02)
    prog = applyDrillSubmission(prog, true, day0).nextProgress;
    prog = applyDrillSubmission(prog, true, day0).nextProgress;
    prog = applyDrillSubmission(prog, true, day0).nextProgress;
    expect(prog.box).toBe(1);
    expect(prog.nextReviewDate).toBe('2026-10-02');
    expect(isCardDueForReview(prog, '2026-10-01')).toBe(false);
    expect(isCardDueForReview(prog, '2026-10-02')).toBe(true);

    // Box 1 -> Box 2 (+3d)
    const rev1 = applyScheduledReviewSubmission(prog, true, new Date('2026-10-02T09:00:00'));
    expect(rev1.newBox).toBe(2);
    expect(rev1.nextProgress.nextReviewDate).toBe('2026-10-05');

    // Box 2 -> Box 3 (+7d)
    const rev2 = applyScheduledReviewSubmission(
      rev1.nextProgress,
      true,
      new Date('2026-10-05T09:00:00')
    );
    expect(rev2.newBox).toBe(3);
    expect(rev2.nextProgress.nextReviewDate).toBe('2026-10-12');

    // Box 3 -> Box 4 (+14d)
    const rev3 = applyScheduledReviewSubmission(
      rev2.nextProgress,
      true,
      new Date('2026-10-12T09:00:00')
    );
    expect(rev3.newBox).toBe(4);
    expect(rev3.nextProgress.nextReviewDate).toBe('2026-10-26');

    // Box 4 -> Box 5 (+30d)
    const rev4 = applyScheduledReviewSubmission(
      rev3.nextProgress,
      true,
      new Date('2026-10-26T09:00:00')
    );
    expect(rev4.newBox).toBe(5);
    expect(rev4.nextProgress.nextReviewDate).toBe('2026-11-25');

    // Box 5 -> stays Box 5 (+30d)
    const rev5 = applyScheduledReviewSubmission(
      rev4.nextProgress,
      true,
      new Date('2026-11-25T09:00:00')
    );
    expect(rev5.newBox).toBe(5);
    expect(rev5.nextProgress.nextReviewDate).toBe('2026-12-25');

    // Now fail a Box 5 review -> must demote to Box 1 and lock out of review queue until 3/3 drill completes!
    const failRev = applyScheduledReviewSubmission(
      rev5.nextProgress,
      false,
      new Date('2026-12-25T09:00:00')
    );
    expect(failRev.event).toBe('review-failed-remediation');
    expect(failRev.nextProgress.box).toBe(1);
    expect(failRev.nextProgress.needsRemediationDrill).toBe(true);
    expect(failRev.nextProgress.currentStreak).toBe(0);
    expect(isCardDueForReview(failRev.nextProgress, '2026-12-25')).toBe(false);

    // Even if passed once, it must NOT graduate early until 3 consecutive repetitions complete
    const rem1 = applyScheduledReviewSubmission(
      failRev.nextProgress,
      true,
      new Date('2026-12-25T09:01:00')
    );
    expect(rem1.nextProgress.needsRemediationDrill).toBe(true);
    expect(rem1.nextProgress.currentStreak).toBe(1);

    const rem2 = applyDrillSubmission(
      rem1.nextProgress,
      true,
      new Date('2026-12-25T09:02:00')
    );
    const rem3 = applyDrillSubmission(
      rem2.nextProgress,
      true,
      new Date('2026-12-25T09:03:00')
    );
    expect(rem3.event).toBe('drill-complete');
    expect(rem3.nextProgress.box).toBe(1);
    expect(rem3.nextProgress.needsRemediationDrill).toBe(false);
    expect(rem3.nextProgress.nextReviewDate).toBe('2026-12-26');
  });

  it('computes daily streaks accurately across continuous and non-continuous study days', () => {
    const streaks = computeStudyStreaks(
      {
        '2026-10-15': { date: '2026-10-15', attempts: 5, successfulRepetitions: 5, mistakes: 0, cardsMastered: 1, reviewsCompleted: 0 },
        '2026-10-16': { date: '2026-10-16', attempts: 4, successfulRepetitions: 4, mistakes: 0, cardsMastered: 1, reviewsCompleted: 0 },
        '2026-10-17': { date: '2026-10-17', attempts: 6, successfulRepetitions: 6, mistakes: 0, cardsMastered: 2, reviewsCompleted: 0 },
        '2026-10-18': { date: '2026-10-18', attempts: 3, successfulRepetitions: 3, mistakes: 0, cardsMastered: 1, reviewsCompleted: 0 },
        '2026-10-21': { date: '2026-10-21', attempts: 3, successfulRepetitions: 3, mistakes: 0, cardsMastered: 1, reviewsCompleted: 0 },
        '2026-10-22': { date: '2026-10-22', attempts: 7, successfulRepetitions: 6, mistakes: 1, cardsMastered: 2, reviewsCompleted: 1 },
      },
      '2026-10-22'
    );
    expect(streaks.currentStreak).toBe(2);
    expect(streaks.longestStreak).toBe(4);
  });
});

describe('5. Data Migration, Corruption Recovery & JSON Import Validation', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('migrates legacy v1 state and clamps invalid numeric fields safely', () => {
    window.localStorage.setItem(
      LEGACY_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        cardsProgress: {
          'w01-01': {
            cardId: 'w01-01',
            box: 3,
            status: 'mastered',
            currentStreak: 99,
            totalAttempts: 5,
            totalMistakes: -4,
            totalSuccessfulRepetitions: 5,
            nextReviewDate: '2026-10-25',
          },
        },
        settings: { theme: 'dark', soundEnabled: false, dailyReviewGoal: 40 },
      })
    );

    const migrated = loadPersistedState();
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.progress['w01-01'].box).toBe(3);
    expect(migrated.progress['w01-01'].currentStreak).toBe(3);
    expect(migrated.progress['w01-01'].totalMistakes).toBe(0);
    expect(migrated.settings.theme).toBe('dark');
    expect(migrated.settings.soundEnabled).toBe(false);
  });

  it('recovers gracefully from corrupted JSON in LocalStorage without crashing', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken_json:: [1, 2');
    const recovered = loadPersistedState();
    expect(recovered.progress).toEqual({});
    expect(window.localStorage.getItem(`${STORAGE_KEY}_corrupted_backup`)).toBe('{broken_json:: [1, 2');
  });

  it('validates valid imports, rejects malformed JSON, and protects progress during merge', () => {
    const badJson = validateImportJson('{not valid json', DEFAULT_CARDS);
    expect(badJson.valid).toBe(false);

    const invalidWeek = validateImportJson(
      JSON.stringify({
        cards: [{ id: 'bad-1', week: 99, question: 'Q?', answer: 'A' }],
      }),
      DEFAULT_CARDS
    );
    expect(invalidWeek.valid).toBe(false);

    const validCustom = validateImportJson(
      JSON.stringify({
        ...EXAMPLE_CUSTOM_DECK,
        cards: [
          { ...EXAMPLE_CUSTOM_DECK.cards[0], unsupportedExtraField: 'ignored-safely' },
          EXAMPLE_CUSTOM_DECK.cards[1],
        ],
      }),
      DEFAULT_CARDS
    );
    expect(validCustom.valid).toBe(true);
    expect(validCustom.cards).toHaveLength(2);
    expect(validCustom.weeksCovered).toEqual([5, 11]);
    expect(validCustom.warnings.some((w) => w.includes('ignored'))).toBe(true);

    // Ensure merge protects existing card progress
    const baseState = migrateAndSanitizeState({
      ...createDefaultAppState(),
      progress: {
        'custom-w05-euclid-01': {
          cardId: 'custom-w05-euclid-01',
          box: 4,
          status: 'mastered',
          needsRemediationDrill: false,
          currentStreak: 3,
          totalAttempts: 6,
          totalMistakes: 0,
          totalSuccessfulRepetitions: 6,
          nextReviewDate: '2026-11-05',
          lastReviewDate: '2026-10-22T00:00:00.000Z',
          completionDate: '2026-10-01T00:00:00.000Z',
        },
      },
    });

    const merged = applyValidatedImport(baseState, DEFAULT_CARDS, validCustom, 'merge');
    expect(merged.customCards).toHaveLength(2);
    expect(merged.progress['custom-w05-euclid-01'].box).toBe(4);
  });
});
