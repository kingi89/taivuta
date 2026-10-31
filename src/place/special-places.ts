/**
 * Morphological handlers for specialized place names, exonyms, abbreviations, and foreign toponyms.
 *
 * @packageDocumentation
 */

import type { GrammaticalCase } from '../cases/types.ts';
import { harmonize } from '../morphology/vowels.ts';

/**
 * Checks whether a token represents an abbreviation or non-alphabetic ending requiring a colon before case endings.
 *
 * Kotus Rules:
 * - Words ending in non-Latin characters (digits, symbols, logographs) attach suffixes with a colon (:).
 * - Acronyms/abbreviations where the last word segment has no vowels are pronounced letter-by-letter,
 *   and thus take case endings separated by a colon (e.g. "Koski Tl" -> "Koski Tl:ltä", "HJK" -> "HJK:ssa").
 *
 * @param token - Word or proper noun to inspect.
 * @returns True if colon separation is required.
 */
export function needsColon(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) {
    return false;
  }

  const lastChar = trimmed[trimmed.length - 1] ?? '';
  // Non-Latin characters (digits, symbols, non-Latin scripts like 朧)
  if (!/\p{Script=Latin}/u.test(lastChar)) {
    return true;
  }

  // Final component without vowels (e.g. "Koski Tl", "HJK", "STT")
  const parts = trimmed.split(/[\s-]+/);
  const lastSegment = parts[parts.length - 1] ?? '';
  return !/[aeiouyäöáéíóúàèìòùâêîôûãõäöüÿøåæœōūāēī]/i.test(lastSegment);
}

/**
 * Inflects an abbreviation or non-alphabetic token using colon suffixation.
 *
 * @param token - Token requiring colon.
 * @param targetCase - Target grammatical case.
 * @returns Colon-separated inflected string.
 */
export function inflectColonWord(token: string, targetCase: GrammaticalCase): string {
  if (targetCase === 'genitive') {
    return `${token}:n`;
  }
  if (targetCase === 'partitive') {
    return `${token}:${harmonize('a', token)}`;
  }
  if (targetCase === 'illative') {
    return `${token}:${harmonize('iin', token)}`;
  }

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', token),
    elative: harmonize('sta', token),
    adessive: harmonize('lla', token),
    ablative: harmonize('lta', token),
    allative: 'lle',
    essive: harmonize('na', token),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${token}:${end}` : token;
}

/**
 * Compound prefixes whose head adjective inflects congruently with the place name (e.g. Uusi-Seelanti, Iso-Britannia).
 */
const COMPOUND_PREFIX_DECLENSIONS: Record<string, Record<GrammaticalCase, string>> = {
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

/**
 * Matches and inflects compound prefixes where both prefix and noun inflect (e.g. Uusi-Seelanti -> Uudessa-Seelannissa).
 *
 * @param place - Compound place name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected compound prefix and remaining name, or null if not matched.
 */
export function getCompoundPrefixMatch(
  place: string,
  targetCase: GrammaticalCase
): { prefix: string; remainder: string } | null {
  const match = place.match(/^(.*?\b)(Uusi-|Iso-)(.*)$/);
  if (!match) {
    return null;
  }
  const pre = match[1] ?? '';
  const prefix = match[2] ?? '';
  const remainder = match[3] ?? '';
  const inflectedPrefix = COMPOUND_PREFIX_DECLENSIONS[prefix]?.[targetCase];
  if (!inflectedPrefix) {
    return null;
  }
  return { prefix: `${pre}${inflectedPrefix}`, remainder };
}

/**
 * Inflects plural island groups ending in -saaret (e.g. Kanariansaaret).
 *
 * @param place - Island group name.
 * @param targetCase - Target grammatical case.
 * @returns Inflected island group or null if not matched.
 */
export function inflectIslandGroup(
  place: string,
  targetCase: GrammaticalCase
): string | null {
  if (!place.toLowerCase().endsWith('saaret')) {
    return null;
  }

  if (targetCase === 'genitive') {
    return `${place.slice(0, -2)}ten`;
  }

  const stem = `${place.slice(0, -2)}i`;
  if (targetCase === 'partitive') return `${stem}a`;
  if (targetCase === 'illative') return `${stem}in`;

  const endings: Record<string, string> = {
    inessive: 'ssa',
    elative: 'sta',
    adessive: 'lla',
    ablative: 'lta',
    allative: 'lle',
    essive: 'na',
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${stem}${end}` : place;
}

/**
 * Inflects names ending in singular -nen into regular nominal cases (e.g. Virtanen, Kaustinen).
 *
 * @param place - Place or surname ending in -nen.
 * @param targetCase - Target grammatical case.
 * @returns Inflected -nen name.
 */
export function inflectNenPlace(place: string, targetCase: GrammaticalCase): string {
  const stem = place.slice(0, -3) + 'se';
  if (targetCase === 'genitive') return `${stem}n`;
  if (targetCase === 'partitive') return `${place.slice(0, -3)}${harmonize('sta', place)}`;
  if (targetCase === 'illative') return `${stem}en`;

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
 * Inflects foreign places ending in a long macron vowel (e.g. Hokkaidō).
 * Kotus Guideline: Macron vowels represent long vowels and take -ta in partitive and -hon in illative.
 *
 * @param place - Place name ending in macron vowel.
 * @param targetCase - Target grammatical case.
 * @returns Inflected string or null if not a macron place.
 */
export function inflectMacronPlace(place: string, targetCase: GrammaticalCase): string | null {
  if (!/[āēīōū]$/i.test(place)) {
    return null;
  }

  if (targetCase === 'genitive') return `${place}n`;
  if (targetCase === 'partitive') return `${place}${harmonize('ta', place)}`;
  if (targetCase === 'illative') return `${place}${harmonize('hon', place)}`;

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
