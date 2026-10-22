import React from 'react';
import { ArrowRight, BookOpen, Play, RefreshCw } from 'lucide-react';
import {
  ASSESSMENT_FRAMEWORK,
  CONSOLIDATION_METADATA,
  COURSE_CODE,
  COURSE_TITLE,
  CURRICULUM_WEEKS,
  UNIVERSITY_NAME,
} from '../data/curriculum';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { AppRoute, WeekNumber } from '../types';

interface AllCoursesPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AllCoursesPage: React.FC<AllCoursesPageProps> = ({ onNavigate }) => {
  const { weekStatsList, overallStats } = useSpacedRepetition();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
              {UNIVERSITY_NAME}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {COURSE_CODE}: {COURSE_TITLE} — Complete 14-Week Syllabus
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {overallStats.totalUniqueCards} active-recall flashcards covering definitions, theorem conditions, formulas, formal proofs, and worked examples.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'study', mode: 'continue' })}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <Play className="h-4 w-4 fill-current" />
            Resume Course Queue
          </button>
        </div>

        {/* Assessment Weight Pills */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ASSESSMENT_FRAMEWORK.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {item.weight}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {item.coverageLabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All 14 Weeks + Mid-Semester Consolidation Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {CURRICULUM_WEEKS.map((wDef) => {
          const stats = weekStatsList.find((w) => w.week === wDef.week)!;

          return (
            <React.Fragment key={wDef.week}>
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-bold text-white dark:bg-indigo-600">
                      Week {wDef.week}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.masteryPercentage}% Mastered ({stats.masteredCards}/{stats.totalCards})
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {wDef.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {wDef.summary}
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                      style={{ width: `${stats.masteryPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-3 text-slate-500 dark:text-slate-400">
                      <span>{stats.learningCards} learning</span>
                      <span className={stats.dueCards > 0 ? 'font-bold text-amber-600' : ''}>
                        {stats.dueCards} due
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate({ page: 'week', week: wDef.week as WeekNumber })
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate({
                            page: 'study',
                            mode: 'week-learn',
                            week: wDef.week as WeekNumber,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700"
                      >
                        Drill
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {wDef.week === 8 && (
                <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5 dark:border-amber-800/70 dark:bg-amber-950/20">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-900 dark:text-amber-300">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Dedicated Consolidation Mode
                    </div>
                    <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                      {CONSOLIDATION_METADATA.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {CONSOLIDATION_METADATA.summary}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: 'consolidation' })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                    >
                      Open Consolidation Deck
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
