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

import { assembleCase } from '../morphology/assembler.ts';
import { needsColon, inflectColonWord } from '../morphology/colon.ts';
import { getPersonParadigm } from './stem-person.ts';
import type { GrammaticalCase, InflectPersonOptions } from '../cases/types.ts';

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
  if (needsColon(token)) {
    return inflectColonWord(token, targetCase);
  }

  // Handle hyphenated compound names (e.g. "Marja-Liisa" -> "Marja-Liisan")
  if (token.includes('-')) {
    const parts = token.split('-');
    const lastIndex = parts.length - 1;
    const inflectedLast = inflectSingleName(parts[lastIndex] ?? '', targetCase, options);
    parts[lastIndex] = inflectedLast;
    return parts.join('-');
  }

  const paradigm = getPersonParadigm(token, options);
  return assembleCase(paradigm, targetCase);
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
