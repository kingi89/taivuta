/**
 * Unit and linguistic accuracy benchmark tests for Finnish place name inflection
 * and local case detection (Milestone 4).
 *
 * @packageDocumentation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MUNICIPALITY_TEST_CASES } from './fixtures/municipalities.fixture.ts';
import { detectLocalCase, inflectPlace } from '../src/place/inflect-place.ts';

describe('Official Finnish Municipalities Benchmark (100% Accuracy on 308 Municipalities)', () => {
  it('achieves 100% accuracy on local case selection (in vs. on) for all 308 municipalities', () => {
    let passed = 0;
    const failures: Array<{ name: string; expected: string; actual: string }> = [];

    for (const tc of MUNICIPALITY_TEST_CASES) {
      const actualType = detectLocalCase(tc.name);
      if (actualType === tc.localCaseType) {
        passed++;
      } else {
        failures.push({ name: tc.name, expected: tc.localCaseType, actual: actualType });
      }
    }

    assert.equal(
      failures.length,
      0,
      `Local case detection failed on ${failures.length} municipalities:\n` +
        failures.map((f) => `  ${f.name}: expected ${f.expected}, got ${f.actual}`).join('\n')
    );
    assert.equal(passed, 308);
  });

  it('correctly inflects all 308 municipalities into their primary local case form', () => {
    let passed = 0;
    const failures: Array<{ name: string; expected: string; actual: string }> = [];

    for (const tc of MUNICIPALITY_TEST_CASES) {
      const targetCase = tc.localCaseType === 'in' ? 'inessive' : 'adessive';
      const actual = inflectPlace(tc.name, targetCase);
      if (actual === tc.localCase) {
        passed++;
      } else {
        failures.push({ name: tc.name, expected: tc.localCase, actual });
      }
    }

    assert.equal(
      failures.length,
      0,
      `Primary local case inflection failed on ${failures.length} municipalities:\n` +
        failures.map((f) => `  ${f.name}: expected ${f.expected}, got ${f.actual}`).join('\n')
    );
    assert.equal(passed, 308);
  });

  it('correctly inflects all 308 municipalities into genitive', () => {
    let passed = 0;
    const failures: Array<{ name: string; expected: string; actual: string }> = [];

    for (const tc of MUNICIPALITY_TEST_CASES) {
      const actual = inflectPlace(tc.name, 'genitive');
      if (actual === tc.genitive) {
        passed++;
      } else {
        failures.push({ name: tc.name, expected: tc.genitive, actual });
      }
    }

    assert.equal(
      failures.length,
      0,
      `Genitive inflection failed on ${failures.length} municipalities:\n` +
        failures.map((f) => `  ${f.name}: expected ${f.expected}, got ${f.actual}`).join('\n')
    );
    assert.equal(passed, 308);
  });

  it('accurately handles specific morphological edge cases (partitive and illative)', () => {
    for (const tc of MUNICIPALITY_TEST_CASES) {
      if (tc.partitive) {
        const actualPartitive = inflectPlace(tc.name, 'partitive');
        assert.equal(actualPartitive, tc.partitive, `Partitive mismatch for ${tc.name}`);
      }
      if (tc.illative) {
        const actualIllative = inflectPlace(tc.name, 'illative');
        assert.equal(actualIllative, tc.illative, `Illative mismatch for ${tc.name}`);
      }
    }
  });
});

describe('Place Name Suffix Heuristics & Fallbacks', () => {
  it('detects external local case for arbitrary place names with nature suffixes', () => {
    assert.equal(detectLocalCase('Kyläjärvi'), 'on');
    assert.equal(detectLocalCase('Isojoki'), 'on');
    assert.equal(detectLocalCase('Mustamäki'), 'on');
    assert.equal(detectLocalCase('Syvävesi'), 'on');
    assert.equal(detectLocalCase('Myllykoski'), 'on');
    assert.equal(detectLocalCase('Kivisalmi'), 'on');
    assert.equal(detectLocalCase('Kuusisaari'), 'on');
    assert.equal(detectLocalCase('Kultaniemi'), 'on');
  });

  it('detects internal local case for arbitrary settlement and landscape suffixes', () => {
    assert.equal(detectLocalCase('Peltokylä'), 'in');
    assert.equal(detectLocalCase('Mäntylahti'), 'in');
    assert.equal(detectLocalCase('Uusilinna'), 'in');
    assert.equal(detectLocalCase('Heinävesi'), 'on'); // -vesi takes external
  });

  it('inflects places across all remaining nominal cases and edge inputs', () => {
    // Edge inputs
    assert.equal(detectLocalCase(''), 'in');
    assert.equal(inflectPlace('', 'genitive'), '');
    assert.equal(inflectPlace('Helsinki', 'nominative'), 'Helsinki');

    // General case forms
    assert.equal(inflectPlace('Helsinki', 'elative'), 'Helsingistä');
    assert.equal(inflectPlace('Helsinki', 'allative'), 'Helsingille');
    assert.equal(inflectPlace('Helsinki', 'essive'), 'Helsinkinä');
    assert.equal(inflectPlace('Helsinki', 'translative'), 'Helsingiksi');
    assert.equal(inflectPlace('Tampere', 'essive'), 'Tampereena');

    // Nature place forms
    assert.equal(inflectPlace('Alajärvi', 'elative'), 'Alajärvestä');
    assert.equal(inflectPlace('Alajärvi', 'ablative'), 'Alajärveltä');
    assert.equal(inflectPlace('Alajärvi', 'allative'), 'Alajärvelle');
    assert.equal(inflectPlace('Alajärvi', 'essive'), 'Alajärvenä');
    assert.equal(inflectPlace('Alajärvi', 'translative'), 'Alajärveksi');

    // Long vowel place forms
    assert.equal(inflectPlace('Espoo', 'elative'), 'Espoosta');
    assert.equal(inflectPlace('Espoo', 'allative'), 'Espoolle');
    assert.equal(inflectPlace('Espoo', 'essive'), 'Espoona');
    assert.equal(inflectPlace('Espoo', 'translative'), 'Espooksi');
    assert.equal(inflectPlace('Ii', 'illative'), 'Iihin');

    // Consonant place forms
    assert.equal(inflectPlace('Finström', 'elative'), 'Finströmistä');
    assert.equal(inflectPlace('Finström', 'allative'), 'Finströmille');
    assert.equal(inflectPlace('Finström', 'essive'), 'Finströminä');
    assert.equal(inflectPlace('Finström', 'translative'), 'Finströmiksi');
  });
});
