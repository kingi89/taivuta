import type {
  AmbiguityDimension,
  DimensionChoice,
  NameDisambiguation,
  PersonPreferenceParams,
  PreferenceOption
} from '../cases/types.ts';
import { inflectPerson } from '../person/index.ts';
import { WORD_DERIVED_GIVEN_NAMES } from './ambiguous-names.data.ts';

// Matches qualitative gradation patterns (stops mp, nt, lt, rt, single t/p, liquid + k, and Kotus type 9 diphthong + k).
// Kotus: Nouns of nominal type 9 (kala) with single intervocalic k undergo qualitative gradation (k -> Ø),
// e.g. Taika -> Taian / Taikan. Modern given names (Aki, Mika, Riku, Reko, Jouko) resist k-loss and are unambiguous.
const QUALITATIVE_GRADATION_REGEX =
  /(?:[aeiouyäö](?:t|p|mp|nt|lt|rt)|[rl]k)[aeiouyäö]$|(?:ai|ei|au|eu|ui|yi|äi|öi|ou|ey|iy|äy|öy)k[aä]$/i;
const S_STEM_REGEX = /[aeiouyäö]s$/i;
const FOREIGN_OR_OS_REGEX = /[cxzqw]|os$/i;

interface InflectionExamples {
  readonly genitive: string;
  readonly allative: string;
  readonly illative: string;
  readonly adessive: string;
  readonly ablative: string;
}

function createExamples(
  name: string,
  params: PersonPreferenceParams
): InflectionExamples {
  return {
    genitive: inflectPerson(name, 'genitive', { preference: params }),
    allative: inflectPerson(name, 'allative', { preference: params }),
    illative: inflectPerson(name, 'illative', { preference: params }),
    adessive: inflectPerson(name, 'adessive', { preference: params }),
    ablative: inflectPerson(name, 'ablative', { preference: params })
  };
}

function detectGradationDimension(name: string): AmbiguityDimension | null {
  if (!QUALITATIVE_GRADATION_REGEX.test(name)) {
    return null;
  }
  const defaultChoiceId = /k[aä]$/i.test(name) ? 'no-gradation' : 'gradation';
  const choices: readonly DimensionChoice[] = [
    { id: 'gradation', label: 'Weak grade / consonant gradation (e.g. Sadun, Sadulle)', params: { gradation: true } },
    { id: 'no-gradation', label: 'Strong grade / no gradation (e.g. Satun, Satulle)', params: { gradation: false } }
  ];
  return {
    key: 'gradation',
    title: 'Consonant Gradation',
    description: 'Declension with weakened consonants or retaining strong consonants.',
    choices,
    defaultChoiceId
  };
}

function detectSStemDimension(name: string): AmbiguityDimension | null {
  // Kotus: S-stems ending in -as/-äs, -us/-ys, -os, -es, -is are polysyllabic derivations.
  // Monosyllabic words (e.g. Kas, Hans, Lars) take consonant linking vowel -i- without alternation.
  if (name.length <= 3 || !S_STEM_REGEX.test(name)) {
    return null;
  }
  const defaultChoiceId = FOREIGN_OR_OS_REGEX.test(name) ? 'vocalic' : 's-stem';
  const choices: readonly DimensionChoice[] = [
    { id: 's-stem', label: 'Finnish s-stem (e.g. Lucaksen, Lucakselle)', params: { sStem: true } },
    { id: 'vocalic', label: 'Vocalic stem (e.g. Lucasin, Lucasille)', params: { sStem: false } }
  ];
  return {
    key: 's-stem',
    title: 'S-Stem vs. Vocalic Stem',
    description: 'Inflection using Finnish s-stem (-kse-) or direct vocalic stem.',
    choices,
    defaultChoiceId
  };
}

function detectVocalicVariantDimension(name: string): AmbiguityDimension | null {
  if (!WORD_DERIVED_GIVEN_NAMES.has(name.toLowerCase())) {
    return null;
  }
  const choices: readonly DimensionChoice[] = [
    { id: 'nominative', label: 'Personal name stem (e.g. Tuulin, Tuulille)', params: { vocalicStemVariant: 'nominative' } },
    { id: 'inflected', label: 'Noun stem (e.g. Tuulen, Tuulelle)', params: { vocalicStemVariant: 'inflected' } }
  ];
  return {
    key: 'vocalic-variant',
    title: 'Vocalic Stem Variant',
    description: 'Preserving modern personal name nominative -i stem vs. traditional noun stem.',
    choices,
    defaultChoiceId: 'nominative'
  };
}

function detectAcronymDimension(name: string): AmbiguityDimension | null {
  const isAllCaps = name.length >= 2 && name === name.toUpperCase() && /[A-ZÅÄÖ]/.test(name);
  if (!isAllCaps || /\d/.test(name) || !/[AEIOUYÅÄÖ]/.test(name)) {
    return null;
  }
  const choices: readonly DimensionChoice[] = [
    { id: 'acronym', label: `${name}:n, ${name}:lle (acronym with colon)`, params: { colon: true } },
    { id: 'word', label: `${name}n, ${name}lle (word without colon)`, params: { colon: false } }
  ];
  return {
    key: 'acronym-colon',
    title: 'Acronym vs. Word',
    description: 'Inflected as an acronym with a colon or as a spoken word without a colon.',
    choices,
    defaultChoiceId: 'acronym'
  };
}

