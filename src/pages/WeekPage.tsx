import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { WeekProgress } from '../components/WeekProgress';
import { CONSOLIDATION_METADATA, getWeekDefinition } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { isCardDueForReview } from '../services/reviewScheduler';
import { AppRoute, StudyMode, WeekNumber } from '../types';

interface WeekPageProps {
  variant: 'week' | 'consolidation' | 'test-1' | 'test-2' | 'final-exam';
  week?: WeekNumber;
  onNavigate: (route: AppRoute) => void;
}

export const WeekPage: React.FC<WeekPageProps> = ({ variant, week = 1, onNavigate }) => {
  const { allCards, resetWeekProgress, removeCustomCard } = useProgress();
  const { progressByCard, weekStatsList, todayStr } = useSpacedRepetition();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const displayedCards = useMemo(() => {
    if (variant === 'week') {
      return allCards.filter((c) => c.week === week);
    }
    if (variant === 'consolidation') {
      return allCards.filter((c) => c.week >= 1 && c.week <= 8);
    }
    if (variant === 'test-1') {
      return allCards.filter((c) => c.week >= 1 && c.week <= 7);
    }
    if (variant === 'test-2') {
      return allCards.filter((c) => c.week === 6 || (c.week >= 8 && c.week <= 13));
    }
    return allCards;
  }, [allCards, variant, week]);

  const deckSummary = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let due = 0;
    let missed = 0;
    let box1 = 0;

    for (const c of displayedCards) {
      const p = progressByCard.get(c.id)!;
      if (p.status === 'mastered') mastered += 1;
      if (p.status === 'learning') learning += 1;
      if (isCardDueForReview(p, todayStr) || p.needsRemediationDrill) due += 1;
      if (p.totalMistakes > 0) missed += 1;
      if (p.box === 1) box1 += 1;
    }

    const total = displayedCards.length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, learning, due, missed, box1, pct };
  }, [displayedCards, progressByCard, todayStr]);

  const weekDef = variant === 'week' ? getWeekDefinition(week) : null;
  const weekStats = variant === 'week' ? weekStatsList.find((w) => w.week === week)! : null;

  const finalRevisionShortcuts: { mode: StudyMode; label: string; sub: string }[] = [
    {
      mode: 'final-all',
      label: 'Full Cumulative Revision',
      sub: `${allCards.length} total cards across Weeks 1–14`,
    },
    {
      mode: 'final-due',
      label: 'Due & Overdue Reviews',
      sub: `${deckSummary.due} cards due or in remediation`,
    },
    {
      mode: 'final-failed',
      label: 'Previously Failed Cards',
      sub: `${deckSummary.missed} cards with ≥ 1 historical mistake`,
    },
    {
      mode: 'final-formulas',
      label: 'Formula Recall Deck',
      sub: `${allCards.filter((c) => c.category === 'formula').length} core WIX1001 formulas`,
    },
    {
      mode: 'final-definitions',
      label: 'Definitions & Theorems',
      sub: `${
        allCards.filter((c) => c.category === 'definition' || c.category === 'concept').length
      } definitions & conditions`,
    },
    {
      mode: 'final-proofs',
      label: 'Formal Proof Techniques',
      sub: `${allCards.filter((c) => c.category === 'proof').length} proof strategies & setups`,
    },
    {
      mode: 'final-examples',
      label: 'Worked Examples Deck',
      sub: `${
        allCards.filter((c) => c.category === 'worked-example').length
      } multi-step problem drills`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Test 1 Milestone Banner (Week 7 or Test 1 Prep View) */}
      {(variant === 'test-1' || (variant === 'week' && week === 7)) && (
        <div className="flex items-start gap-3.5 rounded-2xl border-2 border-indigo-400 bg-indigo-50/90 p-5 text-indigo-950 shadow-2xs dark:border-indigo-500/60 dark:bg-indigo-950/50 dark:text-indigo-100">
          <Target className="mt-0.5 h-6 w-6 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-xs font-extrabold tracking-wider text-indigo-700 uppercase dark:text-indigo-300">
              Test 1 Milestone Assessment Banner · 20% Course Weight
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              This deck contributes directly to your preparation for the <strong>20% Test 1</strong>{' '}
              assessment (planned course scope: Weeks 1–5, with Week 6 Functions included in the
              Week 7 mixed review deck). Flashcard mastery tracks self-assessment readiness and does
              not automatically grant exam marks.
            </p>
          </div>
        </div>
      )}

      {/* Test 2 Milestone Banner (Week 13 or Test 2 Prep View) */}
      {(variant === 'test-2' || (variant === 'week' && week === 13)) && (
        <div className="flex items-start gap-3.5 rounded-2xl border-2 border-purple-400 bg-purple-50/90 p-5 text-purple-950 shadow-2xs dark:border-purple-500/60 dark:bg-purple-950/50 dark:text-purple-100">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-xs font-extrabold tracking-wider text-purple-700 uppercase dark:text-purple-300">
              Test 2 Milestone Assessment Banner · 20% Course Weight
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              This deck contributes directly to your preparation for the <strong>20% Test 2</strong>{' '}
              assessment (planned course scope: Weeks 6–11, with Week 13 synthesizing mixed exam
              problems across Weeks 8–12). Flashcard mastery tracks self-assessment readiness and
              does not automatically grant exam marks.
            </p>
          </div>
        </div>
      )}

      {/* Final Exam Milestone Banner (Week 14 or Final Exam View) */}
      {(variant === 'final-exam' || (variant === 'week' && week === 14)) && (
        <div className="flex items-start gap-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-5 text-emerald-950 shadow-2xs dark:border-emerald-500/60 dark:bg-emerald-950/50 dark:text-emerald-100">
          <GraduationCap className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
              Final Examination Master Revision · 50% Course Weight
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              Comprehensive cumulative revision drawing directly from all 14 weeks of WIX1001 course
              cards plus cross-chapter capstone synthesis problems without duplicating cards.
            </p>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-3xl space-y-2">
            <span className="inline-block rounded-lg bg-indigo-600 px-3 py-1 font-mono text-xs font-bold text-white">
              {variant === 'week'
                ? `Week ${week} of 14`
                : variant === 'consolidation'
                  ? 'Mid-Semester Break (Weeks 1–8)'
                  : variant === 'test-1'
                    ? 'Test 1 Preparation Deck (Weeks 1–7)'
                    : variant === 'test-2'
                      ? 'Test 2 Preparation Deck (Weeks 6, 8–13)'
                      : 'Weeks 1–14 Cumulative Exam Hub'}
            </span>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {variant === 'week' && weekDef
                ? weekDef.title
                : variant === 'consolidation'
                  ? CONSOLIDATION_METADATA.title
                  : variant === 'test-1'
                    ? 'Test 1 Comprehensive Preparation'
                    : variant === 'test-2'
                      ? 'Test 2 Comprehensive Preparation'
                      : 'Final Examination Master Revision'}
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {variant === 'week' && weekDef
                ? weekDef.summary
                : variant === 'consolidation'
                  ? CONSOLIDATION_METADATA.summary
                  : 'Drill definitions, formulas, proofs, and worked exam problems under strict 3-repetition active recall.'}
            </p>

            {weekDef && (
              <ul className="mt-3 space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-300">
                {weekDef.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex shrink-0 flex-wrap gap-2.5">
            {variant === 'week' && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'study', mode: 'week-learn', week })}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Active Drill
                </button>
                {weekStats && weekStats.dueCards > 0 && (
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'study', mode: 'week-review', week })}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    <Clock className="h-4 w-4" />
                    Review Due ({weekStats.dueCards})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'study', mode: 'week-practice', week })}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  Practice All ({displayedCards.length})
                </button>
              </>
            )}

            {variant === 'test-1' && (
              <button
                type="button"
                onClick={() => onNavigate({ page: 'study', mode: 'test-1' })}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch Test 1 Mixed Drill
              </button>
            )}

            {variant === 'test-2' && (
              <button
                type="button"
                onClick={() => onNavigate({ page: 'study', mode: 'test-2' })}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch Test 2 Mixed Drill
              </button>
            )}

            {variant === 'final-exam' && (
              <button
                type="button"
                onClick={() => onNavigate({ page: 'study', mode: 'final-all' })}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Full Exam Revision Queue
              </button>
            )}
          </div>
        </div>

        {/* Summary Progress Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-5 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500">Total Cards</span>
            <p className="font-mono text-lg font-extrabold text-slate-900 dark:text-white">
              {deckSummary.total}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Mastered</span>
            <p className="font-mono text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {deckSummary.mastered} ({deckSummary.pct}%)
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Currently Learning</span>
            <p className="font-mono text-lg font-extrabold text-sky-600 dark:text-sky-400">
              {deckSummary.learning}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Due for Review</span>
            <p className="font-mono text-lg font-extrabold text-amber-600 dark:text-amber-400">
              {deckSummary.due}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-end sm:col-span-1">
            {variant === 'week' && (
              <>
                {!confirmResetOpen ? (
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Week {week}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        resetWeekProgress(week);
                        setConfirmResetOpen(false);
                      }}
                      className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetOpen(false)}
                      className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Mid-Semester Break Consolidation Modes */}
      {variant === 'consolidation' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-2xl border border-rose-200 bg-white p-5 dark:border-rose-900/50 dark:bg-slate-900">
            <div>
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                Previously Missed Cards
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {deckSummary.missed} Weeks 1–8 cards with at least one recorded mistake
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'consolidation-missed' })}
              className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              Drill Missed ({deckSummary.missed})
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-900/50 dark:bg-slate-900">
            <div>
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                Overdue Reviews
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {deckSummary.due} Weeks 1–8 cards due today or awaiting remediation
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'consolidation-overdue' })}
              className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              Review Overdue ({deckSummary.due})
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-indigo-200 bg-white p-5 dark:border-indigo-900/50 dark:bg-slate-900">
            <div>
              <Award className="h-5 w-5 text-indigo-500" />
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                Box 1 Consolidation
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {deckSummary.box1} recently learned or demoted Box 1 cards in Weeks 1–8
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'consolidation-box1' })}
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              Drill Box 1 ({deckSummary.box1})
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-5 dark:border-emerald-900/50 dark:bg-slate-900">
            <div>
              <RefreshCw className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                Mixed Weeks 1–8 Revision
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Prioritizes trouble spots across all {deckSummary.total} Weeks 1–8 cards
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'consolidation-all' })}
              className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Start Mixed Revision
            </button>
          </div>
        </div>
      )}

      {/* Final Examination Master Revision Targeted Launchers (shown on BOTH Week 14 AND Final Exam page!) */}
      {(variant === 'final-exam' || (variant === 'week' && week === 14)) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Cumulative Master Revision Queues (Draws Across All Weeks 1–14 Without Duplicates)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Target specific question types or trouble cards across the entire 14-week syllabus
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {finalRevisionShortcuts.map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() => onNavigate({ page: 'study', mode: item.mode })}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-500"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Launch Deck →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Card Browser */}
      <WeekProgress
        cards={displayedCards}
        progressByCard={progressByCard}
        todayStr={todayStr}
        onStudyCard={(cardId) =>
          onNavigate({ page: 'study', mode: 'single-card', week, cardId })
        }
        onRemoveCustomCard={removeCustomCard}
      />
    </div>
  );
};
