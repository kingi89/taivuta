/**
 * Core grammatical case suffix composer for Finnish nominal stems.
 *
 * Implements standard morphological rules for genitive, partitive, illative,
 * local cases (inessive, elative, adessive, ablative, allative), essive, and translative.
 *
 * @packageDocumentation
 */

import { analyzeStem, type AnalyzedStem } from '../morphology/stem.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { harmonize } from '../morphology/vowels.ts';
import { matchNatureNounSurname, inflectNatureNounSurname } from '../morphology/nature-nouns.ts';
import { needsColon, inflectColonWord } from '../morphology/colon.ts';
import type { GrammaticalCase, InflectPersonOptions } from './types.ts';

/**
 * Builds the genitive form (-n) of an analyzed stem.
 *
 * @param analyzed - Analyzed nominal stem.
 * @param options - Person inflection options.
 * @returns Inflected genitive string.
 */
function buildGenitive(analyzed: AnalyzedStem, options: InflectPersonOptions): string {
  if (analyzed.isNen || analyzed.isSStem) {
    return analyzed.stem + 'n';
  }

  if (analyzed.linkingVowel) {
    const separator = analyzed.needsApostrophe ? "'" : '';
    return analyzed.stem + separator + (analyzed.needsApostrophe ? 'n' : analyzed.linkingVowel + 'n');
  }

  const isGiven = options.role !== 'surname';
  const isLaSurname = options.role === 'surname' && /(?:la|lä)$/i.test(analyzed.stem);
  const shouldWeaken = options.gradation !== false && !isLaSurname;
  const weakStem = shouldWeaken ? weakenConsonants(analyzed.stem, { doubleOnly: isGiven }) : analyzed.stem;
  return weakStem + 'n';
}

/**
 * Builds the partitive form (-a/-ä, -ta/-tä) of an analyzed stem.
 *
 * Kotus:
 * - Names in -nen take -sta/-stä in partitive (Virtanen -> Virtasta, Mäkinen -> Mäkistä).
 * - S-stems take -ta/-tä on nominative stem (Tuomas -> Tuomasta, Markus -> Markusta).
 * - Names ending in a short vowel take single -a/-ä on the strong stem (Pekkaa, Mattia, Villeä).
 *
 * @param analyzed - Analyzed nominal stem.
 * @returns Inflected partitive string.
 */
function buildPartitive(analyzed: AnalyzedStem): string {
  if (analyzed.isNen) {
    const suffix = harmonize('sta', analyzed.nominative);
    return analyzed.stem.slice(0, -2) + suffix; // Virtase -> Virtasta
  }

  if (analyzed.isSStem) {
    const suffix = harmonize('ta', analyzed.nominative);
    return analyzed.nominative + suffix;
  }

  if (analyzed.linkingVowel) {
    const separator = analyzed.needsApostrophe ? "'" : '';
    const suffix = harmonize('a', analyzed.nominative);
    return analyzed.stem + separator + (analyzed.needsApostrophe ? 'ta' : analyzed.linkingVowel + suffix);
  }

  // Disyllabic nouns in -io / -iö take -ta / -tä (Kotus: Kallio -> Kalliota, Vainio -> Vainiota)
  if (/(?:io|iö)$/i.test(analyzed.stem)) {
    const suffix = harmonize('ta', analyzed.nominative);
    return analyzed.stem + suffix;
  }

  // Vowel stems use strong grade in partitive (Pekkaa, Mattia, Villeä, Kerttua)
  const suffix = harmonize('a', analyzed.nominative);
  return analyzed.stem + suffix;
}

/**
 * Builds the illative form (lengthened vowel + -n) of an analyzed stem.
 *
 * @param analyzed - Analyzed nominal stem.
 * @returns Inflected illative string.
 */
