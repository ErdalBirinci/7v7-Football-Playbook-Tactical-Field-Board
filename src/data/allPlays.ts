import { Play, FormationCategory, PlayType, Direction } from '../types';
import { TRIPS_PASS_PLAYS } from './plays/tripsPass';
import { TRIPS_RUN_PLAYS } from './plays/tripsRun';
import { TWINS_PASS_PLAYS } from './plays/twinsPass';
import { TWINS_RUN_PLAYS } from './plays/twinsRun';
import { EMPTY_PASS_PLAYS } from './plays/emptyPass';
import { EMPTY_RUN_PLAYS } from './plays/emptyRun';
import { TWO_LINE_PASS_PLAYS } from './plays/twoLinePass';
import { TWO_LINE_RUN_PLAYS } from './plays/twoLineRun';
import { ONE_LINE_PLAYS } from './plays/oneLine';
import { SPLIT_PLAYS } from './plays/split';

export const ALL_PLAYBOOK_PLAYS: Play[] = [
  ...TRIPS_PASS_PLAYS,
  ...TRIPS_RUN_PLAYS,
  ...TWINS_PASS_PLAYS,
  ...TWINS_RUN_PLAYS,
  ...EMPTY_PASS_PLAYS,
  ...EMPTY_RUN_PLAYS,
  ...TWO_LINE_PASS_PLAYS,
  ...TWO_LINE_RUN_PLAYS,
  ...ONE_LINE_PLAYS,
  ...SPLIT_PLAYS,
];

export const CATEGORIES: FormationCategory[] = [
  'TRIPS PASS',
  'TRIPS RUN',
  'TWINS PASS',
  'TWINS RUN',
  'EMPTY PASS',
  'EMPTY RUN',
  '2 LINE PASS',
  '2 LINE RUN',
  '1 LINE PASS',
  '1 LINE RUN',
  'SPLIT PASS',
  'SPLIT RUN',
];

export function getPlayById(id: string): Play | undefined {
  return ALL_PLAYBOOK_PLAYS.find((p) => p.id === id);
}

export function searchPlays(query: string, options: {
  category?: string;
  playType?: PlayType | 'ALL';
  direction?: Direction | 'ALL';
} = {}): Play[] {
  const cleanQ = query.toLowerCase().trim();

  return ALL_PLAYBOOK_PLAYS.filter((play) => {
    // Filter by category
    if (options.category && options.category !== 'ALL' && play.category !== options.category) {
      return false;
    }

    // Filter by play type
    if (options.playType && options.playType !== 'ALL' && play.playType !== options.playType) {
      return false;
    }

    // Filter by direction
    if (options.direction && options.direction !== 'ALL' && play.direction !== options.direction && play.direction !== 'BALANCED') {
      return false;
    }

    if (!cleanQ) return true;

    // Match code, playNumber, englishName, originalTurkishCode, tags, concept
    const matchNumber = String(play.playNumber).toLowerCase().includes(cleanQ);
    const matchCode = play.code.toLowerCase().includes(cleanQ);
    const matchEnglish = play.englishName.toLowerCase().includes(cleanQ);
    const matchTurkish = play.originalTurkishCode.toLowerCase().includes(cleanQ);
    const matchTags = play.tags.some((t) => t.toLowerCase().includes(cleanQ));
    const matchConcept = play.conceptName.toLowerCase().includes(cleanQ);
    const matchCategory = play.category.toLowerCase().includes(cleanQ);

    return matchNumber || matchCode || matchEnglish || matchTurkish || matchTags || matchConcept || matchCategory;
  });
}
