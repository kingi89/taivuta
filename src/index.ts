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
