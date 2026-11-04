/**
 * Canonical morphological stem paradigm generator for Finnish person names.
 *
 * Constructs StemParadigm models for given names, surnames, foreign names,
 * and irregular historical names.
 *
 * @packageDocumentation
 */

import { createStemParadigm, type StemParadigm } from '../morphology/paradigm.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';
import { analyzeStem, type AnalyzedStem } from '../morphology/stem.ts';
import type { InflectPersonOptions } from '../cases/types.ts';

function resolveIrregularParadigm(
  name: string,
  options?: InflectPersonOptions
): StemParadigm | null {
  if (options?.gradation === false) {
    if (name === 'Satu') {
      return createStemParadigm('Satu', {
        strong: 'Satu',
        weak: 'Satu',
        partitive: 'Satua',
        illative: 'Satuun'
      });
    }
    return null;
  }

  if (name === 'Sampo') {
    return createStemParadigm('Sampo', {
      strong: 'Sampo',
      weak: 'Sammo',
      partitive: 'Sampoa',
      illative: 'Sampoon'
    });
  }

  if (name === 'Aleksis') {
    return createStemParadigm('Aleksis', {
      strong: 'Aleksikse',
      weak: 'Aleksikse',
      partitive: 'Aleksista',
      illative: 'Aleksikseen'
    });
  }

  if (name === 'Satu') {
    return createStemParadigm('Satu', {
      strong: 'Satu',
      weak: 'Sadu',
      partitive: 'Satua',
      illative: 'Satuun'
    });
  }

  return null;
}

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

function resolveVocalicPersonParadigm(
  name: string,
  options?: InflectPersonOptions
): StemParadigm {
  const isGiven = options?.role !== 'surname';
  // Kotus: Surnames ending in -la/-lä resist consonant gradation (Mattila -> Mattilan)
  const isLaSurname = options?.role === 'surname' && /(?:la|lä)$/i.test(name);
  const shouldWeaken = options?.gradation !== false && !isLaSurname;
  const weakStem = shouldWeaken ? weakenConsonants(name, { doubleOnly: isGiven }) : name;
  const partitiveSuffix = /(?:io|iö)$/i.test(name)
    ? harmonize('ta', name)
    : harmonize('a', name);
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

  const irregular = resolveIrregularParadigm(name, options);
  if (irregular) {
    return irregular;
  }

  const analyzed = analyzeStem(name, options);
  return (
    resolveSpecialAnalyzedParadigm(name, analyzed) ??
    resolveVocalicPersonParadigm(name, options)
  );
}
