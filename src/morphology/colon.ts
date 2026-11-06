/**
 * Colon suffixation for Finnish abbreviations, acronyms, numerals, and non-alphabetic proper nouns.
 *
 * Implements Kotus guidelines:
 * - Words ending in non-Latin characters (digits, symbols, logographs) attach case endings with a colon (:).
 *   Examples: "Agent007" -> "Agent007:n", "Studio_" -> "Studio_:ssa", "朧" -> "朧:ssä".
 * - Acronyms, initialisms, and codes without vowels in their final segment are pronounced letter-by-letter
 *   and attach case endings with a colon (:).
 *   Examples: "Koski Tl" -> "Koski Tl:ltä", "HJK" -> "HJK:ssa", "VR" -> "VR:llä".
 *
 * Applies across all proper noun roles (given names, surnames, nicknames, online handles, places, and organizations).
 *
 * @packageDocumentation
 */

import type { GrammaticalCase } from '../cases/types.ts';
import { harmonize } from './vowels.ts';

/**
 * Checks whether a token represents an abbreviation, handle, or non-alphabetic ending requiring colon suffixation.
 *
 * @param token - Word or proper noun to inspect (e.g. "Koski Tl", "Agent007", "HJK").
 * @returns True if colon separation is required; otherwise false.
 *
 * @example
 * ```ts
 * needsColon("Agent007"); // true
 * needsColon("HJK");      // true
 * needsColon("Matti");    // false
 * ```
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

const COLON_BASE_ENDINGS: Record<GrammaticalCase, string | null> = {
  nominative: null,
  genitive: 'n',
  partitive: 'a',
  illative: 'iin',
  inessive: 'ssa',
  elative: 'sta',
  adessive: 'lla',
  ablative: 'lta',
  allative: 'lle',
  essive: 'na',
  translative: 'ksi'
};

function resolveHarmonizedSuffix(
  suffix: string,
  token: string,
  harmony?: 'front' | 'back'
): string {
  if (harmony === 'front') {
    return suffix.replace(/a/g, 'ä').replace(/o/g, 'ö').replace(/u/g, 'y');
  }
  if (harmony === 'back') {
    return suffix.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/y/g, 'u');
  }
  return harmonize(suffix, token);
}

/**
 * Inflects an abbreviation, numeral, handle, or non-alphabetic token using colon suffixation.
 *
 * @param token - Token requiring colon suffixation (e.g. "Koski Tl", "Agent007").
 * @param targetCase - Target grammatical case.
 * @param options - Optional configuration, including explicit vowel harmony override.
 * @returns Colon-separated inflected string.
 *
 * @example
 * ```ts
 * inflectColonWord("Agent007", "genitive"); // "Agent007:n"
 * inflectColonWord("HJK", "inessive");      // "HJK:ssa"
 * inflectColonWord("Agent007", "adessive", { harmony: 'front' }); // "Agent007:llä"
 * ```
 */
export function inflectColonWord(
  token: string,
  targetCase: GrammaticalCase,
  options?: { readonly harmony?: 'front' | 'back' }
): string {
  const baseSuffix = COLON_BASE_ENDINGS[targetCase];
  if (!baseSuffix) {
    return token;
  }
  return `${token}:${resolveHarmonizedSuffix(baseSuffix, token, options?.harmony)}`;
}
