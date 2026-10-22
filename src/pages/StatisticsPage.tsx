import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  BoxDistributionChart,
  StudyActivityCalendar,
  WeeklyProgressChart,
} from '../components/ProgressChart';
import { useProgress } from '../hooks/useProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { AppRoute } from '../types';

interface StatisticsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ onNavigate }) => {
  const { state, resetStatistics } = useProgress();
  const { overallStats, weekStatsList, calendarHeatmap } = useSpacedRepetition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const totalReviewsCompletedEver = Object.values(state.dailyHistory).reduce(
    (sum, day) => sum + day.reviewsCompleted,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Learning Analytics & Spaced-Repetition Statistics
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Computed dynamically from your LocalStorage records — repeated attempts never inflate unique card counts.
          </p>
        </div>

        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Statistics & Progress
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 dark:border-rose-800 dark:bg-rose-950/70">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
              Permanently reset all statistics?
            </span>
            <button
              type="button"
              onClick={() => {
                resetStatistics();
                setConfirmOpen(false);
              }}
              className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Total Unique Cards</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallStats.totalUniqueCards}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Currently Learning</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-sky-600 dark:text-sky-400">
            {overallStats.totalLearning}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Cards Mastered</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {overallStats.totalMastered}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Due Today</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {overallStats.dueToday}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Reviews Completed</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {totalReviewsCompletedEver}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Today’s Exact Reps</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallStats.todayActivity.successfulRepetitions}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Accuracy Rate</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {overallStats.accuracyRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Mistake Rate</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {overallStats.mistakeRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Current Study Streak</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-orange-600 dark:text-orange-400">
            {overallStats.currentStreak}d
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500">Longest Study Streak</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {overallStats.longestStreak}d
          </p>
        </div>
      </div>

      {/* Leitner Box Distribution */}
      <BoxDistributionChart
        distribution={overallStats.boxDistribution}
        totalCards={overallStats.totalUniqueCards}
      />

      {/* Weekly Mastery Bar Chart */}
      <WeeklyProgressChart
        weekStatsList={weekStatsList}
        onSelectWeek={(week) => onNavigate({ page: 'week', week })}
      />

      {/* 12-Week Calendar Heatmap + 14-Day Daily Repetitions */}
      <StudyActivityCalendar cells={calendarHeatmap} />
    </div>
  );
};
