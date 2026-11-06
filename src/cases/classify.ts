/**
 * Proper noun entity classification (place vs. person).
 *
 * Implements heuristic discrimination between toponyms and personal names
 * based on spatial cases, nature formatives, compound prefixes, and municipality registries.
 *
 * @packageDocumentation
 */

import type { LocalCaseType } from './types.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  IRREGULAR_PLACES
} from '../place/municipalities.data.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';

const GEOGRAPHIC_PREFIX_REGEX = /^(?:Pohjois|Etelä|Itä|Länsi|Keski|Ylä|Ala|Taka|Etu)-/i;

const WORD_DERIVED_GIVEN_NAMES = new Set([
  'tuuli',
  'meri',
  'pilvi',
  'helmi',
  'suvi',
  'lumi',
  'sini'
]);

const PLACE_SUFFIX_REGEX = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|saaret|niemi|vaara|harju|kangas|suo|lampi|nummi|kylä|linna|lahti|maa|rannikko|laakso|kunta|kunnat|tasavalta|tasavallat|vallat|maat|emiraatit)$/i;

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

  if (WORD_DERIVED_GIVEN_NAMES.has(trimmed.toLowerCase())) {
    return 'person';
  }

  if (matchNatureNoun(trimmed) || PLACE_SUFFIX_REGEX.test(trimmed)) {
    return 'place';
  }

  if (hasPlacePrefix(trimmed) || hasStateTitlePrefix(trimmed)) {
    return 'place';
  }

  return 'person';
}
