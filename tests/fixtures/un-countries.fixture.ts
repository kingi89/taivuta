/**
 * Official UN Member States Benchmark Fixture in Finnish.
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Expected grammatical forms for a country name.
 */
export interface CountryTestCase {
  readonly name: string;
  readonly localCase: string;
  readonly localFrom: string;
  readonly localTo: string;
  readonly genitive: string;
  readonly localCaseType: 'in' | 'on';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'un-countries.json');
const variantsPath = path.join(__dirname, 'country-variants.json');

export const UN_COUNTRY_TEST_CASES: readonly CountryTestCase[] = JSON.parse(
  fs.readFileSync(jsonPath, 'utf8')
) as CountryTestCase[];

export const COUNTRY_VARIANT_TEST_CASES: readonly CountryTestCase[] = JSON.parse(
  fs.readFileSync(variantsPath, 'utf8')
) as CountryTestCase[];
