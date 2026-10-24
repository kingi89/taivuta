/**
 * Nominal stem analysis for Finnish proper nouns.
 *
 * Inflection in Finnish is affixal: case endings attach to an inflecting stem.
 * The stem may differ from the nominative dictionary form through suffix alternation
 * (-nen -> -se, -as -> -akse) or vowel insertion for consonant-final foreign names.
 *
 * Kotus Guidelines:
 * - Proper nouns ending in -nen (Virtanen, Korhonen) use the stem in -se (Virtasen, Virtasella).
 * - Names ending in -as/-äs, -us/-ys, -os/-es (Tuomas, Markus, Johannes) take an inflecting
 *   stem in -kse (Tuomaksen, Markuksessa, Johannekselle).
 * - Modern given names ending in -e (Ville, Kalle, Anne) retain short -e without lengthening
 *   (Villen, Kallessa), unlike common nouns (vene -> veneen).
 * - Foreign names ending in a pronounced consonant take an epenthetic (linking) -i-
 *   (John -> Johnin, David -> Davidilla).
 * - Foreign names ending in a silent letter use an apostrophe (Bordeaux -> Bordeaux'ssa, Dumas -> Dumas'n).
 *
 * @packageDocumentation
 */

/**
 * Result of analyzing a nominal stem.
 */
export interface AnalyzedStem {
  /** The inflecting vowel stem (weak or strong as required) */
  readonly stem: string;
  /** Whether the original noun ends in -nen */
  readonly isNen: boolean;
  /** Whether the noun is an s-stem ending in -as/-us/-os/-es */
  readonly isSStem: boolean;
  /** The vocalic linking vowel (e.g. 'i' for consonant stems) */
  readonly linkingVowel: string;
  /** Whether an apostrophe is required before case endings */
  readonly needsApostrophe: boolean;
  /** The original nominative singular form */
  readonly nominative: string;
}

const VOWEL_REGEX = /[aeiouyäö]/i;
const SILENT_ENDINGS = /(?:eaux|oux|aux|e|t|x|s)$/i;

/**
 * Checks if a name ending in a consonant likely has a silent final letter.
 *
 * @param name - The name to test.
 * @returns True if the ending is conventionally silent in Finnish orthography.
 */
function hasSilentEnding(name: string): boolean {
  // Common French/foreign silent endings (e.g. Bordeaux, Dumas, Monet)
  return SILENT_ENDINGS.test(name) && !VOWEL_REGEX.test(name.slice(-1));
}

/**
 * Analyzes s-stem suffixes (-nen, -as, -us, -os, -es) and produces the appropriate inflecting stem.
 *
 * @param name - The input proper noun.
 * @returns Partial stem data if matched, or undefined.
 */
function matchSStem(name: string): { stem: string; isNen: boolean; isSStem: boolean } | undefined {
  if (name.endsWith('nen') || name.endsWith('Nen')) {
    return {
      stem: name.slice(0, -3) + (name.endsWith('nen') ? 'se' : 'Se'),
      isNen: true,
      isSStem: false
    };
  }

  // -as / -äs (Tuomas -> Tuomakse, Matias -> Matiakse)
  if (/[aä]s$/i.test(name) && name.length > 3) {
    const vowel = name[name.length - 2];
    return {
      stem: name.slice(0, -2) + vowel + 'kse',
      isNen: false,
      isSStem: true
    };
  }

  // -us / -ys, -os, -es (Markus -> Markukse, Johannes -> Johannekse)
  if (/[uyoe]s$/i.test(name) && name.length > 3) {
    return {
      stem: name.slice(0, -1) + 'kse',
      isNen: false,
      isSStem: true
    };
  }

  return undefined;
}

/**
 * Analyzes a proper noun and extracts its base inflecting stem and orthographic properties.
 *
 * @param name - The nominative form of the proper noun (e.g. "Virtanen", "Tuomas", "John", "Bordeaux").
 * @returns AnalyzedStem object containing the stem and metadata.
 *
 * @example
 * ```ts
 * analyzeStem("Virtanen"); // { stem: "Virtase", isNen: true, linkingVowel: "", needsApostrophe: false, ... }
 * analyzeStem("Tuomas");   // { stem: "Tuomakse", isSStem: true, linkingVowel: "", needsApostrophe: false, ... }
 * analyzeStem("John");     // { stem: "John", linkingVowel: "i", needsApostrophe: false, ... }
 * analyzeStem("Bordeaux"); // { stem: "Bordeaux", linkingVowel: "i", needsApostrophe: true, ... }
 * ```
 */
export function analyzeStem(name: string): AnalyzedStem {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      stem: '',
      isNen: false,
      isSStem: false,
      linkingVowel: '',
      needsApostrophe: false,
      nominative: ''
    };
  }

  const sStem = matchSStem(trimmed);
  if (sStem) {
    return {
      stem: sStem.stem,
      isNen: sStem.isNen,
      isSStem: sStem.isSStem,
      linkingVowel: '',
      needsApostrophe: false,
      nominative: trimmed
    };
  }

  // If the word ends in a vowel, suffixes attach directly without a linking vowel
  const lastChar = trimmed[trimmed.length - 1] ?? '';
  if (VOWEL_REGEX.test(lastChar)) {
    return {
      stem: trimmed,
      isNen: false,
      isSStem: false,
      linkingVowel: '',
      needsApostrophe: false,
      nominative: trimmed
    };
  }

  // Consonant-ending names take an epenthetic 'i' linking vowel in Finnish
  const needsApos = hasSilentEnding(trimmed);
  return {
    stem: trimmed,
    isNen: false,
    isSStem: false,
    linkingVowel: 'i',
    needsApostrophe: needsApos,
    nominative: trimmed
  };
}
