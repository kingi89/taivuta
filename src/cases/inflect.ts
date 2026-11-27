/**
 * Unified inflection entry point for Finnish proper nouns (persons, places, and nominals).
 *
 * @packageDocumentation
 */

import type {
  CaseName,
  GeneralPreference,
  GeneralPreferenceInput,
  GrammaticalCase,
  InflectOptions,
  InflectPersonOptions,
  LocalCaseType,
  PersonPreference
} from './types.ts';
import { inflectPerson } from '../person/inflect-person.ts';
import { isKnownPersonPreferenceId } from '../person/stem-person.ts';
import { inflectPlace, detectLocalCase, type InflectPlaceOptions } from '../place/inflect-place.ts';
import { fallbackString, isRecord, isValidCaseName, sanitizeInput } from '../morphology/guards.ts';
import { classifyProperNoun } from './classify.ts';

const PERSON_PREF_KEYS = ['gradation', 'sStem', 'tarStem', 'vocalicStemVariant', 'colon', 'harmony'] as const;

function isContextualLocalCase(targetCase: CaseName): boolean {
  return targetCase === 'local' || targetCase === 'localFrom' || targetCase === 'localTo';
}

function toPreferenceItems(preference: GeneralPreference): readonly GeneralPreferenceInput[] {
  return Array.isArray(preference)
    ? preference
    : [preference as GeneralPreferenceInput];
}

/**
 * Extracts an explicit `localCase` override from a single preference entry.
 * Returns `null` when the entry does not specify a place local case.
 */
function extractLocalCaseFromItem(item: GeneralPreferenceInput): LocalCaseType | null {
  if (!isRecord(item)) {
    return null;
  }
  if ('localCase' in item && (item.localCase === 'in' || item.localCase === 'on')) {
    return item.localCase;
  }
  if ('params' in item && isRecord(item.params)) {
    const localCase = item.params.localCase;
    if (localCase === 'in' || localCase === 'on') {
      return localCase;
    }
  }
  return null;
}

/**
 * Resolves the last-specified `localCase` across a single or array `GeneralPreference`.
 * Returns `null` when no place preference is present.
 */
function resolvePreferenceLocalCase(preference: GeneralPreference): LocalCaseType | null {
  let resolved: LocalCaseType | null = null;
  for (const item of toPreferenceItems(preference)) {
    const candidate = extractLocalCaseFromItem(item);
    if (candidate !== null) {
      resolved = candidate;
    }
  }
  return resolved;
}

function buildPlaceOptions(options: InflectOptions): InflectPlaceOptions {
  if (options.localCase === 'in' || options.localCase === 'on') {
    return { localCase: options.localCase };
  }
  if (options.preference !== undefined) {
    const localCase = resolvePreferenceLocalCase(options.preference);
    if (localCase !== null) {
      return { localCase };
    }
  }
  return {};
}

function isPersonPreferenceItem(item: GeneralPreferenceInput): boolean {
  if (typeof item === 'string') {
    return isKnownPersonPreferenceId(item);
  }
  if (!isRecord(item)) {
    return false;
  }
  const params = 'params' in item ? item.params : item;
  if (!isRecord(params)) {
    return false;
  }
  return PERSON_PREF_KEYS.some((key) => Object.hasOwn(params, key));
}

function hasPersonPreference(preference: GeneralPreference): boolean {
  return toPreferenceItems(preference).some(isPersonPreferenceItem);
}

function buildPersonOptions(options: InflectOptions): InflectPersonOptions {
  const base: InflectPersonOptions = {
    sStem: options.sStem,
    tarStem: options.tarStem,
    gradation: options.gradation,
    vocalicStemVariant: options.vocalicStemVariant,
    colon: options.colon,
    harmony: options.harmony,
    preference: options.preference as PersonPreference | undefined
  };
  if (options.role === 'givenName' || options.role === 'surname' || options.role === 'auto') {
    return { ...base, role: options.role };
  }
  return base;
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
  const trimmed = sanitizeInput(name);
  if (!trimmed) {
    return 'person';
  }
  return classifyProperNoun(trimmed, detectLocalCase(trimmed));
}

function hasPersonOptions(options: InflectOptions): boolean {
  const hasPersonPref = options.preference !== undefined && hasPersonPreference(options.preference);
  return (
    hasPersonPref ||
    options.vocalicStemVariant !== undefined ||
    options.sStem !== undefined ||
    options.gradation !== undefined
  );
}

function hasPlaceOptions(options: InflectOptions): boolean {
  if (options.localCase === 'in' || options.localCase === 'on') {
    return true;
  }
  return options.preference !== undefined && resolvePreferenceLocalCase(options.preference) !== null;
}

function resolveEntityRole(name: string, options: InflectOptions): 'person' | 'place' {
  if (options.role === 'place') {
    return 'place';
  }
  if (options.role === 'person' || options.role === 'givenName' || options.role === 'surname') {
    return 'person';
  }
  if (hasPersonOptions(options)) {
    return 'person';
  }
  if (hasPlaceOptions(options)) {
    return 'place';
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
  const trimmed = sanitizeInput(name);
  if (!trimmed) {
    return fallbackString(name);
  }
  if (!isValidCaseName(targetCase) || targetCase === 'nominative') {
    return trimmed;
  }

  const safeOptions: InflectOptions = isRecord(options) ? options : {};
  const placeOptions = buildPlaceOptions(safeOptions);
  if (isContextualLocalCase(targetCase)) {
    return inflectPlace(trimmed, targetCase, placeOptions);
  }

  const role = resolveEntityRole(trimmed, safeOptions);
  if (role === 'place') {
    return inflectPlace(trimmed, targetCase, placeOptions);
  }

  return inflectPerson(trimmed, targetCase as GrammaticalCase, buildPersonOptions(safeOptions));
}
