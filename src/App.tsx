import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Menu, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { ImportExport } from './components/ImportExport';
import { Sidebar } from './components/Sidebar';
import { COURSE_CODE } from './data/curriculum';
import { ProgressProvider, useProgress } from './hooks/useProgress';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { AllCoursesPage } from './pages/AllCoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { StudyPage } from './pages/StudyPage';
import { WeekPage } from './pages/WeekPage';
import { isValidWeekNumber } from './services/storageService';
import { AppRoute, StudyMode, WeekNumber } from './types';

function routeToHash(route: AppRoute): string {
  switch (route.page) {
    case 'dashboard':
      return '#/dashboard';
    case 'courses':
      return '#/courses';
    case 'week':
      return `#/week/${route.week}`;
    case 'consolidation':
      return '#/consolidation';
    case 'test-1':
      return '#/test-1';
    case 'test-2':
      return '#/test-2';
    case 'final-exam':
      return '#/final-exam';
    case 'statistics':
      return '#/statistics';
    case 'import-export':
      return '#/import-export';
    case 'settings':
      return '#/settings';
    case 'study': {
      const parts = ['#/study', route.mode];
      if (route.week) parts.push(`w${route.week}`);
      if (route.cardId) parts.push(encodeURIComponent(route.cardId));
      return parts.join('/');
    }
  }
}

function parseHashToRoute(hash: string): AppRoute {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned || cleaned === 'dashboard') return { page: 'dashboard' };
  const segments = cleaned.split('/');

  if (segments[0] === 'courses') return { page: 'courses' };
  if (segments[0] === 'consolidation') return { page: 'consolidation' };
  if (segments[0] === 'test-1') return { page: 'test-1' };
  if (segments[0] === 'test-2') return { page: 'test-2' };
  if (segments[0] === 'final-exam') return { page: 'final-exam' };
  if (segments[0] === 'statistics') return { page: 'statistics' };
  if (segments[0] === 'import-export') return { page: 'import-export' };
  if (segments[0] === 'settings') return { page: 'settings' };

  if (segments[0] === 'week') {
    const wk = Number(segments[1]);
    if (isValidWeekNumber(wk)) {
      return { page: 'week', week: wk };
    }
  }

  if (segments[0] === 'study') {
    const mode = (segments[1] as StudyMode) || 'continue';
    let week: WeekNumber | undefined;
    let cardId: string | undefined;
    for (const extra of segments.slice(2)) {
      if (/^w\d+$/.test(extra)) {
        const parsedWk = Number(extra.slice(1));
        if (isValidWeekNumber(parsedWk)) week = parsedWk;
      } else {
        cardId = decodeURIComponent(extra);
      }
    }
    return { page: 'study', mode, week, cardId };
  }

  return { page: 'dashboard' };
}

const AppShell: React.FC = () => {
  const { state, diagnostics, updateSettings } = useProgress();
  const { overallStats } = useSpacedRepetition();
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseHashToRoute(window.location.hash) : { page: 'dashboard' }
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    const hash = routeToHash(nextRoute);
    if (typeof window !== 'undefined' && window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashToRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        currentRoute={route}
        onNavigate={navigate}
        collapsed={state.settings.sidebarCollapsed}
        onToggleCollapse={() =>
          updateSettings({ sidebarCollapsed: !state.settings.sidebarCollapsed })
        }
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Utility Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-slate-800/90 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation sidebar"
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {COURSE_CODE} · Mathematics for Computing 1
              </p>
              <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                Universiti Malaya · Local Offline-First Active-Recall Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ page: 'study', mode: 'daily-review' })}
              className="hidden items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 sm:inline-flex dark:bg-amber-950/60 dark:text-amber-300"
            >
              <span>Due Today:</span>
              <span className="font-mono">
                {overallStats.dueToday + overallStats.remediationPending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
              title={state.settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label={
                state.settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'
              }
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {state.settings.soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                updateSettings({
                  theme: state.settings.theme === 'dark' ? 'light' : 'dark',
                })
              }
              title="Toggle light/dark mode"
              aria-label="Toggle light/dark mode"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {state.settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Optional Storage Diagnostics Notice */}
        {diagnostics.warningMessage && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-950 sm:mx-6 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{diagnostics.warningMessage}</span>
          </div>
        )}

        {/* Main Active View */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {route.page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
          {route.page === 'courses' && <AllCoursesPage onNavigate={navigate} />}
          {route.page === 'week' && (
            <WeekPage variant="week" week={route.week} onNavigate={navigate} />
          )}
          {route.page === 'consolidation' && (
            <WeekPage variant="consolidation" onNavigate={navigate} />
          )}
          {route.page === 'test-1' && <WeekPage variant="test-1" onNavigate={navigate} />}
          {route.page === 'test-2' && <WeekPage variant="test-2" onNavigate={navigate} />}
          {route.page === 'final-exam' && (
            <WeekPage variant="final-exam" onNavigate={navigate} />
          )}
          {route.page === 'study' && (
            <StudyPage
              mode={route.mode}
              week={route.week}
              singleCardId={route.cardId}
              onNavigate={navigate}
            />
          )}
          {route.page === 'statistics' && <StatisticsPage onNavigate={navigate} />}
          {route.page === 'import-export' && <ImportExport />}
          {route.page === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ProgressProvider>
      <AppShell />
    </ProgressProvider>
  );
}

export default App;
