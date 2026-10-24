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

const BACK_VOWELS = new Set(['a', 'o', 'u', 'A', 'O', 'U']);
const FRONT_VOWELS = new Set(['ä', 'ö', 'y', 'Ä', 'Ö', 'Y']);

/**
 * Extracts the relevant final segment of a word for vowel harmony determination.
 * For compound words joined by hyphens or spaces, the last word component is used.
 *
 * @param word - The input word or compound phrase.
 * @returns The final component to evaluate for harmony.
 */
function getLastComponent(word: string): string {
  const trimmed = word.trim();
  const segments = trimmed.split(/[\s-]+/);
  return segments[segments.length - 1] ?? trimmed;
}

/**
 * Determines whether a word requires front vowel harmony ('ä', 'ö', 'y')
 * or back vowel harmony ('a', 'o', 'u') in its case suffixes.
 *
 * Rule precedence:
 * 1. For compound names (hyphen or space separated), the last component governs.
 * 2. If the component contains any back vowel (a, o, u), it takes back harmony.
 * 3. If it contains front vowels (ä, ö, y) and no back vowels, it takes front harmony.
 * 4. If it contains only neutral vowels (e, i), Finnish defaults to front harmony (e.g. "Helsingissä", "Villellä").
 *
 * @param word - The word or name to evaluate.
 * @returns 'front' or 'back' vowel harmony.
 *
 * @example
 * ```ts
 * getVowelHarmony("Turku");        // "back" (Turussa)
 * getVowelHarmony("Helsinki");     // "front" (Helsingissä)
 * getVowelHarmony("Marja-Liisa");  // "front" (governed by "Liisa")
 * ```
 */
export function getVowelHarmony(word: string): VowelHarmony {
  const component = getLastComponent(word);

  let hasBack = false;
  let hasFront = false;

  for (const char of component) {
    if (BACK_VOWELS.has(char)) {
      hasBack = true;
    } else if (FRONT_VOWELS.has(char)) {
      hasFront = true;
    }
  }

  if (hasBack) {
    return 'back';
  }
  if (hasFront) {
    return 'front';
  }

  // Words with only neutral vowels (e, i) take front vowel harmony in Finnish.
  // Kotus guideline: Sanat, joissa on vain e- ja i-vokaaleja, ovat etuvokaalisia.
  return 'front';
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
  const harmony = getVowelHarmony(word);
  if (harmony === 'back') {
    return suffix;
  }

  return suffix
    .replace(/a/g, 'ä')
    .replace(/o/g, 'ö')
    .replace(/u/g, 'y')
    .replace(/A/g, 'Ä')
    .replace(/O/g, 'Ö')
    .replace(/U/g, 'Y');
}
