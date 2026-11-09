/**
 * Official Finnish Municipalities Benchmark Fixture (308 Municipalities).
 * Toponymic local case and base inflection test data.
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Expected grammatical and spatial forms for a Finnish municipality.
 */
export interface MunicipalityTestCase {
  readonly name: string;
  readonly localCase: string;
  readonly localFrom: string;
  readonly localTo: string;
  readonly localCaseType: 'in' | 'on';
  readonly genitive: string;
  readonly partitive?: string;
  readonly illative?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'municipalities.json');

export const MUNICIPALITY_TEST_CASES: readonly MunicipalityTestCase[] = JSON.parse(
  fs.readFileSync(jsonPath, 'utf8')
) as MunicipalityTestCase[];
