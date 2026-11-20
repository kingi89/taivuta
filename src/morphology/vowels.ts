/**
 * Vowel harmony utilities for Finnish nominal inflection.
 *
 * Finnish exhibits vowel harmony: back vowels (a, o, u) and front vowels (ä, ö, y)
 * cannot normally co-occur within a native single word stem. Neutral vowels (e, i)
 * can co-occur with either group.
 *
 * In compound words (e.g. "Marja-Liisa", "Uusi-Seelanti"), harmony is determined
 * strictly by the final component.
 *
 * @packageDocumentation
 */

/**
 * The vowel harmony classification of a word.
 */
export type VowelHarmony = 'front' | 'back';

/**
 * Matches a back vowel (Finnish a, o, u, å plus accented variants).
 */
const BACK_VOWEL_REGEX = /[aouåáàâãāóòôõōúùûū]/i;

/**
 * Matches a Finnish or Scandinavian/Germanic front vowel (ä, ö, y, ü, ø, æ).
 * Note: e and i are neutral vowels in Finnish, not front triggers when back vowels exist.
 */
const FRONT_VOWEL_REGEX = /[äöyüøæ]/i;

/**
 * Matches a single Latin letter whose spoken Finnish name contains a back vowel
 * (A, H, K, O, Q, U, Z, Ž, Å and accented back-vowel variants).
 */
const BACK_SPOKEN_LETTER_REGEX = /^[ahkoquzžåáàâãāóòôõōúùûū]$/i;

/**
 * Matches a single Latin script character (letters across European orthographies).
 */
export const LATIN_LETTER_REGEX = /\p{Script=Latin}/u;

/**
 * Matches an isolated trailing Latin letter at the end of a token or after a non-Latin character.
 */
export const ISOLATED_TRAILING_LATIN_REGEX = /(?:^|[^\p{Script=Latin}])(\p{Script=Latin})$/u;

/**
 * Matches any Latin vowel character (Finnish, Nordic, Western/Eastern European, or macron variants).
 */
export const LATIN_VOWEL_REGEX = /[aeiouyäöåáéíóúàèìòùâêîôûãõüÿøæœōūāēī]/i;

const FRONT_VOWEL_MAP: Readonly<Record<string, string>> = {
  a: 'ä',
  o: 'ö',
  u: 'y',
  A: 'Ä',
  O: 'Ö',
  U: 'Y'
};

const BACK_VOWEL_MAP: Readonly<Record<string, string>> = {
  ä: 'a',
  ö: 'o',
  y: 'u',
  Ä: 'A',
  Ö: 'O',
  Y: 'U'
};

/**
 * Checks whether a single letter has back vowel harmony in its spoken Finnish letter name.
 *
 * @param letter - Single letter character.
 * @returns True if the spoken letter name requires back vowel harmony; otherwise false.
 *
 * @example
 * ```ts
 * isBackSpokenLetter("A"); // true
 * isBackSpokenLetter("H"); // true
 * isBackSpokenLetter("E"); // false
 * isBackSpokenLetter("X"); // false
 * ```
 */
export function isBackSpokenLetter(letter: string): boolean {
  return BACK_SPOKEN_LETTER_REGEX.test(letter);
}

/**
 * Extracts the final whitespace- or hyphen-delimited segment of a proper noun.
 *
 * @param word - The input word or compound phrase.
 * @returns The final segment (trimmed if single-token).
 */
export function getLastSegment(word: string): string {
  const trimmed = word.trim();
  const segments = trimmed.split(/[\s-]+/);
  return segments[segments.length - 1] ?? trimmed;
}

function scanVowels(component: string): 'back' | 'front' | null {
  // Foreign names ending in the German diphthong -stein pronounced /ai/ (e.g. Liechtenstein)
  // take back harmony regardless of orthographic 'e' and 'i'.
  if (component.toLowerCase().endsWith('stein')) {
    return 'back';
  }

  // In foreign names where a back vowel (a, o, u) is followed in the final syllable by a
  // single -y pronounced /i/ (e.g. Tony, Paraguay, Uruguay), ignore the trailing -y glide
  // so the preceding back vowel governs. Native Finnish long -yy (Kruunupyy) is preserved.
  const target = /[aou][^aeiouyäö]*y$/i.test(component)
    ? component.slice(0, -1)
    : component;

  // Scan harmony-bearing vowels: back (a, o, u, å) vs. front (ä, ö, y), ignoring neutral
  // vowels (e, i). Tracking the last match handles both simple stems (where back and front
  // vowels never mix) and unhyphenated compounds or loanwords (Yrjömatti -> 'back',
  // Oripää / Sodankylä / Vårdö -> 'front'), where the final constituent's vowel governs.
  let lastHarmony: 'back' | 'front' | null = null;

  for (const char of target) {
    if (BACK_VOWEL_REGEX.test(char)) {
      lastHarmony = 'back';
    } else if (FRONT_VOWEL_REGEX.test(char)) {
      lastHarmony = 'front';
    }
  }

  return lastHarmony;
}

