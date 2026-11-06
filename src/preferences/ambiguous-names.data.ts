/**
 * Special dataset of given names derived from Finnish nature/common words ending in -i.
 *
 * In Finnish morphology, words belonging to this historical noun class alternate
 * between the modern personal name vocalic stem (-in, -ille) and the ancient
 * nominal stem (-en, -elle / partitive -ta/-tä).
 *
 * Examples:
 * - Tuuli -> Tuulin vs. Tuulen (partitive Tuulia vs. Tuulta)
 * - Meri -> Merin vs. Meren (partitive Meriä vs. Merta)
 * - Pilvi -> Pilvin vs. Pilven
 * - Helmi -> Helmin vs. Helmen
 * - Suvi -> Suvin vs. Suven
 * - Lumi -> Lumin vs. Lumen (partitive Lumia vs. Lunta)
 * - Sini -> Sinin vs. Sinen
 */
export const WORD_DERIVED_GIVEN_NAMES: ReadonlySet<string> = new Set([
  'tuuli',
  'meri',
  'pilvi',
  'helmi',
  'suvi',
  'lumi',
  'sini'
]);
