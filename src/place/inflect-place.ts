/**
 * Place name inflection and local case detection for Finnish toponyms.
 *
 * Inflects Finnish municipalities and arbitrary place names into all grammatical cases,
 * with high linguistic accuracy for local case selection (sisä- vs. ulkopaikallissijat).
 *
 * @packageDocumentation
 */

import type { CaseName, GrammaticalCase, LocalCaseType } from '../cases/types.ts';
import { harmonize } from '../morphology/vowels.ts';
import { weakenConsonants } from '../morphology/gradation.ts';
import {
  EXTERNAL_CASE_MUNICIPALITIES,
  ISLAND_INTERNAL_EXCEPTIONS,
  GRADATION_RESISTANT_PLACES,
  IRREGULAR_PLACES
} from './municipalities.data.ts';

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
export const TOPONYM_SUFFIX_REGEX = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|niemi|vaara|harju|kangas|suo|lampi|nummi|kylä|linna|lahti)$/i;

const NATURE_EXTERNAL_SUFFIXES = /(?:järvi|joki|mäki|vesi|koski|salmi|saari|niemi|vaara|harju|kangas|suo|lampi|nummi)$/i;

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
export function detectLocalCase(place: string): LocalCaseType {
  if (!place) {
    return 'in';
  }

  const override = IRREGULAR_PLACES.get(place);
  if (override?.localCaseType) {
    return override.localCaseType;
  }

  if (EXTERNAL_CASE_MUNICIPALITIES.has(place)) {
    return 'on';
  }

  if (ISLAND_INTERNAL_EXCEPTIONS.has(place)) {
    return 'in';
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

function resolveNatureSuffix(place: string): SuffixForms | null {
  const lower = place.toLowerCase();
  if (lower.endsWith('järvi')) {
    const b = place.slice(0, -5);
    return { weakStem: `${b}järve`, strongStem: `${b}järve`, partitive: `${b}järveä`, illative: `${b}järveen`, suffixHarmony: 'front' };
  }
  if (lower.endsWith('joki')) {
    const b = place.slice(0, -4);
    return { weakStem: `${b}joe`, strongStem: `${b}joke`, partitive: `${b}jokea`, illative: `${b}jokeen`, suffixHarmony: 'back' };
  }
  if (lower.endsWith('mäki')) {
    const b = place.slice(0, -4);
    return { weakStem: `${b}mäe`, strongStem: `${b}mäke`, partitive: `${b}mäkeä`, illative: `${b}mäkeen`, suffixHarmony: 'front' };
  }
  if (lower.endsWith('vesi')) {
    const b = place.slice(0, -4);
    return { weakStem: `${b}vede`, strongStem: `${b}vete`, partitive: `${b}vettä`, illative: `${b}veteen`, suffixHarmony: 'front' };
  }
  if (lower.endsWith('saari')) {
    const b = place.slice(0, -5);
    return { weakStem: `${b}saare`, strongStem: `${b}saare`, partitive: `${b}saarta`, illative: `${b}saareen`, suffixHarmony: 'back' };
  }
  if (lower.endsWith('koski')) {
    const b = place.slice(0, -5);
    return { weakStem: `${b}koske`, strongStem: `${b}koske`, partitive: `${b}koskea`, illative: `${b}koskeen`, suffixHarmony: 'back' };
  }
  if (lower.endsWith('salmi')) {
    const b = place.slice(0, -5);
    return { weakStem: `${b}salme`, strongStem: `${b}salme`, partitive: `${b}salmea`, illative: `${b}salmeen`, suffixHarmony: 'back' };
  }
  if (lower.endsWith('niemi')) {
    const b = place.slice(0, -5);
    return { weakStem: `${b}nieme`, strongStem: `${b}nieme`, partitive: `${b}niemeä`, illative: `${b}niemeen`, suffixHarmony: 'front' };
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

function resolveStandardPartitive(place: string): string {
  if (/(?:io|iö)$/i.test(place)) {
    return harmonize('ta', place);
  }
  if (place.endsWith('e') && !/(?:ee)$/i.test(place)) {
    return harmonize('tta', place);
  }
  return harmonize('a', place);
}

function inflectStandardPlace(place: string, targetCase: GrammaticalCase): string {
  const resists = GRADATION_RESISTANT_PLACES.has(place);
  const weakStem = resists ? place : weakenConsonants(place);
  const strongStem = place;
  const isEPlace = place.endsWith('e') && !/(?:ee)$/i.test(place);

  if (targetCase === 'genitive') return isEPlace ? `${place}en` : `${weakStem}n`;
  if (targetCase === 'illative') return isEPlace ? `${place}eseen` : `${place}${place.slice(-1)}n`;
  if (targetCase === 'partitive') return `${place}${resolveStandardPartitive(place)}`;

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  const stem = targetCase === 'essive' ? strongStem : weakStem;
  return end ? `${stem}${end}` : place;
}

function inflectConsonantPlace(place: string, targetCase: GrammaticalCase): string {
  const stem = `${place}i`;
  if (targetCase === 'genitive') return `${stem}n`;
  if (targetCase === 'illative') return `${stem}in`;
  if (targetCase === 'partitive') return `${stem}${harmonize('a', place)}`;

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${stem}${end}` : place;
}

function inflectLongVowelPlace(place: string, targetCase: GrammaticalCase): string {
  if (targetCase === 'genitive') return `${place}n`;
  if (targetCase === 'partitive') return `${place}${harmonize('ta', place)}`;
  if (targetCase === 'illative') {
    const illEnd = place === 'Ii' ? 'hin' : 'seen';
    return `${place}${illEnd}`;
  }

  const endings: Record<string, string> = {
    inessive: harmonize('ssa', place),
    elative: harmonize('sta', place),
    adessive: harmonize('lla', place),
    ablative: harmonize('lta', place),
    allative: 'lle',
    essive: harmonize('na', place),
    translative: 'ksi'
  };

  const end = endings[targetCase];
  return end ? `${place}${end}` : place;
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

  const natureForms = resolveNatureSuffix(place);
  if (natureForms) {
    return inflectNaturePlace(natureForms, resolvedCase);
  }

  if (/[bcdfghjklmnpqrstvwxz]$/i.test(place)) {
    return inflectConsonantPlace(place, resolvedCase);
  }

  if (/(?:aa|ää|oo|öö|uu|yy|ii|ee)$/i.test(place)) {
    return inflectLongVowelPlace(place, resolvedCase);
  }

  return inflectStandardPlace(place, resolvedCase);
}
