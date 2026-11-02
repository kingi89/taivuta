/**
 * Canonical morphological stem paradigm generator for Finnish place names.
 *
 * Constructs StemParadigm models for vowel-ending, consonant-ending,
 * long-vowel, macron-vowel, and plural island toponyms.
 *
 * @packageDocumentation
 */

import type { LocalCaseType } from '../cases/types.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { createStemParadigm, type StemParadigm } from '../morphology/paradigm.ts';
import { GRADATION_RESISTANT_PLACES } from './municipalities.data.ts';

function resolveStandardPartitive(place: string): string {
  if (/(?:([aeiouyäö])\1|io|iö)$/i.test(place)) {
    return harmonize('ta', place);
  }
  return harmonize('a', place);
}

function resolveStandardIllative(place: string): string {
  if (/(?:ei|ay|uy|au)$/i.test(place)) {
    const last = place.slice(-1);
    const v = last === 'y' ? 'i' : last;
    return `${place}h${v}n`;
  }
  return `${place}${place.slice(-1)}n`;
}

function resolveSpecialPlaceParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm | null {
  if (/[āēīōū]$/i.test(place)) {
    return createStemParadigm(place, {
      strong: place,
      weak: place,
      partitive: `${place}${harmonize('ta', place)}`,
      illative: `${place}${harmonize('hon', place)}`
    }, { defaultSpatialCase });
  }

  if (place.toLowerCase().endsWith('saaret')) {
    const base = place.slice(0, -2);
    const stem = `${base}i`;
    return createStemParadigm(place, {
      strong: stem,
      weak: stem,
      partitive: `${stem}a`,
      illative: `${stem}in`,
      genitive: `${base}ten`
    }, { defaultSpatialCase, isPlural: true });
  }

  if (place.endsWith('nen')) {
    const stem = `${place.slice(0, -3)}se`;
    return createStemParadigm(place, {
      strong: stem,
      weak: stem,
      partitive: `${place.slice(0, -3)}${harmonize('sta', place)}`,
      illative: `${stem}en`
    }, { defaultSpatialCase });
  }

  return null;
}

function resolveVocalicPlaceParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm {
  if (/[bcdfghjklmnpqrstvwxz]$/i.test(place)) {
    const stem = `${place}i`;
    return createStemParadigm(place, {
      strong: stem,
      weak: stem,
      partitive: `${stem}${harmonize('a', place)}`,
      illative: `${stem}in`
    }, { defaultSpatialCase });
  }

  if (/(?:aa|ää|oo|öö|uu|yy|ii|ee)$/i.test(place)) {
    const illativeEnd = place.toLowerCase().endsWith('maa')
      ? 'han'
      : place === 'Ii'
        ? 'hin'
        : 'seen';
    return createStemParadigm(place, {
      strong: place,
      weak: place,
      partitive: `${place}${harmonize('ta', place)}`,
      illative: `${place}${illativeEnd}`
    }, { defaultSpatialCase });
  }

  const resists = GRADATION_RESISTANT_PLACES.has(place);
  const weakStem = resists ? place : weakenConsonants(place);
  return createStemParadigm(place, {
    strong: place,
    weak: weakStem,
    partitive: `${place}${resolveStandardPartitive(place)}`,
    illative: resolveStandardIllative(place)
  }, { defaultSpatialCase });
}

/**
 * Builds the canonical morphological StemParadigm for a Finnish place name.
 *
 * @param place - Nominative place name (e.g. "Turku", "Finström", "Espoo", "Kanariansaaret").
 * @param defaultSpatialCase - Default spatial case preference ('in' vs 'on').
 * @returns Fully constructed StemParadigm.
 *
 * @example
 * ```ts
 * const p = getPlaceParadigm("Turku", "in");
 * assembleCase(p, "genitive"); // "Turun"
 * assembleCase(p, "local");    // "Turussa"
 * ```
 */
export function getPlaceParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType = 'in'
): StemParadigm {
  return (
    resolveSpecialPlaceParadigm(place, defaultSpatialCase) ??
    resolveVocalicPlaceParadigm(place, defaultSpatialCase)
  );
}
