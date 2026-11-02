/**
 * Place name inflection and local case detection for Finnish toponyms.
 *
 * Inflects Finnish municipalities and arbitrary place names into all grammatical cases,
 * with high linguistic accuracy for local case selection (sisä- vs. ulkopaikallissijat).
 *
 * @packageDocumentation
 */

import type { CaseName, GrammaticalCase, LocalCaseType } from '../cases/types.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  IRREGULAR_PLACES
} from './municipalities.data.ts';
import { needsColon, inflectColonWord } from '../morphology/colon.ts';
import {
  inflectPluralMaat,
  inflectPluralVallat,
  inflectPluralIslandArchipelago,
  inflectStateCompound
} from './state-places.ts';
import { getPlaceParadigm } from './stem-places.ts';
import { decomposeCompound } from '../morphology/compounds.ts';
import { matchNatureNoun } from '../morphology/nature-nouns.ts';
import { assembleCase } from '../morphology/assembler.ts';

/**
 * Options controlling place name inflection.
 */
export interface InflectPlaceOptions {
  /**
   * Explicit override for local case preference:
   * - 'in': internal local cases (-ssa/-ssä, -sta/-stä, -on/-seen)
   * - 'on': external local cases (-lla/-llä, -lta/-ltä, -lle)
   */
  readonly localCase?: LocalCaseType;
}

/**
 * Common toponymic settlement and landscape suffixes.
 */
export const TOPONYM_SUFFIX_REGEX = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|saaret|niemi|vaara|harju|kangas|suo|lampi|nummi|kylä|linna|lahti|maa|rannikko)$/i;

const NATURE_EXTERNAL_SUFFIXES = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|saaret|niemi|vaara|harju|kangas|suo|lampi|nummi|rannikko)$/i;

const EXTERNAL_CASE_COUNTRIES: ReadonlySet<string> = new Set([
  'ahvenanmaa',
  'bahama',
  'barbados',
  'dominica',
  'fidzi',
  'grenada',
  'kap verde',
  'kiribati',
  'malta',
  'nauru',
  'palau',
  'saint lucia',
  'samoa',
  'sao tome ja principe',
  'tonga',
  'tuvalu',
  'vanuatu',
  'venäjä',
  'valko-venäjä'
]);

/**
 * Normalizes foreign diacritics in toponyms for robust matching,
 * while strictly preserving Finnish phonemic vowels (ä, ö, å).
 */
function normalizeForeignAccents(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàâãā]/g, 'a')
    .replace(/[éèêëē]/g, 'e')
    .replace(/[íìîïī]/g, 'i')
    .replace(/[óòôõō]/g, 'o')
    .replace(/[úùûū]/g, 'u')
    .replace(/ž/g, 'z')
    .replace(/š/g, 's')
    .replace(/č/g, 'c');
}

/**
 * Detects whether a Finnish place name conventionally takes internal local cases
 * (sisäpaikallissijat: inessiivi, elatiivi, illatiivi) or external local cases
 * (ulkopaikallissijat: adessiivi, ablatiivi, allatiivi).
 *
 * @param place - The nominative place name (e.g. "Helsinki", "Tampere", "Alajärvi").
 * @returns 'in' for internal cases, 'on' for external cases.
 *
 * @example
 * ```ts
 * detectLocalCase("Helsinki"); // "in" (Helsingissä)
 * detectLocalCase("Tampere");  // "on" (Tampereella)
 * detectLocalCase("Alajärvi"); // "on" (Alajärvellä)
 * ```
 */
function hasExternalLocalCase(place: string): boolean {
  const normalized = normalizeForeignAccents(place);
  return (
    normalized.endsWith('saaret') ||
    EXTERNAL_CASE_COUNTRIES.has(normalized) ||
    /(?:iinit|iivit|ellit|orit)$/i.test(place)
  );
}

function checkCompoundRemainder(place: string): string | null {
  if (place.startsWith('Uusi-') || place.startsWith('Iso-')) {
    return place.slice(place.indexOf('-') + 1);
  }
  return null;
}

