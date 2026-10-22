import { AnswerCheckResult, DiffSegment, Flashcard } from '../types';

export interface SymbolAliasRule {
  pattern: RegExp;
  replacement: string;
  description: string;
}

/**
 * Deterministic, explicit mathematical symbol alias table.
 * Only replaces explicit LaTeX backslash commands and multi-character ASCII math shorthands,
 * never altering variable names, numbers, or prose words.
 */
export const DEFAULT_SYMBOL_ALIASES: SymbolAliasRule[] = [
  // Multi-character LaTeX blackboard bold sets
  { pattern: /\\mathbb\{N\}/g, replacement: 'ℕ', description: 'Natural numbers ℕ' },
  { pattern: /\\mathbb\{W\}/g, replacement: '𝕎', description: 'Whole numbers 𝕎' },
  { pattern: /\\mathbb\{Z\}/g, replacement: 'ℤ', description: 'Integers ℤ' },
  { pattern: /\\mathbb\{Q\}/g, replacement: 'ℚ', description: 'Rational numbers ℚ' },
  { pattern: /\\mathbb\{R\}/g, replacement: 'ℝ', description: 'Real numbers ℝ' },
  { pattern: /\\mathbb\{C\}/g, replacement: 'ℂ', description: 'Complex numbers ℂ' },

  // Set & logic LaTeX commands (longer prefixes before shorter prefixes!)
  { pattern: /\\leftrightarrow\b/g, replacement: '↔', description: 'Biconditional ↔' },
  { pattern: /\\rightarrow\b/g, replacement: '→', description: 'Implication →' },
  { pattern: /\\subseteq\b/g, replacement: '⊆', description: 'Subset or equal ⊆' },
  { pattern: /\\subset\b/g, replacement: '⊂', description: 'Proper subset ⊂' },
  { pattern: /\\emptyset\b/g, replacement: '∅', description: 'Empty set ∅' },
  { pattern: /\\varnothing\b/g, replacement: '∅', description: 'Empty set ∅' },
  { pattern: /\\notin\b/g, replacement: '∉', description: 'Not element of ∉' },
  { pattern: /\\forall\b/g, replacement: '∀', description: 'Universal quantifier ∀' },
  { pattern: /\\exists\b/g, replacement: '∃', description: 'Existential quantifier ∃' },
  { pattern: /\\land\b|\\wedge\b/g, replacement: '∧', description: 'Logical AND ∧' },
  { pattern: /\\lor\b|\\vee\b/g, replacement: '∨', description: 'Logical OR ∨' },
  { pattern: /\\neg\b|\\lnot\b/g, replacement: '¬', description: 'Logical NOT ¬' },
  { pattern: /\\equiv\b/g, replacement: '≡', description: 'Logical equivalence ≡' },
  { pattern: /\\neq\b|\\ne\b/g, replacement: '≠', description: 'Not equal ≠' },
  { pattern: /\\leq\b|\\le\b/g, replacement: '≤', description: 'Less than or equal ≤' },
  { pattern: /\\geq\b|\\ge\b/g, replacement: '≥', description: 'Greater than or equal ≥' },
  { pattern: /\\times\b/g, replacement: '×', description: 'Cartesian / cross product ×' },
  { pattern: /\\circ\b/g, replacement: '∘', description: 'Function composition ∘' },
  { pattern: /\\sqrt\b/g, replacement: '√', description: 'Square root √' },
  { pattern: /\\sum\b/g, replacement: '∑', description: 'Summation ∑' },
  { pattern: /\\cap\b/g, replacement: '∩', description: 'Intersection ∩' },
  { pattern: /\\cup\b/g, replacement: '∪', description: 'Union ∪' },
  { pattern: /\\in\b/g, replacement: '∈', description: 'Element of ∈' },
  { pattern: /\\to\b/g, replacement: '→', description: 'Arrow →' },
  { pattern: /\\pm\b/g, replacement: '±', description: 'Plus-minus ±' },

  // Multi-character ASCII operator shorthands
  { pattern: /<->|<=>/g, replacement: '↔', description: 'ASCII biconditional <->' },
  { pattern: /->/g, replacement: '→', description: 'ASCII implication ->' },
  { pattern: /!=/g, replacement: '≠', description: 'ASCII not-equal !=' },
  { pattern: /<=/g, replacement: '≤', description: 'ASCII less-or-equal <=' },
  { pattern: />=/g, replacement: '≥', description: 'ASCII greater-or-equal >=' },
  { pattern: /\+-/g, replacement: '±', description: 'ASCII plus-minus +-' },
  { pattern: /~/g, replacement: '¬', description: 'Tilde negation ~' },
  { pattern: /\bsqrt\s*\(/g, replacement: '√(', description: 'Function-style sqrt(' },
];

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  'ⁿ': 'n',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

function canonicalizeSubSup(str: string): string {
  // Convert runs of Unicode superscripts e.g. x² -> x^2, A⁻¹ -> A^(-1)
  let result = str.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+/g, (run) => {
    const mapped = Array.from(run)
      .map((ch) => SUPERSCRIPT_MAP[ch] ?? ch)
      .join('');
    return mapped.length === 1 ? `^${mapped}` : `^(${mapped})`;
  });

  // Convert runs of Unicode subscripts e.g. x₁ -> x_1
  result = result.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (run) => {
    const mapped = Array.from(run)
      .map((ch) => SUBSCRIPT_MAP[ch] ?? ch)
      .join('');
    return mapped.length === 1 ? `_${mapped}` : `_(${mapped})`;
  });

  // Normalize single-token curly superscripts/subscripts: x^{2} -> x^2, A^{-1} -> A^(-1), x_{1} -> x_1
  result = result.replace(/\^\{([^{}]+)\}/g, (_match, inner: string) => {
    const trimmed = inner.trim();
    return /^[a-zA-Z0-9]$/.test(trimmed) ? `^${trimmed}` : `^(${trimmed})`;
  });
  result = result.replace(/_\{([^{}]+)\}/g, (_match, inner: string) => {
    const trimmed = inner.trim();
    return /^[a-zA-Z0-9]$/.test(trimmed) ? `_${trimmed}` : `_(${trimmed})`;
  });

  return result;
}

