import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Play, RotateCcw, Sparkles } from 'lucide-react';
import { DrillCard } from '../components/DrillCard';
import { useProgress } from '../hooks/useProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { AppRoute, StudyMode, WeekNumber } from '../types';

interface StudyPageProps {
  mode: StudyMode;
  week?: WeekNumber;
  singleCardId?: string;
  onNavigate: (route: AppRoute) => void;
}

const MODE_LABELS: Record<StudyMode, string> = {
  'daily-review': 'Daily Spaced-Repetition Review Queue',
  continue: 'Continue Course Active-Recall Session',
  'week-learn': 'Weekly Active-Recall Drill',
  'week-review': 'Weekly Due Reviews',
  'week-practice': 'Full Week Extra Practice Drill',
  'consolidation-all': 'Mid-Semester Consolidation · Mixed Weeks 1–8',
  'consolidation-missed': 'Mid-Semester Consolidation · Previously Missed Cards',
  'consolidation-overdue': 'Mid-Semester Consolidation · Overdue & Remediation',
  'consolidation-box1': 'Mid-Semester Consolidation · Box 1 Cards',
  'test-1': 'Test 1 Preparation Mixed Drill',
  'test-2': 'Test 2 Preparation Mixed Drill',
  'final-all': 'Final Examination · Master Cumulative Queue',
  'final-due': 'Final Examination · Due & Overdue Reviews',
  'final-failed': 'Final Examination · Previously Failed Cards',
  'final-formulas': 'Final Examination · Formula Recall Deck',
  'final-definitions': 'Final Examination · Definitions & Theorem Conditions',
  'final-proofs': 'Final Examination · Formal Proof Techniques',
  'final-examples': 'Final Examination · Worked Examples',
  'single-card': 'Targeted Card Drill',
};

export const StudyPage: React.FC<StudyPageProps> = ({
  mode,
  week,
  singleCardId,
  onNavigate,
}) => {
  const { allCards } = useProgress();
  const { buildQueue, overallStats } = useSpacedRepetition();

  const [sessionCardIds, setSessionCardIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Snapshot card IDs at session start so completing a card preserves smooth card-to-card progression
  useEffect(() => {
    const initialCards = buildQueue(mode, week, singleCardId);
    setSessionCardIds(initialCards.map((c) => c.id));
    setCurrentIndex(0);
    setSessionFinished(false);
    // Intentionally snapshot when session parameters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, week, singleCardId]);

  const cardMap = useMemo(() => new Map(allCards.map((c) => [c.id, c])), [allCards]);
  const activeCard = sessionCardIds[currentIndex]
    ? cardMap.get(sessionCardIds[currentIndex]) ?? null
    : null;

  const handleRestartFreshQueue = () => {
    const fresh = buildQueue(mode, week, singleCardId);
    setSessionCardIds(fresh.map((c) => c.id));
    setCurrentIndex(0);
    setSessionFinished(false);
  };

  const handleNextCard = () => {
    if (currentIndex + 1 < sessionCardIds.length) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      setSessionFinished(true);
    }
  };

  const backRoute: AppRoute = week
    ? { page: 'week', week }
    : mode.startsWith('consolidation')
      ? { page: 'consolidation' }
      : mode === 'test-1'
        ? { page: 'test-1' }
        : mode === 'test-2'
          ? { page: 'test-2' }
          : mode.startsWith('final-')
            ? { page: 'final-exam' }
            : { page: 'dashboard' };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Session Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(backRoute)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Overview
          </button>
          <h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
            {MODE_LABELS[mode]}
            {week ? ` — Week ${week}` : ''}
          </h1>
        </div>

        {sessionCardIds.length > 0 && !sessionFinished && (
          <div className="w-full sm:w-52">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Session Progress</span>
              <span>
                {currentIndex + 1} / {sessionCardIds.length}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${Math.round(((currentIndex + 1) / sessionCardIds.length) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Empty Queue State (e.g. Zero Due Reviews Today) */}
      {sessionCardIds.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'daily-review'
              ? 'All Caught Up on Scheduled Reviews!'
              : 'No Cards Match This Filter Yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            {mode === 'daily-review'
              ? `You have 0 cards due right now (${overallStats.totalMastered} mastered across ${overallStats.totalUniqueCards} total cards). Ready to learn new WIX1001 material?`
              : 'Complete weekly drills first or switch modes to study new curriculum cards.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'continue' })}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Play className="h-4 w-4 fill-current" />
              Continue Learning New Cards
            </button>
            <button
              type="button"
              onClick={() => onNavigate(backRoute)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              Return to Overview
            </button>
          </div>
        </div>
      )}

      {/* Active Flashcard Engine */}
      {activeCard && !sessionFinished && (
        <DrillCard
          card={activeCard}
          queueIndex={currentIndex}
          queueTotal={sessionCardIds.length}
          forceReviewIfDue={
            mode === 'daily-review' ||
            mode === 'week-review' ||
            mode === 'consolidation-overdue' ||
            mode === 'final-due'
          }
          onNextCard={handleNextCard}
        />
      )}

      {/* Session Completed State */}
      {sessionFinished && sessionCardIds.length > 0 && (
        <div className="animate-popIn rounded-3xl border-2 border-emerald-300 bg-white p-8 text-center shadow-sm dark:border-emerald-800/70 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
            Session Complete!
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            You completed all {sessionCardIds.length}{' '}
            {sessionCardIds.length === 1 ? 'card' : 'cards'} in this active-recall session. Your
            Leitner boxes, streaks, and next review dates are saved in your browser.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRestartFreshQueue}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Queue
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'dashboard' })}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
