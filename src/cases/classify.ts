/**
 * Proper noun entity classification (place vs. person).
 *
 * Implements heuristic discrimination between toponyms and personal names
 * based on spatial cases, nature formatives, compound prefixes, and municipality registries.
 *
 * @packageDocumentation
 */

import type { LocalCaseType } from './types.ts';
import { sanitizeInput } from '../morphology/guards.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  IRREGULAR_PLACES
} from '../place/municipalities.data.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';

const GEOGRAPHIC_PREFIX_REGEX = /^(?:Pohjois|Etelä|Itä|Länsi|Keski|Ylä|Ala|Taka|Etu)-/i;

const GEOPOLITICAL_MULTIWORD_REGEX =
  /\b(?:kunta|kunnat|tasavalta|tasavallat|emiraatit|emiirikunnat|kuningaskunta|saaret)$|\sja\s/i;

const GIVEN_NAME_NATURE_SUFFIX_REGEX = /(?:tuuli|meri|pilvi|helmi|suvi|lumi|sini)$/i;

const PLACE_SUFFIX_REGEX =
  /(?:järvi|joki|mäki|vesi|koski|salmi|saari|saaret|niemi|vaara|harju|kangas|suo|lampi|nummi|kylä|linna|lahti|maa|rannikko|laakso|kunta|kunnat|tasavalta|tasavallat|vallat|maat|emiraatit)$/i;

function isKnownPlaceDataset(name: string): boolean {
  return (
    IRREGULAR_PLACES.has(name) ||
    EXTERNAL_CASE_MUNICIPALITIES.has(name) ||
    ISLAND_INTERNAL_EXCEPTIONS.has(name)
  );
}

function hasPlacePrefix(name: string): boolean {
  if (/\s/.test(name)) {
    return false;
  }
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
 * Stage 1: Checks whether the input matches an explicit place dataset or multi-word/hyphenated place marker.
 */
function isExplicitPlace(trimmed: string): boolean {
  return (
    isKnownPlaceDataset(trimmed) ||
    hasPlacePrefix(trimmed) ||
    hasStateTitlePrefix(trimmed) ||
    GEOPOLITICAL_MULTIWORD_REGEX.test(trimmed)
  );
}

/**
 * Stage 2: Checks whether the input is a multi-word/hyphenated personal name or word-derived given name.
 */
function isCompoundOrGivenPersonName(trimmed: string): boolean {
  return /[\s-]/.test(trimmed) || GIVEN_NAME_NATURE_SUFFIX_REGEX.test(trimmed);
}

/**
 * Stage 3: Checks whether a single-word token matches morphological place markers.
 */
function isMorphologicalPlace(trimmed: string, defaultSpatialCase?: LocalCaseType): boolean {
  return (
    defaultSpatialCase === 'on' ||
    matchNatureNoun(trimmed) !== null ||
    PLACE_SUFFIX_REGEX.test(trimmed)
  );
}

/**
 * Heuristically classifies whether a proper noun represents a place or a person.
 *
 * Evaluates proper nouns through a 4-stage pipeline:
 * 1. Explicit place datasets, geographic compound prefixes, and geopolitical multi-word markers.
 * 2. Multi-word/hyphenated personal names and word-derived given names.
 * 3. Single-word morphological place markers (external spatial case, nature formatives, toponym suffixes).
 * 4. Default fallback to 'person'.
 *
 * Note: This heuristic makes an educated guess and does not guarantee that a match is a place name.
 * Single-word surnames of toponymic origin (such as "Karhuvaara" or "Niemi") match geographic patterns;
 * callers handling ambiguous proper nouns should specify an explicit role option when certainty is required.
 *
 * @param name - Proper noun to classify (e.g. "Tampere", "Uusi-Seelanti", "Matti Niemi", "Virtanen").
 * @param defaultSpatialCase - Optional spatial case hint if already resolved.
 * @returns 'place' if matched against toponymic markers; otherwise 'person'.
 *
 * @example
 * ```ts
 * classifyProperNoun("Uusi-Seelanti"); // "place"
 * classifyProperNoun("Matti Niemi");   // "person"
 * ```
 */
export function classifyProperNoun(
  name: string,
  defaultSpatialCase?: LocalCaseType
): 'person' | 'place' {
  const trimmed = sanitizeInput(name);
  if (!trimmed) {
    return 'person';
  }

  if (isExplicitPlace(trimmed)) {
    return 'place';
  }

  if (isCompoundOrGivenPersonName(trimmed)) {
    return 'person';
  }

  if (isMorphologicalPlace(trimmed, defaultSpatialCase)) {
    return 'place';
  }

  return 'person';
}