export interface NormalizeOptions {
  caseSensitive?: boolean;
  aliases?: SymbolAliasRule[];
}

const MATH_DELIMITER_PATTERN =
  /\s*([∩∪⊂⊆∈∉∀∃∧∨¬→↔≡≠≤≥±∘×∑√+*/^_=(),[\]{}|:-])\s*/g;

/**
 * Deterministically normalizes a user or expected answer while preserving all mathematical meaning,
 * signs, variable names, quantifiers, operators, and word boundaries.
 */
export function normalizeAnswer(raw: string, options: NormalizeOptions = {}): string {
  const { caseSensitive = true, aliases = DEFAULT_SYMBOL_ALIASES } = options;

  if (typeof raw !== 'string') {
    return '';
  }

  // 1. Canonical Unicode NFC composition (preserves math symbols without flattening superscripts blindly)
  let text = raw.normalize('NFC');

  // 2. Unify minus / dash variants to ASCII hyphen-minus
  text = text.replace(/[\u2212\u2013\u2014]/g, '-');

  // 3. Apply explicit symbol alias rules
  for (const rule of aliases) {
    text = text.replace(rule.pattern, rule.replacement);
  }

  // 4. Canonicalize superscripts & subscripts so x² and x^2, A⁻¹ and A^(-1) normalize identically
  text = canonicalizeSubSup(text);

  // 5. Trim & collapse repeated whitespace
  text = text.trim().replace(/\s+/g, ' ');

  // 6. Strip harmless spacing adjacent to math operators and delimiters (e.g., "A ∩ B" === "A∩B")
  text = text.replace(MATH_DELIMITER_PATTERN, '$1');

  // 7. Apply optional case folding only when explicitly configured (prose/classification cards)
  if (!caseSensitive) {
    text = text.toLowerCase();
  }

  return text;
}

