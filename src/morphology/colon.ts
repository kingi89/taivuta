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

/**
 * Inflects an abbreviation, numeral, handle, or non-alphabetic token using colon suffixation.
 *
 * @param token - Token requiring colon suffixation (e.g. "Koski Tl", "Agent007").
 * @param targetCase - Target grammatical case.
 * @returns Colon-separated inflected string.
 *
 * @example
 * ```ts
 * inflectColonWord("Agent007", "genitive"); // "Agent007:n"
 * inflectColonWord("HJK", "inessive");      // "HJK:ssa"
 * inflectColonWord("Koski Tl", "adessive"); // "Koski Tl:llä"
 * ```
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
