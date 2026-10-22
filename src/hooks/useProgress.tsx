import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CARDS } from '../data/cardDefinitions';
import {
  applyDrillSubmission,
  applyScheduledReviewSubmission,
  createInitialCardProgress,
  startCardDrill,
  TransitionOutcome,
  updateDailyHistory,
} from '../services/reviewScheduler';
import { applyValidatedImport } from '../services/importExportService';
import {
  createDefaultAppState,
  getStorageDiagnostics,
  LEGACY_STORAGE_KEY,
  loadPersistedState,
  migrateAndSanitizeState,
  safeRemoveRaw,
  savePersistedState,
  STORAGE_KEY,
  StorageDiagnostics,
} from '../services/storageService';
import {
  CardProgress,
  Flashcard,
  ImportConflictStrategy,
  ImportValidationPreview,
  PersistedAppState,
  UserSettings,
  WeekNumber,
} from '../types';

interface ProgressContextValue {
  state: PersistedAppState;
  allCards: Flashcard[];
  diagnostics: StorageDiagnostics;
  getCardProgress: (cardId: string) => CardProgress;
  markDrillStarted: (cardId: string) => void;
  submitDrillAttempt: (cardId: string, isCorrect: boolean) => TransitionOutcome;
  submitReviewAttempt: (cardId: string, isCorrect: boolean) => TransitionOutcome;
  updateSettings: (patch: Partial<UserSettings>) => void;
  resetWeekProgress: (week: WeekNumber) => void;
  resetStatistics: () => void;
  clearAllData: () => void;
  applyImport: (preview: ImportValidationPreview, strategy: ImportConflictStrategy) => void;
  removeCustomCard: (cardId: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedAppState>(() => loadPersistedState());
  const [diagnostics, setDiagnostics] = useState<StorageDiagnostics>(() =>
    getStorageDiagnostics()
  );
  const isFirstRender = useRef(true);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  // Persist to LocalStorage only when state actually changes after hydration
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    savePersistedState(state);
    setDiagnostics(getStorageDiagnostics());
  }, [state]);

  // Listen for cross-tab storage synchronization
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(migrateAndSanitizeState(JSON.parse(e.newValue)));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const allCards = useMemo<Flashcard[]>(() => {
    const base = state.replacedCurriculumCards ?? DEFAULT_CARDS;
    const seen = new Set<string>();
    const combined: Flashcard[] = [];
    for (const card of [...base, ...state.customCards]) {
      if (!seen.has(card.id)) {
        seen.add(card.id);
        combined.push(card);
      }
    }
    return combined;
  }, [state.replacedCurriculumCards, state.customCards]);

  const getCardProgress = useCallback(
    (cardId: string): CardProgress => {
      return state.progress[cardId] ?? createInitialCardProgress(cardId);
    },
    [state.progress]
  );

  const markDrillStarted = useCallback((cardId: string) => {
    setState((prev) => {
      const current = prev.progress[cardId] ?? createInitialCardProgress(cardId);
      const next = startCardDrill(current);
      if (
        prev.lastActiveCardId === cardId &&
        current.status === next.status &&
        current.currentStreak === next.currentStreak
      ) {
        return prev;
      }
      return {
        ...prev,
        lastActiveCardId: cardId,
        progress: {
          ...prev.progress,
          [cardId]: next,
        },
      };
    });
  }, []);

  const submitDrillAttempt = useCallback(
    (cardId: string, isCorrect: boolean): TransitionOutcome => {
      let capturedOutcome: TransitionOutcome | null = null;
      const now = new Date();

      setState((prev) => {
        const current = prev.progress[cardId] ?? createInitialCardProgress(cardId);
        const outcome = applyDrillSubmission(current, isCorrect, now);
        capturedOutcome = outcome;

        return {
          ...prev,
          lastActiveCardId: cardId,
          progress: {
            ...prev.progress,
            [cardId]: outcome.nextProgress,
          },
          dailyHistory: updateDailyHistory(prev.dailyHistory, outcome, isCorrect, now),
        };
      });

      if (!capturedOutcome) {
        const current = state.progress[cardId] ?? createInitialCardProgress(cardId);
        return applyDrillSubmission(current, isCorrect, now);
      }
      return capturedOutcome;
    },
    [state.progress]
  );

  const submitReviewAttempt = useCallback(
    (cardId: string, isCorrect: boolean): TransitionOutcome => {
      let capturedOutcome: TransitionOutcome | null = null;
      const now = new Date();

      setState((prev) => {
        const current = prev.progress[cardId] ?? createInitialCardProgress(cardId);
        const outcome = applyScheduledReviewSubmission(current, isCorrect, now);
        capturedOutcome = outcome;

        return {
          ...prev,
          lastActiveCardId: cardId,
          progress: {
            ...prev.progress,
            [cardId]: outcome.nextProgress,
          },
          dailyHistory: updateDailyHistory(prev.dailyHistory, outcome, isCorrect, now),
        };
      });

      if (!capturedOutcome) {
        const current = state.progress[cardId] ?? createInitialCardProgress(cardId);
        return applyScheduledReviewSubmission(current, isCorrect, now);
      }
      return capturedOutcome;
    },
    [state.progress]
  );

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...patch,
      },
    }));
  }, []);

  const resetWeekProgress = useCallback(
    (week: WeekNumber) => {
      const weekCardIds = new Set(allCards.filter((c) => c.week === week).map((c) => c.id));
      setState((prev) => {
        const nextProgress = { ...prev.progress };
        for (const id of weekCardIds) {
          delete nextProgress[id];
        }
        return {
          ...prev,
          progress: nextProgress,
          lastActiveCardId:
            prev.lastActiveCardId && weekCardIds.has(prev.lastActiveCardId)
              ? null
              : prev.lastActiveCardId,
        };
      });
    },
    [allCards]
  );

  const resetStatistics = useCallback(() => {
    setState((prev) => ({
      ...prev,
      progress: {},
      dailyHistory: {},
      lastActiveCardId: null,
    }));
  }, []);

  const clearAllData = useCallback(() => {
    safeRemoveRaw(STORAGE_KEY);
    safeRemoveRaw(LEGACY_STORAGE_KEY);
    safeRemoveRaw(`${STORAGE_KEY}_corrupted_backup`);
    const clean = createDefaultAppState();
    savePersistedState(clean);
    setState(clean);
  }, []);

  const applyImport = useCallback(
    (preview: ImportValidationPreview, strategy: ImportConflictStrategy) => {
      setState((prev) => applyValidatedImport(prev, DEFAULT_CARDS, preview, strategy));
    },
    []
  );

  const removeCustomCard = useCallback((cardId: string) => {
    setState((prev) => {
      const nextProgress = { ...prev.progress };
      delete nextProgress[cardId];
      return {
        ...prev,
        customCards: prev.customCards.filter((c) => c.id !== cardId),
        progress: nextProgress,
      };
    });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      allCards,
      diagnostics,
      getCardProgress,
      markDrillStarted,
      submitDrillAttempt,
      submitReviewAttempt,
      updateSettings,
      resetWeekProgress,
      resetStatistics,
      clearAllData,
      applyImport,
      removeCustomCard,
    }),
    [
      state,
      allCards,
      diagnostics,
      getCardProgress,
      markDrillStarted,
      submitDrillAttempt,
      submitReviewAttempt,
      updateSettings,
      resetWeekProgress,
      resetStatistics,
      clearAllData,
      applyImport,
      removeCustomCard,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
