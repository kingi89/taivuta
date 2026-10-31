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
import {
  needsColon,
  inflectColonWord,
  getCompoundPrefixMatch,
  inflectIslandGroup,
  inflectNenPlace,
  inflectMacronPlace
} from './special-places.ts';
import {
  inflectPluralMaat,
  inflectPluralVallat,
  inflectPluralIslandArchipelago,
  inflectStateCompound
} from './state-places.ts';
import { dispatchStemInflection } from './stem-places.ts';

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

  if (place.startsWith('Uusi-') || place.startsWith('Iso-')) {
    return detectLocalCase(place.slice(place.indexOf('-') + 1));
  }

  if (NATURE_EXTERNAL_SUFFIXES.test(place)) {
    return 'on';
  }

  return 'in';
}

interface SuffixForms {
  weakStem: string;
  strongStem: string;
  partitive: string;
  illative: string;
  suffixHarmony: 'front' | 'back';
}

interface NatureSuffixRule {
  readonly suffix: string;
  readonly weak: string;
  readonly strong: string;
  readonly partitive: string;
  readonly illative: string;
  readonly harmony: 'front' | 'back';
}

const NATURE_SUFFIX_RULES: readonly NatureSuffixRule[] = [
  { suffix: 'järvi', weak: 'järve', strong: 'järve', partitive: 'järveä', illative: 'järveen', harmony: 'front' },
  { suffix: 'joki', weak: 'joe', strong: 'joke', partitive: 'jokea', illative: 'jokeen', harmony: 'back' },
  { suffix: 'mäki', weak: 'mäe', strong: 'mäke', partitive: 'mäkeä', illative: 'mäkeen', harmony: 'front' },
  { suffix: 'vesi', weak: 'vede', strong: 'vete', partitive: 'vettä', illative: 'veteen', harmony: 'front' },
  { suffix: 'saari', weak: 'saare', strong: 'saare', partitive: 'saarta', illative: 'saareen', harmony: 'back' },
  { suffix: 'koski', weak: 'koske', strong: 'koske', partitive: 'koskea', illative: 'koskeen', harmony: 'back' },
  { suffix: 'salmi', weak: 'salme', strong: 'salme', partitive: 'salmea', illative: 'salmeen', harmony: 'back' },
  { suffix: 'niemi', weak: 'nieme', strong: 'nieme', partitive: 'niemeä', illative: 'niemeen', harmony: 'front' },
  { suffix: 'lahti', weak: 'lahde', strong: 'lahte', partitive: 'lahtea', illative: 'lahteen', harmony: 'back' }
];

function resolveNatureSuffix(place: string): SuffixForms | null {
  const lower = place.toLowerCase();
  for (const rule of NATURE_SUFFIX_RULES) {
    if (lower.endsWith(rule.suffix)) {
      const base = place.slice(0, -rule.suffix.length);
      const isCap = !base && place[0] === place[0]?.toUpperCase();
      const cap = (s: string): string => (isCap ? (s[0]?.toUpperCase() ?? '') + s.slice(1) : s);
      return {
        weakStem: base ? `${base}${rule.weak}` : cap(rule.weak),
        strongStem: base ? `${base}${rule.strong}` : cap(rule.strong),
        partitive: base ? `${base}${rule.partitive}` : cap(rule.partitive),
        illative: base ? `${base}${rule.illative}` : cap(rule.illative),
        suffixHarmony: rule.harmony
      };
    }
  }
  return null;
}

const FRONT_NATURE_ENDINGS: Record<string, string> = {
  inessive: 'ssä',
  elative: 'stä',
  adessive: 'llä',
  ablative: 'ltä',
  allative: 'lle',
  essive: 'nä',
  translative: 'ksi'
};

const BACK_NATURE_ENDINGS: Record<string, string> = {
  inessive: 'ssa',
  elative: 'sta',
  adessive: 'lla',
  ablative: 'lta',
  allative: 'lle',
  essive: 'na',
  translative: 'ksi'
};

function inflectNaturePlace(forms: SuffixForms, targetCase: GrammaticalCase): string {
  const { weakStem, strongStem, partitive, illative, suffixHarmony } = forms;
  if (targetCase === 'partitive') return partitive;
  if (targetCase === 'illative') return illative;
  if (targetCase === 'genitive') return `${weakStem}n`;

  const table = suffixHarmony === 'front' ? FRONT_NATURE_ENDINGS : BACK_NATURE_ENDINGS;
  const end = table[targetCase];
  const stem = targetCase === 'essive' ? strongStem : weakStem;
  return end ? `${stem}${end}` : weakStem;
}

function resolveSpecialPlace(place: string, targetCase: GrammaticalCase): string | null {
  if (needsColon(place)) {
    return inflectColonWord(place, targetCase);
  }
  const state = inflectStateCompound(place, targetCase);
  if (state) {
    return state;
  }
  const maat = inflectPluralMaat(place, targetCase);
  if (maat) {
    return maat;
  }
  const vallat = inflectPluralVallat(place, targetCase);
  if (vallat) {
    return vallat;
  }
  const islandGroup =
    inflectIslandGroup(place, targetCase) ??
    inflectPluralIslandArchipelago(place, targetCase);
  if (islandGroup) {
    return islandGroup;
  }
  const macron = inflectMacronPlace(place, targetCase);
  if (macron) {
    return macron;
  }
  if (place.endsWith('nen')) {
    return inflectNenPlace(place, targetCase);
  }
  return null;
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

  const override = IRREGULAR_PLACES.get(place);
  if (override && override[resolvedCase]) {
    return override[resolvedCase]!;
  }

  const compound = getCompoundPrefixMatch(place, resolvedCase);
  if (compound) {
    return `${compound.prefix}${inflectPlace(compound.remainder, resolvedCase, options)}`;
  }

  const special = resolveSpecialPlace(place, resolvedCase);
  if (special) {
    return special;
  }

  const natureForms = resolveNatureSuffix(place);
  if (natureForms) {
    return inflectNaturePlace(natureForms, resolvedCase);
  }

  return dispatchStemInflection(place, resolvedCase);
}
