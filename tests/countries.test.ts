import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inflectPlace, detectLocalCase } from '../src/index.ts';
import {
  UN_COUNTRY_TEST_CASES,
  COUNTRY_VARIANT_TEST_CASES
} from './fixtures/un-countries.fixture.ts';

describe('UN Member States & Country Toponyms Benchmark', () => {
  it('achieves >= 90% accuracy (100% actual) across all official UN member states in local cases and genitive', () => {
    let successCount = 0;
    const failures: Array<{ country: string; field: string; got: string; want: string }> = [];

    for (const country of UN_COUNTRY_TEST_CASES) {
      const local = inflectPlace(country.name, 'local');
      const localFrom = inflectPlace(country.name, 'localFrom');
      const localTo = inflectPlace(country.name, 'localTo');
      const genitive = inflectPlace(country.name, 'genitive');

      let matches = true;
      if (local !== country.localCase) {
        failures.push({ country: country.name, field: 'local', got: local, want: country.localCase });
        matches = false;
      }
      if (localFrom !== country.localFrom) {
        failures.push({ country: country.name, field: 'localFrom', got: localFrom, want: country.localFrom });
        matches = false;
      }
      if (localTo !== country.localTo) {
        failures.push({ country: country.name, field: 'localTo', got: localTo, want: country.localTo });
        matches = false;
      }
      if (genitive !== country.genitive) {
        failures.push({ country: country.name, field: 'genitive', got: genitive, want: country.genitive });
        matches = false;
      }

      if (matches) {
        successCount++;
      }
    }

    const accuracy = successCount / UN_COUNTRY_TEST_CASES.length;
    assert.ok(
      accuracy >= 0.9,
      `Expected >= 90% accuracy on UN countries, got ${(accuracy * 100).toFixed(1)}%. Failures: ${JSON.stringify(failures)}`
    );
    assert.strictEqual(failures.length, 0, `Expected 0 failures on UN countries benchmark, got ${failures.length}`);
  });

  it('correctly detects local case type (in vs on) for island nations and mainland states', () => {
    for (const country of UN_COUNTRY_TEST_CASES) {
      const detected = detectLocalCase(country.name);
      assert.strictEqual(
        detected,
        country.localCaseType,
        `Mismatch in detectLocalCase for ${country.name}: got "${detected}", want "${country.localCaseType}"`
      );
    }
  });

  it('inflects commonly used alternative country names accurately', () => {
    for (const variant of COUNTRY_VARIANT_TEST_CASES) {
      assert.strictEqual(
        inflectPlace(variant.name, 'local'),
        variant.localCase,
        `Local mismatch for variant ${variant.name}`
      );
      assert.strictEqual(
        inflectPlace(variant.name, 'localFrom'),
        variant.localFrom,
        `LocalFrom mismatch for variant ${variant.name}`
      );
      assert.strictEqual(
        inflectPlace(variant.name, 'localTo'),
        variant.localTo,
        `LocalTo mismatch for variant ${variant.name}`
      );
      assert.strictEqual(
        inflectPlace(variant.name, 'genitive'),
        variant.genitive,
        `Genitive mismatch for variant ${variant.name}`
      );
    }
  });

  it('accurately handles complex multi-word compound states and kingdoms', () => {
    assert.strictEqual(
      inflectPlace('Dominikaaninen tasavalta', 'local'),
      'Dominikaanisessa tasavallassa'
    );
    assert.strictEqual(
      inflectPlace('Kongon demokraattinen tasavalta', 'localTo'),
      'Kongon demokraattiseen tasavaltaan'
    );
    assert.strictEqual(
      inflectPlace('Yhdistynyt kuningaskunta', 'local'),
      'Yhdistyneessä kuningaskunnassa'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiirikunnat', 'local'),
      'Yhdistyneissä arabiemiirikunnissa'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiirikunnat', 'localTo'),
      'Yhdistyneisiin arabiemiirikuntiin'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiirikunnat', 'localFrom'),
      'Yhdistyneistä arabiemiirikunnista'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiirikunnat', 'genitive'),
      'Yhdistyneiden arabiemiirikuntien'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiraatit', 'local'),
      'Yhdistyneissä arabiemiraateissa'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiraatit', 'localTo'),
      'Yhdistyneisiin arabiemiraatteihin'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiraatit', 'localFrom'),
      'Yhdistyneistä arabiemiraateista'
    );
    assert.strictEqual(
      inflectPlace('Yhdistyneet arabiemiraatit', 'genitive'),
      'Yhdistyneiden arabiemiraattien'
    );
    assert.strictEqual(
      inflectPlace('Arabiemiraatit', 'local'),
      'Arabiemiraateissa'
    );
    assert.strictEqual(
      inflectPlace('Arabiemiraatit', 'localTo'),
      'Arabiemiraatteihin'
    );
    assert.strictEqual(
      inflectPlace('Arabiemiraatit', 'localFrom'),
      'Arabiemiraateista'
    );
    assert.strictEqual(
      inflectPlace('Arabiemiraatit', 'genitive'),
      'Arabiemiraattien'
    );
    assert.strictEqual(
      inflectPlace('Taiwan', 'local'),
      'Taiwanissa'
    );
    assert.strictEqual(
      inflectPlace('Taiwan', 'localTo'),
      'Taiwaniin'
    );
    assert.strictEqual(
      inflectPlace('Taiwan', 'localFrom'),
      'Taiwanista'
    );
    assert.strictEqual(
      inflectPlace('Taiwan', 'genitive'),
      'Taiwanin'
    );
    assert.strictEqual(
      inflectPlace('Etelä-Korea', 'local'),
      'Etelä-Koreassa'
    );
    assert.strictEqual(
      inflectPlace('Etelä-Korea', 'localTo'),
      'Etelä-Koreaan'
    );
    assert.strictEqual(
      inflectPlace('Etelä-Korea', 'localFrom'),
      'Etelä-Koreasta'
    );
    assert.strictEqual(
      inflectPlace('Etelä-Korea', 'genitive'),
      'Etelä-Korean'
    );
    assert.strictEqual(
      inflectPlace('Papua-Uusi-Guinea', 'local'),
      'Papua-Uudessa-Guineassa'
    );
    assert.strictEqual(
      inflectPlace('Papua-Uusi-Guinea', 'localTo'),
      'Papua-Uuteen-Guineaan'
    );
  });

  it('normalizes foreign diacritics while preserving phonemic Finnish vowels for local case detection', () => {
    assert.strictEqual(detectLocalCase('Fidži'), 'on');
    assert.strictEqual(detectLocalCase('Fidzi'), 'on');
    assert.strictEqual(detectLocalCase('São Tomé ja Príncipe'), 'on');
    assert.strictEqual(detectLocalCase('Sao Tome ja Principe'), 'on');
    assert.strictEqual(detectLocalCase('Venäjä'), 'on');
    assert.strictEqual(detectLocalCase('Valko-Venäjä'), 'on');
  });

  it('accurately inflects plural country nouns and island archipelagos', () => {
    assert.strictEqual(inflectPlace('Yhdysvallat', 'local'), 'Yhdysvalloissa');
    assert.strictEqual(inflectPlace('Yhdysvallat', 'localTo'), 'Yhdysvaltoihin');
    assert.strictEqual(inflectPlace('Yhdysvallat', 'genitive'), 'Yhdysvaltojen');

    assert.strictEqual(inflectPlace('Alankomaat', 'local'), 'Alankomaissa');
    assert.strictEqual(inflectPlace('Alankomaat', 'localTo'), 'Alankomaihin');
    assert.strictEqual(inflectPlace('Alankomaat', 'genitive'), 'Alankomaiden');

    assert.strictEqual(inflectPlace('Filippiinit', 'local'), 'Filippiineillä');
    assert.strictEqual(inflectPlace('Malediivit', 'localTo'), 'Malediiveille');
    assert.strictEqual(inflectPlace('Seychellit', 'genitive'), 'Seychellien');
    assert.strictEqual(inflectPlace('Saint Vincent ja Grenadiinit', 'local'), 'Saint Vincent ja Grenadiineilla');
  });
});
