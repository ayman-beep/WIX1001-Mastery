import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  EyeOff,
  Flame,
  HelpCircle,
  Info,
  Keyboard,
  Layers,
  Play,
  Sparkles,
} from 'lucide-react';
import { getWeekDefinition } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { evaluateCardAnswer } from '../services/answerNormalizer';
import { audioService } from '../services/audioService';
import {
  getLocalDateString,
  isCardDueForReview,
  REQUIRED_STREAK,
  TransitionOutcome,
} from '../services/reviewScheduler';
import { AnswerCheckResult, Flashcard, LeitnerBox } from '../types';
import { AnswerInput } from './AnswerInput';
import { KaTeXFormula, KaTeXText } from './KaTeXText';
import { MistakeModal } from './MistakeModal';

type CardPhase = 'study' | 'drill' | 'review' | 'mistake' | 'complete';

interface DrillCardProps {
  card: Flashcard;
  queueIndex: number;
  queueTotal: number;
  /** Only true in explicit due-review queues; learning/week/continue always open Guided Study + Type-Out first! */
  forceReviewIfDue?: boolean;
  onNextCard: () => void;
}

export const DrillCard: React.FC<DrillCardProps> = ({
  card,
  queueIndex,
  queueTotal,
  forceReviewIfDue = false,
  onNextCard,
}) => {
  const {
    state,
    getCardProgress,
    markDrillStarted,
    submitDrillAttempt,
    submitReviewAttempt,
  } = useProgress();

  const progress = getCardProgress(card.id);
  const weekDef = getWeekDefinition(card.week);
  const soundEnabled = state.settings.soundEnabled;

  const computeInitialPhase = useCallback((): CardPhase => {
    const today = getLocalDateString();
    if (progress.needsRemediationDrill) {
      return 'study';
    }
    if (forceReviewIfDue && isCardDueForReview(progress, today)) {
      return 'review';
    }
    return 'study';
  }, [forceReviewIfDue, progress]);

  const [phase, setPhase] = useState<CardPhase>(computeInitialPhase);
  const [inputValue, setInputValue] = useState('');
  const [studyFeedback, setStudyFeedback] = useState<AnswerCheckResult | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState('');
  const [mistakeCheck, setMistakeCheck] = useState<AnswerCheckResult | null>(null);
  const [demotedFromBox, setDemotedFromBox] = useState<LeitnerBox | null>(null);
  const [lastSuccessToast, setLastSuccessToast] = useState<string | null>(null);
  const [completionOutcome, setCompletionOutcome] = useState<TransitionOutcome | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);

  const submissionLockRef = useRef(false);

  // Reset local card UI cleanly whenever active card changes
  useEffect(() => {
    submissionLockRef.current = false;
    setPhase(computeInitialPhase());
    setInputValue('');
    setStudyFeedback(null);
    setLastSubmitted('');
    setMistakeCheck(null);
    setDemotedFromBox(null);
    setLastSuccessToast(null);
    setCompletionOutcome(null);
    setFocusNonce((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  // Allow pressing Enter on completion view to load the next card smoothly
  useEffect(() => {
    if (phase !== 'complete') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNextCard();
      }
    };
    const timer = window.setTimeout(() => {
      window.addEventListener('keydown', onKey);
    }, 120);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [onNextCard, phase]);

  // Live check in Phase 1 (Guided Study & Type-Out) so students see instant green match confirmation as they type!
  const liveStudyMatch = useMemo(() => {
    if (phase !== 'study' || !inputValue.trim()) return false;
    return evaluateCardAnswer(inputValue, card).isCorrect;
  }, [card, inputValue, phase]);

  const handleStartDrill = (withWarmupCelebration = false) => {
    markDrillStarted(card.id);
    setInputValue('');
    setStudyFeedback(null);
    setLastSuccessToast(
      withWarmupCelebration
        ? `Guided practice matched! Answer is now hidden — answer the question ${REQUIRED_STREAK} times in a row from memory (0 / ${REQUIRED_STREAK}).`
        : null
    );
    setPhase('drill');
    setFocusNonce((n) => n + 1);
  };

  const handleGuidedPracticeSubmit = () => {
    if (phase !== 'study') return;
    const check = evaluateCardAnswer(inputValue, card);
    if (check.isCorrect) {
      audioService.playRepetitionHit(soundEnabled, 1);
      handleStartDrill(true);
    } else {
      setStudyFeedback(check);
    }
  };

  const handleSubmit = () => {
    if (submissionLockRef.current) return;
    if (phase !== 'drill' && phase !== 'review') return;

    submissionLockRef.current = true;
    try {
      const check = evaluateCardAnswer(inputValue, card);

      if (phase === 'review') {
        const outcome = submitReviewAttempt(card.id, check.isCorrect);
        if (check.isCorrect && outcome.event === 'review-passed') {
          audioService.playCardSuccess(soundEnabled);
          setInputValue('');
          setCompletionOutcome(outcome);
          setPhase('complete');
        } else {
          audioService.playMistakeReset(soundEnabled);
          setLastSubmitted(inputValue);
          setMistakeCheck(check);
          setDemotedFromBox(outcome.previousBox);
          setInputValue('');
          setPhase('mistake');
        }
        return;
      }

      // Phase 2: Hidden-answer 3-consecutive-repetition active recall test
      const outcome = submitDrillAttempt(card.id, check.isCorrect);

      if (!check.isCorrect) {
        audioService.playMistakeReset(soundEnabled);
        setLastSubmitted(inputValue);
        setMistakeCheck(check);
        setDemotedFromBox(outcome.previousBox >= 1 ? outcome.previousBox : null);
        setInputValue('');
        setPhase('mistake');
        return;
      }

      setInputValue('');
      if (outcome.event === 'drill-complete') {
        audioService.playCardSuccess(soundEnabled);
        setLastSuccessToast(null);
        setCompletionOutcome(outcome);
        setPhase('complete');
      } else {
        const streakNow = outcome.nextProgress.currentStreak;
        audioService.playRepetitionHit(soundEnabled, streakNow);
        setLastSuccessToast(
          `Repetition ${streakNow} / ${REQUIRED_STREAK} exact! ${
            REQUIRED_STREAK - streakNow
          } more consecutive ${
            REQUIRED_STREAK - streakNow === 1 ? 'repetition' : 'repetitions'
          } to complete.`
        );
        setFocusNonce((n) => n + 1);
      }
    } finally {
      submissionLockRef.current = false;
    }
  };

  const handleTryAgainAfterMistake = () => {
    setMistakeCheck(null);
    setLastSuccessToast(null);
    setInputValue('');
    setPhase('drill');
    setFocusNonce((n) => n + 1);
  };

  const handleReturnToGuidedStudyAfterMistake = () => {
    setMistakeCheck(null);
    setStudyFeedback(null);
    setLastSuccessToast(null);
    setInputValue('');
    setPhase('study');
    setFocusNonce((n) => n + 1);
  };

  const displayStreak =
    phase === 'drill'
      ? progress.status === 'mastered' &&
        !progress.needsRemediationDrill &&
        progress.currentStreak === REQUIRED_STREAK
        ? 0
        : progress.currentStreak
      : 0;

  return (
    <div className="space-y-5">
      {/* Top Card Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
            Week {card.week}
          </span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {card.topic}
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {card.category.replace('-', ' ')}
          </span>
          {card.isCustom && (
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Custom Deck
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            {progress.box === 0 ? 'Unboxed (New)' : `Leitner Box ${progress.box}`}
          </span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Card {queueIndex + 1} / {queueTotal}
          </span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        {/* Two-Stage Learning Flow Bar */}
        {phase !== 'review' && phase !== 'complete' && (
          <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                phase === 'study'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:border-indigo-500/70 dark:bg-indigo-950/60 dark:text-indigo-200'
                  : 'border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400'
              }`}
            >
              <Keyboard className="h-4 w-4 shrink-0" />
              <span>1. Study Answer & Practice Typing</span>
            </div>

            <div
              className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                phase === 'drill' || phase === 'mistake'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:border-indigo-500/70 dark:bg-indigo-950/60 dark:text-indigo-200'
                  : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-500'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <EyeOff className="h-4 w-4 shrink-0" />
                <span>2. Recall Test (3 / 3 From Memory)</span>
              </span>
              <span className="font-mono font-bold">
                {phase === 'drill'
                  ? `${displayStreak} / ${REQUIRED_STREAK}`
                  : `0 / ${REQUIRED_STREAK}`}
              </span>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            WIX1001 · {weekDef.shortTitle}
          </span>

          {phase === 'drill' && (
            <div
              className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 dark:border-indigo-500/40 dark:bg-indigo-950/60"
              aria-live="polite"
            >
              <Flame className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-mono text-xs font-bold text-indigo-800 dark:text-indigo-200">
                Streak: {displayStreak} / {REQUIRED_STREAK}
              </span>
              <div className="flex items-center gap-1 pl-1">
                {[0, 1, 2].map((pip) => (
                  <span
                    key={pip}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                      pip < displayStreak
                        ? 'scale-110 bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === 'review' && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
              Scheduled Review Check · Box {progress.box} → Box {Math.min(5, progress.box + 1)}
            </span>
          )}
        </div>

        {/* ====================================================================
            TOP STUDY CARD (Shown ONLY in Phase 1 Study Mode):
            1. Expected Answer Reference at Top
            2. Explanation & Derivation
           ==================================================================== */}
        {phase === 'study' && (
          <div className="mb-6 space-y-4 animate-popIn">
            {progress.needsRemediationDrill && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/50 dark:text-amber-200">
                Remediation Practice: Study the expected answer below, practice answering the question with the Live Preview, then complete 3 consecutive recall checks from memory.
              </div>
            )}

            <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/55 p-5 dark:border-indigo-500/35 dark:bg-indigo-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
                  <BookOpen className="h-4 w-4" />
                  Phase 1 · Study Complete Expected Answer
                </span>
                <span className="rounded-md bg-white/80 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Format: {card.formatHint}
                </span>
              </div>

              {card.answerLatex && (
                <div className="my-4 overflow-x-auto rounded-xl bg-white p-4 text-center text-lg shadow-2xs dark:bg-slate-900">
                  <KaTeXFormula latex={card.answerLatex} displayMode />
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/90 px-4 py-2.5 dark:bg-slate-900/90">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Expected Answer
                  </span>
                  <p className="mt-0.5 font-mono text-base font-bold text-indigo-950 dark:text-indigo-200">
                    {card.answer}
                  </p>
                </div>
                {card.acceptedVariants && card.acceptedVariants.length > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-slate-400">
                      Also accepted:
                    </span>
                    <p className="font-mono text-xs text-slate-600 dark:text-slate-300">
                      {card.acceptedVariants.slice(0, 2).join('  ·  ')}
                    </p>
                  </div>
                )}
              </div>

              {card.explanation && (
                <div className="mt-3 rounded-lg border border-indigo-100 bg-white/80 p-3.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                  <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Explanation & Worked Derivation
                  </p>
                  <KaTeXText text={card.explanation} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            PRACTICE & RECALL AREA:
            - Question ALWAYS sits cleanly RIGHT ABOVE the Answer Input Place!
            - Answer Input Place + Math Symbol Toolbar + Live Preview sit RIGHT BELOW Question!
           ==================================================================== */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/55 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/45">
          {phase === 'study' && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-200">
                Guided Type-Out Practice
              </p>

              {liveStudyMatch && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Exact Match! Press Enter to Start 0 / 3 Recall
                </span>
              )}
            </div>
          )}

          {/* QUESTION — DIRECTLY ABOVE THE ANSWER PLACE! */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
              <HelpCircle className="h-3.5 w-3.5" />
              Question
            </p>
            <div className="text-base font-medium text-slate-900 sm:text-lg dark:text-slate-100">
              <KaTeXText text={card.question} />
            </div>
          </div>

          {/* ANSWER PLACE — RIGHT BELOW QUESTION */}
          {phase === 'study' && (
            <div className="space-y-3">
              {studyFeedback && !liveStudyMatch && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-200">
                  <p className="font-bold">
                    Check difference against <code className="font-mono">{card.answer}</code>:
                  </p>
                  <div className="mt-1 break-all font-mono">
                    {studyFeedback.submittedSegments.map((seg, i) =>
                      seg.type === 'unexpected' ? (
                        <span
                          key={i}
                          className="rounded bg-rose-200 px-1 font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-100"
                        >
                          {seg.text}
                        </span>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      )
                    )}
                  </div>
                </div>
              )}

              <AnswerInput
                value={inputValue}
                onChange={(val) => {
                  setInputValue(val);
                  if (studyFeedback) setStudyFeedback(null);
                }}
                onSubmit={handleGuidedPracticeSubmit}
                autoFocusKey={`study-${card.id}-${focusNonce}`}
                placeholder={`Type "${card.answer}" here and check your Live Preview below...`}
                submitLabel="Practice Done → Start 0 / 3 Recall"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Or skip warmup and jump straight into the hidden-answer 0 / 3 recall test:
                </p>
                <button
                  type="button"
                  onClick={() => handleStartDrill(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Start Drill (Hide Answer · 0 / 3)
                </button>
              </div>
            </div>
          )}

          {(phase === 'drill' || phase === 'review') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Info className="h-3.5 w-3.5 text-indigo-500" />
                  Expected format: <span className="font-mono font-semibold">{card.formatHint}</span>
                </span>
                <span>
                  {phase === 'review'
                    ? 'Single active-recall check (any mistake resets to Box 1 + 0/3 drill)'
                    : 'Expected answer hidden — complete 3 consecutive exact checks'}
                </span>
              </div>

              {lastSuccessToast && (
                <div
                  role="status"
                  aria-live="polite"
                  className="animate-pulseSuccess flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-200"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{lastSuccessToast}</span>
                </div>
              )}

              <AnswerInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                autoFocusKey={`drill-${card.id}-${focusNonce}`}
                submitLabel={
                  phase === 'review'
                    ? 'Submit Review Answer'
                    : `Verify Repetition ${displayStreak + 1} of ${REQUIRED_STREAK}`
                }
              />
            </div>
          )}

          {phase === 'mistake' && mistakeCheck && (
            <MistakeModal
              card={card}
              submittedRaw={lastSubmitted}
              checkResult={mistakeCheck}
              demotedFromBox={demotedFromBox}
              onTryAgain={handleTryAgainAfterMistake}
              onReturnToStudy={handleReturnToGuidedStudyAfterMistake}
            />
          )}

          {phase === 'complete' && completionOutcome && (
            <div className="animate-popIn rounded-2xl border-2 border-emerald-400/80 bg-emerald-50/80 p-6 dark:border-emerald-600/50 dark:bg-emerald-950/30">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-2xl bg-emerald-600 p-3 text-white shadow-sm">
                    {completionOutcome.event === 'review-passed' ? (
                      <Sparkles className="h-6 w-6" />
                    ) : (
                      <Award className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                      {completionOutcome.event === 'review-passed'
                        ? `Scheduled Review Passed — Advanced to Box ${completionOutcome.newBox}!`
                        : '3 / 3 Consecutive Repetitions Complete — Card Mastered!'}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                      Next spaced-repetition review scheduled for{' '}
                      <span className="font-mono font-bold">
                        {completionOutcome.nextProgress.nextReviewDate}
                      </span>{' '}
                      ({completionOutcome.intervalDays}{' '}
                      {completionOutcome.intervalDays === 1 ? 'day' : 'days'} from today in{' '}
                      <span className="font-semibold">Leitner Box {completionOutcome.newBox}</span>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-medium text-slate-500">Leitner Box</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white">
                    Box {completionOutcome.newBox} / 5
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-medium text-slate-500">Total Repetitions</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {completionOutcome.nextProgress.totalSuccessfulRepetitions}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-medium text-slate-500">Total Attempts</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white">
                    {completionOutcome.nextProgress.totalAttempts}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                  <p className="text-[11px] font-medium text-slate-500">Total Mistakes</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-rose-600 dark:text-rose-400">
                    {completionOutcome.nextProgress.totalMistakes}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={onNextCard}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  {queueIndex + 1 < queueTotal ? 'Next Card' : 'Finish Session'}
                  <ArrowRight className="h-4 w-4" />
                  <span className="hidden rounded bg-emerald-500/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                    Enter
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
