/**
 * Person name inflection subsystem of the taivuta library.
 *
 * Provides grammatical case inflection for Finnish given names, surnames,
 * hyphenated compound names, and multi-word full names.
 *
 * @packageDocumentation
 */

export {
  inflectPerson
} from './inflect-person.ts';

export {
  getPersonParadigm,
  resolvePersonPreference
} from './stem-person.ts';

export type {
  InflectPersonOptions,
  GrammaticalCase,
  PersonPreferenceParams,
  PreferenceOption,
  NameDisambiguation
} from '../cases/types.ts';