function detectSymbolHarmonyDimension(name: string): AmbiguityDimension | null {
  const lastChar = name.slice(-1);
  if (!lastChar || /\p{Script=Latin}/u.test(lastChar)) {
    return null;
  }
  const choices: readonly DimensionChoice[] = [
    { id: 'harmony-front', label: `${name}:llä, ${name}:ltä (front vowel)`, params: { harmony: 'front' } },
    { id: 'harmony-back', label: `${name}:lla, ${name}:lta (back vowel)`, params: { harmony: 'back' } }
  ];
  return {
    key: 'vowel-harmony',
    title: 'Suffix Vowel Harmony',
    description: 'Vowel harmony based on pronunciation of non-alphabetic character (front vs. back vowel).',
    choices,
    defaultChoiceId: 'harmony-front'
  };
}

function formatOptionLabel(dimKey: string, examples: InflectionExamples): string {
  if (dimKey === 'vowel-harmony') {
    return `${examples.adessive}, ${examples.ablative}`;
  }
  return `${examples.genitive}, ${examples.allative}`;
}

function deduplicateOptions(options: readonly PreferenceOption[]): PreferenceOption[] {
  const seen = new Set<string>();
  const unique: PreferenceOption[] = [];
  for (const opt of options) {
    const sig = `${opt.label}|${opt.examples.genitive}|${opt.examples.illative}`;
    if (!seen.has(sig)) {
      seen.add(sig);
      unique.push(opt);
    }
  }
  return unique;
}

function buildSingleDimensionOptions(name: string, dim: AmbiguityDimension): PreferenceOption[] {
  return dim.choices.map((choice) => {
    const examples = createExamples(name, choice.params);
    return {
      id: choice.id,
      label: formatOptionLabel(dim.key, examples),
      description: choice.label,
      examples,
      params: choice.params,
      isDefault: choice.id === dim.defaultChoiceId
    };
  });
}

function buildCartesianOptions(name: string, dimensions: readonly AmbiguityDimension[]): PreferenceOption[] {
  const firstDim = dimensions[0];
  if (!firstDim) {
    return [];
  }
  if (dimensions.length === 1) {
    return buildSingleDimensionOptions(name, firstDim);
  }

  const secondDim = dimensions[1];
  if (!secondDim) {
    return buildSingleDimensionOptions(name, firstDim);
  }

  const results: PreferenceOption[] = [];
  for (const c1 of firstDim.choices) {
    for (const c2 of secondDim.choices) {
      const params: PersonPreferenceParams = { ...c1.params, ...c2.params };
      const examples = createExamples(name, params);
      const isDefault = c1.id === firstDim.defaultChoiceId && c2.id === secondDim.defaultChoiceId;
      results.push({
        id: `${c1.id}+${c2.id}`,
        label: `${examples.genitive}, ${examples.allative}`,
        description: `${c1.label} + ${c2.label}`,
        examples,
        params,
        isDefault
      });
    }
  }
  return deduplicateOptions(results);
}

/**
 * Detects whether a proper noun has morphological inflection ambiguity requiring
 * name-holder disambiguation, returning structured dimensions and ready-to-render options.
 *
 * Detection is performed algorithmically based on morphological patterns:
 * - Qualitative consonant gradation positions (single stops t, k, p or clusters mp, nt, lt, rt)
 * - Nouns ending in -s (s-stem -kse- vs. vocalic -s-)
 * - Closed class of Finnish given names derived from ancient nature nouns ending in -i
 * - All-uppercase handles (acronym colon vs. word reading)
 * - Trailing digits with ambiguous vowel harmony (such as 7 "seitsemän" vs. "seiska")
 *
 * @param name - Proper noun or handle to inspect.
 * @returns Disambiguation metadata with dimensions and options, or null if unambiguous.
 * @example
 * ```typescript
 * import { detectNameDisambiguation } from 'taivuta/preferences';
 *
 * const result = detectNameDisambiguation('Satu');
 * if (result?.isAmbiguous) {
 *   console.log(result.options.map(opt => opt.label));
 *   // ['Sadun, Sadulle', 'Satun, Satulle']
 * }
 * ```
 */
function collectDimensions(name: string): AmbiguityDimension[] {
  const detectors = [
    detectGradationDimension,
    detectSStemDimension,
    detectVocalicVariantDimension,
    detectAcronymDimension,
    detectSymbolHarmonyDimension
  ];
  const dims: AmbiguityDimension[] = [];
  for (const detect of detectors) {
    const dim = detect(name);
    if (dim) {
      dims.push(dim);
    }
  }
  return dims;
}

export function detectNameDisambiguation(name: string): NameDisambiguation | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const dims = collectDimensions(trimmed);
  if (dims.length === 0) {
    return null;
  }

  const options = deduplicateOptions(buildCartesianOptions(trimmed, dims));
  if (options.length <= 1) {
    return null;
  }
  const defaultOpt = options.find((opt) => opt.isDefault) ?? options[0];

  return {
    name: trimmed,
    isAmbiguous: true,
    dimensions: dims,
    options,
    defaultOptionId: defaultOpt?.id
  };
}

/**
 * Checks whether a given proper noun or handle has inflection ambiguity.
 *
 * @param name - Name or username string.
 * @returns True if name has multiple valid declensions, false otherwise.
 * @example
 * ```typescript
 * isAmbiguousName('Satu'); // true
 * isAmbiguousName('Matti'); // false
 * ```
 */
export function isAmbiguousName(name: string): boolean {
  return detectNameDisambiguation(name) !== null;
}

/**
 * Returns available preference options for an ambiguous name, or empty array if unambiguous.
 *
 * @param name - Name or handle to inspect.
 * @returns List of preference options with precomputed inflection examples.
 * @example
 * ```typescript
 * const options = getNamePreferenceOptions('Satu');
 * ```
 */
export function getNamePreferenceOptions(name: string): readonly PreferenceOption[] {
  return detectNameDisambiguation(name)?.options ?? [];
}
