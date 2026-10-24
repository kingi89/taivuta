/**
 * Declension paradigms for Finnish surnames and toponyms derived from ancient nature nouns.
 *
 * Many Finnish surnames originated directly from nature nouns (e.g. Niemi, Koski, Mäki, Saari,
 * Salmi, Nurmi, Lahti, Laine). When inflected as surnames, these follow old Finnish nominal stems
 * (e.g. Niemi -> Niemen, Mäki -> Mäen, Laine -> Laineen), unlike modern given names (Sari -> Sarin).
 *
 * Kotus Guidelines:
 * - Luontonimet sukuniminä (Niemi, Nurmi, Koski, Mäki jne.) taipuvat kuten vastaavat yleisnimet.
 * - Sanojen Kallio ja Vainio partitiivi on Kalliota ja Vainiota (-ta/-tä pääte).
 * - Johdinsukunimet -la/-lä (Mattila, Anttila, Peltola) eivät taivu astevaihtelussa.
 *
 * @packageDocumentation
 */

import { harmonize } from './vowels.ts';
import type { GrammaticalCase } from '../cases/types.ts';

/**
 * Stem information for nature noun surnames.
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

interface NaturePattern {
  readonly pattern: RegExp;
  readonly getStems: (name: string) => NatureNounStem;
}

const NATURE_PATTERNS: readonly NaturePattern[] = [
  {
    pattern: /niemi$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'e' + harmonize('ä', n),
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /nurmi$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'ea',
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /saari$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'ta',
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /salmi$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'ea',
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /lahti$/i,
    getStems: (n): NatureNounStem => {
      const isLower = n.endsWith('i');
      return {
        strongStem: n.slice(0, -1) + 'e',
        weakStem: n.slice(0, -3) + (isLower ? 'hde' : 'Hde'),
        partitive: n.slice(0, -1) + 'ea',
        illativeSuffix: 'en'
      };
    }
  },
  {
    pattern: /koski$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'ea',
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /mäki$/i,
    getStems: (n): NatureNounStem => {
      const isLower = n.endsWith('i');
      return {
        strongStem: n.slice(0, -1) + 'e',
        weakStem: n.slice(0, -2) + (isLower ? 'e' : 'E'),
        partitive: n.slice(0, -1) + 'eä',
        illativeSuffix: 'en'
      };
    }
  },
  {
    pattern: /meri$/i,
    getStems: (n) => ({
      strongStem: n.slice(0, -1) + 'e',
      weakStem: n.slice(0, -1) + 'e',
      partitive: n.slice(0, -1) + 'tä',
      illativeSuffix: 'en'
    })
  },
  {
    pattern: /laine$/i,
    getStems: (n) => ({
      strongStem: n + 'e',
      weakStem: n + 'e',
      partitive: n + 'tta',
      illativeSuffix: 'seen'
    })
  },
  {
    pattern: /rinne$/i,
    getStems: (n): NatureNounStem => {
      const isLower = n.endsWith('e');
      return {
        strongStem: n.slice(0, -4) + (isLower ? 'ntee' : 'Ntee'),
        weakStem: n.slice(0, -4) + (isLower ? 'ntee' : 'Ntee'),
        partitive: n + 'ttä',
        illativeSuffix: 'seen'
      };
    }
  }
];

const STANDARD_SUFFIXES: Record<string, string> = {
  inessive: 'ssa',
  elative: 'sta',
  adessive: 'lla',
  ablative: 'lta',
  allative: 'lle',
  translative: 'ksi'
};

/**
 * Checks whether a proper noun matches an ancient nature noun surname stem.
 *
 * @param name - The surname token to inspect.
 * @returns NatureNounStem definition if matched, otherwise undefined.
 */
export function matchNatureNounSurname(name: string): NatureNounStem | undefined {
  const trimmed = name.trim();
  for (const entry of NATURE_PATTERNS) {
    if (entry.pattern.test(trimmed)) {
      return entry.getStems(trimmed);
    }
  }
  return undefined;
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
  if (caseName === 'nominative') {
    return name;
  }
  if (caseName === 'genitive') {
    return stemDef.weakStem + 'n';
  }
  if (caseName === 'partitive') {
    return stemDef.partitive;
  }
  if (caseName === 'illative') {
    return stemDef.strongStem + harmonize(stemDef.illativeSuffix, name);
  }
  if (caseName === 'essive') {
    return stemDef.strongStem + harmonize('na', name);
  }

  const rawSuffix = STANDARD_SUFFIXES[caseName];
  if (rawSuffix) {
    return stemDef.weakStem + harmonize(rawSuffix, name);
  }

  return name;
}
