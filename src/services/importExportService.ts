import {
  CardProgress,
  DailyActivity,
  ExportKind,
  Flashcard,
  ImportConflictStrategy,
  ImportValidationPreview,
  PersistedAppState,
  WeekNumber,
} from '../types';
import {
  CURRENT_SCHEMA_VERSION,
  isValidWeekNumber,
  sanitizeCardProgress,
  sanitizeDailyActivity,
  sanitizeFlashcard,
  sanitizeSettings,
} from './storageService';

export const JSON_SCHEMA_DOCUMENTATION = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WIX1001 Import/Export Payload",
  "type": "object",
  "properties": {
    "exportType": {
      "enum": ["full-deck", "week-deck", "progress", "complete-backup"]
    },
    "schemaVersion": { "type": "integer", "const": 2 },
    "exportedAt": { "type": "string", "format": "date-time" },
    "cards": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "week", "question", "answer"],
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "week": { "type": "integer", "minimum": 1, "maximum": 14 },
          "topic": { "type": "string" },
          "category": {
            "enum": ["definition", "formula", "worked-example", "proof", "concept"]
          },
          "question": { "type": "string", "minLength": 1 },
          "answer": { "type": "string", "minLength": 1 },
          "answerLatex": { "type": "string" },
          "acceptedVariants": { "type": "array", "items": { "type": "string" } },
          "caseSensitive": { "type": "boolean", "default": true },
          "formatHint": { "type": "string" },
          "explanation": { "type": "string" }
        }
      }
    },
    "progress": { "type": "object" },
    "dailyHistory": { "type": "object" },
    "settings": { "type": "object" }
  }
}`;

export const EXAMPLE_CUSTOM_DECK = {
  exportType: 'week-deck',
  schemaVersion: CURRENT_SCHEMA_VERSION,
  course: 'WIX1001 Mathematics for Computing 1',
  exportedAt: '2026-10-22T08:00:00.000Z',
  cards: [
    {
      id: 'custom-w05-euclid-01',
      week: 5,
      topic: 'Custom Tutorial · Euclidean Divisibility',
      category: 'proof',
      question:
        'If $d \\mid a$ and $d \\mid b$ for integers $a, b, d$ ($d \\neq 0$), does $d$ always divide $ax + by$ for every $x, y \\in \\mathbb{Z}$? Answer `Yes` or `No`.',
      answer: 'Yes',
      answerLatex: 'd \\mid a \\land d \\mid b \\implies \\forall x, y \\in \\mathbb{Z},\\; d \\mid (ax + by)',
      acceptedVariants: [],
      caseSensitive: false,
      formatHint: 'Yes or No',
      explanation:
        'Write $a = dk_1$ and $b = dk_2$ ($k_1, k_2 \\in \\mathbb{Z}$). Then $ax + by = d(k_1 x + k_2 y)$, proving $d \\mid (ax + by)$.',
      isCustom: true,
    },
    {
      id: 'custom-w11-bipartite-01',
      week: 11,
      topic: 'Custom Tutorial · Complete Bipartite Graph K_{m,n}',
      category: 'formula',
      question:
        'How many edges $|E|$ are in the complete bipartite graph $K_{3,4}$?',
      answer: '12',
      answerLatex: '|E(K_{3,4})| = 3 \\times 4 = 12',
      acceptedVariants: ['3 * 4'],
      caseSensitive: true,
      formatHint: 'Integer value',
      explanation:
        'Each of the $m = 3$ vertices in part $V_1$ connects to all $n = 4$ vertices in part $V_2$, giving $m \\cdot n = 3 \\times 4 = 12$ edges.',
      isCustom: true,
    },
  ],
};

export interface BuildExportOptions {
  kind: ExportKind;
  allCards: Flashcard[];
  state: PersistedAppState;
  week?: WeekNumber;
}

export function createExportJsonString({
  kind,
  allCards,
  state,
  week = 1,
}: BuildExportOptions): { filename: string; content: string } {
  const dateStamp = new Date().toISOString().slice(0, 10);

  if (kind === 'full-deck') {
    return {
      filename: `wix1001-full-deck-${dateStamp}.json`,
      content: JSON.stringify(
        {
          exportType: 'full-deck',
          schemaVersion: CURRENT_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
          cards: allCards,
        },
        null,
        2
      ),
    };
  }

  if (kind === 'week-deck') {
    const filtered = allCards.filter((c) => c.week === week);
    return {
      filename: `wix1001-week-${String(week).padStart(2, '0')}-deck-${dateStamp}.json`,
      content: JSON.stringify(
        {
          exportType: 'week-deck',
          week,
          schemaVersion: CURRENT_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
          cards: filtered,
        },
        null,
        2
      ),
    };
  }

  if (kind === 'progress') {
    return {
      filename: `wix1001-learning-progress-${dateStamp}.json`,
      content: JSON.stringify(
        {
          exportType: 'progress',
          schemaVersion: CURRENT_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
          progress: state.progress,
          dailyHistory: state.dailyHistory,
          lastActiveCardId: state.lastActiveCardId,
        },
        null,
        2
      ),
    };
  }

  return {
    filename: `wix1001-complete-backup-${dateStamp}.json`,
    content: JSON.stringify(
      {
        exportType: 'complete-backup',
        schemaVersion: CURRENT_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        cards: allCards,
        customCards: state.customCards,
        replacedCurriculumCards: state.replacedCurriculumCards,
        progress: state.progress,
        dailyHistory: state.dailyHistory,
        settings: state.settings,
        lastActiveCardId: state.lastActiveCardId,
      },
      null,
      2
    ),
  };
}

export function triggerJsonDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

const KNOWN_CARD_KEYS = new Set([
  'id',
  'week',
  'topic',
  'category',
  'question',
  'answer',
  'answerLatex',
  'acceptedVariants',
  'caseSensitive',
  'formatHint',
  'explanation',
  'isCustom',
]);

/**
 * Pure validation & preview analyzer for any JSON string selected by the user.
 * Never evaluates code; uses strict `JSON.parse` + structural checks.
 */
export function validateImportJson(
  rawJson: string,
  existingCards: Flashcard[]
): ImportValidationPreview {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawJson || !rawJson.trim()) {
    return {
      valid: false,
      errors: ['Selected file is empty.'],
      warnings: [],
      detectedType: 'unknown',
      cards: [],
      weeksCovered: [],
      duplicateIdsWithExisting: [],
      internalDuplicateIds: [],
      progressEntriesCount: 0,
      hasSettings: false,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    return {
      valid: false,
      errors: [
        `Invalid JSON syntax: ${err instanceof Error ? err.message : 'Unable to parse file.'}`,
      ],
      warnings: [],
      detectedType: 'unknown',
      cards: [],
      weeksCovered: [],
      duplicateIdsWithExisting: [],
      internalDuplicateIds: [],
      progressEntriesCount: 0,
      hasSettings: false,
    };
  }

  // Allow top-level array of flashcards as shorthand custom deck
  const rootObj: Record<string, unknown> = Array.isArray(parsed)
    ? { exportType: 'full-deck', cards: parsed }
    : parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};

  if (!Array.isArray(parsed) && (!parsed || typeof parsed !== 'object')) {
    return {
      valid: false,
      errors: ['JSON root must be an object or an array of flashcard objects.'],
      warnings: [],
      detectedType: 'unknown',
      cards: [],
      weeksCovered: [],
      duplicateIdsWithExisting: [],
      internalDuplicateIds: [],
      progressEntriesCount: 0,
      hasSettings: false,
    };
  }

  const hasCardsArray = Array.isArray(rootObj.cards);
  const hasProgressObj =
    Boolean(rootObj.progress) &&
    typeof rootObj.progress === 'object' &&
    !Array.isArray(rootObj.progress);
  const hasSettings =
    Boolean(rootObj.settings) &&
    typeof rootObj.settings === 'object' &&
    !Array.isArray(rootObj.settings);

  if (!hasCardsArray && !hasProgressObj && !hasSettings) {
    errors.push(
      'JSON does not contain recognizable `cards`, `progress`, or `settings` sections matching the WIX1001 schema.'
    );
  }

  const validCards: Flashcard[] = [];
  const seenIds = new Set<string>();
  const internalDuplicateIds: string[] = [];
  let ignoredFieldsCount = 0;

  if (hasCardsArray) {
    const rawCards = rootObj.cards as unknown[];
    rawCards.forEach((item, index) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`Card at index ${index} must be an object.`);
        return;
      }
      const itemObj = item as Record<string, unknown>;
      for (const key of Object.keys(itemObj)) {
        if (!KNOWN_CARD_KEYS.has(key)) {
          ignoredFieldsCount += 1;
        }
      }
      if (!isValidWeekNumber(itemObj.week)) {
        errors.push(`Card at index ${index} ("${String(itemObj.id ?? 'unnamed')}") has invalid week "${String(itemObj.week)}" (must be integer 1–14).`);
        return;
      }
      const clean = sanitizeFlashcard(itemObj);
      if (!clean) {
        errors.push(
          `Card at index ${index} is missing required non-empty string fields (\`id\`, \`question\`, or \`answer\`).`
        );
        return;
      }
      if (seenIds.has(clean.id)) {
        internalDuplicateIds.push(clean.id);
        warnings.push(`Duplicate card ID "${clean.id}" inside imported file (keeping first occurrence).`);
        return;
      }
      seenIds.add(clean.id);
      validCards.push(clean);
    });
  }

  if (ignoredFieldsCount > 0) {
    warnings.push(
      `${ignoredFieldsCount} unsupported extra property field(s) will be safely ignored.`
    );
  }

  const sanitizedProgress: Record<string, CardProgress> = {};
  if (hasProgressObj) {
    for (const [cardId, rawProg] of Object.entries(rootObj.progress as Record<string, unknown>)) {
      const cleanProg = sanitizeCardProgress(cardId, rawProg);
      if (cleanProg) {
        sanitizedProgress[cleanProg.cardId] = cleanProg;
      } else {
        warnings.push(`Skipped malformed progress record for "${cardId}".`);
      }
    }
  }

  const sanitizedHistory: Record<string, DailyActivity> = {};
  if (rootObj.dailyHistory && typeof rootObj.dailyHistory === 'object' && !Array.isArray(rootObj.dailyHistory)) {
    for (const [dateKey, entry] of Object.entries(rootObj.dailyHistory as Record<string, unknown>)) {
      const cleanHist = sanitizeDailyActivity(dateKey, entry);
      if (cleanHist) {
        sanitizedHistory[dateKey] = cleanHist;
      }
    }
  }

  const existingIds = new Set(existingCards.map((c) => c.id));
  const duplicateIdsWithExisting = validCards
    .map((c) => c.id)
    .filter((id) => existingIds.has(id));

  const weeksCovered = Array.from(new Set(validCards.map((c) => c.week))).sort(
    (a, b) => a - b
  ) as WeekNumber[];

  const detectedType: ImportValidationPreview['detectedType'] =
    hasCardsArray && (hasProgressObj || hasSettings)
      ? 'complete-backup'
      : hasCardsArray
        ? 'deck'
        : hasProgressObj
          ? 'progress'
          : 'unknown';

  if (hasCardsArray && validCards.length === 0 && errors.length === 0) {
    errors.push('The `cards` array contains 0 valid flashcards.');
  }

  return {
    valid: errors.length === 0 && detectedType !== 'unknown',
    errors,
    warnings,
    detectedType,
    cards: validCards,
    weeksCovered,
    duplicateIdsWithExisting,
    internalDuplicateIds,
    progressEntriesCount: Object.keys(sanitizedProgress).length,
    hasSettings,
    rawPayload: {
      progress: sanitizedProgress,
      dailyHistory: sanitizedHistory,
      settings: hasSettings ? sanitizeSettings(rootObj.settings) : undefined,
      lastActiveCardId:
        typeof rootObj.lastActiveCardId === 'string' ? rootObj.lastActiveCardId : undefined,
    },
  };
}

