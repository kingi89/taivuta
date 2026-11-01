/**
 * Place name inflection and spatial case detection subsystem of the taivuta library.
 *
 * Provides grammatical case inflection and local case selection (sisä- vs. ulkopaikallissijat)
 * for Finnish municipalities, settlements, nature toponyms, and foreign place names.
 *
 * @packageDocumentation
 */

export {
  inflectPlace,
  detectLocalCase,
  TOPONYM_SUFFIX_REGEX,
  type InflectPlaceOptions
} from './inflect-place.ts';

export type {
  LocalCaseType,
  PlaceLocalCase,
  GrammaticalCase
} from '../cases/types.ts';
