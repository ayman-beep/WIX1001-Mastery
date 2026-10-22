import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXFormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const KaTeXFormula: React.FC<KaTeXFormulaProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: 'ignore',
      });
    } catch {
      return '';
    }
  }, [latex, displayMode]);

  if (!html) {
    return <code className={className}>{latex}</code>;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface KaTeXTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { kind: 'display-math'; value: string }
  | { kind: 'inline-math'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'italic'; value: string }
  | { kind: 'text'; value: string };

function tokenizeRichMathText(input: string): Segment[] {
  const segments: Segment[] = [];
  // Matches $$...$$, $...$, `...`, **...**, *...*
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', value: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({ kind: 'display-math', value: token.slice(2, -2).trim() });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({ kind: 'inline-math', value: token.slice(1, -1).trim() });
    } else if (token.startsWith('`') && token.endsWith('`')) {
      segments.push({ kind: 'code', value: token.slice(1, -1) });
    } else if (token.startsWith('**') && token.endsWith('**')) {
      segments.push({ kind: 'bold', value: token.slice(2, -2) });
    } else if (token.startsWith('*') && token.endsWith('*')) {
      segments.push({ kind: 'italic', value: token.slice(1, -1) });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ kind: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

export const KaTeXText: React.FC<KaTeXTextProps> = ({ text, className = '' }) => {
  const paragraphs = useMemo(() => text.split('\n'), [text]);

  return (
    <div className={`space-y-1.5 leading-relaxed ${className}`}>
      {paragraphs.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }
        const isBullet = trimmed.startsWith('- ');
        const content = isBullet ? trimmed.slice(2) : line;
        const segments = tokenizeRichMathText(content);

        const rendered = segments.map((seg, idx) => {
          switch (seg.kind) {
            case 'display-math':
              return (
                <div key={idx} className="my-2 overflow-x-auto text-center">
                  <KaTeXFormula latex={seg.value} displayMode />
                </div>
              );
            case 'inline-math':
              return <KaTeXFormula key={idx} latex={seg.value} />;
            case 'code':
              return (
                <code
                  key={idx}
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                >
                  {seg.value}
                </code>
              );
            case 'bold':
              return (
                <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
                  {tokenizeRichMathText(seg.value).map((inner, innerIdx) =>
                    inner.kind === 'inline-math' ? (
                      <KaTeXFormula key={innerIdx} latex={inner.value} />
                    ) : (
                      <React.Fragment key={innerIdx}>{inner.value}</React.Fragment>
                    )
                  )}
                </strong>
              );
            case 'italic':
              return (
                <em key={idx} className="italic">
                  {seg.value}
                </em>
              );
            default:
              return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
          }
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <div className="flex-1">{rendered}</div>
            </div>
          );
        }

        return <div key={lineIdx}>{rendered}</div>;
      })}
    </div>
  );
};

/**
 * Converts plain/Unicode student input into clean LaTeX so students can visually inspect
 * their own typed expression in real time with KaTeX while answering.
 */
export function convertPlainMathToLatex(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Handle nested 2D matrix syntax e.g. [[1, 2], [3, 4]]
  const matrixMatch = trimmed.match(/^\[\s*(\[[\s\S]+\])\s*\]$/);
  if (matrixMatch) {
    const inner = matrixMatch[1];
    const rowMatches = inner.match(/\[[^\]]*\]/g);
    if (rowMatches && rowMatches.length >= 1) {
      const latexRows = rowMatches.map((r) =>
        r
          .slice(1, -1)
          .split(',')
          .map((cell) => cell.trim() || '\\square')
          .join(' & ')
      );
      return `\\begin{bmatrix} ${latexRows.join(' \\\\ ')} \\end{bmatrix}`;
    }
  }

  let out = trimmed
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/ℕ/g, '\\mathbb{N}')
    .replace(/𝕎/g, '\\mathbb{W}')
    .replace(/ℤ/g, '\\mathbb{Z}')
    .replace(/ℚ/g, '\\mathbb{Q}')
    .replace(/ℝ/g, '\\mathbb{R}')
    .replace(/ℂ/g, '\\mathbb{C}')
    .replace(/∩/g, ' \\cap ')
    .replace(/∪/g, ' \\cup ')
    .replace(/⊆/g, ' \\subseteq ')
    .replace(/⊂/g, ' \\subset ')
    .replace(/∅/g, '\\emptyset')
    .replace(/∉/g, ' \\notin ')
    .replace(/∈/g, ' \\in ')
    .replace(/∀/g, '\\forall ')
    .replace(/∃/g, '\\exists ')
    .replace(/∧/g, ' \\land ')
    .replace(/∨/g, ' \\lor ')
    .replace(/¬/g, '\\neg ')
    .replace(/↔|<->/g, ' \\leftrightarrow ')
    .replace(/→|->/g, ' \\to ')
    .replace(/≡/g, ' \\equiv ')
    .replace(/≠|!=/g, ' \\neq ')
    .replace(/≤|<=/g, ' \\le ')
    .replace(/≥|>=/g, ' \\ge ')
    .replace(/±|\+-/g, ' \\pm ')
    .replace(/∘/g, ' \\circ ')
    .replace(/×/g, ' \\times ')
    .replace(/∑/g, '\\sum ')
    .replace(/√\(([^()]*)\)/g, '\\sqrt{$1}')
    .replace(/\^\(([^()]+)\)/g, '^{$1}')
    .replace(/_\(([^()]+)\)/g, '_{$1}');

  return out;
}
