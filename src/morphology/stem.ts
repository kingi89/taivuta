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

import type { InflectPersonOptions } from '../cases/types.ts';

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
  /** Whether the noun is a Finnish Type 32 -tar/-tär stem */
  readonly isTarStem: boolean;
  /** The vocalic linking vowel (e.g. 'i' for consonant stems) */
  readonly linkingVowel: string;
  /** Whether an apostrophe is required before case endings */
  readonly needsApostrophe: boolean;
  /** The original nominative singular form */
  readonly nominative: string;
}

const VOWEL_REGEX = /[aeiouyäöåáéíóúàèìòùâêîôûãõäöüÿøæœōūāēī]/i;
const FRENCH_SILENT_SUFFIXES = /(?:eaux|oux|aux)$/i;

/**
 * Traditional Finnish and biblical given names taking the -kse s-stem declension
 * (e.g. Tuomas -> Tuomaksen, Markus -> Markuksen).
 * Other names ending in -s (e.g. English James, Charles, Jones, Thomas) take the regular
 * consonant linking vowel -i- (Jamesin, Charlesin).
 */
const FINNISH_S_STEM_REGEX =
  /^(?:tuomas|matias|elias|joonas|topias|andreas|vilpas|markus|julius|justus|magnus|johannes|aleksis|petrus|paulus|linus|niklas|rasmus|aatos|luukas|aulis|eelis|iiris|jeesus|kristus)$/i;

/**
 * Well-known names ending in silent consonants or vocalic diphthongs (e.g. Kaj [kai]).
 */
const SILENT_FINAL_REGEX =
  /^(?:dumas|camus|descartes|monet|manet|degas|renoir|kaj|maj|guy)$/i;

/**
 * Checks if a name ending in a consonant likely has a silent final letter.
 *
 * @param name - The name to test.
 * @returns True if the ending is conventionally silent in Finnish orthography.
 */
function hasSilentEnding(name: string): boolean {
  return SILENT_FINAL_REGEX.test(name) || FRENCH_SILENT_SUFFIXES.test(name);
}

interface PartialStem {
  readonly stem: string;
  readonly isNen?: boolean;
  readonly isSStem?: boolean;
  readonly isTarStem?: boolean;
}

/**
 * Extracts Finnish -nen surname stem (-nen -> -se).
 *
 * @param name - The input proper noun.
 * @returns Stem object if -nen matched, otherwise undefined.
 */
function matchNen(name: string): PartialStem | undefined {
  if (name.endsWith('nen') || name.endsWith('Nen')) {
    const suffix = name.endsWith('nen') ? 'se' : 'Se';
    return {
      stem: name.slice(0, -3) + suffix,
      isNen: true
    };
  }
  return undefined;
}

/**
 * Analyzes s-stem suffixes (recognized Finnish -as/-us/-es/-is names)
 * and produces the appropriate inflecting stem.
 *
 * @param name - The input proper noun.
 * @param options - Person inflection options.
 * @returns Partial stem data if matched, or undefined.
 */
function matchSStem(
  name: string,
  options?: InflectPersonOptions
): PartialStem | undefined {
  if (options?.sStem === false || name.length <= 3) {
    return undefined;
  }

  const isCandidate = options?.sStem === true || FINNISH_S_STEM_REGEX.test(name);
  if (!isCandidate) {
    return undefined;
  }

  // -as / -äs (Tuomas -> Tuomakse, Matias -> Matiakse, Niklas -> Niklakse, Lucas -> Lucakse)
  if (/[aä]s$/i.test(name)) {
    const vowel = name[name.length - 2];
    return {
      stem: name.slice(0, -2) + vowel + 'kse',
      isSStem: true
    };
  }

  // -us / -ys, -os, -es, -is (Markus -> Markukse, Aatos -> Aatokse, Aulis -> Aulikse, Eelis -> Eelikse)
  if (/[uyoei]s$/i.test(name)) {
    return {
      stem: name.slice(0, -1) + 'kse',
      isSStem: true
    };
  }

  return undefined;
}

const FINNISH_TAR_REGEX =
  /^(?:aallo|ilma|suome|kuu|sulo|aino|valo|onne|otava|tuule|suve|halla|aja)tar$/i;

/**
 * Checks whether a proper noun defaults to Finnish Kotus Type 32 (-tar/-tär) declension.
 *
 * @param name - The proper noun to inspect.
 * @returns True if the name defaults to Kotus Type 32 (-ttare-/-ttäre-).
 */
export function isFinnishTarName(name: string): boolean {
  return name.length >= 5 && (/[aeiouyäö]tär$/i.test(name) || FINNISH_TAR_REGEX.test(name));
}

function matchTarStem(
  name: string,
  options?: InflectPersonOptions
): PartialStem | undefined {
  if (options?.tarStem === false || name.length < 5) {
    return undefined;
  }
  const match = name.match(/t([aä])r$/i);
  if (!match || (options?.tarStem !== true && !isFinnishTarName(name))) {
    return undefined;
  }
  return {
    stem: `${name.slice(0, -3)}tt${match[1] ?? 'a'}re`,
    isTarStem: true
  };
}

function makeStem(
  data: PartialStem,
  nominative: string
): AnalyzedStem {
  return {
    stem: data.stem,
    isNen: data.isNen ?? false,
    isSStem: data.isSStem ?? false,
    isTarStem: data.isTarStem ?? false,
    linkingVowel: '',
    needsApostrophe: false,
    nominative
  };
}

/**
 * Analyzes a proper noun and extracts its base inflecting stem and orthographic properties.
 *
 * @param name - The nominative form of the proper noun (e.g. "Virtanen", "Tuomas", "John", "Bordeaux").
 * @param options - Optional configuration options (e.g. sStem override).
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
export function analyzeStem(name: string, options?: InflectPersonOptions): AnalyzedStem {
  const trimmed = name.trim();
  if (!trimmed) {
    return makeStem({ stem: '' }, '');
  }

  const nen = matchNen(trimmed);
  if (nen) {
    return makeStem(nen, trimmed);
  }

  const sStem = matchSStem(trimmed, options);
  if (sStem) {
    return makeStem(sStem, trimmed);
  }

  const tarStem = matchTarStem(trimmed, options);
  if (tarStem) {
    return makeStem(tarStem, trimmed);
  }

  // If the word ends in a vowel, suffixes attach directly without a linking vowel
  const lastChar = trimmed[trimmed.length - 1] ?? '';
  if (VOWEL_REGEX.test(lastChar)) {
    return makeStem({ stem: trimmed }, trimmed);
  }

  // Consonant-ending names take an epenthetic 'i' linking vowel in Finnish
  return {
    stem: trimmed,
    isNen: false,
    isSStem: false,
    isTarStem: false,
    linkingVowel: 'i',
    needsApostrophe: hasSilentEnding(trimmed),
    nominative: trimmed
  };
}
