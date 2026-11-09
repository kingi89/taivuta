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
import { harmonize, isBackSpokenLetter } from './vowels.ts';

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

  const core = trimmed.replace(/\.+$/, '');
  if (!core) {
    // Tokens consisting purely of punctuation/dots (e.g. "...", ".") attach endings with a colon
    return true;
  }

  const lastChar = core[core.length - 1] ?? '';
  // Non-Latin characters (digits, symbols, non-Latin scripts like 朧)
  if (!/\p{Script=Latin}/u.test(lastChar)) {
    return true;
  }

  // Tokens ending in an isolated single Latin letter (e.g. "X", "E", "foo123x", "bar___y", "abc!xy$z.", "Á", "Ø")
  if (/(?:^|[^\p{Script=Latin}])\p{Script=Latin}$/u.test(core)) {
    return true;
  }

  // Final component without vowels (e.g. "Koski Tl", "HJK", "STT")
  const parts = trimmed.split(/[\s-]+/);
  const lastSegment = parts[parts.length - 1] ?? '';
  return !/[aeiouyäöáéíóúàèìòùâêîôûãõäöüÿøåæœōūāēī]/i.test(lastSegment);
}

interface LetterPhonology {
  readonly partitive: string;
  readonly illative: string;
}

function normalizeBaseLetter(letter: string): string {
  if (letter === 'å') {
    return 'å';
  }
  if (letter === 'ø') {
    return 'ö';
  }
  if (letter === 'ü') {
    return 'y';
  }
  return letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function resolveVocalicLetterVowel(base: string): string | null {
  if (/[bcdegptvw]/.test(base)) {
    return 'e';
  }
  if (/[hkoå]/.test(base)) {
    return 'o';
  }
  if (base === 'j') {
    return 'i';
  }
  if (base === 'q') {
    return 'u';
  }
  return /[aeiouyäö]/.test(base) ? base : null;
}

/**
 * Resolves the phonological partitive and illative endings for a Latin letter
 * according to Kotus spoken letter-name standards.
 *
 * @param letter - Single letter character (case-insensitive).
 * @returns Phonological suffix pair, or null if unrecognized.
 */
function getLetterPhonology(letter: string): LetterPhonology | null {
  const lowerLetter = letter.toLowerCase();
  if (/[flmnrsxš]/.test(lowerLetter)) {
    return { partitive: 'ää', illative: 'ään' };
  }
  if (/[zž]/.test(lowerLetter)) {
    return { partitive: 'aa', illative: 'aan' };
  }

  const base = normalizeBaseLetter(lowerLetter);
  const vowel = resolveVocalicLetterVowel(base);
  if (!vowel) {
    return null;
  }

  const isBack = isBackSpokenLetter(lowerLetter);
  return {
    partitive: isBack ? 'ta' : 'tä',
    illative: `h${vowel}n`
  };
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

  const core = token.trim().replace(/\.+$/, '');
  const lastChar = core.slice(-1);

  if (targetCase === 'partitive' || targetCase === 'illative') {
    const phonology = getLetterPhonology(lastChar);
    if (phonology) {
      const suffix = targetCase === 'partitive' ? phonology.partitive : phonology.illative;
      return `${token}:${resolveHarmonizedSuffix(suffix, token, options?.harmony)}`;
    }
  }

  return `${token}:${resolveHarmonizedSuffix(baseSuffix, token, options?.harmony)}`;
}
