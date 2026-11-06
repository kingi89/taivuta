/**
 * Unified inflection entry point for Finnish proper nouns (persons, places, and nominals).
 *
 * @packageDocumentation
 */

import type {
  CaseName,
  GrammaticalCase,
  InflectOptions
} from './types.ts';
import { inflectPerson } from '../person/inflect-person.ts';
import { inflectPlace, detectLocalCase } from '../place/inflect-place.ts';
import { classifyProperNoun } from './classify.ts';

function isContextualLocalCase(targetCase: CaseName): boolean {
  return targetCase === 'local' || targetCase === 'localFrom' || targetCase === 'localTo';
}

/**
 * Heuristically determines whether a proper noun represents a place or a person.
 *
 * Note: This is an educated heuristic based on structural markers, prefixes, nature formatives,
 * and local case conventions. It is not an absolute classifier; ambiguous names (such as surnames
 * with toponymic origins like "Karhuvaara" or "Ylä-Anttila") should specify an explicit role.
 *
 * @param name - The proper noun to inspect.
 * @returns The detected entity role ('place' or 'person').
 */
export function detectEntityRole(name: string): 'person' | 'place' {
  return classifyProperNoun(name, detectLocalCase(name));
}

function resolveEntityRole(name: string, explicitRole?: 'person' | 'place' | 'auto'): 'person' | 'place' {
  if (explicitRole === 'person' || explicitRole === 'place') {
    return explicitRole;
  }
  return detectEntityRole(name);
}

/**
 * Inflects any Finnish proper noun (person or place) into the specified grammatical or local case.
 *
 * @param name - The proper noun to inflect (e.g. "Matti", "Virtanen", "Helsinki", "Tampere").
 * @param targetCase - The target case name (e.g. "genitive", "partitive", "local", "localTo").
 * @param options - Configuration options controlling role, local case, or morphological parameters.
 * @returns The inflected name string.
 *
 * @example
 * ```ts
 * inflect("Matti", "genitive");         // "Matin"
 * inflect("Virtanen", "partitive");     // "Virtasta"
 * inflect("Tampere", "local");          // "Tampereella"
 * inflect("Helsinki", "localTo");       // "Helsinkiin"
 * ```
 */
export function inflect(
  name: string,
  targetCase: CaseName,
  options: InflectOptions = {}
): string {
  if (!name || targetCase === 'nominative') {
    return name;
  }

  if (isContextualLocalCase(targetCase)) {
    return inflectPlace(name, targetCase, { localCase: options.localCase });
  }

  const role = resolveEntityRole(name, options.role);
  if (role === 'place') {
    return inflectPlace(name, targetCase, { localCase: options.localCase });
  }

  return inflectPerson(name, targetCase as GrammaticalCase, {
    role: options.role === 'auto' ? 'auto' : undefined,
    sStem: options.sStem,
    gradation: options.gradation,
    vocalicStemVariant: options.vocalicStemVariant,
    colon: options.colon,
    harmony: options.harmony,
    preference: options.preference
  });
}