/**
 * Determines whether a word requires front vowel harmony ('ä', 'ö', 'y')
 * or back vowel harmony ('a', 'o', 'u') in its case suffixes.
 *
 * Harmony is governed by the last harmony-bearing vowel of the final word component,
 * defaulting to 'front' when only neutral vowels ('e', 'i') are present, or using the
 * spoken name of the final letter for isolated letters and vowel-less abbreviations.
 *
 * Note: Because unhyphenated compound words cannot be split reliably without a lexicon,
 * compounds whose initial element contains a back vowel ('a', 'o', 'u') and whose final
 * element contains only neutral vowels ('e', 'i') resolve to 'back' (e.g. "Uusipaavalniemi"
 * when evaluated outside nature-noun suffix matching, or "Ainoheikki").
 *
 * @param word - The word or name to evaluate.
 * @returns 'front' or 'back' vowel harmony.
 *
 * @example
 * ```ts
 * getVowelHarmony("Turku");        // "back" (Turussa)
 * getVowelHarmony("Helsinki");     // "front" (Helsingissä)
 * getVowelHarmony("Marja-Liisa");  // "front" (governed by "Liisa")
 * getVowelHarmony("Yrjömatti");    // "back" (governed by "a" in "matti")
 * getVowelHarmony("Oripää");       // "front" (governed by "ä" in "pää")
 * ```
 */
export function getVowelHarmony(word: string): VowelHarmony {
  // Step 1: For space- or hyphen-separated compounds, only the final word component governs.
  const component = getLastSegment(word);

  // Step 2: Single letters and tokens ending in an isolated letter (e.g. "X", "E", "foo123x",
  // "3D", "P.", "Á") take the harmony of that final letter's spoken Finnish name.
  const isolatedLetterMatch = ISOLATED_TRAILING_LATIN_REGEX.exec(component.replace(/\.+$/, ''));
  if (isolatedLetterMatch) {
    const letter = isolatedLetterMatch[1] ?? '';
    return isBackSpokenLetter(letter) ? 'back' : 'front';
  }

  // Step 3: Resolve from harmony-bearing vowels (a/o/u/å vs. ä/ö/y) in the component.
  const scanned = scanVowels(component);
  if (scanned) {
    return scanned;
  }

  // Step 4: For vowel-less acronyms/abbreviations, use the spoken name of the final letter
  // (A, H, K, O, Q, U, Z, Ž, Å take back harmony, e.g. HJK:ssa, HZ:lla).
  const lastChar = component[component.length - 1] ?? '';
  if (isBackSpokenLetter(lastChar)) {
    return 'back';
  }

  // Step 5: Words containing only neutral vowels (e, i) take front vowel harmony in Finnish
  // (Kotus guideline: Sanat, joissa on vain e- ja i-vokaaleja, ovat etuvokaalisia).
  return 'front';
}

/**
 * Converts a suffix string into the requested vowel harmony ('front' or 'back').
 *
 * @param suffix - Suffix string to convert (e.g. "ssa", "ssä", "hon").
 * @param harmony - Target vowel harmony ('front' maps a/o/u -> ä/ö/y; 'back' maps ä/ö/y -> a/o/u).
 * @returns The suffix converted to the requested vowel harmony.
 *
 * @example
 * ```ts
 * applyHarmony("ssa", "front"); // "ssä"
 * applyHarmony("ään", "back");  // "aan"
 * ```
 */
export function applyHarmony(suffix: string, harmony: VowelHarmony): string {
  if (harmony === 'front') {
    return suffix.replace(/[aouAOU]/g, (ch) => FRONT_VOWEL_MAP[ch] ?? ch);
  }
  return suffix.replace(/[äöyÄÖY]/g, (ch) => BACK_VOWEL_MAP[ch] ?? ch);
}

/**
 * Harmonizes a suffix template according to the vowel harmony of the target word.
 * Suffix characters 'a', 'o', 'u' will be transformed to 'ä', 'ö', 'y' if the word has front harmony.
 *
 * @param suffix - Suffix containing back vowels (e.g. "ssa", "lla", "sta", "na").
 * @param word - The word governing the vowel harmony.
 * @returns The harmonized suffix string.
 *
 * @example
 * ```ts
 * harmonize("ssa", "Turku");    // "ssa" -> Turussa
 * harmonize("ssa", "Helsinki"); // "ssä" -> Helsingissä
 * ```
 */
export function harmonize(suffix: string, word: string): string {
  return getVowelHarmony(word) === 'back' ? suffix : applyHarmony(suffix, 'front');
}
