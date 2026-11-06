import type {
  AmbiguityDimension,
  DimensionChoice,
  NameDisambiguation,
  PersonPreferenceParams,
  PreferenceOption
} from '../cases/types.ts';
import { inflectPerson } from '../person/index.ts';
import { WORD_DERIVED_GIVEN_NAMES } from './ambiguous-names.data.ts';

const QUALITATIVE_GRADATION_REGEX = /(?:[aeiouyäö])(?:t|k|p|mp|nt|lt|rt)[aeiouyäö]$/i;
const S_STEM_REGEX = /[a-zåäö]s$/i;
const FOREIGN_OR_OS_REGEX = /[cxzqw]|os$/i;

function createExamples(
  name: string,
  params: PersonPreferenceParams
): { readonly genitive: string; readonly allative: string; readonly illative: string } {
  return {
    genitive: inflectPerson(name, 'genitive', { preference: params }),
    allative: inflectPerson(name, 'allative', { preference: params }),
    illative: inflectPerson(name, 'illative', { preference: params })
  };
}

function detectGradationDimension(name: string): AmbiguityDimension | null {
  if (!QUALITATIVE_GRADATION_REGEX.test(name)) {
    return null;
  }
  const choices: readonly DimensionChoice[] = [
    { id: 'gradation', label: 'Weak grade / consonant gradation (e.g. Sadun, Sadulle)', params: { gradation: true } },
    { id: 'no-gradation', label: 'Strong grade / no gradation (e.g. Satun, Satulle)', params: { gradation: false } }
  ];
  return {
    key: 'gradation',
    title: 'Consonant Gradation',
    description: 'Declension with weakened consonants or retaining strong consonants.',
    choices,
    defaultChoiceId: 'gradation'
  };
}

function detectSStemDimension(name: string): AmbiguityDimension | null {
  if (!S_STEM_REGEX.test(name)) {
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

function detectNumeralHarmonyDimension(name: string): AmbiguityDimension | null {
  if (!name.endsWith('7')) {
    return null;
  }
  const choices: readonly DimensionChoice[] = [
    { id: 'harmony-front', label: `${name}:llä (front vowel, e.g. "seitsemän")`, params: { harmony: 'front' } },
    { id: 'harmony-back', label: `${name}:lla (back vowel, e.g. "seiska")`, params: { harmony: 'back' } }
  ];
  return {
    key: 'vowel-harmony',
    title: 'Suffix Vowel Harmony',
    description: 'Vowel harmony based on pronunciation (front vowel e.g. "seitsemän" vs. back vowel e.g. "seiska").',
    choices,
    defaultChoiceId: 'harmony-front'
  };
}

function buildSingleDimensionOptions(name: string, dim: AmbiguityDimension): PreferenceOption[] {
  return dim.choices.map((choice) => {
    const examples = createExamples(name, choice.params);
    return {
      id: choice.id,
      label: `${examples.genitive}, ${examples.allative}`,
      description: choice.label,
      examples,
      params: choice.params,
      isDefault: choice.id === dim.defaultChoiceId
    };
  });
}

function buildCartesianOptions(name: string, dimensions: readonly AmbiguityDimension[]): PreferenceOption[] {
  if (dimensions.length === 0) {
    return [];
  }
  const firstDim = dimensions[0];
  if (!firstDim || dimensions.length === 1) {
    return buildSingleDimensionOptions(name, firstDim ?? { key: 'gradation', title: '', choices: [], defaultChoiceId: '' });
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
  return results;
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
export function detectNameDisambiguation(name: string): NameDisambiguation | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const dims: AmbiguityDimension[] = [];
  const gDim = detectGradationDimension(trimmed);
  if (gDim) dims.push(gDim);

  const sDim = detectSStemDimension(trimmed);
  if (sDim) dims.push(sDim);

  const vDim = detectVocalicVariantDimension(trimmed);
  if (vDim) dims.push(vDim);

  const aDim = detectAcronymDimension(trimmed);
  if (aDim) dims.push(aDim);

  const hDim = detectNumeralHarmonyDimension(trimmed);
  if (hDim) dims.push(hDim);

  if (dims.length === 0) {
    return null;
  }

  const options = buildCartesianOptions(trimmed, dims);
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