function buildIllative(analyzed: AnalyzedStem): string {
  if (analyzed.isNen || analyzed.isSStem) {
    return analyzed.stem + 'en'; // Virtase -> Virtaseen, Tuomakse -> Tuomakseen
  }

  if (analyzed.linkingVowel) {
    if (analyzed.needsApostrophe) {
      // Kotus: Names ending in vocalic j (Kaj, Maj) take -hin (Kaj'hin)
      const suffix = analyzed.nominative.toLowerCase().endsWith('j')
        ? 'hin'
        : harmonize('hon', analyzed.nominative);
      return analyzed.stem + "'" + suffix;
    }
    return analyzed.stem + 'iin';
  }

  // Strong vowel stem with final vowel lengthened + n (Pekkaan, Mattiin, Villeen)
  const lastChar = analyzed.stem.slice(-1);
  return analyzed.stem + lastChar + 'n';
}

/**
 * Map of standard case suffixes in back vowel form.
 */
const CASE_SUFFIXES: Record<string, string> = {
  inessive: 'ssa',
  elative: 'sta',
  adessive: 'lla',
  ablative: 'lta',
  allative: 'lle',
  essive: 'na',
  translative: 'ksi'
};

function resolveStandardStem(
  analyzed: AnalyzedStem,
  isEssive: boolean,
  options: InflectPersonOptions
): string {
  const isGiven = options.role !== 'surname';
  const isLaSurname = options.role === 'surname' && /(?:la|lä)$/i.test(analyzed.stem);
  if (isEssive || isLaSurname || options.gradation === false) {
    return analyzed.stem;
  }
  return weakenConsonants(analyzed.stem, { doubleOnly: isGiven });
}

/**
 * Builds standard local, essive, or translative case forms.
 *
 * @param analyzed - Analyzed nominal stem.
 * @param caseName - Target grammatical case.
 * @param options - Person inflection options.
 * @returns Inflected case string.
 */
function buildStandardCase(
  analyzed: AnalyzedStem,
  caseName: GrammaticalCase,
  options: InflectPersonOptions
): string {
  const rawSuffix = CASE_SUFFIXES[caseName];
  if (!rawSuffix) {
    return analyzed.nominative;
  }

  const suffix = harmonize(rawSuffix, analyzed.nominative);

  if (analyzed.isNen || analyzed.isSStem) {
    return analyzed.stem + suffix;
  }

  if (analyzed.linkingVowel) {
    const separator = analyzed.needsApostrophe ? "'" : '';
    return analyzed.stem + separator + (analyzed.needsApostrophe ? '' : analyzed.linkingVowel) + suffix;
  }

  const isEssive = caseName === 'essive';
  const stem = resolveStandardStem(analyzed, isEssive, options);
  return stem + suffix;
}

/**
 * Composes the requested grammatical case for a given proper noun.
 *
 * @param word - Nominative singular form of the noun (e.g. "Matti", "Virtanen", "John").
 * @param caseName - Target grammatical case (e.g. "genitive", "partitive", "inessive").
 * @param options - Inflection options.
 * @returns Inflected word string.
 *
 * @example
 * ```ts
 * composeCase("Matti", "genitive");   // "Matin"
 * composeCase("Virtanen", "partitive"); // "Virtasta"
 * composeCase("John", "adessive");    // "Johnilla"
 * ```
 */
export function composeCase(
  word: string,
  caseName: GrammaticalCase,
  options: InflectPersonOptions = {}
): string {
  if (!word) {
    return '';
  }

  if (caseName === 'nominative') {
    return word;
  }

  if (needsColon(word)) {
    return inflectColonWord(word, caseName);
  }

  // Ancient nature noun surnames (Niemi, Koski, Mäki, Saari, Salmi, Nurmi, Lahti, Laine)
  if (options.role === 'surname') {
    const nature = matchNatureNounSurname(word);
    if (nature) {
      return inflectNatureNounSurname(word, caseName, nature);
    }
  }

  const analyzed = analyzeStem(word, options);

  if (caseName === 'genitive') {
    return buildGenitive(analyzed, options);
  }

  if (caseName === 'partitive') {
    return buildPartitive(analyzed);
  }

  if (caseName === 'illative') {
    return buildIllative(analyzed);
  }

  return buildStandardCase(analyzed, caseName, options);
}
