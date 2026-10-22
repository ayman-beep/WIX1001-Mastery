import React from 'react';
import {
  ArrowRight,
  Award,
  BookCheck,
  CalendarClock,
  CheckCircle2,
  Flame,
  GraduationCap,
  Info,
  Play,
  Repeat,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { ASSESSMENT_FRAMEWORK, COURSE_CODE, COURSE_TITLE, UNIVERSITY_NAME } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { AppRoute, WeekNumber } from '../types';
import { WeeklyProgressChart } from './ProgressChart';

interface DashboardProps {
  onNavigate: (route: AppRoute) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { state } = useProgress();
  const { overallStats, weekStatsList, upcomingSchedule } = useSpacedRepetition();

  const dailyGoal = state.settings.dailyReviewGoal;
  const doneToday =
    overallStats.todayActivity.reviewsCompleted + overallStats.todayActivity.cardsMastered;
  const dailyGoalPct = Math.min(100, Math.round((doneToday / Math.max(1, dailyGoal)) * 100));

  const computeReadinessForWeeks = (weeks: WeekNumber[]) => {
    const selected = weekStatsList.filter((w) => weeks.includes(w.week));
    const total = selected.reduce((acc, w) => acc + w.totalCards, 0);
    const mastered = selected.reduce((acc, w) => acc + w.masteredCards, 0);
    return {
      total,
      mastered,
      pct: total > 0 ? Math.round((mastered / total) * 100) : 0,
    };
  };

  const test1Readiness = computeReadinessForWeeks([1, 2, 3, 4, 5, 6, 7]);
  const test2Readiness = computeReadinessForWeeks([6, 8, 9, 10, 11, 12, 13]);
  const finalReadiness = computeReadinessForWeeks([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]);

  return (
    <div className="space-y-6">
      {/* Hero Banner with Primary Action Buttons */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 text-white shadow-sm sm:p-8 dark:border-slate-800">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
              <span>{COURSE_CODE}</span>
              <span>·</span>
              <span>{UNIVERSITY_NAME}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {COURSE_TITLE}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Chessable-style strict active recall with 3-consecutive-repetition mastery drills and
              5-box Leitner spaced-repetition scheduling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'continue' })}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <Play className="h-4 w-4 fill-current" />
              Continue Studying
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'study', mode: 'daily-review' })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
            >
              <CalendarClock className="h-4 w-4 text-amber-300" />
              Start Daily Review
              <span className="rounded-full bg-amber-400 px-2 py-0.5 font-mono text-xs font-extrabold text-slate-950">
                {overallStats.dueToday + overallStats.remediationPending}
              </span>
            </button>
          </div>
        </div>

        {/* Daily Goal & Course Completion Progress Strip */}
        <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Weekly Syllabus Completion ({overallStats.totalLearned} / {overallStats.totalUniqueCards} learned)</span>
              <span className="font-mono font-bold text-indigo-300">
                {overallStats.courseCompletionPercentage}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-all duration-300"
                style={{ width: `${overallStats.courseCompletionPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>
                Today’s Study Goal ({doneToday} / {dailyGoal} cards mastered or reviewed)
              </span>
              <span className="font-mono font-bold text-emerald-300">{dailyGoalPct}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${dailyGoalPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid (6 real-time KPI cards) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Cards Learned</span>
            <BookCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallStats.totalLearned}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            of {overallStats.totalUniqueCards} unique cards
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Cards Mastered</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {overallStats.totalMastered}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {overallStats.courseMasteryPercentage}% active mastery
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Reviews Due Today</span>
            <CalendarClock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {overallStats.dueToday}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {overallStats.remediationPending > 0
              ? `+ ${overallStats.remediationPending} in remediation`
              : 'Up to date on queue'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Study Streak</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallStats.currentStreak}{' '}
            <span className="font-sans text-xs font-medium text-slate-500">days</span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Best: {overallStats.longestStreak} days
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Exact Repetitions</span>
            <Repeat className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallStats.totalSuccessfulRepetitions}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Accuracy: {overallStats.accuracyRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Weekly Progress</span>
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {weekStatsList.filter((w) => w.masteryPercentage === 100).length} / 14
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Weeks 100% mastered</p>
        </div>
      </div>

      {/* Assessment Milestone Cards (Test 1, Test 2, Final Examination) */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-200 bg-white p-5 shadow-2xs dark:border-indigo-900/60 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                <Target className="h-3.5 w-3.5" />
                Milestone · 20% Course Weight
              </span>
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {test1Readiness.pct}% Ready
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Test 1 Preparation
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Covers Weeks 1–5 core material plus Week 6 Functions & Week 7 mixed exam drills (
              {test1Readiness.mastered}/{test1Readiness.total} cards mastered).
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${test1Readiness.pct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'test-1' })}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
            >
              Open Test 1 Prep Deck
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-purple-200 bg-white p-5 shadow-2xs dark:border-purple-900/60 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Milestone · 20% Course Weight
              </span>
              <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                {test2Readiness.pct}% Ready
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Test 2 Preparation
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Covers Weeks 6–11 course planning scope & Week 13 mixed review deck spanning Weeks
              8–12 ({test2Readiness.mastered}/{test2Readiness.total} cards mastered).
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-purple-600 transition-all"
                style={{ width: `${test2Readiness.pct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'test-2' })}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100 dark:bg-purple-950/80 dark:text-purple-300 dark:hover:bg-purple-900/70"
            >
              Open Test 2 Prep Deck
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-5 shadow-2xs dark:border-emerald-900/60 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                <GraduationCap className="h-3.5 w-3.5" />
                Milestone · 50% Course Weight
              </span>
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {finalReadiness.pct}% Ready
              </span>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Final Examination Master Revision
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Comprehensive Weeks 1–14 cumulative mastery including formulas, proofs, worked
              examples & missed cards ({finalReadiness.mastered}/{finalReadiness.total} mastered).
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${finalReadiness.pct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'final-exam' })}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 dark:hover:bg-emerald-900/70"
            >
              Open Final Revision Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week-by-Week Progress Chart */}
      <WeeklyProgressChart
        weekStatsList={weekStatsList}
        onSelectWeek={(week) => onNavigate({ page: 'week', week })}
      />

      {/* Upcoming Review Schedule + Course Assessment Framework */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming 10-Day Spaced-Repetition Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Review Schedule (Next 10 Days)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Computed from local card review timestamps across Leitner Boxes 1–5
          </p>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {upcomingSchedule.map((item, idx) => (
              <div
                key={item.date}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      idx === 0 && item.count > 0
                        ? 'bg-amber-500'
                        : item.count > 0
                          ? 'bg-indigo-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                    idx === 0 && item.count > 0
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : item.count > 0
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'text-slate-400'
                  }`}
                >
                  {item.count} {item.count === 1 ? 'card' : 'cards'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Course & Assessment Planning Framework */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            WIX1001 Course & Assessment Planning Framework
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Course weight structure vs. self-paced active-recall mastery
          </p>

          <div className="mt-4 space-y-3">
            {ASSESSMENT_FRAMEWORK.map((item) => {
              const readiness = computeReadinessForWeeks(item.relatedWeeks);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="rounded bg-slate-200/80 px-2 py-0.5 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {item.weight}% Weight
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Deck Mastery: {readiness.pct}% ({readiness.mastered}/{readiness.total})
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {item.coverageLabel}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.deckNote}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p>
              <strong>Academic Note:</strong> Stated coverage ranges represent course-planning
              reference data rather than official university examination specifications. Completing
              flashcards builds personal active-recall mastery and never automatically awards
              course or examination marks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
