/**
 * Unified inflection entry point for Finnish proper nouns (persons, places, and nominals).
 *
 * @packageDocumentation
 */

import type { CaseName, GrammaticalCase, InflectOptions } from './types.ts';
import { inflectPerson } from '../person/inflect-person.ts';
import { inflectPlace, TOPONYM_SUFFIX_REGEX } from '../place/inflect-place.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  IRREGULAR_PLACES
} from '../place/municipalities.data.ts';

function isKnownPlace(name: string): boolean {
  return (
    IRREGULAR_PLACES.has(name) ||
    EXTERNAL_CASE_MUNICIPALITIES.has(name) ||
    ISLAND_INTERNAL_EXCEPTIONS.has(name) ||
    TOPONYM_SUFFIX_REGEX.test(name)
  );
}

function isContextualLocalCase(targetCase: CaseName): boolean {
  return targetCase === 'local' || targetCase === 'localFrom' || targetCase === 'localTo';
}

/**
 * Detects whether a proper noun represents a recognized place name or person name.
 *
 * @param name - The proper noun to inspect.
 * @returns 'place' if matched against known municipalities, exceptions, or toponymic suffixes; otherwise 'person'.
 */
export function detectEntityRole(name: string): 'person' | 'place' {
  return isKnownPlace(name) ? 'place' : 'person';
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
    sStem: options.sStem,
    gradation: options.gradation
  });
}
