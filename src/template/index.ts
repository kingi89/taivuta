/**
 * Template string interpolation engine for Finnish grammatical inflections.
 *
 * Provides format() and tagged template t`` functions for composing natural Finnish text
 * with inline inflections (e.g. "Hei {$name:genitive}!").
 *
 * @packageDocumentation
 */

export {
  format,
  t,
  type FormatValues,
  type TaggedTemplateArg
} from './format.ts';
