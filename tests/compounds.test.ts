/**
 * Unit tests for compound token decomposition, concordance, and entity classification.
 */

import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';

import { decomposeCompound } from '../src/morphology/index.ts';
import { classifyProperNoun } from '../src/cases/classify.ts';

describe('Compound Token Decomposition (decomposeCompound)', () => {
  it('correctly decomposes inflecting prefixes with requested case', () => {
    const uusiNom = decomposeCompound('Uusi-Seelanti', 'nominative');
    assert.ok(uusiNom);
    assert.equal(uusiNom.prefix, 'Uusi-');
    assert.equal(uusiNom.headWord, 'Seelanti');
    assert.equal(uusiNom.isInflectingPrefix, true);

    const uusiIness = decomposeCompound('Uusi-Seelanti', 'inessive');
    assert.ok(uusiIness);
    assert.equal(uusiIness.prefix, 'Uudessa-');
    assert.equal(uusiIness.headWord, 'Seelanti');

    const isoGen = decomposeCompound('Iso-Britannia', 'genitive');
    assert.ok(isoGen);
    assert.equal(isoGen.prefix, 'Ison-');
    assert.equal(isoGen.headWord, 'Britannia');
    assert.equal(isoGen.isInflectingPrefix, true);
  });

  it('correctly decomposes static geographic and personal compound prefixes', () => {
    const pohjois = decomposeCompound('Pohjois-Karjala', 'inessive');
    assert.ok(pohjois);
    assert.equal(pohjois.prefix, 'Pohjois-');
    assert.equal(pohjois.headWord, 'Karjala');
    assert.equal(pohjois.isInflectingPrefix, false);

    const etela = decomposeCompound('Etelä-Afrikka', 'allative');
    assert.ok(etela);
    assert.equal(etela.prefix, 'Etelä-');
    assert.equal(etela.headWord, 'Afrikka');
    assert.equal(etela.isInflectingPrefix, false);

    const kariPekka = decomposeCompound('Kari-Pekka', 'genitive');
    assert.ok(kariPekka);
    assert.equal(kariPekka.prefix, 'Kari-');
    assert.equal(kariPekka.headWord, 'Pekka');
    assert.equal(kariPekka.isInflectingPrefix, false);
  });

  it('returns null for unhyphenated single words or trailing hyphens', () => {
    assert.equal(decomposeCompound('Helsinki'), null);
    assert.equal(decomposeCompound('Virtanen'), null);
    assert.equal(decomposeCompound('Uusi-'), null);
    assert.equal(decomposeCompound(''), null);
  });
});

describe('Entity Classification (classifyProperNoun)', () => {
  it('heuristically classifies places based on structural toponymic markers', () => {
    assert.equal(classifyProperNoun('Uusi-Seelanti'), 'place');
    assert.equal(classifyProperNoun('Iso-Britannia'), 'place');
    assert.equal(classifyProperNoun('Savonlinna'), 'place');
    assert.equal(classifyProperNoun('Tampere'), 'place');
    assert.equal(classifyProperNoun('Lahti'), 'place');
    assert.equal(classifyProperNoun('Virrat'), 'place');
    assert.equal(classifyProperNoun('Alajärvi'), 'place');
    assert.equal(classifyProperNoun('Kontiolahti'), 'place');
    assert.equal(classifyProperNoun('Thaimaa'), 'place');
    assert.equal(classifyProperNoun('Ahvenanmaa'), 'place');
    assert.equal(classifyProperNoun('Venäjä', 'on'), 'place');
    assert.equal(classifyProperNoun('Yhdistyneet arabiemiraatit'), 'place');
    assert.equal(classifyProperNoun('Yhdistynyt kuningaskunta'), 'place');
    assert.equal(classifyProperNoun('Pohjois-Karjala'), 'place');

    // Surnames with toponymic roots match geographic patterns by design
    assert.equal(classifyProperNoun('Karhuvaara'), 'place');
    assert.equal(classifyProperNoun('Ylä-Anttila'), 'place');
  });

  it('classifies personal names and unannotated base forms as person', () => {
    assert.equal(classifyProperNoun('Matti'), 'person');
    assert.equal(classifyProperNoun('Virtanen'), 'person');
    assert.equal(classifyProperNoun('Pekka'), 'person');
    assert.equal(classifyProperNoun('Marja-Liisa'), 'person');
    assert.equal(classifyProperNoun('Kari-Pekka'), 'person');
    assert.equal(classifyProperNoun('John Smith'), 'person');
    // Words without toponymic suffixes or spatial hints default safely to person
    assert.equal(classifyProperNoun('Helsinki'), 'person');
  });

  it('handles empty input safely', () => {
    assert.equal(classifyProperNoun(''), 'person');
  });
});
