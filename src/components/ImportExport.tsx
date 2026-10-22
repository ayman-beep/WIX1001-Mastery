import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Download,
  FileCheck2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { CURRICULUM_WEEKS } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import {
  createExportJsonString,
  EXAMPLE_CUSTOM_DECK,
  JSON_SCHEMA_DOCUMENTATION,
  triggerJsonDownload,
  validateImportJson,
} from '../services/importExportService';
import {
  ExportKind,
  ImportConflictStrategy,
  ImportValidationPreview,
  WeekNumber,
} from '../types';

export const ImportExport: React.FC = () => {
  const { state, allCards, applyImport } = useProgress();
  const [selectedWeek, setSelectedWeek] = useState<WeekNumber>(1);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [preview, setPreview] = useState<ImportValidationPreview | null>(null);
  const [strategy, setStrategy] = useState<ImportConflictStrategy>('merge');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    kind: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showSchema, setShowSchema] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = (kind: ExportKind) => {
    const { filename, content } = createExportJsonString({
      kind,
      allCards,
      state,
      week: selectedWeek,
    });
    triggerJsonDownload(filename, content);
    setStatusBanner({
      kind: 'success',
      message: `Generated and downloaded "${filename}" entirely in your browser.`,
    });
  };

  const handleDownloadExampleDeck = () => {
    triggerJsonDownload(
      'wix1001-example-custom-deck.json',
      JSON.stringify(EXAMPLE_CUSTOM_DECK, null, 2)
    );
    setStatusBanner({
      kind: 'success',
      message:
        'Downloaded "wix1001-example-custom-deck.json". You can inspect or import it directly below!',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusBanner(null);
    setConfirmOpen(false);
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const validated = validateImportJson(content, allCards);
      setPreview(validated);
      if (!validated.valid) {
        setStatusBanner({
          kind: 'error',
          message: 'Import file failed validation. Existing decks and progress remain untouched.',
        });
      }
    };
    reader.onerror = () => {
      setStatusBanner({
        kind: 'error',
        message: 'Unable to read selected file from disk.',
      });
    };
    reader.readAsText(file);
  };

  const handleConfirmApplyImport = () => {
    if (!preview || !preview.valid) return;
    applyImport(preview, strategy);
    setConfirmOpen(false);
    setStatusBanner({
      kind: 'success',
      message: `Successfully imported "${selectedFileName}" using "${strategy}" strategy (${preview.cards.length} cards, ${preview.progressEntriesCount} progress records).`,
    });
    setPreview(null);
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {statusBanner && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium ${
            statusBanner.kind === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
              : 'border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
          }`}
        >
          {statusBanner.kind === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{statusBanner.message}</span>
        </div>
      )}

      {/* EXPORT SECTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Export Course Decks, Progress & Full Backups
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Downloads portable, human-readable UTF-8 JSON files generated completely locally in your browser.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Complete Backup (Recommended)
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Includes all flashcards, custom additions, Leitner box schedules, daily streaks, and settings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExport('complete-backup')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              Export Complete Backup (.json)
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Learning Progress Only
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Exports your spaced-repetition boxes, review dates, attempts, and daily streak history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExport('progress')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export Progress Records (.json)
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Entire Course Deck ({allCards.length} Cards)
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Exports all Weeks 1–14 flashcards with formulas, answers, variants, and worked explanations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleExport('full-deck')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export Full Deck (.json)
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Export Selected Single Week
              </h3>
              <label htmlFor="export-week-select" className="sr-only">
                Select Week to Export
              </label>
              <select
                id="export-week-select"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value) as WeekNumber)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {CURRICULUM_WEEKS.map((w) => (
                  <option key={w.week} value={w.week}>
                    Week {w.week}: {w.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleExport('week-deck')}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export Week {selectedWeek} (.json)
            </button>
          </div>
        </div>
      </section>

      {/* IMPORT SECTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Validate & Import JSON Deck or Backup
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Files are parsed strictly as data (never executed), checked for duplicates, and require confirmation before applying.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadExampleDeck}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/70 dark:text-purple-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Download Example Custom Deck
          </button>
        </div>

        <div className="mt-5">
          <label
            htmlFor="json-import-file-input"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-950/40"
          >
            <Upload className="h-8 w-8 text-indigo-500" />
            <span className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {selectedFileName
                ? `Selected: ${selectedFileName}`
                : 'Click to choose a WIX1001 .json file to validate'}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Supports custom week decks, full course decks, progress snapshots, or complete backups
            </span>
            <input
              ref={fileInputRef}
              id="json-import-file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {/* Validation Preview Report */}
        {preview && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Import Validation Preview ({preview.detectedType})
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                  preview.valid
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {preview.valid ? 'Schema Valid' : 'Rejected — Invalid Schema'}
              </span>
            </div>

            {preview.errors.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {preview.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {preview.warnings.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-700 dark:text-amber-300">
                {preview.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            )}

            {preview.valid && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">Valid Cards Found</p>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                      {preview.cards.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">Weeks Covered</p>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {preview.weeksCovered.length > 0
                        ? preview.weeksCovered.map((w) => `W${w}`).join(', ')
                        : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">Duplicate IDs Detected</p>
                    <p className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                      {preview.duplicateIdsWithExisting.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                    <p className="text-[11px] text-slate-500">Progress Entries</p>
                    <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {preview.progressEntriesCount}
                    </p>
                  </div>
                </div>

                {/* Merge vs Replace Selector */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-xs ${
                      strategy === 'merge'
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="import-strategy"
                      checked={strategy === 'merge'}
                      onChange={() => setStrategy('merge')}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Merge Safely (Protects Existing Progress)
                      </p>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                        Adds custom cards, updates matching card content, and preserves all existing review progress.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-xs ${
                      strategy === 'replace'
                        ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="import-strategy"
                      checked={strategy === 'replace'}
                      onChange={() => setStrategy('replace')}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Replace Course Deck / Restore Backup
                      </p>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                        Replaces active deck and/or overwrites progress state from backup snapshot.
                      </p>
                    </div>
                  </label>
                </div>

                {!confirmOpen ? (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                      Proceed to Confirm Import
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
                    <p className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                      Confirm applying "{selectedFileName}" using <strong>{strategy.toUpperCase()}</strong> mode?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmOpen(false)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmApplyImport}
                        className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Confirm & Apply Import
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* DOCUMENTED JSON SCHEMA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Documented WIX1001 JSON Deck & Backup Schema
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowSchema((s) => !s)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            {showSchema ? 'Hide Schema' : 'Show Full JSON Schema'}
          </button>
        </div>

        {showSchema && (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200">
            {JSON_SCHEMA_DOCUMENTATION}
          </pre>
        )}
      </section>
    </div>
  );
};