/**
 * Computes an exact character-level Longest Common Subsequence (LCS) diff between two strings
 * so the Mistake Modal highlights the exact missing and unexpected tokens/characters clearly.
 */
export function computeAnswerDiff(
  submittedRaw: string,
  expectedRaw: string
): { expectedSegments: DiffSegment[]; submittedSegments: DiffSegment[] } {
  const subChars = Array.from(submittedRaw.trim());
  const expChars = Array.from(expectedRaw.trim());

  const m = subChars.length;
  const n = expChars.length;

  // Guard unusually long inputs so diff computation always stays O(m*n) instantaneous
  if (m * n > 40_000) {
    return {
      expectedSegments: [{ type: 'missing', text: expectedRaw.trim() }],
      submittedSegments: [
        { type: 'unexpected', text: submittedRaw.trim() || '(empty response)' },
      ],
    };
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (subChars[i] === expChars[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const expectedSegments: DiffSegment[] = [];
  const submittedSegments: DiffSegment[] = [];

  const pushSegment = (arr: DiffSegment[], type: DiffSegment['type'], ch: string) => {
    const last = arr[arr.length - 1];
    if (last && last.type === type) {
      last.text += ch;
    } else {
      arr.push({ type, text: ch });
    }
  };

  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (subChars[i] === expChars[j]) {
      pushSegment(expectedSegments, 'equal', expChars[j]);
      pushSegment(submittedSegments, 'equal', subChars[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushSegment(submittedSegments, 'unexpected', subChars[i]);
      i++;
    } else {
      pushSegment(expectedSegments, 'missing', expChars[j]);
      j++;
    }
  }

  while (i < m) {
    pushSegment(submittedSegments, 'unexpected', subChars[i++]);
  }
  while (j < n) {
    pushSegment(expectedSegments, 'missing', expChars[j++]);
  }

  if (submittedSegments.length === 0) {
    submittedSegments.push({ type: 'unexpected', text: '(empty answer)' });
  }

  return { expectedSegments, submittedSegments };
}

/**
 * Checks a student's submitted answer against the canonical answer and explicitly configured variants.
 */
export function evaluateCardAnswer(
  submitted: string,
  card: Pick<Flashcard, 'answer' | 'acceptedVariants' | 'caseSensitive'>
): AnswerCheckResult {
  const caseSensitive = card.caseSensitive !== false;
  const normalizedSubmitted = normalizeAnswer(submitted, { caseSensitive });
  const normalizedExpected = normalizeAnswer(card.answer, { caseSensitive });

  if (normalizedSubmitted.length === 0) {
    const { expectedSegments, submittedSegments } = computeAnswerDiff('', card.answer);
    return {
      isCorrect: false,
      normalizedSubmitted,
      normalizedExpected,
      expectedSegments,
      submittedSegments,
    };
  }

  const candidates = [card.answer, ...(card.acceptedVariants ?? [])];
  for (const candidate of candidates) {
    const normCandidate = normalizeAnswer(candidate, { caseSensitive });
    if (normalizedSubmitted === normCandidate) {
      return {
        isCorrect: true,
        normalizedSubmitted,
        normalizedExpected,
        matchedVariant: candidate,
        expectedSegments: [{ type: 'equal', text: card.answer }],
        submittedSegments: [{ type: 'equal', text: submitted.trim() }],
      };
    }
  }

  const { expectedSegments, submittedSegments } = computeAnswerDiff(submitted, card.answer);
  return {
    isCorrect: false,
    normalizedSubmitted,
    normalizedExpected,
    expectedSegments,
    submittedSegments,
  };
}
