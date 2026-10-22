import React from 'react';
import {
  BarChart3,
  BookMarked,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileJson2,
  Flame,
  GraduationCap,
  LayoutDashboard,
  RefreshCw,
  Settings,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import { COURSE_CODE, CURRICULUM_WEEKS } from '../data/curriculum';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { AppRoute, WeekNumber } from '../types';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { weekStatsList, overallStats } = useSpacedRepetition();

  const go = (route: AppRoute) => {
    onNavigate(route);
    onCloseMobile();
  };

  const navBtnClass = (active: boolean) =>
    `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
      active
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const isMini = collapsed && !isMobileDrawer;

    return (
      <div className="flex h-full flex-col bg-slate-900 text-slate-100 select-none">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          {!isMini && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-mono text-xs font-extrabold text-white shadow-sm">
                UM
              </div>
              <div className="truncate">
                <p className="truncate text-sm font-bold tracking-tight text-white">
                  {COURSE_CODE} Mastery
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  Math for Computing 1
                </p>
              </div>
            </div>
          )}

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isMini ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isMini ? 'Expand sidebar' : 'Collapse sidebar'}
              className="mx-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white sm:mx-0"
            >
              {isMini ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {/* Primary Section */}
          <div className="space-y-1">
            {!isMini && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Core Workspace
              </p>
            )}
            <button
              type="button"
              onClick={() => go({ page: 'dashboard' })}
              title="Dashboard"
              className={navBtnClass(currentRoute.page === 'dashboard')}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {!isMini && <span className="truncate">Dashboard</span>}
            </button>

            <button
              type="button"
              onClick={() =>
                go({
                  page: 'study',
                  mode:
                    overallStats.dueToday + overallStats.remediationPending > 0
                      ? 'daily-review'
                      : 'continue',
                })
              }
              title="Study Today"
              className={navBtnClass(
                currentRoute.page === 'study' &&
                  (currentRoute.mode === 'daily-review' || currentRoute.mode === 'continue')
              )}
            >
              <CalendarCheck2 className="h-4 w-4 shrink-0" />
              {!isMini && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span>Study Today</span>
                  {overallStats.dueToday + overallStats.remediationPending > 0 && (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-950">
                      {overallStats.dueToday + overallStats.remediationPending}
                    </span>
                  )}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => go({ page: 'courses' })}
              title="All Courses"
              className={navBtnClass(currentRoute.page === 'courses')}
            >
              <Compass className="h-4 w-4 shrink-0" />
              {!isMini && <span className="truncate">All Courses</span>}
            </button>
          </div>

          {/* Assessments & Milestone Preparation */}
          <div className="space-y-1">
            {!isMini && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Milestone Prep
              </p>
            )}
            <button
              type="button"
              onClick={() => go({ page: 'test-1' })}
              title="Test 1 Preparation (20%)"
              className={navBtnClass(currentRoute.page === 'test-1')}
            >
              <Target className="h-4 w-4 shrink-0 text-indigo-400" />
              {!isMini && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span>Test 1 Preparation</span>
                  <span className="text-[10px] text-slate-400">20%</span>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => go({ page: 'test-2' })}
              title="Test 2 Preparation (20%)"
              className={navBtnClass(currentRoute.page === 'test-2')}
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-purple-400" />
              {!isMini && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span>Test 2 Preparation</span>
                  <span className="text-[10px] text-slate-400">20%</span>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => go({ page: 'final-exam' })}
              title="Final Examination (50%)"
              className={navBtnClass(currentRoute.page === 'final-exam')}
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-emerald-400" />
              {!isMini && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span>Final Examination</span>
                  <span className="text-[10px] text-slate-400">50%</span>
                </span>
              )}
            </button>
          </div>

          {/* 14-Week Syllabus with Detailed Live Progress Indicators */}
          <div className="space-y-1.5">
            {!isMini && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Curriculum · Weeks 1–14
              </p>
            )}

            {CURRICULUM_WEEKS.map((weekDef) => {
              const stats = weekStatsList.find((w) => w.week === weekDef.week)!;
              const isSelected =
                currentRoute.page === 'week' && currentRoute.week === weekDef.week;

              return (
                <React.Fragment key={weekDef.week}>
                  <button
                    type="button"
                    onClick={() => go({ page: 'week', week: weekDef.week as WeekNumber })}
                    title={`Week ${weekDef.week}: ${weekDef.title} (${stats.masteryPercentage}% mastered)`}
                    className={`w-full rounded-xl p-2.5 text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/25 ring-1 ring-indigo-400 text-white'
                        : 'bg-slate-950/45 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {isMini ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-xs font-bold">W{weekDef.week}</span>
                        <div className="h-1 w-6 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${stats.masteryPercentage}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="line-clamp-1 text-xs font-semibold leading-snug text-slate-100">
                            W{weekDef.week}: {weekDef.title}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] font-bold text-emerald-400">
                            {stats.masteryPercentage}%
                          </span>
                        </div>

                        {/* Visual Progress Indicator */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${stats.masteryPercentage}%` }}
                          />
                        </div>

                        {/* Card Breakdown Counters */}
                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[10px] text-slate-400">
                          <span>{stats.totalCards} cards</span>
                          <span className="text-emerald-400">{stats.masteredCards} mast.</span>
                          <span className="text-sky-400">{stats.learningCards} learn.</span>
                          <span
                            className={
                              stats.dueCards > 0 ? 'font-bold text-amber-400' : 'text-slate-500'
                            }
                          >
                            {stats.dueCards} due
                          </span>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Insert Mid-Semester Break Consolidation right after Week 8 */}
                  {weekDef.week === 8 && (
                    <button
                      type="button"
                      onClick={() => go({ page: 'consolidation' })}
                      title="Mid-Semester Break: Consolidation (Weeks 1–8)"
                      className={`w-full rounded-xl border border-dashed p-2.5 text-left transition ${
                        currentRoute.page === 'consolidation'
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-700 bg-slate-900/80 text-amber-300/90 hover:border-amber-400/60 hover:bg-slate-800'
                      }`}
                    >
                      {isMini ? (
                        <div className="flex justify-center">
                          <RefreshCw className="h-4 w-4 text-amber-400" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          <div className="truncate">
                            <p className="truncate text-xs font-semibold">Mid-Sem Consolidation</p>
                            <p className="truncate text-[10px] text-slate-400">
                              Missed, Overdue & Box 1 (W1–8)
                            </p>
                          </div>
                        </div>
                      )}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Analytics, Data & Preferences */}
          <div className="space-y-1 border-t border-slate-800 pt-4">
            {!isMini && (
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Analytics & Data
              </p>
            )}
            <button
              type="button"
              onClick={() => go({ page: 'statistics' })}
              title="Statistics"
              className={navBtnClass(currentRoute.page === 'statistics')}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              {!isMini && <span className="truncate">Statistics</span>}
            </button>

            <button
              type="button"
              onClick={() => go({ page: 'import-export' })}
              title="Import / Export"
              className={navBtnClass(currentRoute.page === 'import-export')}
            >
              <FileJson2 className="h-4 w-4 shrink-0" />
              {!isMini && <span className="truncate">Import / Export</span>}
            </button>

            <button
              type="button"
              onClick={() => go({ page: 'settings' })}
              title="Settings"
              className={navBtnClass(currentRoute.page === 'settings')}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!isMini && <span className="truncate">Settings</span>}
            </button>
          </div>
        </div>

        {/* Footer Streak & Offline Indicator */}
        {!isMini && (
          <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                {overallStats.currentStreak} day streak
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <BookMarked className="h-3 w-3" />
                {overallStats.totalMastered}/{overallStats.totalUniqueCards}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-800 transition-all duration-200 lg:block ${
          collapsed ? 'w-[4.5rem]' : 'w-80'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebarBody(false)}</div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-80 max-w-[86vw] shadow-2xl">
            {renderSidebarBody(true)}
          </div>
        </div>
      )}
    </>
  );
};
