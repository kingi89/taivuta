/**
 * Standard nominal stem inflector for Finnish place names.
 *
 * @packageDocumentation
 */

import type { GrammaticalCase } from '../cases/types.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { GRADATION_RESISTANT_PLACES } from './municipalities.data.ts';

function resolveStandardPartitive(place: string): string {
  // Geminate long vowels (e.g. Lontoo -> Lontoota, Espoo -> Espoota) and -io/-iö take -ta/-tä
  if (/(?:([aeiouyäö])\1|io|iö)$/i.test(place)) {
    return harmonize('ta', place);
  }
  return harmonize('a', place);
}

/**
 * Inflects regular vowel-ending place names (e.g. Turku, Tampere, Kempele).
 *
 * @param place - Vowel-ending place name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected place string.
 */
export function inflectStandardPlace(place: string, targetCase: GrammaticalCase): string {
  const resists = GRADATION_RESISTANT_PLACES.has(place);
  const weakStem = resists ? place : weakenConsonants(place);
  const strongStem = place;

  if (targetCase === 'genitive') return `${weakStem}n`;
  if (targetCase === 'illative') {
    if (/(?:ei|ay|uy|au)$/i.test(place)) {
      const last = place.slice(-1);
      const v = last === 'y' ? 'i' : last;
      return `${place}h${v}n`;
    }
    return `${place}${place.slice(-1)}n`;
  }
  if (targetCase === 'partitive') return `${place}${resolveStandardPartitive(place)}`;

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  const stem = targetCase === 'essive' ? strongStem : weakStem;
  return end ? `${stem}${end}` : place;
}

/**
 * Inflects consonant-ending foreign place names (e.g. Finström, Hammarland).
 *
 * @param place - Consonant-ending place name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected place string with vocalic linking i.
 */
export function inflectConsonantPlace(place: string, targetCase: GrammaticalCase): string {
  const stem = `${place}i`;
  if (targetCase === 'genitive') return `${stem}n`;
  if (targetCase === 'illative') return `${stem}in`;
  if (targetCase === 'partitive') return `${stem}${harmonize('a', place)}`;

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${stem}${end}` : place;
}

/**
 * Inflects long vowel ending place names (e.g. Espoo, Ii, Thaimaa).
 *
 * @param place - Long vowel place name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected place string.
 */
export function inflectLongVowelPlace(place: string, targetCase: GrammaticalCase): string {
  if (targetCase === 'genitive') return `${place}n`;
  if (targetCase === 'partitive') return `${place}${harmonize('ta', place)}`;
  if (targetCase === 'illative') {
    if (place.toLowerCase().endsWith('maa')) {
      return `${place}han`;
    }
    const illEnd = place === 'Ii' ? 'hin' : 'seen';
    return `${place}${illEnd}`;
  }

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${place}${end}` : place;
}

/**
 * Dispatches regular stem inflection across consonant, long-vowel, and short-vowel stems.
 *
 * @param place - Nominative place name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected place string.
 */
export function dispatchStemInflection(place: string, targetCase: GrammaticalCase): string {
  if (/[bcdfghjklmnpqrstvwxz]$/i.test(place)) {
    return inflectConsonantPlace(place, targetCase);
  }
  if (/(?:aa|ää|oo|öö|uu|yy|ii|ee)$/i.test(place)) {
    return inflectLongVowelPlace(place, targetCase);
  }
  return inflectStandardPlace(place, targetCase);
}
