const FINNISH_TAR_REGEX =
  /^(?:aallo|ilma|suome|kuu|sulo|aino|valo|onne|otava|tuule|suve|halla|aja)tar$/i;

/**
 * Checks whether a proper noun defaults to Finnish Kotus Type 32 (-tar/-tär) declension.
 *
 * @param name - The proper noun to inspect.
 * @returns True if the name defaults to Kotus Type 32 (-ttare-/-ttäre-).
 */
export function isFinnishTarName(name: string): boolean {
  return name.length >= 5 && (/[aeiouyäö]tär$/i.test(name) || FINNISH_TAR_REGEX.test(name));
}
