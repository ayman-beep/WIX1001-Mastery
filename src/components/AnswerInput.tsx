import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eraser, Redo2, Send, Undo2 } from 'lucide-react';
import { convertPlainMathToLatex, KaTeXFormula } from './KaTeXText';
import { MathToolbar } from './MathToolbar';

interface EditSnapshot {
  text: string;
  cursor: number;
}

const SLASH_SHORTCUTS: Record<string, string> = {
  '\\cap': '∩',
  '\\cup': '∪',
  '\\subset': '⊂',
  '\\subseteq': '⊆',
  '\\emptyset': '∅',
  '\\in': '∈',
  '\\notin': '∉',
  '\\forall': '∀',
  '\\exists': '∃',
  '\\land': '∧',
  '\\lor': '∨',
  '\\neg': '¬',
  '\\to': '→',
  '\\iff': '↔',
  '\\neq': '≠',
  '\\le': '≤',
  '\\ge': '≥',
  '\\pm': '±',
  '\\times': '×',
  '\\circ': '∘',
  '\\sum': '∑',
  '\\sqrt': '√()',
  '\\N': 'ℕ',
  '\\W': '𝕎',
  '\\Z': 'ℤ',
  '\\Q': 'ℚ',
  '\\R': 'ℝ',
  '\\C': 'ℂ',
};

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocusKey?: string | number;
  submitLabel?: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type exact answer here... (use symbol buttons or shorthands like ->, !=, <=, \\in + Tab)',
  autoFocusKey,
  submitLabel = 'Check Answer',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [undoStack, setUndoStack] = useState<EditSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<EditSnapshot[]>([]);
  const pendingCursorRef = useRef<number | null>(null);

  // Focus textarea cleanly whenever drill step resets or begins
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocusKey, disabled]);

  // Apply scheduled cursor position after React controlled value updates
  useEffect(() => {
    if (pendingCursorRef.current !== null && textareaRef.current) {
      const pos = pendingCursorRef.current;
      pendingCursorRef.current = null;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(pos, pos);
    }
  }, [value]);

  const commitEdit = useCallback(
    (nextText: string, nextCursor: number) => {
      const currentCursor = textareaRef.current?.selectionStart ?? value.length;
      setUndoStack((prev) => [...prev.slice(-49), { text: value, cursor: currentCursor }]);
      setRedoStack([]);
      pendingCursorRef.current = nextCursor;
      onChange(nextText);
    },
    [onChange, value]
  );

  const handleToolbarInsert = useCallback(
    (before: string, after: string = '') => {
      if (disabled) return;
      const el = textareaRef.current;
      const start = el ? el.selectionStart : value.length;
      const end = el ? el.selectionEnd : value.length;
      const selected = value.slice(start, end);

      const nextText = value.slice(0, start) + before + selected + after + value.slice(end);
      // Place cursor cleanly right inside delimiters if nothing selected, or after wrapped text
      const nextCursor =
        selected.length > 0 ? start + before.length + selected.length + after.length : start + before.length;

      commitEdit(nextText, nextCursor);
    },
    [commitEdit, disabled, value]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || disabled) return;
    const previous = undoStack[undoStack.length - 1];
    const currentCursor = textareaRef.current?.selectionStart ?? value.length;
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((r) => [...r, { text: value, cursor: currentCursor }]);
    pendingCursorRef.current = previous.cursor;
    onChange(previous.text);
  }, [disabled, onChange, undoStack, value]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || disabled) return;
    const next = redoStack[redoStack.length - 1];
    const currentCursor = textareaRef.current?.selectionStart ?? value.length;
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((s) => [...s, { text: value, cursor: currentCursor }]);
    pendingCursorRef.current = next.cursor;
    onChange(next.text);
  }, [disabled, onChange, redoStack, value]);

  const handleClear = useCallback(() => {
    if (!value || disabled) return;
    commitEdit('', 0);
  }, [commitEdit, disabled, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    // Undo / Redo keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Backslash command quick expansion via Tab (e.g. `\in` + Tab -> `∈`)
    if (e.key === 'Tab' && textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      const prefix = value.slice(0, pos);
      const match = prefix.match(/\\[a-zA-Z]+$/);
      if (match && SLASH_SHORTCUTS[match[0]]) {
        e.preventDefault();
        const replacement = SLASH_SHORTCUTS[match[0]];
        const start = pos - match[0].length;
        const nextText = value.slice(0, start) + replacement + value.slice(pos);
        const cursorOffset = replacement === '√()' ? start + 2 : start + replacement.length;
        commitEdit(nextText, cursorOffset);
        return;
      }
    }

    // Submit on Enter (Shift+Enter inserts newline if desired)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = e.target.value;
    setUndoStack((prev) => [
      ...prev.slice(-49),
      { text: value, cursor: e.target.selectionStart ?? nextText.length },
    ]);
    setRedoStack([]);
    onChange(nextText);
  };

  const livePreviewLatex = convertPlainMathToLatex(value);

  return (
    <div className="space-y-3">
      <MathToolbar onInsert={handleToolbarInsert} disabled={disabled} />

      <div className="relative">
        <label htmlFor="drill-answer-textarea" className="sr-only">
          Mathematical Answer Input
        </label>
        <textarea
          id="drill-answer-textarea"
          ref={textareaRef}
          rows={2}
          disabled={disabled}
          value={value}
          onChange={handleManualChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-base text-slate-900 shadow-xs transition placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Live KaTeX preview of what the user is typing */}
      <div className="flex min-h-[2.5rem] items-center justify-between gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/50">
        <span className="shrink-0 text-xs font-medium tracking-wide text-slate-400 uppercase">
          Live Preview
        </span>
        <div className="overflow-x-auto text-right text-slate-800 dark:text-slate-200">
          {livePreviewLatex ? (
            <KaTeXFormula latex={livePreviewLatex} />
          ) : (
            <span className="text-xs italic text-slate-400">
              Your typed math notation renders here as you type
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={disabled || undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            aria-label="Undo edit"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={disabled || redoStack.length === 0}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
            aria-label="Redo edit"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Redo2 className="h-3.5 w-3.5" />
            Redo
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled || value.length === 0}
            title="Clear answer input"
            aria-label="Clear answer input"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.99] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitLabel}
          <span className="hidden rounded bg-indigo-500/70 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            Enter
          </span>
        </button>
      </div>
    </div>
  );
};
