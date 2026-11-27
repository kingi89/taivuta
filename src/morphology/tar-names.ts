import { sanitizeInput } from './guards.ts';

const FINNISH_TAR_REGEX =
  /^(?:aallo|ilma|suome|kuu|sulo|aino|valo|onne|otava|tuule|suve|halla|aja)tar$/i;

/**
 * Checks whether a proper noun defaults to Finnish Kotus Type 32 (-tar/-tär) declension.
 *
 * @param name - The proper noun to inspect.
 * @returns True if the name defaults to Kotus Type 32 (-ttare-/-ttäre-); false for non-matching, empty, or invalid inputs.
 *
 * @example
 * ```ts
 * isFinnishTarName("Ilmatar"); // true
 * isFinnishTarName("Petar");   // false
 * ```
 */
export function isFinnishTarName(name: string): boolean {
  const trimmed = sanitizeInput(name);
  if (!trimmed || trimmed.length < 5) {
    return false;
  }
  return /[aeiouyäö]tär$/i.test(trimmed) || FINNISH_TAR_REGEX.test(trimmed);
}
