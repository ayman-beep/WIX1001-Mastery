import { useCallback, useEffect, useMemo, useState } from 'react';
import { CURRICULUM_WEEKS } from '../data/curriculum';
import {
  addDaysToDateString,
  computeStudyStreaks,
  createInitialCardProgress,
  getLocalDateString,
  isCardDueForReview,
} from '../services/reviewScheduler';
import {
  CardProgress,
  DailyActivity,
  Flashcard,
  LeitnerBox,
  StudyMode,
  WeekNumber,
  WeekStats,
} from '../types';
import { useProgress } from './useProgress';

export interface UpcomingScheduleItem {
  date: string;
  label: string;
  count: number;
}

export function useSpacedRepetition() {
  const { state, allCards } = useProgress();
  const [todayStr, setTodayStr] = useState<string>(() => getLocalDateString());

  // Automatically detect midnight local date rollover if tab stays open across days
  useEffect(() => {
    const checkDate = () => {
      const current = getLocalDateString();
      setTodayStr((prev) => (prev === current ? prev : current));
    };
    const timer = window.setInterval(checkDate, 30_000);
    window.addEventListener('focus', checkDate);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', checkDate);
    };
  }, []);

  const progressByCard = useMemo(() => {
    const map = new Map<string, CardProgress>();
    for (const card of allCards) {
      map.set(card.id, state.progress[card.id] ?? createInitialCardProgress(card.id));
    }
    return map;
  }, [allCards, state.progress]);

  const weekStatsList = useMemo<WeekStats[]>(() => {
    return CURRICULUM_WEEKS.map((wDef) => {
      const cardsInWeek = allCards.filter((c) => c.week === wDef.week);
      const totalCards = cardsInWeek.length;
      let newCards = 0;
      let learningCards = 0;
      let masteredCards = 0;
      let dueCards = 0;
      let learnedCount = 0;

      for (const card of cardsInWeek) {
        const prog = progressByCard.get(card.id)!;
        if (prog.status === 'new') newCards += 1;
        else if (prog.status === 'learning') learningCards += 1;
        else if (prog.status === 'mastered') masteredCards += 1;

        if (prog.completionDate !== null || prog.box >= 1) {
          learnedCount += 1;
        }
        if (isCardDueForReview(prog, todayStr)) {
          dueCards += 1;
        }
      }

      const masteryPercentage =
        totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
      const completionPercentage =
        totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0;

      return {
        week: wDef.week,
        totalCards,
        newCards,
        learningCards,
        masteredCards,
        dueCards,
        masteryPercentage,
        learnedCount,
        completionPercentage,
      };
    });
  }, [allCards, progressByCard, todayStr]);

  const overallStats = useMemo(() => {
    const totalUniqueCards = allCards.length;
    let totalLearned = 0;
    let totalMastered = 0;
    let totalLearning = 0;
    let totalNew = 0;
    let dueToday = 0;
    let remediationPending = 0;
    let totalAttempts = 0;
    let totalMistakes = 0;
    let totalSuccessfulRepetitions = 0;

    const boxDistribution: Record<LeitnerBox, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const card of allCards) {
      const prog = progressByCard.get(card.id)!;
      boxDistribution[prog.box] += 1;

      if (prog.status === 'new') totalNew += 1;
      else if (prog.status === 'learning') totalLearning += 1;
      else if (prog.status === 'mastered') totalMastered += 1;

      if (prog.completionDate !== null || prog.box >= 1) {
        totalLearned += 1;
      }
      if (prog.needsRemediationDrill) {
        remediationPending += 1;
      }
      if (isCardDueForReview(prog, todayStr)) {
        dueToday += 1;
      }

      totalAttempts += prog.totalAttempts;
      totalMistakes += prog.totalMistakes;
      totalSuccessfulRepetitions += prog.totalSuccessfulRepetitions;
    }

    const accuracyRate =
      totalAttempts > 0 ? Math.round((totalSuccessfulRepetitions / totalAttempts) * 1000) / 10 : 0;
    const mistakeRate =
      totalAttempts > 0 ? Math.round((totalMistakes / totalAttempts) * 1000) / 10 : 0;
    const courseCompletionPercentage =
      totalUniqueCards > 0 ? Math.round((totalLearned / totalUniqueCards) * 100) : 0;
    const courseMasteryPercentage =
      totalUniqueCards > 0 ? Math.round((totalMastered / totalUniqueCards) * 100) : 0;

    const { currentStreak, longestStreak } = computeStudyStreaks(state.dailyHistory, todayStr);
    const todayActivity: DailyActivity = state.dailyHistory[todayStr] ?? {
      date: todayStr,
      attempts: 0,
      successfulRepetitions: 0,
      mistakes: 0,
      cardsMastered: 0,
      reviewsCompleted: 0,
    };

    return {
      totalUniqueCards,
      totalLearned,
      totalMastered,
      totalLearning,
      totalNew,
      dueToday,
      remediationPending,
      totalAttempts,
      totalMistakes,
      totalSuccessfulRepetitions,
      accuracyRate,
      mistakeRate,
      courseCompletionPercentage,
      courseMasteryPercentage,
      boxDistribution,
      currentStreak,
      longestStreak,
      todayActivity,
      todayStr,
    };
  }, [allCards, progressByCard, state.dailyHistory, todayStr]);

  const upcomingSchedule = useMemo<UpcomingScheduleItem[]>(() => {
    const countsByDate = new Map<string, number>();
    let dueOrOverdueCount = 0;

    for (const card of allCards) {
      const prog = progressByCard.get(card.id)!;
      if (prog.box >= 1 && !prog.needsRemediationDrill && prog.nextReviewDate) {
        if (prog.nextReviewDate <= todayStr) {
          dueOrOverdueCount += 1;
        } else {
          countsByDate.set(
            prog.nextReviewDate,
            (countsByDate.get(prog.nextReviewDate) ?? 0) + 1
          );
        }
      }
    }

    const days: UpcomingScheduleItem[] = [];
    for (let offset = 0; offset < 10; offset++) {
      const date = addDaysToDateString(todayStr, offset);
      const label =
        offset === 0
          ? 'Today (Due)'
          : offset === 1
            ? 'Tomorrow'
            : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
      days.push({
        date,
        label,
        count: offset === 0 ? dueOrOverdueCount : (countsByDate.get(date) ?? 0),
      });
    }
    return days;
  }, [allCards, progressByCard, todayStr]);

  const calendarHeatmap = useMemo(() => {
    // Past 84 days (12 weeks) ending today
    const cells: DailyActivity[] = [];
    for (let offset = -83; offset <= 0; offset++) {
      const dateKey = addDaysToDateString(todayStr, offset);
      cells.push(
        state.dailyHistory[dateKey] ?? {
          date: dateKey,
          attempts: 0,
          successfulRepetitions: 0,
          mistakes: 0,
          cardsMastered: 0,
          reviewsCompleted: 0,
        }
      );
    }
    return cells;
  }, [state.dailyHistory, todayStr]);

  const buildQueue = useCallback(
    (mode: StudyMode, week?: WeekNumber, singleCardId?: string): Flashcard[] => {
      const preferredWeek = state.settings.preferredStartingWeek;

      if (mode === 'single-card' && singleCardId) {
        return allCards.filter((c) => c.id === singleCardId);
      }

      if (mode === 'daily-review') {
        // Remediation-locked cards first, then overdue/due reviews ordered by earliest nextReviewDate & lowest box
        const remediation = allCards.filter((c) => progressByCard.get(c.id)?.needsRemediationDrill);
        const due = allCards
          .filter((c) => isCardDueForReview(progressByCard.get(c.id), todayStr))
          .sort((a, b) => {
            const pa = progressByCard.get(a.id)!;
            const pb = progressByCard.get(b.id)!;
            if ((pa.nextReviewDate ?? '') !== (pb.nextReviewDate ?? '')) {
              return (pa.nextReviewDate ?? '').localeCompare(pb.nextReviewDate ?? '');
            }
            return pa.box - pb.box;
          });
        return [...remediation, ...due];
      }

      if (mode === 'continue') {
        // 1. In-progress learning/remediation cards
        const inLearning = allCards.filter((c) => progressByCard.get(c.id)?.status === 'learning');
        // 2. Due reviews
        const due = allCards.filter((c) => isCardDueForReview(progressByCard.get(c.id), todayStr));
        // 3. Unseen cards starting from preferredStartingWeek wrapping around Weeks 1..14
        const unseen = allCards
          .filter((c) => progressByCard.get(c.id)?.status === 'new')
          .sort((a, b) => {
            const wa = a.week >= preferredWeek ? a.week - preferredWeek : a.week + 14 - preferredWeek;
            const wb = b.week >= preferredWeek ? b.week - preferredWeek : b.week + 14 - preferredWeek;
            return wa - wb;
          });
        const merged = [...inLearning, ...due, ...unseen];
        return merged.length > 0 ? merged : allCards.filter((c) => c.week === preferredWeek);
      }

      if (mode === 'week-learn' && week) {
        const weekCards = allCards.filter((c) => c.week === week);
        const active = weekCards.filter(
          (c) =>
            progressByCard.get(c.id)?.status !== 'mastered' ||
            isCardDueForReview(progressByCard.get(c.id), todayStr)
        );
        return active.length > 0 ? active : weekCards;
      }

      if (mode === 'week-review' && week) {
        return allCards.filter(
          (c) =>
            c.week === week &&
            (isCardDueForReview(progressByCard.get(c.id), todayStr) ||
              progressByCard.get(c.id)?.needsRemediationDrill)
        );
      }

      if (mode === 'week-practice' && week) {
        return allCards.filter((c) => c.week === week);
      }

      // Mid-Semester Break Consolidation (reuses existing Weeks 1–8 cards — zero duplication!)
      const weeks1To8 = allCards.filter((c) => c.week >= 1 && c.week <= 8);
      if (mode === 'consolidation-missed') {
        return weeks1To8.filter((c) => (progressByCard.get(c.id)?.totalMistakes ?? 0) > 0);
      }
      if (mode === 'consolidation-overdue') {
        return weeks1To8.filter(
          (c) =>
            isCardDueForReview(progressByCard.get(c.id), todayStr) ||
            progressByCard.get(c.id)?.needsRemediationDrill
        );
      }
      if (mode === 'consolidation-box1') {
        return weeks1To8.filter((c) => progressByCard.get(c.id)?.box === 1);
      }
      if (mode === 'consolidation-all') {
        return [...weeks1To8].sort((a, b) => {
          const pa = progressByCard.get(a.id)!;
          const pb = progressByCard.get(b.id)!;
          return pb.totalMistakes - pa.totalMistakes || pa.box - pb.box;
        });
      }

      // Milestone Assessment Prep Modes
      if (mode === 'test-1') {
        // Prioritizes Week 7 Test 1 Milestone deck + unmastered/due Weeks 1–6 cards
        const w7 = allCards.filter((c) => c.week === 7);
        const w1To6 = allCards.filter((c) => c.week >= 1 && c.week <= 6);
        return [...w7, ...w1To6];
      }

      if (mode === 'test-2') {
        // Prioritizes Week 13 Test 2 Milestone deck + Weeks 8–12 & Week 6 cards
        const w13 = allCards.filter((c) => c.week === 13);
        const w8To12 = allCards.filter((c) => c.week >= 8 && c.week <= 12);
        return [...w13, ...w8To12];
      }

      // Final Examination Master Revision modes (draws from ALL existing Weeks 1–14 cards)
      if (mode === 'final-due') {
        return allCards.filter(
          (c) =>
            isCardDueForReview(progressByCard.get(c.id), todayStr) ||
            progressByCard.get(c.id)?.needsRemediationDrill
        );
      }
      if (mode === 'final-failed') {
        return allCards
          .filter((c) => (progressByCard.get(c.id)?.totalMistakes ?? 0) > 0)
          .sort(
            (a, b) =>
              (progressByCard.get(b.id)?.totalMistakes ?? 0) -
              (progressByCard.get(a.id)?.totalMistakes ?? 0)
          );
      }
      if (mode === 'final-formulas') {
        return allCards.filter((c) => c.category === 'formula');
      }
      if (mode === 'final-definitions') {
        return allCards.filter((c) => c.category === 'definition' || c.category === 'concept');
      }
      if (mode === 'final-proofs') {
        return allCards.filter((c) => c.category === 'proof');
      }
      if (mode === 'final-examples') {
        return allCards.filter((c) => c.category === 'worked-example');
      }

      // Default `final-all`: Week 14 synthesis + overdue/remediation + missed + remaining course deck
      return [...allCards].sort((a, b) => {
        const pa = progressByCard.get(a.id)!;
        const pb = progressByCard.get(b.id)!;
        const dueA = isCardDueForReview(pa, todayStr) || pa.needsRemediationDrill ? 1 : 0;
        const dueB = isCardDueForReview(pb, todayStr) || pb.needsRemediationDrill ? 1 : 0;
        if (dueA !== dueB) return dueB - dueA;
        if (a.week === 14 && b.week !== 14) return -1;
        if (b.week === 14 && a.week !== 14) return 1;
        if (pa.totalMistakes !== pb.totalMistakes) return pb.totalMistakes - pa.totalMistakes;
        return pa.box - pb.box;
      });
    },
    [allCards, progressByCard, state.settings.preferredStartingWeek, todayStr]
  );

  return {
    todayStr,
    progressByCard,
    weekStatsList,
    overallStats,
    upcomingSchedule,
    calendarHeatmap,
    buildQueue,
  };
}
