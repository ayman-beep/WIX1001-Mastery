import React, { useState } from 'react';
import { Grid2x2 } from 'lucide-react';

export interface ToolbarSymbolSpec {
  id: string;
  label: string;
  title: string;
  group: 'sets-logic' | 'number-sets' | 'structures';
  insertBefore: string;
  insertAfter?: string;
  shortcutHint?: string;
}

export const TOOLBAR_SYMBOLS: ToolbarSymbolSpec[] = [
  // Sets and Logic
  { id: 'inter', label: '∩', title: 'Intersection', group: 'sets-logic', insertBefore: '∩', shortcutHint: '\\cap' },
  { id: 'union', label: '∪', title: 'Union', group: 'sets-logic', insertBefore: '∪', shortcutHint: '\\cup' },
  { id: 'psubset', label: '⊂', title: 'Proper subset', group: 'sets-logic', insertBefore: '⊂', shortcutHint: '\\subset' },
  { id: 'subset', label: '⊆', title: 'Subset or equal', group: 'sets-logic', insertBefore: '⊆', shortcutHint: '\\subseteq' },
  { id: 'empty', label: '∅', title: 'Empty set', group: 'sets-logic', insertBefore: '∅', shortcutHint: '\\emptyset' },
  { id: 'in', label: '∈', title: 'Element of', group: 'sets-logic', insertBefore: '∈', shortcutHint: '\\in' },
  { id: 'notin', label: '∉', title: 'Not an element of', group: 'sets-logic', insertBefore: '∉', shortcutHint: '\\notin' },
  { id: 'forall', label: '∀', title: 'For all', group: 'sets-logic', insertBefore: '∀', shortcutHint: '\\forall' },
  { id: 'exists', label: '∃', title: 'There exists', group: 'sets-logic', insertBefore: '∃', shortcutHint: '\\exists' },
  { id: 'and', label: '∧', title: 'Logical AND', group: 'sets-logic', insertBefore: '∧', shortcutHint: '\\land' },
  { id: 'or', label: '∨', title: 'Logical OR', group: 'sets-logic', insertBefore: '∨', shortcutHint: '\\lor' },
  { id: 'not', label: '¬', title: 'Logical NOT', group: 'sets-logic', insertBefore: '¬', shortcutHint: '\\neg or ~' },
  { id: 'imp', label: '→', title: 'Implication', group: 'sets-logic', insertBefore: '→', shortcutHint: '->' },
  { id: 'iff', label: '↔', title: 'Biconditional', group: 'sets-logic', insertBefore: '↔', shortcutHint: '<->' },

  // Number Sets
  { id: 'nat', label: 'ℕ', title: 'Natural numbers {1, 2, 3, ...}', group: 'number-sets', insertBefore: 'ℕ', shortcutHint: '\\mathbb{N}' },
  { id: 'whole', label: '𝕎', title: 'Whole numbers {0, 1, 2, ...}', group: 'number-sets', insertBefore: '𝕎', shortcutHint: '\\mathbb{W}' },
  { id: 'int', label: 'ℤ', title: 'Integers', group: 'number-sets', insertBefore: 'ℤ', shortcutHint: '\\mathbb{Z}' },
  { id: 'rat', label: 'ℚ', title: 'Rational numbers', group: 'number-sets', insertBefore: 'ℚ', shortcutHint: '\\mathbb{Q}' },
  { id: 'real', label: 'ℝ', title: 'Real numbers', group: 'number-sets', insertBefore: 'ℝ', shortcutHint: '\\mathbb{R}' },
  { id: 'comp', label: 'ℂ', title: 'Complex numbers', group: 'number-sets', insertBefore: 'ℂ', shortcutHint: '\\mathbb{C}' },

  // Fractions, exponents, roots, delimiters, combinatorics, matrices
  { id: 'frac', label: 'a/b', title: 'Fraction ( ) / ( )', group: 'structures', insertBefore: '(', insertAfter: ') / ()' },
  { id: 'sup', label: 'xⁿ', title: 'Superscript / exponent', group: 'structures', insertBefore: '^(', insertAfter: ')' },
  { id: 'sub', label: 'xᵢ', title: 'Subscript', group: 'structures', insertBefore: '_', insertAfter: '' },
  { id: 'sqrt', label: '√', title: 'Square root √( )', group: 'structures', insertBefore: '√(', insertAfter: ')', shortcutHint: 'sqrt(' },
  { id: 'paren', label: '( )', title: 'Parentheses', group: 'structures', insertBefore: '(', insertAfter: ')' },
  { id: 'brack', label: '[ ]', title: 'Square brackets', group: 'structures', insertBefore: '[', insertAfter: ']' },
  { id: 'brace', label: '{ }', title: 'Set curly braces', group: 'structures', insertBefore: '{', insertAfter: '}' },
  { id: 'abs', label: '|x|', title: 'Absolute value / Set cardinality', group: 'structures', insertBefore: '|', insertAfter: '|' },
  { id: 'sum', label: '∑', title: 'Summation ∑', group: 'structures', insertBefore: '∑', shortcutHint: '\\sum' },
  { id: 'fact', label: 'n!', title: 'Factorial !', group: 'structures', insertBefore: '!' },
  { id: 'binom', label: 'C(n,r)', title: 'Binomial coefficient C(n, r)', group: 'structures', insertBefore: 'C(', insertAfter: ', )' },
  { id: 'matrix', label: '[[·]]', title: '2×2 Matrix template [[a, b], [c, d]]', group: 'structures', insertBefore: '[[', insertAfter: ', ], [, ]]' },
  { id: 'neq', label: '≠', title: 'Not equal ≠', group: 'structures', insertBefore: '≠', shortcutHint: '!=' },
  { id: 'pm', label: '±', title: 'Plus-minus ±', group: 'structures', insertBefore: '±', shortcutHint: '+-' },
  { id: 'times', label: '×', title: 'Cartesian / Cross product ×', group: 'structures', insertBefore: '×', shortcutHint: '\\times' },
  { id: 'compfn', label: '∘', title: 'Function composition ∘', group: 'structures', insertBefore: '∘', shortcutHint: '\\circ' },
];

