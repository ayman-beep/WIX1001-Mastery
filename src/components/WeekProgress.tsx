import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Play, Search, Trash2 } from 'lucide-react';
import { isCardDueForReview } from '../services/reviewScheduler';
import { CardProgress, Flashcard, LearningStatus } from '../types';
import { KaTeXText } from './KaTeXText';

interface WeekProgressProps {
  cards: Flashcard[];
  progressByCard: Map<string, CardProgress>;
  todayStr: string;
  onStudyCard: (cardId: string) => void;
  onRemoveCustomCard?: (cardId: string) => void;
}

export const WeekProgress: React.FC<WeekProgressProps> = ({
  cards,
  progressByCard,
  todayStr,
  onStudyCard,
  onRemoveCustomCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LearningStatus | 'due'>('all');

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cards.filter((card) => {
      const prog = progressByCard.get(card.id);
      if (statusFilter === 'due' && !isCardDueForReview(prog, todayStr)) return false;
      if (
        statusFilter !== 'all' &&
        statusFilter !== 'due' &&
        prog?.status !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        card.topic.toLowerCase().includes(q) ||
        card.question.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q)
      );
    });
  }, [cards, progressByCard, searchQuery, statusFilter, todayStr]);

  return (
    <div className="space-y-4">
      {/* Search & Status Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            aria-label="Filter cards by topic or question"
            placeholder="Search topics, theorems, or prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3.5 pl-10 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              ['all', `All (${cards.length})`],
              ['new', 'Unseen'],
              ['learning', 'Learning'],
              ['mastered', 'Mastered'],
              ['due', 'Due Today'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Deck List */}
      {filteredCards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No flashcards match your selected filter criteria.
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredCards.map((card) => {
            const prog = progressByCard.get(card.id)!;
            const due = isCardDueForReview(prog, todayStr);

            return (
              <div
                key={card.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      W{card.week}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {card.topic}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] capitalize text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {card.category.replace('-', ' ')}
                    </span>

                    {prog.status === 'mastered' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Box {prog.box}
                      </span>
                    )}
                    {prog.status === 'learning' && (
                      <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800 dark:bg-sky-950/70 dark:text-sky-300">
                        {prog.needsRemediationDrill
                          ? 'Remediation (0/3)'
                          : `Learning (${prog.currentStreak}/3)`}
                      </span>
                    )}
                    {due && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                        <Clock className="h-3 w-3" />
                        Due Now
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-800 dark:text-slate-200">
                    <KaTeXText text={card.question} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Attempts: {prog.totalAttempts}</span>
                    <span>Mistakes: {prog.totalMistakes}</span>
                    {prog.nextReviewDate && (
                      <span>Next review: {prog.nextReviewDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  {card.isCustom && onRemoveCustomCard && (
                    <button
                      type="button"
                      onClick={() => onRemoveCustomCard(card.id)}
                      title="Delete custom card"
                      aria-label="Delete custom card"
                      className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onStudyCard(card.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-indigo-700"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {due ? 'Review' : prog.status === 'mastered' ? 'Practice' : 'Study'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
