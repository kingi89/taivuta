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
import { inflect, inflectPerson } from '../src/index.ts';

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
    // Contextual macro local cases (local, localFrom, localTo)
    assert.equal(inflectPlace('Helsinki', 'local'), 'Helsingissä');
    assert.equal(inflectPlace('Helsinki', 'localFrom'), 'Helsingistä');
    assert.equal(inflectPlace('Helsinki', 'localTo'), 'Helsinkiin');
    assert.equal(inflectPlace('Tampere', 'local'), 'Tampereella');
    assert.equal(inflectPlace('Tampere', 'localFrom'), 'Tampereelta');
    assert.equal(inflectPlace('Tampere', 'localTo'), 'Tampereelle');
    assert.equal(inflectPlace('Kirkkonummi', 'localTo'), 'Kirkkonummelle');
    assert.equal(inflectPlace('Kuortane', 'localTo'), 'Kuortaneelle');

    // Grammatical illative distinction for external-case place
    assert.equal(inflectPlace('Tampere', 'illative'), 'Tampereeseen');
    assert.equal(inflectPlace('Kuortane', 'illative'), 'Kuortaneeseen');

    // Explicit override via options
    assert.equal(inflectPlace('Helsinki', 'local', { localCase: 'on' }), 'Helsingillä');
    assert.equal(inflectPlace('Helsinki', 'localTo', { localCase: 'on' }), 'Helsingille');
    assert.equal(inflectPlace('Tampere', 'local', { localCase: 'in' }), 'Tampereessa');
    assert.equal(inflectPlace('Tampere', 'localTo', { localCase: 'in' }), 'Tampereeseen');
  });

  it('inflects specialized toponyms, exonyms, abbreviations, and foreign names accurately', () => {
    // 1. Surnames/places in -nen with local and grammatical cases
    assert.equal(inflectPlace('Virtanen', 'local'), 'Virtasessa');
    assert.equal(inflectPlace('Virtanen', 'localFrom'), 'Virtasesta');
    assert.equal(inflectPlace('Virtanen', 'localTo'), 'Virtaseen');
    assert.equal(inflectPlace('Virtanen', 'genitive'), 'Virtasen');
    assert.equal(inflectPlace('Virtanen', 'partitive'), 'Virtasta');
    assert.equal(inflectPlace('Virtanen', 'illative'), 'Virtaseen');
    assert.equal(inflectPlace('Virtanen', 'adessive'), 'Virtasella');
    assert.equal(inflectPlace('Virtanen', 'ablative'), 'Virtaselta');
    assert.equal(inflectPlace('Virtanen', 'allative'), 'Virtaselle');
    assert.equal(inflectPlace('Virtanen', 'essive'), 'Virtasena');
    assert.equal(inflectPlace('Virtanen', 'translative'), 'Virtaseksi');
    assert.equal(inflect('Virtanen', 'local'), 'Virtasessa');

    // 2. Plural -inen municipalities
    assert.equal(inflectPlace('Kauniainen', 'localFrom'), 'Kauniaisista');
    assert.equal(inflectPlace('Huittinen', 'localFrom'), 'Huittisista');
    assert.equal(inflectPlace('Parainen', 'localFrom'), 'Paraisilta');
    assert.equal(inflectPlace('Uurainen', 'localFrom'), 'Uuraisilta');

    // 3. Vowel-less abbreviations (Koski Tl, HJK) requiring colon separation
    assert.equal(inflectPlace('Koski Tl', 'local'), 'Koski Tl:llä');
    assert.equal(inflectPlace('Koski Tl', 'localFrom'), 'Koski Tl:ltä');
    assert.equal(inflectPlace('Koski Tl', 'localTo'), 'Koski Tl:lle');
    assert.equal(inflectPlace('Koski Tl', 'genitive'), 'Koski Tl:n');
    assert.equal(inflectPlace('Koski Tl', 'partitive'), 'Koski Tl:ää');
    assert.equal(inflectPlace('Koski Tl', 'illative'), 'Koski Tl:ään');
    assert.equal(inflectPlace('Koski Tl', 'inessive'), 'Koski Tl:ssä');
    assert.equal(inflectPlace('Koski Tl', 'elative'), 'Koski Tl:stä');
    assert.equal(inflectPlace('Koski Tl', 'essive'), 'Koski Tl:nä');
    assert.equal(inflectPlace('Koski Tl', 'translative'), 'Koski Tl:ksi');
    assert.equal(inflectPlace('HJK', 'local'), 'HJK:ssa');
    assert.equal(inflectPlace('VR', 'adessive'), 'VR:llä');
    assert.equal(inflectPlace('HZ', 'adessive'), 'HZ:lla');
    assert.equal(inflect('Koski Tl', 'localFrom'), 'Koski Tl:ltä');

    // 4. Non-alphanumeric and non-Latin endings
    assert.equal(inflectPlace('Studio_', 'local'), 'Studio_:ssa');
    assert.equal(inflectPlace('Agent007', 'allative'), 'Agent007:lle');
    assert.equal(inflectPlace('Agent007', 'localTo'), 'Agent007:iin');
    assert.equal(inflectPlace('朧', 'local'), '朧:ssä');
    assert.equal(inflectPerson('Agent007', 'genitive'), 'Agent007:n');
    assert.equal(inflectPerson('Agent007', 'partitive'), 'Agent007:a');
    assert.equal(inflectPerson('Agent007', 'illative'), 'Agent007:iin');
    assert.equal(inflectPerson('Agent007', 'adessive'), 'Agent007:lla');

    // 5. Exonyms and compound places
    assert.equal(inflectPlace('Uusi-Seelanti', 'local'), 'Uudessa-Seelannissa');
    assert.equal(inflectPlace('Uusi-Seelanti', 'localFrom'), 'Uudesta-Seelannista');
    assert.equal(inflectPlace('Uusi-Seelanti', 'localTo'), 'Uuteen-Seelantiin');
    assert.equal(inflectPlace('Iso-Britannia', 'local'), 'Isossa-Britanniassa');
    assert.equal(inflectPlace('Iso-Britannia', 'localFrom'), 'Isosta-Britanniasta');
    assert.equal(inflectPlace('Iso-Britannia', 'localTo'), 'Isoon-Britanniaan');
    assert.equal(inflectPlace('Thaimaa', 'local'), 'Thaimaassa');
    assert.equal(inflectPlace('Thaimaa', 'localTo'), 'Thaimaahan');
    assert.equal(inflectPlace('Kanariansaaret', 'local'), 'Kanariansaarilla');
    assert.equal(inflectPlace('Kanariansaaret', 'localFrom'), 'Kanariansaarilta');
    assert.equal(inflectPlace('Kanariansaaret', 'localTo'), 'Kanariansaarille');
    assert.equal(inflectPlace('Kanariansaaret', 'genitive'), 'Kanariansaarten');
    assert.equal(inflectPlace('Kanariansaaret', 'partitive'), 'Kanariansaaria');
    assert.equal(inflectPlace('Kanariansaaret', 'illative'), 'Kanariansaariin');
    assert.equal(inflectPlace('Kanariansaaret', 'inessive'), 'Kanariansaarissa');
    assert.equal(inflectPlace('Kanariansaaret', 'elative'), 'Kanariansaarista');
    assert.equal(inflectPlace('Kanariansaaret', 'essive'), 'Kanariansaarina');
    assert.equal(inflectPlace('Kanariansaaret', 'translative'), 'Kanariansaariksi');
    assert.equal(inflect('Uusi-Seelanti', 'local'), 'Uudessa-Seelannissa');
    assert.equal(inflect('Kanariansaaret', 'local'), 'Kanariansaarilla');

    // 6. Accented tail characters and macrons (Hokkaidō)
    assert.equal(inflectPlace('Hokkaidō', 'local'), 'Hokkaidōssa');
    assert.equal(inflectPlace('Hokkaidō', 'localFrom'), 'Hokkaidōsta');
    assert.equal(inflectPlace('Hokkaidō', 'localTo'), 'Hokkaidōhon');
    assert.equal(inflectPlace('Hokkaidō', 'partitive'), 'Hokkaidōta');
    assert.equal(inflectPlace('Hokkaidō', 'genitive'), 'Hokkaidōn');
    assert.equal(inflectPlace('Hokkaidō', 'adessive'), 'Hokkaidōlla');
    assert.equal(inflectPlace('Hokkaidō', 'ablative'), 'Hokkaidōlta');
    assert.equal(inflectPlace('Hokkaidō', 'allative'), 'Hokkaidōlle');
    assert.equal(inflectPlace('Hokkaidō', 'essive'), 'Hokkaidōna');
    assert.equal(inflectPlace('Hokkaidō', 'translative'), 'Hokkaidōksi');
    assert.equal(inflectPlace('Åland', 'local'), 'Ålandissa');
    assert.equal(inflect('Hokkaidō', 'local'), 'Hokkaidōssa');
    assert.equal(inflect('Hokkaidō', 'genitive'), 'Hokkaidōn');

    // 7. Long vowel partitives, nature suffixes, and island provinces
    assert.equal(inflectPlace('Lontoo', 'partitive'), 'Lontoota');
    assert.equal(inflectPlace('Lahti', 'local'), 'Lahdessa');
    assert.equal(inflectPlace('Lahti', 'localFrom'), 'Lahdesta');
    assert.equal(inflectPlace('Lahti', 'localTo'), 'Lahteen');
    assert.equal(inflectPlace('Lahti', 'genitive'), 'Lahden');
    assert.equal(inflectPlace('Lahti', 'partitive'), 'Lahtea');
    assert.equal(inflectPlace('Virrat', 'local'), 'Virroilla');
    assert.equal(inflectPlace('Virrat', 'localFrom'), 'Virroilta');
    assert.equal(inflectPlace('Virrat', 'localTo'), 'Virroille');
    assert.equal(inflectPlace('Ahvenanmaa', 'local'), 'Ahvenanmaalla');
    assert.equal(inflectPlace('Ahvenanmaa', 'localFrom'), 'Ahvenanmaalta');
    assert.equal(inflectPlace('Ahvenanmaa', 'localTo'), 'Ahvenanmaalle');
    assert.equal(inflectPlace('Ahvenanmaa', 'genitive'), 'Ahvenanmaan');
  });
});
