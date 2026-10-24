/**
 * Grammatical case definitions and options for Finnish nominal inflection.
 *
 * @packageDocumentation
 */

/**
 * Standard grammatical cases supported by the library.
 */
export type GrammaticalCase =
  | 'nominative' // base form
  | 'genitive' // -n
  | 'partitive' // -a / -ä / -ta / -tä
  | 'inessive' // -ssa / -ssä
  | 'elative' // -sta / -stä
  | 'illative' // -Vn / -seen / -iin
  | 'adessive' // -lla / -llä
  | 'ablative' // -lta / -ltä
  | 'allative' // -lle
  | 'essive' // -na / -nä
  | 'translative'; // -ksi

/**
 * Classification of local case preference for place names:
 * - 'in': internal local cases (-ssa/-ssä, -sta/-stä, -seen/-Vn)
 * - 'on': external local cases (-lla/-llä, -lta/-ltä, -lle)
 */
export type LocalCaseType = 'in' | 'on';

/**
 * Contextual and macro cases for place names.
 */
export type PlaceLocalCase =
  | 'local' // automatically resolves to inessive (-ssa/-ssä) or adessive (-lla/-llä)
  | 'localFrom' // automatically resolves to elative (-sta/-stä) or ablative (-lta/-ltä)
  | 'localTo'; // automatically resolves to illative (-on/-en/-iin etc.) or allative (-lle)

/**
 * All accepted case identifiers.
 */
export type CaseName = GrammaticalCase | PlaceLocalCase;

/**
 * Configuration options for person name inflection.
 */
export interface InflectPersonOptions {
  /**
   * The morphological role of the name.
   * - 'givenName': Inflected as a first/given name (resists single k/p/t gradation).
   * - 'surname': Inflected as a family name (e.g. -nen -> -sen).
   * - 'auto': Automatically determined by position and structure (default).
   */
  readonly role?: 'givenName' | 'surname' | 'auto';
  /**
   * Explicitly force or disable s-stem (-ksen/-kseen) declension for names ending in -s.
   * - `true`: Forces -ksen declension (e.g. `Lucas` -> `Lucaksen`).
   * - `false`: Forces vocalic -in declension (e.g. `Niklas` -> `Niklasin`).
   * - `undefined`: Automatically determined by Finnish vs foreign name heuristics.
   */
  readonly sStem?: boolean;
  /**
   * Explicitly control whether consonant gradation applies.
   * - `false`: Prevents consonant weakening (e.g. `Satu` -> `Satun`, `Matti` -> `Mattin`).
   * - `true` / `undefined`: Applies standard Finnish consonant gradation rules.
   */
  readonly gradation?: boolean;
}
