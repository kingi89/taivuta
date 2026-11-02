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
  createStemParadigm,
  assembleCase,
  type VowelHarmony,
  type GradationOptions,
  type AnalyzedStem,
  type StemParadigm,
  type CreateParadigmOptions,
  type AssembleCaseOptions
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

import { inflect } from './cases/inflect.ts';
import { createTemplateEngine } from './template/index.ts';

const rootTemplateEngine = createTemplateEngine(inflect);

/**
 * Interpolates variables into a template string, inflecting them into requested cases.
 *
 * Expression syntax: `{$variable:case[:role]}`
 *
 * @param template - The template string containing expressions like `{$user:genitive}`.
 * @param values - Key-value map of variable values.
 * @returns The formatted and inflected string.
 *
 * @example
 * ```ts
 * format("Tänään on {$user:genitive} syntymäpäivä.", { user: "Erkki" });
 * // "Tänään on Erkin syntymäpäivä."
 * ```
 */
export const format = rootTemplateEngine.format;

/**
 * Tagged template literal helper for inline Finnish name inflection.
 *
 * Wrap values in a tuple `[value, caseName, options?]` to inflect them inline.
 *
 * @param strings - The template string parts.
 * @param values - Interleaved values, strings, numbers, or inflection tuples.
 * @returns The composed and inflected string.
 *
 * @example
 * ```ts
 * const user = "Liisa";
 * t`Onnea ${[user, "genitive"]} päivänä!`;
 * // "Onnea Liisan päivänä!"
 * ```
 */
export const t = rootTemplateEngine.t;

export {
  createTemplateEngine,
  type TemplateEngine,
  type InflectorFn,
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
