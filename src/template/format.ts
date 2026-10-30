/**
 * Template engine and tagged template literal helper for Finnish nominal inflection.
 *
 * @packageDocumentation
 */

import type { CaseName, InflectOptions } from '../cases/types.ts';
import { inflect } from '../cases/inflect.ts';

/**
 * Format variables mapping for template interpolation.
 */
export type FormatValues = Record<string, string | number | undefined | null>;

function interpolateMatch(
  token: string,
  values: FormatValues
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
  const options: InflectOptions = role ? { role: role as 'person' | 'place' | 'auto' } : {};
  return inflect(strVal, caseName as CaseName, options);
}

/**
 * Interpolates variables into a template string, inflecting them into requested cases.
 *
 * Expression syntax: `{$variable:case[:role]}`
 * - `variable`: Key in the values object.
 * - `case`: Optional case name (e.g. "genitive", "partitive", "local", "localTo").
 * - `role`: Optional entity role ("person", "place", "auto").
 *
 * @param template - The template string containing expressions like `{$user:genitive}`.
 * @param values - Key-value map of variable values.
 * @returns The formatted and inflected string.
 *
 * @example
 * ```ts
 * format("Tänään on {$user:genitive} syntymäpäivä.", { user: "Erkki" });
 * // "Tänään on Erkin syntymäpäivä."
 *
 * format("Tervetuloa {$city:localTo}!", { city: "Tampere" });
 * // "Tervetuloa Tampereelle!"
 * ```
 */
export function format(template: string, values: FormatValues): string {
  if (!template) {
    return '';
  }

  return template.replace(/\{\$[a-zA-Z0-9_]+(?::[a-zA-Z0-9_]+)?(?::[a-zA-Z0-9_]+)?\}/g, (token) => {
    return interpolateMatch(token, values);
  });
}

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
 * const city = "Tampere";
 * t`Onnea ${[user, "genitive"]} päivänä! Tervetuloa ${[city, "localTo"]}!`;
 * // "Onnea Liisan päivänä! Tervetuloa Tampereelle!"
 * ```
 */
export function t(
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
        result += inflect(name, targetCase, options);
      } else if (val !== undefined && val !== null) {
        result += String(val);
      }
    }
  }

  return result;
}
