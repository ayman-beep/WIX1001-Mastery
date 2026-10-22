import React, { useEffect, useRef } from 'react';
import { AlertOctagon, BookOpen, RotateCcw } from 'lucide-react';
import { AnswerCheckResult, Flashcard, LeitnerBox } from '../types';
import { KaTeXFormula, KaTeXText } from './KaTeXText';

interface MistakeModalProps {
  card: Flashcard;
  submittedRaw: string;
  checkResult: AnswerCheckResult;
  demotedFromBox: LeitnerBox | null;
  onTryAgain: () => void;
  onReturnToStudy?: () => void;
}

export const MistakeModal: React.FC<MistakeModalProps> = ({
  card,
  submittedRaw,
  checkResult,
  demotedFromBox,
  onTryAgain,
  onReturnToStudy,
}) => {
  const tryAgainBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Delay focus slightly so any Enter key release from submitting doesn't accidentally dismiss instantly
    const timer = window.setTimeout(() => {
      tryAgainBtnRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="mistake-modal-title"
      className="animate-popIn rounded-2xl border-2 border-rose-500/80 bg-rose-50/95 p-6 shadow-xl dark:border-rose-500/60 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rose-200 pb-4 dark:border-rose-900/60">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-rose-600 p-2.5 text-white shadow-xs">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <h3
              id="mistake-modal-title"
              className="text-lg font-bold text-rose-900 dark:text-rose-300"
            >
              Incorrect Answer — Streak Reset to 0 / 3
            </h3>
            <p className="mt-0.5 text-sm text-rose-700 dark:text-rose-400">
              {demotedFromBox && demotedFromBox >= 1
                ? `Review missed (demoted from Box ${demotedFromBox} → Box 1). You must complete 3 consecutive exact repetitions before this card returns to your review queue.`
                : 'Strict Active-Recall Rule: Three new consecutive correct repetitions (3 / 3) are required to complete this card.'}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-rose-600 px-3 py-1 font-mono text-xs font-bold text-white">
          Streak: 0 / 3
        </span>
      </div>

      {/* Side-by-side Expected vs Submitted Comparison + Character Diff Highlight */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-900/50 dark:bg-slate-950/70">
          <p className="text-xs font-semibold tracking-wider text-rose-600 uppercase dark:text-rose-400">
            Your Submitted Answer
          </p>
          <p className="mt-2 break-all font-mono text-base text-slate-900 dark:text-slate-100">
            {submittedRaw.trim() || <span className="italic text-slate-400">(empty input)</span>}
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <p className="mb-1 text-[11px] font-medium text-slate-500">Difference Highlight:</p>
            <div className="break-all font-mono text-sm leading-relaxed">
              {checkResult.submittedSegments.map((seg, i) =>
                seg.type === 'unexpected' ? (
                  <span
                    key={i}
                    className="rounded bg-rose-200 px-1 py-0.5 font-bold text-rose-900 underline decoration-rose-600 decoration-wavy dark:bg-rose-900/80 dark:text-rose-100"
                  >
                    {seg.text}
                  </span>
                ) : (
                  <span key={i} className="text-slate-700 dark:text-slate-300">
                    {seg.text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-300 bg-white p-4 dark:border-emerald-800/60 dark:bg-slate-950/70">
          <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
            Expected Exact Answer
          </p>
          <p className="mt-2 break-all font-mono text-base font-bold text-emerald-900 dark:text-emerald-200">
            {card.answer}
          </p>
          {card.answerLatex && (
            <div className="mt-2 rounded-lg bg-emerald-50/70 px-3 py-2 text-slate-900 dark:bg-emerald-950/30 dark:text-slate-100">
              <KaTeXFormula latex={card.answerLatex} />
            </div>
          )}
          <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <p className="mb-1 text-[11px] font-medium text-slate-500">Missing / Target Characters:</p>
            <div className="break-all font-mono text-sm leading-relaxed">
              {checkResult.expectedSegments.map((seg, i) =>
                seg.type === 'missing' ? (
                  <span
                    key={i}
                    className="rounded bg-emerald-200 px-1 py-0.5 font-bold text-emerald-950 dark:bg-emerald-800 dark:text-emerald-100"
                  >
                    {seg.text}
                  </span>
                ) : (
                  <span key={i} className="text-slate-700 dark:text-slate-300">
                    {seg.text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review explanation before restarting 0/3 drill */}
      {card.explanation && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          <p className="mb-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Why This Holds · Concept Review
          </p>
          <KaTeXText text={card.explanation} />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {onReturnToStudy && (
          <button
            type="button"
            onClick={onReturnToStudy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 text-indigo-500" />
            Practice Typing With Answer Shown (Streak 0 / 3)
          </button>
        )}

        <button
          ref={tryAgainBtnRef}
          type="button"
          onClick={onTryAgain}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again (Restart 0 / 3 Drill)
        </button>
      </div>
    </div>
  );
};
