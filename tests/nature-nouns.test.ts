/**
 * Tests for the unified nature nouns morphology module and toponymic formatives.
 */

import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';

import {
  matchNatureNoun,
  matchNatureNounSurname,
  inflectNatureNounSurname,
  NATURE_NOUN_RULES,
  assembleCase
} from '../src/morphology/index.ts';
import { inflectPerson } from '../src/person/index.ts';
import { inflectPlace, detectLocalCase } from '../src/place/index.ts';

describe('Unified Nature Noun Registry & Toponymic Formatives', () => {
  it('exposes a valid NATURE_NOUN_RULES registry', () => {
    assert.ok(NATURE_NOUN_RULES.length >= 15);
    for (const rule of NATURE_NOUN_RULES) {
      assert.ok(rule.suffix.length > 0);
      assert.ok(rule.weak.length > 0);
      assert.ok(rule.strong.length > 0);
      assert.ok(rule.partitive.length > 0);
      assert.ok(rule.illative.length > 0);
      assert.ok(rule.harmony === 'front' || rule.harmony === 'back');
      assert.ok(rule.defaultSpatialCase === 'in' || rule.defaultSpatialCase === 'on');
    }
  });

  it('matches and inflects standalone nature nouns with correct capitalization', () => {
    const lahti = matchNatureNoun('Lahti');
    assert.ok(lahti);
    assert.equal(lahti.weakVocalicStem, 'Lahde');
    assert.equal(lahti.strongVocalicStem, 'Lahte');
    assert.equal(lahti.partitive, 'Lahtea');
    assert.equal(lahti.illative, 'Lahteen');
    assert.equal(lahti.defaultSpatialCase, 'in');

    assert.equal(assembleCase(lahti, 'genitive'), 'Lahden');
    assert.equal(assembleCase(lahti, 'inessive'), 'Lahdessa');
    assert.equal(assembleCase(lahti, 'elative'), 'Lahdesta');
    assert.equal(assembleCase(lahti, 'illative'), 'Lahteen');
    assert.equal(assembleCase(lahti, 'partitive'), 'Lahtea');
  });

  it('matches and inflects compound place names ending in nature suffixes', () => {
    const kontiolahti = matchNatureNoun('Kontiolahti');
    assert.ok(kontiolahti);
    assert.equal(assembleCase(kontiolahti, 'local'), 'Kontiolahdessa');
    assert.equal(assembleCase(kontiolahti, 'localFrom'), 'Kontiolahdesta');
    assert.equal(assembleCase(kontiolahti, 'localTo'), 'Kontiolahteen');
    assert.equal(assembleCase(kontiolahti, 'genitive'), 'Kontiolahden');

    const alajarvi = matchNatureNoun('Alajärvi');
    assert.ok(alajarvi);
    assert.equal(alajarvi.defaultSpatialCase, 'on');
    assert.equal(assembleCase(alajarvi, 'local'), 'Alajärvellä');
    assert.equal(assembleCase(alajarvi, 'localFrom'), 'Alajärveltä');
    assert.equal(assembleCase(alajarvi, 'localTo'), 'Alajärvelle');
    assert.equal(assembleCase(alajarvi, 'genitive'), 'Alajärven');
  });

  it('correctly handles external vs internal spatial cases for various nature formatives', () => {
    assert.equal(detectLocalCase('Alajärvi'), 'on');
    assert.equal(detectLocalCase('Siikajoki'), 'on');
    assert.equal(detectLocalCase('Puijonmäki'), 'on');
    assert.equal(detectLocalCase('Kuusankoski'), 'on');
    assert.equal(detectLocalCase('Mustasaari'), 'on');
    assert.equal(detectLocalCase('Otaniemi'), 'on');
    assert.equal(detectLocalCase('Kontiolahti'), 'in');
    assert.equal(detectLocalCase('Rautasalmi'), 'on');
  });

  it('inflects surnames ending in nature nouns through inflectPerson()', () => {
    assert.equal(inflectPerson('Mäki', 'genitive', { role: 'surname' }), 'Mäen');
    assert.equal(inflectPerson('Koski', 'genitive', { role: 'surname' }), 'Kosken');
    assert.equal(inflectPerson('Niemi', 'genitive', { role: 'surname' }), 'Niemen');
    assert.equal(inflectPerson('Lahti', 'genitive', { role: 'surname' }), 'Lahden');
    assert.equal(inflectPerson('Saari', 'partitive', { role: 'surname' }), 'Saarta');
    assert.equal(inflectPerson('Meri', 'partitive', { role: 'surname' }), 'Merta');
    assert.equal(inflectPerson('Laine', 'genitive', { role: 'surname' }), 'Laineen');
    assert.equal(inflectPerson('Rinne', 'genitive', { role: 'surname' }), 'Rinteen');
  });

  it('inflects place names ending in nature nouns through inflectPlace()', () => {
    assert.equal(inflectPlace('Lahti', 'local'), 'Lahdessa');
    assert.equal(inflectPlace('Kontiolahti', 'local'), 'Kontiolahdessa');
    assert.equal(inflectPlace('Alajärvi', 'local'), 'Alajärvellä');
    assert.equal(inflectPlace('Mustasaari', 'local'), 'Mustasaarella');
    assert.equal(inflectPlace('Kuusankoski', 'local'), 'Kuusankoskella');
  });

  it('preserves backward compatibility with matchNatureNounSurname and inflectNatureNounSurname', () => {
    const stem = matchNatureNounSurname('Niemi');
    assert.ok(stem);
    assert.equal(stem.strongStem, 'Nieme');
    assert.equal(stem.weakStem, 'Nieme');
    assert.equal(inflectNatureNounSurname('Niemi', 'genitive', stem), 'Niemen');
    assert.equal(inflectNatureNounSurname('Niemi', 'partitive', stem), 'Niemeä');
    assert.equal(inflectNatureNounSurname('Niemi', 'illative', stem), 'Niemeen');
    assert.equal(inflectNatureNounSurname('Niemi', 'adessive', stem), 'Niemellä');
  });

  it('returns null safely for empty or non-matching inputs', () => {
    assert.equal(matchNatureNoun(''), null);
    assert.equal(matchNatureNoun('Helsinki'), null);
    assert.equal(matchNatureNoun('Tampere'), null);
  });
});
