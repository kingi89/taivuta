/**
 * Shared internal runtime boundary guards, safe property lookup helpers,
 * and linear-time string utilities.
 *
 * @packageDocumentation
 */

import type { CaseName, GrammaticalCase } from '../cases/types.ts';

/**
 * Maximum character length accepted for single proper-noun inputs.
 * Inputs exceeding this ceiling return safe fallbacks in constant time.
 */
export const MAX_INPUT_LENGTH = 1_000_000;

const GRAMMATICAL_CASES: ReadonlySet<string> = new Set([
  'nominative',
  'genitive',
  'partitive',
  'inessive',
  'elative',
  'illative',
  'adessive',
  'ablative',
  'allative',
  'essive',
  'translative'
]);

/**
 * Checks whether an arbitrary runtime value is a supported grammatical case name.
 */
export function isValidGrammaticalCase(value: unknown): value is GrammaticalCase {
  return typeof value === 'string' && GRAMMATICAL_CASES.has(value);
}

/**
 * Checks whether an arbitrary runtime value is a supported grammatical or spatial case name.
 */
export function isValidCaseName(value: unknown): value is CaseName {
  return (
    isValidGrammaticalCase(value) ||
    value === 'local' ||
    value === 'localFrom' ||
    value === 'localTo'
  );
}

/**
 * Checks whether an arbitrary runtime value is a non-null object record.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

/**
 * Returns `value` when it is a primitive string, otherwise `fallback`.
 */
export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/**
 * Reads an own property from a record safely without inheriting from `Object.prototype`.
 */
export function safeGet<T>(record: object | null | undefined, key: string): T | undefined {
  if (isRecord(record) && Object.hasOwn(record, key)) {
    return (record as Readonly<Record<string, T>>)[key];
  }
  return undefined;
}

/**
 * Validates and trims a proper-noun input, returning `null` for non-strings,
 * empty or whitespace-only inputs, or strings exceeding `MAX_INPUT_LENGTH`.
 */
export function sanitizeInput(input: unknown): string | null {
  if (typeof input !== 'string' || input.length > MAX_INPUT_LENGTH) {
    return null;
  }
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Returns the fallback string when `sanitizeInput` rejects an input:
 * preserves oversized strings unchanged and collapses invalid or empty inputs to `''`.
 */
export function fallbackString(input: unknown): string {
  return typeof input === 'string' && input.length > MAX_INPUT_LENGTH ? input : '';
}

/**
 * Strips trailing ASCII periods in linear time relative to trailing dot count.
 */
export function stripTrailingDots(value: string): string {
  let end = value.length;
  while (end > 0 && value[end - 1] === '.') {
    end--;
  }
  return end === value.length ? value : value.slice(0, end);
}
