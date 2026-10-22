import { Flashcard, WeekNumber } from '../types';
import { CARDS_WEEKS_1_TO_7 } from './cardsPart1';
import { CARDS_WEEKS_8_TO_14 } from './cardsPart2';

export const DEFAULT_CARDS: Flashcard[] = [...CARDS_WEEKS_1_TO_7, ...CARDS_WEEKS_8_TO_14];

export function getCardsByWeek(cards: Flashcard[], week: WeekNumber): Flashcard[] {
  return cards.filter((card) => card.week === week);
}
