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

    it('detects ambiguity for "Sampo" and "Aatu"', () => {
      assert.equal(isAmbiguousName('Sampo'), true);
      assert.equal(isAmbiguousName('Aatu'), true);
      assert.equal(isAmbiguousName('Into'), true);

      // Known limitation & deliberate design choice:
      // Modern Finnish given names ending in intervocalic single -k- (Aki, Mika, Riku, Reko) resist k-loss
      // (Reko -> Rekon). While word-derived names like "Taika" can historically inflect with k-loss
      // (Taika -> Taian, Kotus type 9 k -> Ø), intervocalic single-k gradation is currently deferred
      // to a future dedicated Kotus type-9 increment. Until then, both produce "Rekon" and "Taikan",
      // so option deduplication marks them unambiguous.
      assert.equal(isAmbiguousName('Reko'), false);
      assert.equal(isAmbiguousName('Taika'), false);

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

    it('treats short monosyllabic names like "Kas" and "Lars" as unambiguous', () => {
      assert.equal(isAmbiguousName('Kas'), false);
      assert.equal(detectNameDisambiguation('Kas'), null);
      assert.equal(isAmbiguousName('Lars'), false);
      assert.equal(isAmbiguousName('Hans'), false);
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

  describe('Numeral Handles & Vowel Harmony for Symbols and Digits', () => {
    it('detects ambiguity for handle ending in 7 "Agent007"', () => {
      const res = detectNameDisambiguation('Agent007');
      assert.ok(res);
      assert.equal(res.dimensions[0]?.key, 'vowel-harmony');
      assert.equal(res.defaultOptionId, 'harmony-front');
      const frontOpt = res.options.find((o) => o.id === 'harmony-front');
      const backOpt = res.options.find((o) => o.id === 'harmony-back');
      assert.ok(frontOpt && backOpt);
      assert.equal(frontOpt.label, 'Agent007:llä, Agent007:ltä');
      assert.equal(backOpt.label, 'Agent007:lla, Agent007:lta');
      assert.equal(frontOpt.examples.adessive, 'Agent007:llä');
      assert.equal(backOpt.examples.adessive, 'Agent007:lla');
      assert.equal(frontOpt.examples.allative, 'Agent007:lle');
      assert.equal(backOpt.examples.allative, 'Agent007:lle');
    });

    it('detects ambiguity for handles ending in any other digit or non-Latin symbol', () => {
      assert.equal(isAmbiguousName('Player1'), true);
      assert.equal(isAmbiguousName('Studio_'), true);
      assert.equal(isAmbiguousName('Team#'), true);
      assert.equal(isAmbiguousName('User42'), true);

      const p1 = detectNameDisambiguation('Player1');
      assert.ok(p1);
      assert.equal(p1.dimensions[0]?.key, 'vowel-harmony');
      assert.equal(p1.options.length, 2);

      const studio = detectNameDisambiguation('Studio_');
      assert.ok(studio);
      assert.equal(studio.dimensions[0]?.key, 'vowel-harmony');
      assert.equal(studio.options.length, 2);
    });
  });

  describe('Multi-Dimensional Ambiguity (Cartesian Combinations & Deduplication)', () => {
    it('combines qualitative gradation and acronym dimension for "SATU", deduplicating redundant options', () => {
      const res = detectNameDisambiguation('SATU');
      assert.ok(res);
      assert.equal(res.dimensions.length, 2);
      assert.deepEqual(
        res.dimensions.map((d) => d.key),
        ['gradation', 'acronym-colon']
      );
      // Redundant colon options collapsed from 4 to 3 distinct linguistic choices
      assert.equal(res.options.length, 3);
      assert.ok(res.options.some((o) => o.examples.genitive === 'SATU:n'));
      assert.ok(res.options.some((o) => o.examples.genitive.toLowerCase() === 'sadun'));
      assert.ok(res.options.some((o) => o.examples.genitive.toLowerCase() === 'satun'));
    });

    it('combines s-stem and acronym dimension for "NIKLAS", pruning redundant colon variations', () => {
      const res = detectNameDisambiguation('NIKLAS');
      assert.ok(res);
      assert.equal(res.dimensions.length, 2);
      assert.deepEqual(
        res.dimensions.map((d) => d.key),
        ['s-stem', 'acronym-colon']
      );
      // When colon: true is active, s-stem does not mutate the stem; duplicates are collapsed to 3 choices
      assert.equal(res.options.length, 3);
      assert.ok(res.options.some((o) => o.examples.genitive === 'NIKLAS:n'));
      assert.ok(res.options.some((o) => o.examples.genitive === 'NIKLAksen'));
      assert.ok(res.options.some((o) => o.examples.genitive === 'NIKLASin'));
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

    it('documents deferred quantitative gradation ambiguity for foreign -tte names like "Janette"', () => {
      // Known limitation & intentional design choice:
      // Foreign names ending in geminate stops like -tte/-tti (e.g. Janette, Bernadette, Juliette)
      // have real-world ambiguity between standard Finnish quantitative gradation (tt -> t, "Janetelle")
      // and foreign spelling preservation without gradation ("Janettelle").
      // Currently, taivuta defaults solely to Finnish quantitative gradation and does not flag
      // them as ambiguous. This is recorded as an intentional limitation to be addressed in a future
      // foreign name morphology increment.
      assert.equal(isAmbiguousName('Janette'), false);
      assert.equal(detectNameDisambiguation('Janette'), null);
      assert.equal(isAmbiguousName('Bernadette'), false);
    });

    it('handles empty, whitespace, and special inputs gracefully', () => {
      assert.equal(detectNameDisambiguation(''), null);
      assert.equal(detectNameDisambiguation('   '), null);
      assert.equal(isAmbiguousName(''), false);
      assert.deepEqual(getNamePreferenceOptions(''), []);
    });
  });
});
