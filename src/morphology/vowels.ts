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
 * Finnish back vowels: a, o, u.
 * Accented variants with macrons, acutes, graves, and tildes retain back tongue position.
 */
const BACK_VOWELS = new Set([
  'a', 'o', 'u',
  'á', 'à', 'â', 'ã', 'ā',
  'ó', 'ò', 'ô', 'õ', 'ō',
  'ú', 'ù', 'û', 'ū',
  'A', 'O', 'U',
  'Á', 'À', 'Â', 'Ã', 'Ā',
  'Ó', 'Ò', 'Ô', 'Õ', 'Ō',
  'Ú', 'Ù', 'Û', 'Ū'
]);

/**
 * Finnish front vowels: ä, ö, y, plus Scandinavian/Germanic front vowels: ü, ø, æ.
 * (Note: e and i are neutral vowels in Finnish, not front triggers when back vowels exist).
 */
const FRONT_VOWELS = new Set([
  'ä', 'ö', 'y', 'ü', 'ø', 'æ',
  'Ä', 'Ö', 'Y', 'Ü', 'Ø', 'Æ'
]);

/**
 * Letters whose individual spoken names in Finnish contain back vowels:
 * - A (/aa/), H (/hoo/), K (/koo/), O (/oo/), Q (/kuu/), U (/uu/), Z (/tseta/), Å (/oo/)
 * When used as vowel-less abbreviations (e.g. HJK, Tl), the final letter's spoken name governs:
 * - Suffix with -lla/-ssa: A, H, K, O, Q, U, Z, Å
 * - Suffix with -llä/-ssä: B, C, D, E, F, G, I, J, L, M, N, P, R, S, T, V, W, X, Y, Ä, Ö
 */
const BACK_SPOKEN_LETTER_NAMES = new Set([
  'a', 'h', 'k', 'o', 'q', 'u', 'z', 'ž', 'å',
  'A', 'H', 'K', 'O', 'Q', 'U', 'Z', 'Ž', 'Å'
]);

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
  return BACK_VOWELS.has(letter) || BACK_SPOKEN_LETTER_NAMES.has(letter);
}

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

function scanVowels(component: string): 'back' | 'front' | null {
  // Foreign names ending in German diphthong -stein pronounced /ai/ (e.g. Liechtenstein) take back harmony
  if (component.toLowerCase().endsWith('stein')) {
    return 'back';
  }

  let hasBack = false;
  let hasFront = false;
  let hasAring = false;

  for (const char of component) {
    if (BACK_VOWELS.has(char)) {
      hasBack = true;
    } else if (FRONT_VOWELS.has(char)) {
      hasFront = true;
    } else if (char === 'å' || char === 'Å') {
      hasAring = true;
    }
  }

  if (hasBack) return 'back';
  if (hasFront) return 'front';
  if (hasAring) return 'back';
  return null;
}

/**
 * Determines whether a word requires front vowel harmony ('ä', 'ö', 'y')
 * or back vowel harmony ('a', 'o', 'u') in its case suffixes.
 *
 * Rule precedence:
 * 1. For compound names (hyphen or space separated), the last component governs.
 * 2. If the component ends in an isolated letter, that letter's spoken name governs.
 * 3. If the component contains any back vowel (a, o, u), it takes back harmony.
 * 4. If it contains front vowels (ä, ö, y) and no back vowels, it takes front harmony.
 * 5. Swedish å behaves as back vowel /o/ unless combined with front vowels (e.g. Vårdö -> Vårdössä).
 * 6. If it contains only neutral vowels (e, i), Finnish defaults to front harmony (e.g. "Helsingissä", "Villellä").
 * 7. For vowel-less acronyms, the spoken name of the final letter determines harmony.
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

  // Single letters and tokens ending in an isolated letter (e.g. "X", "E", "foo123x", "bar___y", "3D", "P.", "Á")
  // are governed by the spoken name of that final letter.
  const isolatedLetterMatch = /(?:^|[^\p{Script=Latin}])(\p{Script=Latin})\.?$/u.exec(component);
  if (isolatedLetterMatch) {
    const letter = isolatedLetterMatch[1] ?? '';
    return isBackSpokenLetter(letter) ? 'back' : 'front';
  }

  const scanned = scanVowels(component);
  if (scanned) {
    return scanned;
  }

  // For acronyms/abbreviations without vowels, the spoken name of the final letter determines harmony:
  // A, H, K, O, Q, U, Z, Ž, Å take back vowel harmony (e.g. HJK:ssa, HZ:lla).
  const lastChar = component[component.length - 1] ?? '';
  if (BACK_SPOKEN_LETTER_NAMES.has(lastChar)) {
    return 'back';
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
