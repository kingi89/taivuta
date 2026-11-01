/**
 * Compound word decomposition, token concordance, and entity classification.
 *
 * Implements Finnish compound prefix concordance (e.g. Uudessa-Seelannissa vs. Pohjois-Karjalassa)
 * and heuristic structural classification between person and place proper nouns.
 *
 * @packageDocumentation
 */

import type { GrammaticalCase, LocalCaseType } from '../cases/types.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  IRREGULAR_PLACES
} from '../place/municipalities.data.ts';
import { matchNatureNoun } from './nature-nouns.ts';

/**
 * Compound prefixes whose modifier inflects congruently with the head noun (e.g. Uusi-Seelanti, Iso-Britannia).
 */
const INFLECTING_PREFIXES: Readonly<Record<string, Readonly<Record<GrammaticalCase, string>>>> = {
  'Uusi-': {
    nominative: 'Uusi-',
    genitive: 'Uuden-',
    partitive: 'Uutta-',
    inessive: 'Uudessa-',
    elative: 'Uudesta-',
    illative: 'Uuteen-',
    adessive: 'Uudella-',
    ablative: 'Uudelta-',
    allative: 'Uudelle-',
    essive: 'Uutena-',
    translative: 'Uudeksi-'
  },
  'Iso-': {
    nominative: 'Iso-',
    genitive: 'Ison-',
    partitive: 'Isoa-',
    inessive: 'Isossa-',
    elative: 'Isosta-',
    illative: 'Isoon-',
    adessive: 'Isolla-',
    ablative: 'Isolta-',
    allative: 'Isolle-',
    essive: 'Isona-',
    translative: 'Isoksi-'
  }
};

const GEOGRAPHIC_PREFIX_REGEX = /^(?:Pohjois|Etelä|Itä|Länsi|Keski|Ylä|Ala|Taka|Etu)-/i;

const PLACE_SUFFIX_REGEX = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|saaret|niemi|vaara|harju|kangas|suo|lampi|nummi|kylä|linna|lahti|maa|rannikko|laakso|kunta|kunnat|tasavalta|tasavallat|vallat|maat|emiraatit)$/i;

/**
 * Decomposed components of a compound proper noun.
 */
export interface CompoundParts {
  /** Leading prefix or modifier (e.g. 'Uudessa-', 'Pohjois-', 'Kari-') */
  readonly prefix: string;
  /** Head word that receives main inflection (e.g. 'Seelanti', 'Karjala', 'Pekka') */
  readonly headWord: string;
  /** Whether the prefix itself inflects congruently */
  readonly isInflectingPrefix: boolean;
}

/**
 * Decomposes a hyphenated compound proper noun into its prefix and head word.
 *
 * @param name - The compound proper noun (e.g. "Uusi-Seelanti", "Pohjois-Karjala", "Kari-Pekka").
 * @param targetCase - Optional target case to inflect inflecting prefixes immediately.
 * @returns Decomposed parts or null if the name is not hyphenated.
 *
 * @example
 * ```ts
 * decomposeCompound("Uusi-Seelanti", "inessive");
 * // { prefix: "Uudessa-", headWord: "Seelanti", isInflectingPrefix: true }
 * ```
 */
export function decomposeCompound(
  name: string,
  targetCase: GrammaticalCase = 'nominative'
): CompoundParts | null {
  const match = name.match(/^(.*?\b)(Uusi-|Iso-)(.+)$/);
  if (match) {
    const pre = match[1] ?? '';
    const rawPrefix = match[2] ?? '';
    const headWord = match[3] ?? '';
    const declensionTable = INFLECTING_PREFIXES[rawPrefix];
    const inflectedPrefix = declensionTable?.[targetCase] ?? rawPrefix;
    return {
      prefix: `${pre}${inflectedPrefix}`,
      headWord,
      isInflectingPrefix: true
    };
  }

  const hyphenIdx = name.indexOf('-');
  if (hyphenIdx === -1 || hyphenIdx === name.length - 1) {
    return null;
  }

  return {
    prefix: name.slice(0, hyphenIdx + 1),
    headWord: name.slice(hyphenIdx + 1),
    isInflectingPrefix: false
  };
}

function isKnownPlaceDataset(name: string): boolean {
  return (
    IRREGULAR_PLACES.has(name) ||
    EXTERNAL_CASE_MUNICIPALITIES.has(name) ||
    ISLAND_INTERNAL_EXCEPTIONS.has(name)
  );
}

function hasPlacePrefix(name: string): boolean {
  return (
    name.startsWith('Uusi-') ||
    name.startsWith('Iso-') ||
    GEOGRAPHIC_PREFIX_REGEX.test(name)
  );
}

function hasStateTitlePrefix(name: string): boolean {
  return (
    name.startsWith('Yhdistyneet ') ||
    name.startsWith('Yhdistynyt ') ||
    name.startsWith('San ') ||
    name.startsWith('Saint ')
  );
}

/**
 * Heuristically classifies whether a proper noun represents a place or a person.
 *
 * Evaluates structural markers, nature formatives, compound prefixes, and known exception registries.
 *
 * Note: This heuristic makes an educated guess and does not guarantee that a match is a place name.
 * Surnames of toponymic origin (such as "Karhuvaara" or "Ylä-Anttila") match geographic patterns;
 * callers handling ambiguous proper nouns should specify an explicit role option when certainty is required.
 *
 * @param name - Proper noun to classify (e.g. "Tampere", "Uusi-Seelanti", "Matti", "Virtanen").
 * @param defaultSpatialCase - Optional spatial case hint if already resolved.
 * @returns 'place' if matched against toponymic markers; otherwise 'person'.
 *
 * @example
 * ```ts
 * classifyProperNoun("Uusi-Seelanti"); // "place"
 * classifyProperNoun("Matti");         // "person"
 * ```
 */
export function classifyProperNoun(
  name: string,
  defaultSpatialCase?: LocalCaseType
): 'person' | 'place' {
  if (!name) {
    return 'person';
  }

  const trimmed = name.trim();

  if (defaultSpatialCase === 'on' || isKnownPlaceDataset(trimmed)) {
    return 'place';
  }

  if (matchNatureNoun(trimmed) || PLACE_SUFFIX_REGEX.test(trimmed)) {
    return 'place';
  }

  if (hasPlacePrefix(trimmed) || hasStateTitlePrefix(trimmed)) {
    return 'place';
  }

  return 'person';
}
