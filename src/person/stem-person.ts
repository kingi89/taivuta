/**
 * Canonical morphological stem paradigm generator for Finnish person names.
 *
 * Constructs StemParadigm models for given names, surnames, foreign names,
 * and traditional names.
 *
 * @packageDocumentation
 */

import { createStemParadigm, type StemParadigm } from '../morphology/paradigm.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';
import { analyzeStem, type AnalyzedStem } from '../morphology/stem.ts';
import type { InflectPersonOptions } from '../cases/types.ts';

/**
 * Traditional Finnish given names that conventionally undergo qualitative gradation
 * (e.g. Sampo -> Sammon, Satu -> Sadun) according to Kotus guidelines.
 */
const TRADITIONAL_QUALITATIVE_GIVEN_NAMES: ReadonlySet<string> = new Set([
  'sampo',
  'satu'
]);

function resolveSpecialAnalyzedParadigm(
  name: string,
  analyzed: AnalyzedStem
): StemParadigm | null {
  if (analyzed.isNen) {
    const base = analyzed.nominative.slice(0, -3);
    return createStemParadigm(name, {
      strong: analyzed.stem,
      weak: analyzed.stem,
      partitive: base + harmonize('sta', name),
      illative: analyzed.stem + 'en'
    });
  }

  if (analyzed.isSStem) {
    return createStemParadigm(name, {
      strong: analyzed.stem,
      weak: analyzed.stem,
      partitive: analyzed.nominative + harmonize('ta', name),
      illative: analyzed.stem + 'en'
    });
  }

  if (analyzed.linkingVowel) {
    if (analyzed.needsApostrophe) {
      const illativeSuffix = name.toLowerCase().endsWith('j')
        ? 'hin'
        : harmonize('hon', name);
      return createStemParadigm(name, {
        strong: `${name}'`,
        weak: `${name}'`,
        partitive: `${name}'${harmonize('ta', name)}`,
        illative: `${name}'${illativeSuffix}`
      });
    }

    const stem = `${analyzed.stem}${analyzed.linkingVowel}`;
    return createStemParadigm(name, {
      strong: stem,
      weak: stem,
      partitive: `${stem}${harmonize('a', name)}`,
      illative: `${stem}in`
    });
  }

  return null;
}

function resolveVocalicPartitiveSuffix(name: string): string {
  if (/(?:io|iö)$/i.test(name)) {
    return harmonize('ta', name);
  }
  return harmonize('a', name);
}

function resolveWeakVocalicStem(name: string, options?: InflectPersonOptions): string {
  if (options?.gradation === false) {
    return name;
  }
  // Kotus: Surnames ending in -la/-lä resist consonant gradation (Mattila -> Mattilan)
  if (options?.role === 'surname' && /(?:la|lä)$/i.test(name)) {
    return name;
  }

  const isGiven = options?.role !== 'surname';
  const allowsQualitative = TRADITIONAL_QUALITATIVE_GIVEN_NAMES.has(name.toLowerCase());
  return weakenConsonants(name, { doubleOnly: isGiven && !allowsQualitative });
}

function resolveVocalicPersonParadigm(
  name: string,
  options?: InflectPersonOptions
): StemParadigm {
  const weakStem = resolveWeakVocalicStem(name, options);
  const partitiveSuffix = resolveVocalicPartitiveSuffix(name);
  const lastChar = name.slice(-1);

  return createStemParadigm(name, {
    strong: name,
    weak: weakStem,
    partitive: `${name}${partitiveSuffix}`,
    illative: `${name}${lastChar}n`
  });
}

/**
 * Builds the canonical morphological StemParadigm for a Finnish person name.
 *
 * @param name - Nominative person name (given name, surname, or foreign name).
 * @param options - Optional configuration options controlling role, s-stem, or gradation.
 * @returns Fully constructed StemParadigm.
 *
 * @example
 * ```ts
 * const p = getPersonParadigm("Matti");
 * assembleCase(p, "genitive"); // "Matin"
 *
 * const virtanen = getPersonParadigm("Virtanen");
 * assembleCase(virtanen, "partitive"); // "Virtasta"
 * ```
 */
export function getPersonParadigm(
  name: string,
  options: InflectPersonOptions = {}
): StemParadigm {
  if (options.role === 'surname') {
    const nature = matchNatureNoun(name);
    if (nature) {
      return nature;
    }
  }

  const analyzed = analyzeStem(name, options);
  return (
    resolveSpecialAnalyzedParadigm(name, analyzed) ??
    resolveVocalicPersonParadigm(name, options)
  );
}
