/**
 * Declension paradigms for Finnish surnames and toponyms derived from ancient nature nouns.
 *
 * Many Finnish surnames and place names originated directly from ancient nature nouns
 * (e.g. Niemi, Koski, Mäki, Saari, Salmi, Nurmi, Lahti, Järvi, Joki, Vesi).
 * Both surnames and toponyms share identical nominal stems, vowel changes, and gradation rules.
 *
 * Scope & Boundaries:
 * - In scope: Finnish family names (surnames) and toponymic place names ending in ancient nature nouns.
 * - Out of scope: Finnish given names (first names, e.g. Sari, Kari, Aki, Suvi, or Meri when used as
 *   a first name). First names follow modern vocalic nominal inflection and resist qualitative
 *   gradation in the person module (e.g. Sari -> Sarin, not *Saaren).
 *
 * @packageDocumentation
 */

import { type VowelHarmony } from './vowels.ts';
import { createStemParadigm, type StemParadigm } from './paradigm.ts';
import { assembleCase } from './assembler.ts';
import type { GrammaticalCase, LocalCaseType } from '../cases/types.ts';

/**
 * Descriptor rule for inflecting a nature noun suffix.
 */
export interface NatureNounRule {
  /** Suffix in lowercase (e.g. 'järvi', 'lahti', 'mäki') */
  readonly suffix: string;
  /** Weak stem suffix (e.g. 'järve', 'lahde', 'mäe') */
  readonly weak: string;
  /** Strong stem suffix (e.g. 'järve', 'lahte', 'mäke') */
  readonly strong: string;
  /** Complete partitive suffix (e.g. 'järveä', 'lahtea', 'mäkeä') */
  readonly partitive: string;
  /** Complete illative suffix (e.g. 'järveen', 'lahteen', 'mäkeen') */
  readonly illative: string;
  /** Vowel harmony class of the suffix */
  readonly harmony: VowelHarmony;
  /** Default spatial case preference ('in' vs 'on') */
  readonly defaultSpatialCase: LocalCaseType;
}

/**
 * Universal registry of ancient Finnish nature nouns and landscape formatives.
 */
