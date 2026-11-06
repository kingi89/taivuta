import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inflectPerson, getPersonParadigm } from '../src/person/index.ts';
import { inflect, format } from '../src/index.ts';
import { assembleCase } from '../src/morphology/assembler.ts';
import type { PreferenceOption } from '../src/cases/types.ts';

describe('Name Holder Preference Applying', () => {
  describe('Qualitative Gradation Preferences (e.g. Satu, Sampo)', () => {
    it('applies standard qualitative gradation by default', () => {
      assert.equal(inflectPerson('Satu', 'genitive'), 'Sadun');
      assert.equal(inflectPerson('Satu', 'allative'), 'Sadulle');
      assert.equal(inflectPerson('Sampo', 'genitive'), 'Sammon');
      assert.equal(inflectPerson('Sampo', 'allative'), 'Sammolle');
    });

    it('honors "no-gradation" string preference', () => {
      assert.equal(inflectPerson('Satu', 'genitive', { preference: 'no-gradation' }), 'Satun');
      assert.equal(inflectPerson('Satu', 'allative', { preference: 'no-gradation' }), 'Satulle');
      assert.equal(inflectPerson('Satu', 'inessive', { preference: 'no-gradation' }), 'Satussa');
      assert.equal(inflectPerson('Sampo', 'genitive', { preference: 'no-gradation' }), 'Sampon');
      assert.equal(inflectPerson('Sampo', 'allative', { preference: 'no-gradation' }), 'Sampolle');
    });

    it('honors explicit params object { gradation: false }', () => {
      assert.equal(inflectPerson('Satu', 'genitive', { preference: { gradation: false } }), 'Satun');
      assert.equal(inflectPerson('Satu', 'allative', { preference: { gradation: false } }), 'Satulle');
    });

    it('honors PreferenceOption instance', () => {
      const option: PreferenceOption = {
        id: 'no-gradation',
        label: 'Satun, Satulle',
        examples: { genitive: 'Satun', allative: 'Satulle', illative: 'Satuun' },
        params: { gradation: false }
      };
      assert.equal(inflectPerson('Satu', 'allative', { preference: option }), 'Satulle');
    });

    it('supports getPersonParadigm with preference directly', () => {
      const paradigm = getPersonParadigm('Satu', { preference: 'no-gradation' });
      assert.equal(assembleCase(paradigm, 'genitive'), 'Satun');
      assert.equal(assembleCase(paradigm, 'allative'), 'Satulle');
    });
  });

  describe('S-Stem vs Vocalic Preferences (e.g. Lucas, Niklas)', () => {
    it('applies standard defaults (Niklas s-stem, Lucas vocalic)', () => {
      assert.equal(inflectPerson('Niklas', 'genitive'), 'Niklaksen');
      assert.equal(inflectPerson('Niklas', 'allative'), 'Niklakselle');
      assert.equal(inflectPerson('Lucas', 'genitive'), 'Lucasin');
    });

    it('honors "vocalic" string preference', () => {
      assert.equal(inflectPerson('Niklas', 'genitive', { preference: 'vocalic' }), 'Niklasin');
      assert.equal(inflectPerson('Niklas', 'allative', { preference: 'vocalic' }), 'Niklasille');
      assert.equal(inflectPerson('Lucas', 'genitive', { preference: 'vocalic' }), 'Lucasin');
    });

    it('honors "s-stem" string preference', () => {
      assert.equal(inflectPerson('Lucas', 'genitive', { preference: 's-stem' }), 'Lucaksen');
      assert.equal(inflectPerson('Lucas', 'allative', { preference: 's-stem' }), 'Lucakselle');
      assert.equal(inflectPerson('Niklas', 'genitive', { preference: 's-stem' }), 'Niklaksen');
    });

    it('honors params object { sStem: false }', () => {
      assert.equal(inflectPerson('Niklas', 'genitive', { preference: { sStem: false } }), 'Niklasin');
    });

    it('honors params object { sStem: true }', () => {
      assert.equal(inflectPerson('Lucas', 'genitive', { preference: { sStem: true } }), 'Lucaksen');
    });
  });

  describe('Word-Derived Given Name Preferences (e.g. Tuuli, Meri)', () => {
    it('preserves nominative -i stem for given names by default', () => {
      assert.equal(inflectPerson('Tuuli', 'genitive'), 'Tuulin');
      assert.equal(inflectPerson('Tuuli', 'allative'), 'Tuulille');
      assert.equal(inflectPerson('Meri', 'genitive'), 'Merin');
      assert.equal(inflectPerson('Meri', 'allative'), 'Merille');
      assert.equal(inflectPerson('Pilvi', 'genitive'), 'Pilvin');
    });

    it('honors "inflected" string preference to use nominal stem', () => {
      assert.equal(inflectPerson('Tuuli', 'genitive', { preference: 'inflected' }), 'Tuulen');
      assert.equal(inflectPerson('Tuuli', 'allative', { preference: 'inflected' }), 'Tuulelle');
      assert.equal(inflectPerson('Meri', 'genitive', { preference: 'inflected' }), 'Meren');
      assert.equal(inflectPerson('Meri', 'allative', { preference: 'inflected' }), 'Merelle');
      assert.equal(inflectPerson('Meri', 'partitive', { preference: 'inflected' }), 'Merta');
      assert.equal(inflectPerson('Pilvi', 'genitive', { preference: 'inflected' }), 'Pilven');
      assert.equal(inflectPerson('Lumi', 'genitive', { preference: 'inflected' }), 'Lumen');
      assert.equal(inflectPerson('Lumi', 'partitive', { preference: 'inflected' }), 'Lunta');
    });

    it('honors params object { vocalicStemVariant: "nominative" }', () => {
      assert.equal(inflectPerson('Tuuli', 'genitive', { preference: { vocalicStemVariant: 'nominative' } }), 'Tuulin');
    });

    it('honors "nominative" and "inflected" via unified inflect() and format()', () => {
      assert.equal(inflect('Tuuli', 'allative'), 'Tuulille');
      assert.equal(inflect('Tuuli', 'allative', { preference: 'nominative' }), 'Tuulille');
      assert.equal(inflect('Tuuli', 'allative', { preference: 'inflected' }), 'Tuulelle');

      const msgNom = format('Luo uusi tili {$user:allative}', { user: 'Tuuli' }, {
        preferences: { user: 'nominative' }
      });
      assert.equal(msgNom, 'Luo uusi tili Tuulille');

      const msgInf = format('Luo uusi tili {$user:allative}', { user: 'Tuuli' }, {
        preferences: { user: 'inflected' }
      });
      assert.equal(msgInf, 'Luo uusi tili Tuulelle');
    });
  });

  describe('Acronym & Colon Preferences (e.g. KELA, STT)', () => {
    it('forces colon suffixation when "acronym" preference is set', () => {
      assert.equal(inflectPerson('KELA', 'allative', { preference: 'acronym' }), 'KELA:lle');
      assert.equal(inflectPerson('KELA', 'genitive', { preference: 'acronym' }), 'KELA:n');
      assert.equal(inflectPerson('KELA', 'inessive', { preference: 'acronym' }), 'KELA:ssa');
    });

    it('disables colon when "word" preference is set', () => {
      assert.equal(inflectPerson('KELA', 'allative', { preference: 'word' }), 'KELAlle');
    });
  });

  describe('Numeral Handles & Vowel Harmony (e.g. Agent007)', () => {
    it('honors "harmony-back" preference for numbers like 7 (seiska)', () => {
      assert.equal(inflectPerson('Agent007', 'adessive', { preference: 'harmony-back' }), 'Agent007:lla');
      assert.equal(inflectPerson('Agent007', 'inessive', { preference: 'harmony-back' }), 'Agent007:ssa');
      assert.equal(inflectPerson('Agent007', 'ablative', { preference: 'harmony-back' }), 'Agent007:lta');
    });

    it('honors "harmony-front" preference for numbers like 7 (seitsemän)', () => {
      assert.equal(inflectPerson('Agent007', 'adessive', { preference: 'harmony-front' }), 'Agent007:llä');
      assert.equal(inflectPerson('Agent007', 'inessive', { preference: 'harmony-front' }), 'Agent007:ssä');
      assert.equal(inflectPerson('Agent007', 'ablative', { preference: 'harmony-front' }), 'Agent007:ltä');
    });

    it('honors params object { harmony: "front" }', () => {
      assert.equal(inflectPerson('Agent007', 'adessive', { preference: { harmony: 'front' } }), 'Agent007:llä');
    });
  });

  describe('Multiple, mutually exclusive, and invalid options', () => {
    it('combines multiple independent options in an array', () => {
      assert.equal(inflectPerson('SATU', 'allative', { preference: ['acronym', 'no-gradation'] }), 'SATU:lle');
      assert.equal(inflectPerson('AGENT007', 'adessive', { preference: ['acronym', 'harmony-back'] }), 'AGENT007:lla');
    });

    it('resolves mutually exclusive options via latter-wins precedence', () => {
      assert.equal(inflectPerson('Satu', 'allative', { preference: ['gradation', 'no-gradation'] }), 'Satulle');
      assert.equal(inflectPerson('Satu', 'allative', { preference: ['no-gradation', 'gradation'] }), 'Sadulle');
      assert.equal(inflectPerson('Lucas', 'genitive', { preference: ['s-stem', 'vocalic'] }), 'Lucasin');
      assert.equal(inflectPerson('Lucas', 'genitive', { preference: ['vocalic', 's-stem'] }), 'Lucaksen');
      assert.equal(inflectPerson('Agent007', 'adessive', { preference: ['harmony-front', 'harmony-back'] }), 'Agent007:lla');
    });

    it('handles invalid, unknown, or empty options safely without throwing', () => {
      // Unknown string option safely ignored, falls back to default
      assert.equal(inflectPerson('Satu', 'allative', { preference: 'unknown-option' as never }), 'Sadulle');
      assert.equal(inflectPerson('Satu', 'allative', { preference: [] }), 'Sadulle');
      // Inapplicable preference does not distort standard inflection
      assert.equal(inflectPerson('Matti', 'genitive', { preference: 's-stem' }), 'Matin');
    });
  });
});
