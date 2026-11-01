/**
 * Unit tests for the canonical StemParadigm model and assembleCase() engine.
 */

import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';

import { createStemParadigm, assembleCase, type StemParadigm } from '../src/morphology/index.ts';

describe('Canonical StemParadigm & assembleCase()', () => {
  const mattiParadigm: StemParadigm = createStemParadigm('Matti', {
    strong: 'Matti',
    weak: 'Mati',
    partitive: 'Mattia',
    illative: 'Mattiin'
  });

  it('assembles the 11 supported grammatical cases accurately for back-vowel nouns', () => {
    assert.equal(assembleCase(mattiParadigm, 'nominative'), 'Matti');
    assert.equal(assembleCase(mattiParadigm, 'genitive'), 'Matin');
    assert.equal(assembleCase(mattiParadigm, 'partitive'), 'Mattia');
    assert.equal(assembleCase(mattiParadigm, 'inessive'), 'Matissa');
    assert.equal(assembleCase(mattiParadigm, 'elative'), 'Matista');
    assert.equal(assembleCase(mattiParadigm, 'illative'), 'Mattiin');
    assert.equal(assembleCase(mattiParadigm, 'adessive'), 'Matilla');
    assert.equal(assembleCase(mattiParadigm, 'ablative'), 'Matilta');
    assert.equal(assembleCase(mattiParadigm, 'allative'), 'Matille');
    assert.equal(assembleCase(mattiParadigm, 'essive'), 'Mattina');
    assert.equal(assembleCase(mattiParadigm, 'translative'), 'Matiksi');
  });

  it('harmonizes suffixes according to front-vowel harmony', () => {
    const vainoParadigm: StemParadigm = createStemParadigm('Väinö', {
      strong: 'Väinö',
      weak: 'Väinö',
      partitive: 'Väinöä',
      illative: 'Väinöön'
    });

    assert.equal(assembleCase(vainoParadigm, 'inessive'), 'Väinössä');
    assert.equal(assembleCase(vainoParadigm, 'elative'), 'Väinöstä');
    assert.equal(assembleCase(vainoParadigm, 'adessive'), 'Väinöllä');
    assert.equal(assembleCase(vainoParadigm, 'ablative'), 'Väinöltä');
    assert.equal(assembleCase(vainoParadigm, 'allative'), 'Väinölle');
    assert.equal(assembleCase(vainoParadigm, 'essive'), 'Väinönä');
  });

  it('resolves contextual local cases based on defaultSpatialCase', () => {
    const helsinki: StemParadigm = createStemParadigm('Helsinki', {
      strong: 'Helsinki',
      weak: 'Helsingi',
      partitive: 'Helsinkiä',
      illative: 'Helsinkiin'
    }, { defaultSpatialCase: 'in' });

    assert.equal(assembleCase(helsinki, 'local'), 'Helsingissä');
    assert.equal(assembleCase(helsinki, 'localFrom'), 'Helsingistä');
    assert.equal(assembleCase(helsinki, 'localTo'), 'Helsinkiin');

    const tampere: StemParadigm = createStemParadigm('Tampere', {
      strong: 'Tampere',
      weak: 'Tamperee',
      partitive: 'Tamperetta',
      illative: 'Tampereeseen'
    }, { defaultSpatialCase: 'on' });

    assert.equal(assembleCase(tampere, 'local'), 'Tampereella');
    assert.equal(assembleCase(tampere, 'localFrom'), 'Tampereelta');
    assert.equal(assembleCase(tampere, 'localTo'), 'Tampereelle');
  });

  it('honors explicit localCase options overriding defaultSpatialCase', () => {
    const tampere: StemParadigm = createStemParadigm('Tampere', {
      strong: 'Tampere',
      weak: 'Tamperee',
      partitive: 'Tamperetta',
      illative: 'Tampereeseen'
    }, { defaultSpatialCase: 'on' });

    assert.equal(assembleCase(tampere, 'local', { localCase: 'in' }), 'Tampereessa');
    assert.equal(assembleCase(tampere, 'localFrom', { localCase: 'in' }), 'Tampereesta');
    assert.equal(assembleCase(tampere, 'localTo', { localCase: 'in' }), 'Tampereeseen');
  });

  it('handles edge and fallback cases safely without throwing', () => {
    // @ts-expect-error - testing invalid paradigm input
    assert.equal(assembleCase(null, 'genitive'), '');
    const emptyParadigm = createStemParadigm('', { strong: '', weak: '', partitive: '', illative: '' });
    assert.equal(assembleCase(emptyParadigm, 'genitive'), '');
    // @ts-expect-error - testing unknown case
    assert.equal(assembleCase(mattiParadigm, 'unknownCase'), 'Matti');
  });
});