interface MathToolbarProps {
  onInsert: (before: string, after?: string) => void;
  disabled?: boolean;
}

export const MathToolbar: React.FC<MathToolbarProps> = ({ onInsert, disabled = false }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sets-logic' | 'number-sets' | 'structures'>(
    'all'
  );
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [mCells, setMCells] = useState<[string, string, string, string]>(['1', '0', '0', '1']);

  const visibleSymbols =
    activeTab === 'all'
      ? TOOLBAR_SYMBOLS
      : TOOLBAR_SYMBOLS.filter((s) => s.group === activeTab);

  const handleInsertMatrixGrid = () => {
    const formatted = `[[${mCells[0].trim() || '0'}, ${mCells[1].trim() || '0'}], [${mCells[2].trim() || '0'}, ${mCells[3].trim() || '0'}]]`;
    onInsert(formatted);
    setMatrixOpen(false);
  };

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 dark:border-slate-700/80 dark:bg-slate-800/70"
      aria-label="Mathematical Symbol Toolbar"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Symbol categories">
          {(
            [
              ['all', 'All Symbols'],
              ['sets-logic', 'Sets & Logic'],
              ['number-sets', 'Number Sets'],
              ['structures', 'Algebra & Matrices'],
            ] as const
          ).map(([tabKey, label]) => (
            <button
              key={tabKey}
              type="button"
              role="tab"
              aria-selected={activeTab === tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeTab === tabKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-700/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setMatrixOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-500/40 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          title="Open interactive 2×2 Matrix Builder"
        >
          <Grid2x2 className="h-3.5 w-3.5" />
          2×2 Matrix Builder
        </button>
      </div>

      {matrixOpen && (
        <div className="mb-2.5 rounded-lg border border-indigo-200 bg-white p-3 shadow-sm dark:border-indigo-500/30 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                2×2 Matrix Quick Entry
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fills <code className="font-mono">[[a, b], [c, d]]</code> directly at the cursor
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-300 p-1.5 dark:border-slate-700">
                {mCells.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    aria-label={`Matrix cell row ${Math.floor(idx / 2) + 1} column ${(idx % 2) + 1}`}
                    value={val}
                    onChange={(e) => {
                      const copy: [string, string, string, string] = [...mCells];
                      copy[idx] = e.target.value;
                      setMCells(copy);
                    }}
                    className="w-12 rounded border border-slate-200 bg-slate-50 px-1.5 py-1 text-center font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleInsertMatrixGrid}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {visibleSymbols.map((sym) => (
          <button
            key={sym.id}
            type="button"
            disabled={disabled}
            onMouseDown={(e) => {
              // Prevent button click from stealing focus from textarea on desktop
              e.preventDefault();
            }}
            onClick={() => onInsert(sym.insertBefore, sym.insertAfter)}
            title={
              sym.shortcutHint
                ? `${sym.title} (Shortcut: ${sym.shortcutHint})`
                : sym.title
            }
            aria-label={sym.title}
            className="inline-flex min-w-[2.2rem] items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-xs font-semibold text-slate-800 shadow-2xs transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500 active:scale-95 disabled:pointer-events-none disabled:opacity-45 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/70 dark:hover:text-indigo-300"
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
};
