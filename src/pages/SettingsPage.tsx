import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Moon,
  Sun,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CURRICULUM_WEEKS } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { audioService } from '../services/audioService';
import {
  createExportJsonString,
  triggerJsonDownload,
  validateImportJson,
} from '../services/importExportService';
import { ImportValidationPreview, WeekNumber } from '../types';

export const SettingsPage: React.FC = () => {
  const { state, allCards, updateSettings, clearAllData, applyImport } = useProgress();
  const { settings } = state;

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [restorePreview, setRestorePreview] = useState<ImportValidationPreview | null>(null);
  const [restoreFilename, setRestoreFilename] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(
    null
  );
  const restoreInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportAll = () => {
    const { filename, content } = createExportJsonString({
      kind: 'complete-backup',
      allCards,
      state,
    });
    triggerJsonDownload(filename, content);
    setFeedback({
      kind: 'success',
      text: `Exported complete backup to "${filename}". Keep a copy outside browser storage!`,
    });
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFilename(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const validated = validateImportJson(content, allCards);
      if (!validated.valid) {
        setRestorePreview(null);
        setFeedback({
          kind: 'error',
          text: `Backup file rejected: ${validated.errors[0] ?? 'Invalid format'}. Existing data kept safe.`,
        });
      } else {
        setRestorePreview(validated);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Application Settings & Local Data Management
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          All preferences and learning records are stored 100% locally in your browser without any backend server or account.
        </p>
      </div>

      {/* Browser Storage Warning Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-800/80 dark:bg-amber-950/50 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="font-bold">Local Browser Persistence Notice</p>
          <p className="mt-0.5">
            Clearing your browser site data, cookies/storage, or using private/incognito browsing may permanently remove unsaved progress and custom decks. Export regular JSON backups below to safeguard your semester progress.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2.5 rounded-2xl border p-4 text-sm font-medium ${
            feedback.kind === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
              : 'border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Appearance & Audio Preferences */}
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Interface & Study Preferences
        </h2>

        {/* Theme Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Color Theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose between clean academic Light Mode or high-contrast Dark Mode
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                settings.theme === 'light'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                settings.theme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Synthesized Sound Effects (Web Audio API)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plays local browser chimes for streak progress, 3/3 mastery, and mistake resets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => audioService.playCardSuccess(true)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Test Chime
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                settings.soundEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {settings.soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  Sound On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Muted
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Review Goal */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <label
              htmlFor="daily-goal-input"
              className="text-sm font-semibold text-slate-900 dark:text-white"
            >
              Daily Study & Review Goal
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target number of cards mastered or reviewed each day
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[10, 20, 35, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateSettings({ dailyReviewGoal: preset })}
                className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold ${
                  settings.dailyReviewGoal === preset
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {preset}
              </button>
            ))}
            <input
              id="daily-goal-input"
              type="number"
              min={1}
              max={500}
              value={settings.dailyReviewGoal}
              onChange={(e) => {
                const v = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                updateSettings({ dailyReviewGoal: v });
              }}
              className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-center font-mono text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {/* Preferred Starting Week */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label
              htmlFor="preferred-week-select"
              className="text-sm font-semibold text-slate-900 dark:text-white"
            >
              Preferred Starting Week
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Week prioritized first when clicking “Continue Studying”
            </p>
          </div>
          <select
            id="preferred-week-select"
            value={settings.preferredStartingWeek}
            onChange={(e) =>
              updateSettings({ preferredStartingWeek: Number(e.target.value) as WeekNumber })
            }
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {CURRICULUM_WEEKS.map((w) => (
              <option key={w.week} value={w.week}>
                Week {w.week}: {w.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Backup, Restore, and Clear All Data */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Backup, Restore & Full Local Reset
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export All Data (.json)
          </button>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <Upload className="h-4 w-4" />
            Restore from Backup (.json)
            <input
              ref={restoreInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleRestoreFile}
              className="sr-only"
            />
          </label>

          {!confirmClearOpen ? (
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Local Data
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-rose-500 bg-rose-50 px-4 py-2 dark:bg-rose-950/80">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Erase all decks, settings & progress?
              </span>
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setConfirmClearOpen(false);
                  setFeedback({
                    kind: 'success',
                    text: 'All local browser data cleared and restored to default WIX1001 settings.',
                  });
                }}
                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700"
              >
                Confirm Erase All
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {restorePreview && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-300 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950/60">
            <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
              Ready to restore <strong>{restoreFilename}</strong> ({restorePreview.cards.length}{' '}
              cards, {restorePreview.progressEntriesCount} progress records). Confirm overwrite?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRestorePreview(null);
                  if (restoreInputRef.current) restoreInputRef.current.value = '';
                }}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  applyImport(restorePreview, 'replace');
                  setRestorePreview(null);
                  if (restoreInputRef.current) restoreInputRef.current.value = '';
                  setFeedback({
                    kind: 'success',
                    text: `Restored backup "${restoreFilename}" successfully!`,
                  });
                }}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
