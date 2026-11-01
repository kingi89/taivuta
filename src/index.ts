/**
 * Taivuta - Finnish proper noun inflection and local case detection library.
 *
 * @packageDocumentation
 */

/**
 * The current semantic version of the taivuta library.
 */
export const VERSION = '0.1.0';

/**
 * Returns library metadata and readiness status.
 *
 * @returns Metadata object describing the library release status.
 *
 * @example
 * ```ts
 * import { getStatus } from 'taivuta';
 * const status = getStatus();
 * console.log(status.ready); // true
 * ```
 */
export function getStatus(): { name: string; version: string; ready: boolean } {
  return {
    name: 'taivuta',
    version: VERSION,
    ready: true
  };
}

export {
  getVowelHarmony,
  harmonize,
  weakenConsonants,
  analyzeStem,
  type VowelHarmony,
  type GradationOptions,
  type AnalyzedStem
} from './morphology/index.ts';

export {
  inflectPerson
} from './person/index.ts';

export {
  detectLocalCase,
  inflectPlace,
  type InflectPlaceOptions
} from './place/index.ts';

export {
  inflect,
  detectEntityRole
} from './cases/inflect.ts';

export {
  format,
  t,
  type FormatValues,
  type TaggedTemplateArg
} from './template/index.ts';

export type {
  GrammaticalCase,
  LocalCaseType,
  PlaceLocalCase,
  CaseName,
  InflectPersonOptions,
  InflectOptions
} from './cases/types.ts';
