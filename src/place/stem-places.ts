/**
 * Canonical morphological stem paradigm generator for Finnish place names.
 *
 * Constructs StemParadigm models for vowel-ending, consonant-ending,
 * long-vowel, macron-vowel, and plural island toponyms.
 *
 * @packageDocumentation
 */

import type { LocalCaseType } from '../cases/types.ts';
import { fallbackString, sanitizeInput } from '../morphology/guards.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { createStemParadigm, type StemParadigm } from '../morphology/paradigm.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';
import {
  GRADATION_RESISTANT_PLACES,
  IRREGULAR_PLACE_PARADIGMS,
  NATURE_NOUN_BYPASS_PLACES,
  PLURAL_INEN_PLACES,
  TYPE_39_S_PLACES,
  TYPE_40_US_PLACES,
  TYPE_48_E_PLACES
} from './municipalities.data.ts';

function buildPluralInenParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm {
  // Pluralia tantum -inen municipalities use the plural -isi- stem and -isten genitive
  // (e.g. Kauniainen -> Kauniaisten, Kauniaisia, Kauniaisissa).
  const base = place.slice(0, -3);
  const stem = `${base}si`;
  return createStemParadigm(place, {
    strong: stem,
    weak: stem,
    genitive: `${base}sten`,
    partitive: `${stem}${harmonize('a', place)}`,
    illative: `${stem}in`
  }, { defaultSpatialCase, isPlural: true });
}

function buildType48EParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm {
  // Kotus type 48 (*hame*) lengthens final -e to -ee- in vocalic stems and takes -tta/-ttä in partitive
  // (e.g. Tampere -> Tampereen, Tamperetta, Tampereeseen).
  const stem = `${place}e`;
  return createStemParadigm(place, {
    strong: stem,
    weak: stem,
    partitive: `${place}${harmonize('tta', place)}`,
    illative: `${stem}seen`
  }, { defaultSpatialCase });
}

function buildType39SParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm {
  // Kotus type 39 replaces final -s with -kse- in vocalic cases while keeping -s- in partitive
  // (e.g. Kannus -> Kannuksen, Kannusta, Kannukseen).
  const stem = `${place.slice(0, -1)}kse`;
  return createStemParadigm(place, {
    strong: stem,
    weak: stem,
    partitive: `${place}${harmonize('ta', place)}`,
    illative: `${stem}en`
  }, { defaultSpatialCase });
}

function buildType40UsParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm {
  // Kotus type 40 alternates -us with strong -te-, weak -de-, and partitive -tta/-ttä
  // (e.g. Varkaus -> Varkauden, Varkautta, Varkauteen, Varkautena).
  const base = place.slice(0, -1);
  return createStemParadigm(place, {
    strong: `${base}te`,
    weak: `${base}de`,
    partitive: `${base}${harmonize('tta', place)}`,
    illative: `${base}teen`
  }, { defaultSpatialCase });
}

function resolveNamedClassParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm | null {
  const irregular = IRREGULAR_PLACE_PARADIGMS.get(place);
  if (irregular) {
    return createStemParadigm(place, irregular, {
      defaultSpatialCase,
      isPlural: irregular.isPlural
    });
  }
  if (PLURAL_INEN_PLACES.has(place)) {
    return buildPluralInenParadigm(place, defaultSpatialCase);
  }
  if (TYPE_48_E_PLACES.has(place)) {
    return buildType48EParadigm(place, defaultSpatialCase);
  }
  if (TYPE_39_S_PLACES.has(place)) {
    return buildType39SParadigm(place, defaultSpatialCase);
  }
  if (TYPE_40_US_PLACES.has(place)) {
    return buildType40UsParadigm(place, defaultSpatialCase);
  }
  return null;
}

function resolveNaturePlaceParadigm(
  place: string,
  defaultSpatialCase: LocalCaseType
): StemParadigm | null {
  if (NATURE_NOUN_BYPASS_PLACES.has(place)) {
    return null;
  }
  const nature = matchNatureNoun(place);
  return nature ? { ...nature, defaultSpatialCase } : null;
}

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
    const illativeEnd = /(?:maa|pää|pyy)$/i.test(place) || place === 'Ii'
      ? `h${place.slice(-1).toLowerCase()}n`
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
  const trimmed = sanitizeInput(place);
  if (!trimmed) {
    const fb = fallbackString(place);
    return createStemParadigm(fb, { strong: fb, weak: fb, partitive: fb, illative: fb });
  }
  const safeSpatial: LocalCaseType = defaultSpatialCase === 'on' ? 'on' : 'in';
  return (
    resolveNamedClassParadigm(trimmed, safeSpatial) ??
    resolveNaturePlaceParadigm(trimmed, safeSpatial) ??
    resolveSpecialPlaceParadigm(trimmed, safeSpatial) ??
    resolveVocalicPlaceParadigm(trimmed, safeSpatial)
  );
}