export function detectLocalCase(place: string): LocalCaseType {
  if (!place) {
    return 'in';
  }

  const override = IRREGULAR_PLACES.get(place);
  if (override?.localCaseType) {
    return override.localCaseType;
  }

  if (EXTERNAL_CASE_MUNICIPALITIES.has(place) || hasExternalLocalCase(place)) {
    return 'on';
  }

  if (ISLAND_INTERNAL_EXCEPTIONS.has(place)) {
    return 'in';
  }

  const remainder = checkCompoundRemainder(place);
  if (remainder) {
    return detectLocalCase(remainder);
  }

  const nature = matchNatureNoun(place);
  if (nature) {
    return nature.defaultSpatialCase;
  }

  if (NATURE_EXTERNAL_SUFFIXES.test(place)) {
    return 'on';
  }

  return 'in';
}



function resolveGeopoliticalState(place: string, targetCase: GrammaticalCase): string | null {
  return (
    inflectStateCompound(place, targetCase) ??
    inflectPluralMaat(place, targetCase) ??
    inflectPluralVallat(place, targetCase) ??
    inflectPluralIslandArchipelago(place, targetCase)
  );
}

function resolveLocalCaseTarget(
  place: string,
  targetCase: CaseName,
  options: InflectPlaceOptions
): GrammaticalCase {
  if (targetCase !== 'local' && targetCase !== 'localFrom' && targetCase !== 'localTo') {
    return targetCase;
  }

  const localType = options.localCase ?? detectLocalCase(place);
  if (targetCase === 'local') {
    return localType === 'on' ? 'adessive' : 'inessive';
  }
  if (targetCase === 'localFrom') {
    return localType === 'on' ? 'ablative' : 'elative';
  }
  return localType === 'on' ? 'allative' : 'illative';
}

function resolveSpecialOrStatePlace(
  place: string,
  resolvedCase: GrammaticalCase
): string | null {
  const override = IRREGULAR_PLACES.get(place);
  if (override && resolvedCase !== 'nominative') {
    const custom = override[resolvedCase];
    if (custom) {
      return custom;
    }
  }
  if (needsColon(place)) {
    return inflectColonWord(place, resolvedCase);
  }
  return resolveGeopoliticalState(place, resolvedCase);
}

/**
 * Inflects a Finnish place name into the specified grammatical case or contextual local case.
 *
 * Supported contextual local cases:
 * - `'local'` (missä): resolves to inessive (-ssa/-ssä) or adessive (-lla/-llä)
 * - `'localFrom'` (mistä): resolves to elative (-sta/-stä) or ablative (-lta/-ltä)
 * - `'localTo'` (mihin): resolves to illative (-Vn/-seen/-iin) or allative (-lle)
 *
 * @param place - The place name to inflect (e.g. "Helsinki", "Tampere", "Kuortane").
 * @param targetCase - The target case name (e.g. "genitive", "inessive", "local", "localTo").
 * @param options - Optional configuration options.
 * @returns The inflected place name string.
 *
 * @example
 * ```ts
 * inflectPlace("Helsinki", "local");    // "Helsingissä"
 * inflectPlace("Tampere", "local");     // "Tampereella"
 * inflectPlace("Tampere", "localTo");   // "Tampereelle"
 * inflectPlace("Helsinki", "localTo");  // "Helsinkiin"
 * ```
 */
export function inflectPlace(
  place: string,
  targetCase: CaseName,
  options: InflectPlaceOptions = {}
): string {
  if (!place) {
    return '';
  }

  const resolvedCase = resolveLocalCaseTarget(place, targetCase, options);
  if (resolvedCase === 'nominative') {
    return place;
  }

  const special = resolveSpecialOrStatePlace(place, resolvedCase);
  if (special) {
    return special;
  }

  const compound = decomposeCompound(place, resolvedCase);
  if (compound?.isInflectingPrefix) {
    return `${compound.prefix}${inflectPlace(compound.headWord, resolvedCase, options)}`;
  }

  const nature = matchNatureNoun(place);
  if (nature) {
    return assembleCase(nature, resolvedCase);
  }

  const paradigm = getPlaceParadigm(place, detectLocalCase(place));
  return assembleCase(paradigm, resolvedCase);
}
