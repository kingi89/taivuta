import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectNameDisambiguation,
  isAmbiguousName,
  getNamePreferenceOptions
} from '../src/preferences/index.ts';

describe('Name Holder Disambiguation Subsystem (taivuta/preferences)', () => {
  describe('Qualitative Consonant Gradation Names', () => {
    it('detects ambiguity for "Satu"', () => {
      const res = detectNameDisambiguation('Satu');
      assert.ok(res);
      assert.equal(res.name, 'Satu');
      assert.equal(res.isAmbiguous, true);
      assert.equal(res.dimensions.length, 1);
      assert.equal(res.dimensions[0]?.key, 'gradation');
      assert.equal(res.dimensions[0]?.title, 'Consonant Gradation');
      assert.equal(res.dimensions[0]?.description, 'Declension with weakened consonants or retaining strong consonants.');
      assert.equal(res.options.length, 2);

      const grad = res.options.find((o) => o.id === 'gradation');
      const noGrad = res.options.find((o) => o.id === 'no-gradation');
      assert.ok(grad && noGrad);
      assert.equal(grad.isDefault, true);
      assert.equal(grad.examples.genitive, 'Sadun');
      assert.equal(grad.examples.allative, 'Sadulle');
      assert.equal(noGrad.examples.genitive, 'Satun');
      assert.equal(noGrad.examples.allative, 'Satulle');
      assert.equal(res.defaultOptionId, 'gradation');
    });

    it('detects ambiguity for "Sampo" and "Reko"', () => {
      assert.equal(isAmbiguousName('Sampo'), true);
      assert.equal(isAmbiguousName('Reko'), true);
      assert.equal(isAmbiguousName('Aatu'), true);
      assert.equal(isAmbiguousName('Taika'), true);
      const sampoOpts = getNamePreferenceOptions('Sampo');
      assert.equal(sampoOpts.length, 2);
      assert.equal(sampoOpts[0]?.examples.genitive, 'Sammon');
      assert.equal(sampoOpts[1]?.examples.genitive, 'Sampon');
    });
  });

  describe('S-Stem vs Vocalic Names', () => {
    it('detects ambiguity for "Lucas" with foreign default', () => {
      const res = detectNameDisambiguation('Lucas');
      assert.ok(res);
      assert.equal(res.dimensions[0]?.key, 's-stem');
      assert.equal(res.dimensions[0]?.title, 'S-Stem vs. Vocalic Stem');
      assert.equal(res.defaultOptionId, 'vocalic');
      const vocalicOpt = res.options.find((o) => o.id === 'vocalic');
      const sStemOpt = res.options.find((o) => o.id === 's-stem');
      assert.ok(vocalicOpt && sStemOpt);
      assert.equal(vocalicOpt.examples.genitive, 'Lucasin');
      assert.equal(sStemOpt.examples.genitive, 'Lucaksen');
      assert.equal(isAmbiguousName('Elias'), true);
      assert.equal(isAmbiguousName('Tuomas'), true);
    });

    it('detects ambiguity for "Niklas" with Finnish s-stem default', () => {
      const res = detectNameDisambiguation('Niklas');
      assert.ok(res);
      assert.equal(res.defaultOptionId, 's-stem');
      const sStemOpt = res.options.find((o) => o.id === 's-stem');
      const vocalicOpt = res.options.find((o) => o.id === 'vocalic');
      assert.ok(sStemOpt && vocalicOpt);
      assert.equal(sStemOpt.examples.genitive, 'Niklaksen');
      assert.equal(vocalicOpt.examples.genitive, 'Niklasin');
    });
  });

  describe('Word-Derived Given Names', () => {
    it('detects ambiguity for "Tuuli"', () => {
      const res = detectNameDisambiguation('Tuuli');
      assert.ok(res);
      assert.equal(res.dimensions[0]?.key, 'vocalic-variant');
      assert.equal(res.defaultOptionId, 'nominative');
      const nomOpt = res.options.find((o) => o.id === 'nominative');
      const inflOpt = res.options.find((o) => o.id === 'inflected');
      assert.ok(nomOpt && inflOpt);
      assert.equal(nomOpt.examples.genitive, 'Tuulin');
      assert.equal(inflOpt.examples.genitive, 'Tuulen');
    });

    it('detects ambiguity for "Meri" and "Lumi"', () => {
      assert.equal(isAmbiguousName('Meri'), true);
      assert.equal(isAmbiguousName('Lumi'), true);
      const lumiOpts = getNamePreferenceOptions('Lumi');
      assert.equal(lumiOpts[0]?.examples.genitive, 'Lumin');
      assert.equal(lumiOpts[1]?.examples.genitive, 'Lumen');
    });
  });

  describe('FULL-UPPERCASE Handles (Acronym vs Word)', () => {
    it('detects ambiguity for "KELA"', () => {
      const res = detectNameDisambiguation('KELA');
      assert.ok(res);
      assert.equal(res.dimensions[0]?.key, 'acronym-colon');
      assert.equal(res.defaultOptionId, 'acronym');
      const acrOpt = res.options.find((o) => o.id === 'acronym');
      const wordOpt = res.options.find((o) => o.id === 'word');
      assert.ok(acrOpt && wordOpt);
      assert.equal(acrOpt.examples.allative, 'KELA:lle');
      assert.equal(wordOpt.examples.allative, 'KELAlle');
    });
  });

  describe('Numeral Handles & Vowel Harmony', () => {
    it('detects ambiguity for handle ending in 7 "Agent007"', () => {
      const res = detectNameDisambiguation('Agent007');
      assert.ok(res);
      assert.equal(res.dimensions[0]?.key, 'vowel-harmony');
      assert.equal(res.defaultOptionId, 'harmony-front');
      const frontOpt = res.options.find((o) => o.id === 'harmony-front');
      const backOpt = res.options.find((o) => o.id === 'harmony-back');
      assert.ok(frontOpt && backOpt);
      assert.equal(frontOpt.examples.allative, 'Agent007:lle');
      assert.equal(backOpt.examples.allative, 'Agent007:lle');
    });
  });

  describe('Multi-Dimensional Ambiguity (Cartesian Combinations)', () => {
    it('combines qualitative gradation and acronym dimension for "SATU"', () => {
      const res = detectNameDisambiguation('SATU');
      assert.ok(res);
      assert.equal(res.dimensions.length, 2);
      assert.deepEqual(
        res.dimensions.map((d) => d.key),
        ['gradation', 'acronym-colon']
      );
      // 2 x 2 = 4 combinations
      assert.equal(res.options.length, 4);
      assert.ok(res.options.some((o) => o.id === 'gradation+acronym'));
      assert.ok(res.options.some((o) => o.id === 'no-gradation+acronym'));
      assert.ok(res.options.some((o) => o.id === 'gradation+word'));
      assert.ok(res.options.some((o) => o.id === 'no-gradation+word'));
    });
  });

  describe('Unambiguous Names & Edge Cases', () => {
    it('returns null / false for unambiguous common names', () => {
      assert.equal(detectNameDisambiguation('Matti'), null);
      assert.equal(isAmbiguousName('Matti'), false);
      assert.deepEqual(getNamePreferenceOptions('Matti'), []);

      assert.equal(isAmbiguousName('Mikko'), false);
      assert.equal(isAmbiguousName('Jari'), false);
      assert.equal(isAmbiguousName('Pekka'), false);
      assert.equal(isAmbiguousName('Seppo'), false);
      assert.equal(isAmbiguousName('Ville'), false);
    });

    it('handles empty, whitespace, and special inputs gracefully', () => {
      assert.equal(detectNameDisambiguation(''), null);
      assert.equal(detectNameDisambiguation('   '), null);
      assert.equal(isAmbiguousName(''), false);
      assert.deepEqual(getNamePreferenceOptions(''), []);
    });
  });
});
