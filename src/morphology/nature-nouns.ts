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

type RawNatureNounTuple = readonly [
  suffix: string,
  weak: string,
  strong: string,
  partitive: string,
  illative: string,
  harmony: VowelHarmony,
  defaultSpatialCase: LocalCaseType
];

const RAW_NATURE_NOUN_RULES: readonly RawNatureNounTuple[] = [
  ['järvi', 'järve', 'järve', 'järveä', 'järveen', 'front', 'on'],
  ['joki', 'joe', 'joke', 'jokea', 'jokeen', 'back', 'on'],
  ['mäki', 'mäe', 'mäke', 'mäkeä', 'mäkeen', 'front', 'on'],
  ['vesi', 'vede', 'vete', 'vettä', 'veteen', 'front', 'on'],
  ['saari', 'saare', 'saare', 'saarta', 'saareen', 'back', 'on'],
  ['koski', 'koske', 'koske', 'koskea', 'koskeen', 'back', 'on'],
  ['salmi', 'salme', 'salme', 'salmea', 'salmeen', 'back', 'on'],
  ['niemi', 'nieme', 'nieme', 'niemeä', 'niemeen', 'front', 'on'],
  ['lahti', 'lahde', 'lahte', 'lahtea', 'lahteen', 'back', 'in'],
  ['nurmi', 'nurme', 'nurme', 'nurmea', 'nurmeen', 'back', 'in'],
  ['meri', 'mere', 'mere', 'merta', 'mereen', 'front', 'in'],
  ['vuori', 'vuore', 'vuore', 'vuorta', 'vuoreen', 'back', 'on'],
  ['laine', 'lainee', 'lainee', 'lainetta', 'laineeseen', 'back', 'in'],
  ['rinne', 'rintee', 'rintee', 'rinnettä', 'rinteeseen', 'front', 'in'],
  ['harju', 'harju', 'harju', 'harjua', 'harjuun', 'back', 'on'],
  ['kangas', 'kankaa', 'kankaa', 'kangasta', 'kankaaseen', 'back', 'on'],
  ['suo', 'suo', 'suo', 'suota', 'suohon', 'back', 'on'],
  ['lampi', 'lamme', 'lampe', 'lampea', 'lampeen', 'back', 'on'],
  ['nummi', 'numme', 'numme', 'nummea', 'nummeen', 'back', 'on'],
  ['ranta', 'ranna', 'ranta', 'rantaa', 'rantaan', 'back', 'in'],
  ['tuuli', 'tuule', 'tuule', 'tuulta', 'tuuleen', 'back', 'in'],
  ['pilvi', 'pilve', 'pilve', 'pilveä', 'pilveen', 'front', 'in'],
  ['lumi', 'lume', 'lume', 'lunta', 'lumeen', 'back', 'in'],
  ['helmi', 'helme', 'helme', 'helmeä', 'helmeen', 'front', 'in'],
  ['suvi', 'suve', 'suve', 'suvea', 'suveen', 'back', 'in'],
  ['sini', 'sine', 'sine', 'sineä', 'sineen', 'front', 'in']
];

/**
 * Universal registry of ancient Finnish nature nouns and landscape formatives.
 */
export const NATURE_NOUN_RULES: readonly NatureNounRule[] = RAW_NATURE_NOUN_RULES.map(
  ([suffix, weak, strong, partitive, illative, harmony, defaultSpatialCase]) => ({
    suffix,
    weak,
    strong,
    partitive,
    illative,
    harmony,
    defaultSpatialCase
  })
);

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