/**
 * Applies a validated import preview to current app state using either `merge` or `replace` strategy.
 * Protects existing progress records in `merge` mode unless explicitly replacing via backup.
 */
export function applyValidatedImport(
  currentState: PersistedAppState,
  defaultCards: Flashcard[],
  preview: ImportValidationPreview,
  strategy: ImportConflictStrategy
): PersistedAppState {
  if (!preview.valid) {
    return currentState;
  }

  const nextState: PersistedAppState = {
    ...currentState,
    progress: { ...currentState.progress },
    dailyHistory: { ...currentState.dailyHistory },
    customCards: [...currentState.customCards],
  };

  if (preview.cards.length > 0) {
    if (strategy === 'replace') {
      nextState.replacedCurriculumCards = preview.cards;
      nextState.customCards = [];
    } else {
      // Merge mode: update matching cards or append new custom cards without discarding existing curriculum
      const baseCards = currentState.replacedCurriculumCards ?? defaultCards;
      const baseMap = new Map(baseCards.map((c) => [c.id, c]));
      const customMap = new Map(currentState.customCards.map((c) => [c.id, c]));

      for (const incoming of preview.cards) {
        if (baseMap.has(incoming.id)) {
          baseMap.set(incoming.id, incoming);
        } else {
          customMap.set(incoming.id, { ...incoming, isCustom: true });
        }
      }

      if (currentState.replacedCurriculumCards) {
        nextState.replacedCurriculumCards = Array.from(baseMap.values());
      } else {
        // Check if any built-in card was modified during merge
        const modifiedBuiltIn = preview.cards.some((inc) =>
          defaultCards.some((def) => def.id === inc.id && JSON.stringify(def) !== JSON.stringify(inc))
        );
        if (modifiedBuiltIn) {
          nextState.replacedCurriculumCards = Array.from(baseMap.values());
        }
      }
      nextState.customCards = Array.from(customMap.values());
    }
  }

  // Apply progress safely
  if (preview.rawPayload?.progress && preview.progressEntriesCount > 0) {
    if (strategy === 'replace') {
      nextState.progress = { ...preview.rawPayload.progress };
    } else {
      // Merge protects existing progress unless the card had no saved progress yet
      for (const [id, incomingProg] of Object.entries(preview.rawPayload.progress)) {
        const existing = nextState.progress[id];
        if (!existing || existing.totalAttempts === 0) {
          nextState.progress[id] = incomingProg;
        }
      }
    }
  }

  if (preview.rawPayload?.dailyHistory && Object.keys(preview.rawPayload.dailyHistory).length > 0) {
    if (strategy === 'replace') {
      nextState.dailyHistory = { ...preview.rawPayload.dailyHistory };
    } else {
      for (const [dateKey, entry] of Object.entries(preview.rawPayload.dailyHistory)) {
        if (!nextState.dailyHistory[dateKey]) {
          nextState.dailyHistory[dateKey] = entry;
        }
      }
    }
  }

  if (preview.hasSettings && preview.rawPayload?.settings) {
    nextState.settings = preview.rawPayload.settings;
  }

  return nextState;
}
