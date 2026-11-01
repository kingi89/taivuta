/**
 * Canonical case suffix assembler for Finnish nominal paradigms.
 *
 * Assembles the 11 primary Finnish grammatical cases supported by the library
 * (nominative, genitive, partitive, inessive, elative, illative, adessive, ablative,
 * allative, essive, translative) as well as contextual spatial cases (local, localFrom, localTo)
 * by attaching harmonized suffixes to the canonical strong or weak vocalic stems.
 *
 * Note: While standard Finnish has 15 noun cases, marginal cases (abessive, comitative,
 * instructive) are intentionally omitted due to their negligible utility in proper noun inflection.
 *
 * @packageDocumentation
 */

import { harmonize } from './vowels.ts';
import type { StemParadigm } from './paradigm.ts';
import type { CaseName, LocalCaseType, PlaceLocalCase } from '../cases/types.ts';

/**
 * Options controlling suffix assembly.
 */
export interface AssembleCaseOptions {
  /** Explicit override for contextual local case preference ('in' vs 'on') */
  readonly localCase?: LocalCaseType;
}

/**
 * Standard case suffixes in back-vowel harmony form.
 */
const STANDARD_SUFFIXES: Readonly<Record<string, string>> = {
  inessive: 'ssa',
  elative: 'sta',
  adessive: 'lla',
  ablative: 'lta',
  allative: 'lle',
  essive: 'na',
  translative: 'ksi'
};

function isContextualCase(caseName: string): caseName is PlaceLocalCase {
  return caseName === 'local' || caseName === 'localFrom' || caseName === 'localTo';
}

function resolveContextualCase(
  targetCase: PlaceLocalCase,
  spatialCase: LocalCaseType
): CaseName {
  if (targetCase === 'local') {
    return spatialCase === 'on' ? 'adessive' : 'inessive';
  }
  if (targetCase === 'localFrom') {
    return spatialCase === 'on' ? 'ablative' : 'elative';
  }
  return spatialCase === 'on' ? 'allative' : 'illative';
}

function buildContextualCase(
  targetCase: PlaceLocalCase,
  paradigm: StemParadigm,
  options: AssembleCaseOptions
): string {
  const pref = options.localCase ?? paradigm.defaultSpatialCase;
  const concreteCase = resolveContextualCase(targetCase, pref);
  return assembleCase(paradigm, concreteCase, options);
}

function buildStandardCase(
  paradigm: StemParadigm,
  targetCase: string
): string {
  const rawSuffix = STANDARD_SUFFIXES[targetCase];
  if (!rawSuffix) {
    return paradigm.nominative;
  }

  const harmonyChar = paradigm.vowelHarmony === 'front' ? 'ä' : 'a';
  const suffix = harmonize(rawSuffix, harmonyChar);
  const stem = targetCase === 'essive'
    ? paradigm.strongVocalicStem
    : paradigm.weakVocalicStem;

  return `${stem}${suffix}`;
}

/**
 * Assembles the requested grammatical or contextual local case for a given StemParadigm.
 *
 * @param paradigm - Canonical morphological paradigm of the proper noun.
 * @param targetCase - Requested grammatical or contextual case.
 * @param options - Configuration options such as local case preference overrides.
 * @returns Fully inflected word string.
 *
 * @example
 * ```ts
 * const p = createStemParadigm('Matti', { strong: 'Matti', weak: 'Mati', partitive: 'Mattia', illative: 'Mattiin' });
 * assembleCase(p, 'genitive'); // "Matin"
 * assembleCase(p, 'inessive'); // "Matissa"
 * assembleCase(p, 'essive');   // "Mattina"
 * ```
 */
export function assembleCase(
  paradigm: StemParadigm,
  targetCase: CaseName,
  options: AssembleCaseOptions = {}
): string {
  if (!paradigm || !paradigm.nominative || targetCase === 'nominative') {
    return paradigm ? paradigm.nominative : '';
  }

  if (targetCase === 'genitive') {
    return `${paradigm.weakVocalicStem}n`;
  }
  if (targetCase === 'partitive') {
    return paradigm.partitive;
  }
  if (targetCase === 'illative') {
    return paradigm.illative;
  }

  if (isContextualCase(targetCase)) {
    return buildContextualCase(targetCase, paradigm, options);
  }

  return buildStandardCase(paradigm, targetCase);
}
