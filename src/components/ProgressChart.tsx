import React from 'react';
import { CURRICULUM_WEEKS } from '../data/curriculum';
import { DailyActivity, LeitnerBox, WeekNumber, WeekStats } from '../types';

interface WeeklyChartProps {
  weekStatsList: WeekStats[];
  onSelectWeek?: (week: WeekNumber) => void;
}

export const WeeklyProgressChart: React.FC<WeeklyChartProps> = ({
  weekStatsList,
  onSelectWeek,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Week-by-Week Mastery Progress (Weeks 1–14)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any week bar to inspect its flashcards and active-recall status
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
            Mastered
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-indigo-400" />
            Learning
          </span>
        </div>
      </div>

      {/* Vertical responsive column chart across Weeks 1–14 */}
      <div className="grid grid-cols-7 gap-2.5 sm:grid-cols-14">
        {weekStatsList.map((ws) => {
          const def = CURRICULUM_WEEKS.find((d) => d.week === ws.week)!;
          const learnPct =
            ws.totalCards > 0 ? Math.round((ws.learningCards / ws.totalCards) * 100) : 0;

          return (
            <button
              key={ws.week}
              type="button"
              onClick={() => onSelectWeek?.(ws.week)}
              title={`Week ${ws.week} (${def.shortTitle}): ${ws.masteredCards}/${ws.totalCards} mastered (${ws.masteryPercentage}%)`}
              className="group flex flex-col items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800/60"
            >
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {ws.masteryPercentage}%
              </span>

              <div className="relative flex h-32 w-full max-w-[1.8rem] flex-col justify-end overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                {learnPct > 0 && (
                  <div
                    className="w-full bg-indigo-400 transition-all duration-300"
                    style={{ height: `${learnPct}%` }}
                  />
                )}
                <div
                  className="w-full bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
                  style={{ height: `${ws.masteryPercentage}%` }}
                />
              </div>

              <span className="font-mono text-xs font-bold text-slate-700 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                W{ws.week}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface BoxDistributionProps {
  distribution: Record<LeitnerBox, number>;
  totalCards: number;
}

const BOX_METADATA: { box: LeitnerBox; label: string; interval: string; color: string }[] = [
  { box: 0, label: 'Unboxed (New / Drill)', interval: 'Unscheduled', color: 'bg-slate-400' },
  { box: 1, label: 'Box 1', interval: '1-day interval', color: 'bg-amber-500' },
  { box: 2, label: 'Box 2', interval: '3-day interval', color: 'bg-sky-500' },
  { box: 3, label: 'Box 3', interval: '7-day interval', color: 'bg-indigo-500' },
  { box: 4, label: 'Box 4', interval: '14-day interval', color: 'bg-purple-500' },
  { box: 5, label: 'Box 5 (Long-Term)', interval: '30-day interval', color: 'bg-emerald-500' },
];

export const BoxDistributionChart: React.FC<BoxDistributionProps> = ({
  distribution,
  totalCards,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Leitner Spaced-Repetition Box Distribution
      </h3>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        Reviews advance one box on success and return to Box 1 (+ 3/3 drill) on any mistake
      </p>

      <div className="mt-5 space-y-3.5">
        {BOX_METADATA.map((item) => {
          const count = distribution[item.box];
          const pct = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

          return (
            <div key={item.box} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.label}{' '}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    · {item.interval}
                  </span>
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                  {count} cards ({pct}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ActivityCalendarProps {
  cells: DailyActivity[];
}

export const StudyActivityCalendar: React.FC<ActivityCalendarProps> = ({ cells }) => {
  const intensityClass = (attempts: number) => {
    if (attempts === 0) return 'bg-slate-100 dark:bg-slate-800/90';
    if (attempts < 5) return 'bg-emerald-200 dark:bg-emerald-900/80';
    if (attempts < 15) return 'bg-emerald-400 dark:bg-emerald-700';
    if (attempts < 30) return 'bg-emerald-500 dark:bg-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  const recent14 = cells.slice(-14);
  const maxReps = Math.max(1, ...recent14.map((c) => c.successfulRepetitions));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Study Activity Calendar (Last 12 Weeks)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recorded directly from your local active-recall submissions
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Less</span>
            {[0, 3, 10, 20, 35].map((n) => (
              <span key={n} className={`h-3 w-3 rounded-xs ${intensityClass(n)}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="grid min-w-[440px] grid-flow-col grid-rows-7 gap-1.5">
            {cells.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.successfulRepetitions} exact repetitions, ${day.reviewsCompleted} reviews, ${day.mistakes} mistakes`}
                className={`h-4 w-4 rounded-xs transition hover:ring-2 hover:ring-indigo-500 ${intensityClass(
                  day.attempts
                )}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Daily Successful Repetitions & Review History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Daily Successful Repetitions & Review Completion (Past 14 Days)
        </h3>
        <div className="mt-5 grid grid-cols-7 gap-2 sm:grid-cols-14">
          {recent14.map((day) => {
            const pct = Math.round((day.successfulRepetitions / maxReps) * 100);
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.successfulRepetitions} successful repetitions, ${day.reviewsCompleted} scheduled reviews completed`}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  {day.successfulRepetitions}
                </span>
                <div className="flex h-24 w-full max-w-[1.5rem] items-end overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                  <div
                    className="w-full rounded-t-md bg-indigo-500 transition-all duration-300"
                    style={{ height: `${day.successfulRepetitions > 0 ? Math.max(pct, 8) : 0}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
