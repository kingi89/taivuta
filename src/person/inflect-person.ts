/**
 * High-level person name inflection engine for Finnish given names, surnames, and full names.
 *
 * Implements Finnish naming conventions:
 * - Multi-word full names (e.g. "Matti Virtanen"): By default, only the surname is inflected
 *   ("Matti Virtasen"). If { inflectAll: true } is set, all components are inflected ("Matin Virtasen").
 * - Hyphenated compound names (e.g. "Marja-Liisa"): The final component receives case endings
 *   ("Marja-Liisan", "Juha-Pekan").
 * - Modern first names resist single k/p/t gradation (Aki -> Akin, Riku -> Rikun).
 * - Surnames ending in -nen inflect into -sen (Virtanen -> Virtasen, Mäkinen -> Mäkisen).
 *
 * @packageDocumentation
 */

import { composeCase } from '../cases/inflect-case.ts';
import type { GrammaticalCase, InflectPersonOptions } from '../cases/types.ts';

/**
 * Registry of irregular or traditional historical given names with non-standard stems.
 */
const IRREGULAR_NAMES: Record<string, Record<string, string>> = {
  Sampo: {
    genitive: 'Sammon',
    partitive: 'Sampoa',
    inessive: 'Sammossa',
    elative: 'Sammosta',
    illative: 'Sampoon',
    adessive: 'Sammolla',
    ablative: 'Sammolta',
    allative: 'Sammolle',
    essive: 'Sampona',
    translative: 'Sammoksi'
  },
  Aleksis: {
    genitive: 'Aleksiksen',
    partitive: 'Aleksista',
    inessive: 'Aleksiksessa',
    elative: 'Aleksiksesta',
    illative: 'Aleksikseen',
    adessive: 'Aleksiksella',
    ablative: 'Aleksikselta',
    allative: 'Aleksikselle',
    essive: 'Aleksiksena',
    translative: 'Aleksikseksi'
  },
  // Kotus: Satu inflects with t -> d gradation (Satu : Sadun), but ungradated (Satun) is accepted via { gradation: false }
  Satu: {
    genitive: 'Sadun',
    partitive: 'Satua',
    inessive: 'Sadussa',
    elative: 'Sadusta',
    illative: 'Satuun',
    adessive: 'Sadulla',
    ablative: 'Sadulta',
    allative: 'Sadulle',
    essive: 'Satuna',
    translative: 'Saduksi'
  }
};

/**
 * Inflects a single person name token (first name or surname).
 *
 * @param token - Single word name (e.g. "Matti" or "Virtanen").
 * @param targetCase - Target grammatical case.
 * @param options - Person inflection options.
 * @returns Inflected name string.
 */
function inflectSingleName(
  token: string,
  targetCase: GrammaticalCase,
  options: InflectPersonOptions
): string {
  const allowGradation = options.gradation !== false;
  const irregular = allowGradation ? IRREGULAR_NAMES[token]?.[targetCase] : undefined;
  if (irregular) {
    return irregular;
  }

  // Handle hyphenated compound names (e.g. "Marja-Liisa" -> "Marja-Liisan")
  if (token.includes('-')) {
    const parts = token.split('-');
    const lastIndex = parts.length - 1;
    const inflectedLast = composeCase(parts[lastIndex] ?? '', targetCase, options);
    parts[lastIndex] = inflectedLast;
    return parts.join('-');
  }

  return composeCase(token, targetCase, options);
}

/**
 * Inflects a multi-token full name (e.g. "Matti Virtanen").
 * In standard Finnish usage, only the final surname carries case endings ("Matti Virtasen").
 *
 * @param tokens - Words in the full name.
 * @param targetCase - Target grammatical case.
 * @param options - Person inflection options.
 * @returns Inflected full name string.
 */
function inflectFullName(
  tokens: string[],
  targetCase: GrammaticalCase,
  options: InflectPersonOptions
): string {
  const lastIndex = tokens.length - 1;
  const surname = tokens[lastIndex] ?? '';
  const result = [...tokens];
  result[lastIndex] = inflectSingleName(surname, targetCase, {
    ...options,
    role: options.role ?? 'surname'
  });

  return result.join(' ');
}

/**
 * Inflects a Finnish or foreign person name into the specified grammatical case.
 *
 * @param name - The full name, given name, or surname to inflect (e.g. "Matti", "Virtanen", "Matti Virtanen").
 * @param targetCase - The target grammatical case (e.g. "genitive", "partitive", "allative").
 * @param options - Optional configuration options controlling role hints.
 * @returns The inflected name string. Returns original input if empty.
 *
 * @example
 * ```ts
 * inflectPerson("Matti", "genitive");               // "Matin"
 * inflectPerson("Virtanen", "genitive");             // "Virtasen"
 * inflectPerson("Matti Virtanen", "genitive");       // "Matti Virtasen"
 * inflectPerson("Marja-Liisa", "adessive");          // "Marja-Liisalla"
 * inflectPerson("John", "allative");                 // "Johnille"
 * ```
 */
export function inflectPerson(
  name: string,
  targetCase: GrammaticalCase,
  options: InflectPersonOptions = {}
): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed || targetCase === 'nominative') {
    return trimmed;
  }

  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 1) {
    return inflectSingleName(tokens[0] ?? '', targetCase, options);
  }

  return inflectFullName(tokens, targetCase, options);
}
