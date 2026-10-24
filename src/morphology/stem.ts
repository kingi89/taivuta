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
const FRENCH_SILENT_SUFFIXES = /(?:eaux|oux|aux)$/i;

/**
 * Traditional Finnish and biblical given names taking the -kse s-stem declension
 * (e.g. Tuomas -> Tuomaksen, Markus -> Markuksen).
 * Other names ending in -s (e.g. English James, Charles, Jones, Thomas) take the regular
 * consonant linking vowel -i- (Jamesin, Charlesin).
 */
const FINNISH_S_STEM_NAMES = new Set([
  'tuomas',
  'matias',
  'elias',
  'joonas',
  'topias',
  'andreas',
  'vilpas',
  'markus',
  'julius',
  'justus',
  'magnus',
  'johannes',
  'aleksis',
  'petrus',
  'paulus',
  'linus',
  'jeesus',
  'kristus'
]);

/**
 * Well-known foreign names ending in silent consonants in Finnish orthography.
 */
const SILENT_FINAL_NAMES = new Set([
  'dumas',
  'camus',
  'descartes',
  'monet',
  'manet',
  'degas',
  'renoir'
]);

/**
 * Checks if a name ending in a consonant likely has a silent final letter.
 *
 * @param name - The name to test.
 * @returns True if the ending is conventionally silent in Finnish orthography.
 */
function hasSilentEnding(name: string): boolean {
  const lower = name.toLowerCase();
  if (SILENT_FINAL_NAMES.has(lower)) {
    return true;
  }
  return FRENCH_SILENT_SUFFIXES.test(name);
}

/**
 * Analyzes s-stem suffixes (-nen, and recognized Finnish -as/-us/-es names)
 * and produces the appropriate inflecting stem.
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

  const lower = name.toLowerCase();
  if (!FINNISH_S_STEM_NAMES.has(lower)) {
    return undefined;
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
