/**
 * Compound word decomposition and token concordance for Finnish proper nouns.
 *
 * Implements Finnish compound prefix concordance (e.g. Uudessa-Seelannissa vs. Pohjois-Karjalassa)
 * and compound token decomposition into modifier and head word.
 *
 * @packageDocumentation
 */

import type { GrammaticalCase } from '../cases/types.ts';
import { isValidGrammaticalCase, safeGet, sanitizeInput } from './guards.ts';

/**
 * Compound prefixes whose modifier inflects congruently with the head noun (e.g. Uusi-Seelanti, Iso-Britannia).
 */
const INFLECTING_PREFIXES: Readonly<Record<string, Readonly<Record<GrammaticalCase, string>>>> = {
  'Uusi-': {
    nominative: 'Uusi-',
    genitive: 'Uuden-',
    partitive: 'Uutta-',
    inessive: 'Uudessa-',
    elative: 'Uudesta-',
    illative: 'Uuteen-',
    adessive: 'Uudella-',
    ablative: 'Uudelta-',
    allative: 'Uudelle-',
    essive: 'Uutena-',
    translative: 'Uudeksi-'
  },
  'Iso-': {
    nominative: 'Iso-',
    genitive: 'Ison-',
    partitive: 'Isoa-',
    inessive: 'Isossa-',
    elative: 'Isosta-',
    illative: 'Isoon-',
    adessive: 'Isolla-',
    ablative: 'Isolta-',
    allative: 'Isolle-',
    essive: 'Isona-',
    translative: 'Isoksi-'
  }
};

/**
 * Decomposed components of a compound proper noun.
 */
export interface CompoundParts {
  /** Leading prefix or modifier (e.g. 'Uudessa-', 'Pohjois-', 'Kari-') */
  readonly prefix: string;
  /** Head word that receives main inflection (e.g. 'Seelanti', 'Karjala', 'Pekka') */
  readonly headWord: string;
  /** Whether the prefix itself inflects congruently */
  readonly isInflectingPrefix: boolean;
}

/**
 * Resolves the inflected form of a known congruent compound prefix (e.g. `Uusi-`, `Iso-`).
 *
 * @param rawPrefix - Prefix string including trailing hyphen.
 * @param targetCase - Target grammatical case.
 * @returns Inflected prefix for the requested case, or `rawPrefix` if unrecognized.
 */
export function inflectCompoundPrefix(
  rawPrefix: string,
  targetCase: GrammaticalCase
): string {
  const declensionTable = safeGet<Readonly<Record<GrammaticalCase, string>>>(
    INFLECTING_PREFIXES,
    rawPrefix
  );
  return safeGet<string>(declensionTable, targetCase) ?? rawPrefix;
}

/**
 * Decomposes a hyphenated compound proper noun into its prefix and head word.
 *
 * @param name - The compound proper noun (e.g. "Uusi-Seelanti", "Pohjois-Karjala", "Kari-Pekka").
 * @param targetCase - Optional target case to inflect inflecting prefixes immediately.
 * @returns Decomposed parts or null if the name is not hyphenated.
 *
 * @example
 * ```ts
 * decomposeCompound("Uusi-Seelanti", "inessive");
 * // { prefix: "Uudessa-", headWord: "Seelanti", isInflectingPrefix: true }
 * ```
 */
export function decomposeCompound(
  name: string,
  targetCase: GrammaticalCase = 'nominative'
): CompoundParts | null {
  const trimmed = sanitizeInput(name);
  if (!trimmed) {
    return null;
  }

  const effectiveCase = isValidGrammaticalCase(targetCase) ? targetCase : 'nominative';
  const match = trimmed.match(/^(.*?\b)(Uusi-|Iso-)(.+)$/);
  if (match) {
    const pre = match[1] ?? '';
    const rawPrefix = match[2] ?? '';
    const headWord = match[3] ?? '';
    return {
      prefix: `${pre}${inflectCompoundPrefix(rawPrefix, effectiveCase)}`,
      headWord,
      isInflectingPrefix: true
    };
  }

  const hyphenIdx = trimmed.indexOf('-');
  if (hyphenIdx === -1 || hyphenIdx === trimmed.length - 1) {
    return null;
  }

  return {
    prefix: trimmed.slice(0, hyphenIdx + 1),
    headWord: trimmed.slice(hyphenIdx + 1),
    isInflectingPrefix: false
  };
}
