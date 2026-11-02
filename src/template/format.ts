/**
 * Template engine and tagged template literal helper for Finnish nominal inflection.
 *
 * Provides factory createTemplateEngine() for composing natural Finnish text
 * with inline inflections.
 *
 * @packageDocumentation
 */

import type { CaseName, InflectOptions } from '../cases/types.ts';

/**
 * Format variables mapping for template interpolation.
 */
export type FormatValues = Record<string, string | number | undefined | null>;

/**
 * Function signature for proper noun inflection in template engines.
 */
export type InflectorFn<C extends string = string, O = unknown> = (
  name: string,
  targetCase: C,
  options?: O
) => string;

/**
 * Type of template literal arguments supported by the tagged template `t`.
 */
export type TaggedTemplateArg =
  | string
  | number
  | null
  | undefined
  | [string, CaseName]
  | [string, CaseName, InflectOptions];

/**
 * An instantiated template engine providing format() and tagged template t`` functions.
 */
export interface TemplateEngine {
  /**
   * Interpolates variables into a template string, inflecting them into requested cases.
   *
   * Expression syntax: `{$variable:case[:role]}`
   *
   * @param template - The template string containing expressions like `{$user:genitive}`.
   * @param values - Key-value map of variable values.
   * @returns The formatted and inflected string.
   */
  readonly format: (template: string, values: FormatValues) => string;

  /**
   * Tagged template literal helper for inline Finnish name inflection.
   *
   * @param strings - The template string parts.
   * @param values - Interleaved values, strings, numbers, or inflection tuples.
   * @returns The composed and inflected string.
   */
  readonly t: (
    strings: TemplateStringsArray,
    ...values: readonly TaggedTemplateArg[]
  ) => string;
}

function interpolateMatch<C extends string, O>(
  token: string,
  values: FormatValues,
  inflect: InflectorFn<C, O>
): string {
  const parts = token.slice(2, -1).split(':');
  const key = parts[0];
  if (!key) {
    return '';
  }

  const rawVal = values[key];
  if (rawVal === undefined || rawVal === null) {
    return '';
  }

  const strVal = String(rawVal);
  const caseName = parts[1];
  if (!caseName) {
    return strVal;
  }

  const role = parts[2];
  const options = (role ? { role: role as 'person' | 'place' | 'auto' } : {}) as unknown as O;
  return inflect(strVal, caseName as C, options);
}

/**
 * Creates an isolated template engine bound to the specified inflection function.
 *
 * @param inflect - The inflection function to use (e.g. universal inflect, inflectPerson, or inflectPlace).
 * @returns An object containing `format()` and tagged template `t`` functions.
 *
 * @example
 * ```ts
 * import { createTemplateEngine } from 'taivuta/template';
 * import { inflectPerson } from 'taivuta/person';
 *
 * const { format, t } = createTemplateEngine(inflectPerson);
 * format("Onnea {$name:allative}!", { name: "Matti" }); // "Onnea Matille!"
 * ```
 */
export function createTemplateEngine<C extends string = string, O = unknown>(
  inflect: InflectorFn<C, O>
): TemplateEngine {
  function format(template: string, values: FormatValues): string {
    if (!template) {
      return '';
    }

    return template.replace(/\{\$[a-zA-Z0-9_]+(?::[a-zA-Z0-9_]+)?(?::[a-zA-Z0-9_]+)?\}/g, (token) => {
      return interpolateMatch(token, values, inflect);
    });
  }

  function t(
    strings: TemplateStringsArray,
    ...values: readonly TaggedTemplateArg[]
  ): string {
    let result = '';

    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < values.length) {
        const val = values[i];
        if (Array.isArray(val)) {
          const [name, targetCase, options] = val;
          result += inflect(name, targetCase as unknown as C, options as unknown as O);
        } else if (val !== undefined && val !== null) {
          result += String(val);
        }
      }
    }

    return result;
  }

  return { format, t };
}
