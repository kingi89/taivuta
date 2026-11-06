/**
 * Name Holder Preference & Morphological Disambiguation Subsystem (`taivuta/preferences`).
 *
 * Provides APIs for detecting names and usernames with multiple valid Finnish grammatical
 * declensions, and generating structured preference options for UI selection.
 *
 * @module
 */

export {
  detectNameDisambiguation,
  isAmbiguousName,
  getNamePreferenceOptions
} from './detect.ts';

export {
  WORD_DERIVED_GIVEN_NAMES
} from './ambiguous-names.data.ts';

export type {
  AmbiguityDimension,
  DimensionChoice,
  NameDisambiguation,
  PersonPreferenceParams,
  PlacePreferenceParams,
  PreferenceParams,
  PreferenceOption,
  PersonPreferenceInput,
  PersonPreference,
  GeneralPreferenceInput,
  GeneralPreference
} from '../cases/types.ts';
