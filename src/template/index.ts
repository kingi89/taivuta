/**
 * Template string interpolation engine for Finnish grammatical inflections.
 *
 * Provides factory createTemplateEngine() for composing natural Finnish text
 * with inline inflections.
 *
 * @packageDocumentation
 */

export {
  createTemplateEngine,
  type TemplateEngine,
  type InflectorFn,
  type FormatValues,
  type FormatOptions,
  type TaggedTemplateArg
} from './format.ts';
