/**
 * Canonical stem paradigm model for Finnish nominal inflection.
 *
 * Represents the morphological stems, boundary forms, vowel harmony,
 * and spatial preference of any Finnish proper noun (person or place).
 *
 * @packageDocumentation
 */

import { getVowelHarmony, type VowelHarmony } from './vowels.ts';
import type { LocalCaseType } from '../cases/types.ts';

/**
 * Morphological paradigm holding the canonical stem forms of a proper noun.
 */
export interface StemParadigm {
  /** Nominative base form (e.g. "Helsinki", "Matti", "Virtanen", "Hokkaidō") */
  readonly nominative: string;
  /** Strong vocalic stem used for essive and vowel lengthenings (e.g. "Helsinki", "Matti", "Virtase") */
  readonly strongVocalicStem: string;
  /** Weak vocalic stem used for closed-syllable cases (e.g. "Helsingi", "Mati", "Virtase") */
  readonly weakVocalicStem: string;
  /** Complete partitive form (e.g. "Helsinkiä", "Mattia", "Virtasta", "Hokkaidōta") */
  readonly partitive: string;
  /** Complete illative form (e.g. "Helsinkiin", "Mattiin", "Virtaseen", "Hokkaidōhon") */
  readonly illative: string;
  /** Vowel harmony class of the stem ('front' for ä/ö/y, 'back' for a/o/u) */
  readonly vowelHarmony: VowelHarmony;
  /** Default spatial case preference ('in' for sisäpaikallissijat, 'on' for ulkopaikallissijat) */
  readonly defaultSpatialCase: LocalCaseType;
  /** Explicit genitive form override for plural or non-standard genitives (e.g. "Kanariansaarten") */
  readonly genitive?: string;
  /** Whether the noun is inherently plural (e.g. "Yhdysvallat", "Virrat") */
  readonly isPlural?: boolean;
}

/**
 * Options for constructing a custom stem paradigm.
 */
export interface CreateParadigmOptions {
  /** Optional override for default spatial case preference */
  readonly defaultSpatialCase?: LocalCaseType;
  /** Optional override for vowel harmony */
  readonly vowelHarmony?: VowelHarmony;
  /** Whether the noun is plural */
  readonly isPlural?: boolean;
}

/**
 * Creates a StemParadigm from explicitly provided stem parts.
 *
 * @param nominative - Nominative base form.
 * @param stems - Vocalic strong/weak stems, partitive, and illative forms.
 * @param options - Configuration options for harmony and spatial cases.
 * @returns Fully constructed StemParadigm.
 *
 * @example
 * ```ts
 * const p = createStemParadigm('Matti', {
 *   strong: 'Matti',
 *   weak: 'Mati',
 *   partitive: 'Mattia',
 *   illative: 'Mattiin'
 * });
 * ```
 */
export function createStemParadigm(
  nominative: string,
  stems: {
    readonly strong: string;
    readonly weak: string;
    readonly partitive: string;
    readonly illative: string;
    readonly genitive?: string;
  },
  options: CreateParadigmOptions = {}
): StemParadigm {
  const harmony = options.vowelHarmony ?? getVowelHarmony(nominative);
  return {
    nominative,
    strongVocalicStem: stems.strong,
    weakVocalicStem: stems.weak,
    partitive: stems.partitive,
    illative: stems.illative,
    vowelHarmony: harmony,
    defaultSpatialCase: options.defaultSpatialCase ?? 'in',
    ...(stems.genitive ? { genitive: stems.genitive } : {}),
    ...(options.isPlural ? { isPlural: true } : {})
  };
}