export const NATURE_NOUN_RULES: readonly NatureNounRule[] = [
  { suffix: 'järvi', weak: 'järve', strong: 'järve', partitive: 'järveä', illative: 'järveen', harmony: 'front', defaultSpatialCase: 'on' },
  { suffix: 'joki', weak: 'joe', strong: 'joke', partitive: 'jokea', illative: 'jokeen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'mäki', weak: 'mäe', strong: 'mäke', partitive: 'mäkeä', illative: 'mäkeen', harmony: 'front', defaultSpatialCase: 'on' },
  { suffix: 'vesi', weak: 'vede', strong: 'vete', partitive: 'vettä', illative: 'veteen', harmony: 'front', defaultSpatialCase: 'on' },
  { suffix: 'saari', weak: 'saare', strong: 'saare', partitive: 'saarta', illative: 'saareen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'koski', weak: 'koske', strong: 'koske', partitive: 'koskea', illative: 'koskeen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'salmi', weak: 'salme', strong: 'salme', partitive: 'salmea', illative: 'salmeen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'niemi', weak: 'nieme', strong: 'nieme', partitive: 'niemeä', illative: 'niemeen', harmony: 'front', defaultSpatialCase: 'on' },
  { suffix: 'lahti', weak: 'lahde', strong: 'lahte', partitive: 'lahtea', illative: 'lahteen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'nurmi', weak: 'nurme', strong: 'nurme', partitive: 'nurmea', illative: 'nurmeen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'meri', weak: 'mere', strong: 'mere', partitive: 'merta', illative: 'mereen', harmony: 'front', defaultSpatialCase: 'in' },
  { suffix: 'vuori', weak: 'vuore', strong: 'vuore', partitive: 'vuorta', illative: 'vuoreen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'laine', weak: 'lainee', strong: 'lainee', partitive: 'lainetta', illative: 'laineeseen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'rinne', weak: 'rintee', strong: 'rintee', partitive: 'rinnettä', illative: 'rinteeseen', harmony: 'front', defaultSpatialCase: 'in' },
  { suffix: 'harju', weak: 'harju', strong: 'harju', partitive: 'harjua', illative: 'harjuun', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'kangas', weak: 'kankaa', strong: 'kankaa', partitive: 'kangasta', illative: 'kankaaseen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'suo', weak: 'suo', strong: 'suo', partitive: 'suota', illative: 'suohon', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'lampi', weak: 'lamme', strong: 'lampe', partitive: 'lampea', illative: 'lampeen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'nummi', weak: 'numme', strong: 'numme', partitive: 'nummea', illative: 'nummeen', harmony: 'back', defaultSpatialCase: 'on' },
  { suffix: 'ranta', weak: 'ranna', strong: 'ranta', partitive: 'rantaa', illative: 'rantaan', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'tuuli', weak: 'tuule', strong: 'tuule', partitive: 'tuulta', illative: 'tuuleen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'pilvi', weak: 'pilve', strong: 'pilve', partitive: 'pilveä', illative: 'pilveen', harmony: 'front', defaultSpatialCase: 'in' },
  { suffix: 'lumi', weak: 'lume', strong: 'lume', partitive: 'lunta', illative: 'lumeen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'helmi', weak: 'helme', strong: 'helme', partitive: 'helmeä', illative: 'helmeen', harmony: 'front', defaultSpatialCase: 'in' },
  { suffix: 'suvi', weak: 'suve', strong: 'suve', partitive: 'suvea', illative: 'suveen', harmony: 'back', defaultSpatialCase: 'in' },
  { suffix: 'sini', weak: 'sine', strong: 'sine', partitive: 'sineä', illative: 'sineen', harmony: 'front', defaultSpatialCase: 'in' }
];

function capitalizeForm(base: string, suffixForm: string, isCapitalized: boolean): string {
  if (base) {
    return `${base}${suffixForm}`;
  }
  if (!isCapitalized) {
    return suffixForm;
  }
  return (suffixForm[0]?.toUpperCase() ?? '') + suffixForm.slice(1);
}

/**
 * Matches a proper noun (surname or place name) against ancient nature noun formatives.
 *
 * @param name - The proper noun token (e.g. "Lahti", "Kontiolahti", "Niemi", "Alajärvi").
 * @returns StemParadigm if matched, otherwise null.
 *
 * @example
 * ```ts
 * const p = matchNatureNoun("Kontiolahti");
 * p?.weakVocalicStem; // "Kontiolahde"
 * p?.defaultSpatialCase; // "in"
 * ```
 */
export function matchNatureNoun(name: string): StemParadigm | null {
  if (!name) {
    return null;
  }
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  for (const rule of NATURE_NOUN_RULES) {
    if (lower.endsWith(rule.suffix)) {
      const base = trimmed.slice(0, -rule.suffix.length);
      const isCap = !base && trimmed[0] === trimmed[0]?.toUpperCase();
      return createStemParadigm(
        trimmed,
        {
          strong: capitalizeForm(base, rule.strong, isCap),
          weak: capitalizeForm(base, rule.weak, isCap),
          partitive: capitalizeForm(base, rule.partitive, isCap),
          illative: capitalizeForm(base, rule.illative, isCap)
        },
        {
          defaultSpatialCase: rule.defaultSpatialCase,
          vowelHarmony: rule.harmony
        }
      );
    }
  }

  return null;
}

/**
 * Stem information for nature noun surnames (backward compatibility interface).
 */
export interface NatureNounStem {
  /** The strong vocalic stem (e.g. 'Nieme', 'Lahte', 'Mäke') */
  readonly strongStem: string;
  /** The weak vocalic stem (e.g. 'Nieme', 'Lahde', 'Mäe') */
  readonly weakStem: string;
  /** Complete partitive form */
  readonly partitive: string;
  /** Suffix to append to strongStem for illative (e.g. 'en', 'seen') */
  readonly illativeSuffix: string;
}

/**
 * Checks whether a proper noun matches an ancient nature noun surname stem.
 *
 * @param name - The surname token to inspect.
 * @returns NatureNounStem definition if matched, otherwise undefined.
 */
export function matchNatureNounSurname(name: string): NatureNounStem | undefined {
  const p = matchNatureNoun(name);
  if (!p) {
    return undefined;
  }
  return {
    strongStem: p.strongVocalicStem,
    weakStem: p.weakVocalicStem,
    partitive: p.partitive,
    illativeSuffix: p.illative.slice(p.strongVocalicStem.length)
  };
}

/**
 * Inflects a nature noun surname into the target grammatical case.
 *
 * @param name - The nominative surname (e.g. "Niemi", "Mäki", "Laine").
 * @param caseName - Target grammatical case.
 * @param stemDef - Matched nature noun stem definition.
 * @returns Inflected surname string.
 */
export function inflectNatureNounSurname(
  name: string,
  caseName: GrammaticalCase,
  stemDef: NatureNounStem
): string {
  const p = matchNatureNoun(name);
  if (p) {
    return assembleCase(p, caseName);
  }
  const fallbackParadigm = createStemParadigm(name, {
    strong: stemDef.strongStem,
    weak: stemDef.weakStem,
    partitive: stemDef.partitive,
    illative: `${stemDef.strongStem}${stemDef.illativeSuffix}`
  });
  return assembleCase(fallbackParadigm, caseName);
}
