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

      // Modern Finnish given names ending in intervocalic single -k- (Aki, Mika, Riku, Reko, Jouko) resist k-loss
      // and are unambiguous
      assert.equal(isAmbiguousName('Reko'), false);
      assert.equal(isAmbiguousName('Aki'), false);
      assert.equal(isAmbiguousName('Mika'), false);
      assert.equal(isAmbiguousName('Riku'), false);
      assert.equal(isAmbiguousName('Jouko'), false);

      const sampoOpts = getNamePreferenceOptions('Sampo');
      assert.equal(sampoOpts.length, 2);
      assert.equal(sampoOpts[0]?.examples.genitive, 'Sammon');
      assert.equal(sampoOpts[1]?.examples.genitive, 'Sampon');
    });

    it('detects ambiguity for Kotus type 9 word-derived name "Taika"', () => {
      assert.equal(isAmbiguousName('Taika'), true);

      const disambig = detectNameDisambiguation('Taika');
      assert.ok(disambig);
      assert.equal(disambig.defaultOptionId, 'no-gradation');
      assert.equal(disambig.options.length, 2);

      const gradOpt = disambig.options.find((opt) => opt.id === 'gradation');
      const noGradOpt = disambig.options.find((opt) => opt.id === 'no-gradation');
      assert.ok(gradOpt);
      assert.ok(noGradOpt);

      assert.equal(gradOpt.isDefault, false);
      assert.equal(gradOpt.examples.genitive, 'Taian');
      assert.equal(gradOpt.examples.allative, 'Taialle');

      assert.equal(noGradOpt.isDefault, true);
      assert.equal(noGradOpt.examples.genitive, 'Taikan');
      assert.equal(noGradOpt.examples.allative, 'Taikalle');
    });

    it('handles secondary diphthong-ka names ("Jouka", "Malaika", "Aika") with no-gradation default', () => {
      // Deliberate design choice:
      // Names ending in diphthong + ka/kä match Type 9 single-k phonotactics.
      // They safely default to strong grade (Joukan, Malaikan, Aikan) preserving pronunciation,
      // while offering weak grade (Jouan, Malaian, Aian) if the name-holder prefers it.
      for (const name of ['Jouka', 'Malaika', 'Aika']) {
        assert.equal(isAmbiguousName(name), true);
        const disambig = detectNameDisambiguation(name);
        assert.ok(disambig);
        assert.equal(disambig.defaultOptionId, 'no-gradation');
      }

      const malaikaOpts = getNamePreferenceOptions('Malaika');
      assert.equal(malaikaOpts[0]?.examples.genitive, 'Malaian');
      assert.equal(malaikaOpts[1]?.examples.genitive, 'Malaikan');
      assert.equal(malaikaOpts[1]?.isDefault, true);

      const joukaOpts = getNamePreferenceOptions('Jouka');
      assert.equal(joukaOpts[0]?.examples.genitive, 'Jouan');
      assert.equal(joukaOpts[1]?.examples.genitive, 'Joukan');
      assert.equal(joukaOpts[1]?.isDefault, true);
    });

    it('documents known limitation: Marko false-positive qualitative gradation [BUG-002]', () => {
      // Intentional limitation (BUG-002, scheduled for v0.3.0):
      // Marko defaults to 'Markon' in inflectPerson(), but detectNameDisambiguation()
      // currently matches the [rl]k qualitative gradation regex, defaulting to 'gradation' (*Maron).
      assert.equal(isAmbiguousName('Marko'), true);
      const res = detectNameDisambiguation('Marko');
      assert.ok(res);
      assert.equal(res.defaultOptionId, 'gradation');
      const gradOpt = res.options.find((opt) => opt.id === 'gradation');
      const noGradOpt = res.options.find((opt) => opt.id === 'no-gradation');
      assert.ok(gradOpt && noGradOpt);
      assert.equal(gradOpt.examples.genitive, 'Maron');
      assert.equal(noGradOpt.examples.genitive, 'Markon');
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

    it('detects quantitative gradation ambiguity for foreign feminine names in -ette, -otte, and -itte', () => {
      // Kotus: Foreign feminine names ending in -ette, -otte, or -itte (e.g. Janette, Charlotte, Brigitte)
      // alternate between standard Finnish quantitative gradation (Janetelle) and foreign spelling preservation (Janettelle).
      const testNames = [
        // -ette
        'Janette',
        'Bernadette',
        'Juliette',
        'Annette',
        'Mette',
        // -otte
        'Charlotte',
        'Lotte',
        'Liselotte',
        // -itte
        'Brigitte',
        'Birgitte',
        'Gitte'
      ];

      for (const name of testNames) {
        assert.equal(isAmbiguousName(name), true, `${name} should be recognized as ambiguous`);
        const disambig = detectNameDisambiguation(name);
        assert.ok(disambig);
        assert.equal(disambig.defaultOptionId, 'gradation');
        assert.equal(disambig.options.length, 2);
      }

      // Detailed check for -ette (Janette)
      const janetteOpts = getNamePreferenceOptions('Janette');
      assert.equal(janetteOpts[0]?.id, 'gradation');
      assert.equal(janetteOpts[0]?.isDefault, true);
      assert.equal(janetteOpts[0]?.examples.allative, 'Janetelle');
      assert.equal(janetteOpts[0]?.examples.genitive, 'Janeten');
      assert.equal(janetteOpts[1]?.id, 'no-gradation');
      assert.equal(janetteOpts[1]?.isDefault, false);
      assert.equal(janetteOpts[1]?.examples.allative, 'Janettelle');
      assert.equal(janetteOpts[1]?.examples.genitive, 'Janetten');

      // Detailed check for -otte (Charlotte, Lotte)
      const charlotteOpts = getNamePreferenceOptions('Charlotte');
      assert.equal(charlotteOpts[0]?.examples.allative, 'Charlotelle');
      assert.equal(charlotteOpts[1]?.examples.allative, 'Charlottelle');

      const lotteOpts = getNamePreferenceOptions('Lotte');
      assert.equal(lotteOpts[0]?.examples.allative, 'Lotelle');
      assert.equal(lotteOpts[1]?.examples.allative, 'Lottelle');

      // Detailed check for -itte (Brigitte, Gitte)
      const brigitteOpts = getNamePreferenceOptions('Brigitte');
      assert.equal(brigitteOpts[0]?.examples.allative, 'Brigitelle');
      assert.equal(brigitteOpts[1]?.examples.allative, 'Brigittelle');

      const gitteOpts = getNamePreferenceOptions('Gitte');
      assert.equal(gitteOpts[0]?.examples.allative, 'Gitelle');
      assert.equal(gitteOpts[1]?.examples.allative, 'Gittelle');

      // Native Finnish names ending in -tti or short names like Atte remain unambiguous
      assert.equal(isAmbiguousName('Matti'), false);
      assert.equal(isAmbiguousName('Antti'), false);
      assert.equal(isAmbiguousName('Atte'), false);
    });

    it('handles empty, whitespace, and special inputs gracefully', () => {
      assert.equal(detectNameDisambiguation(''), null);
      assert.equal(detectNameDisambiguation('   '), null);
      assert.equal(isAmbiguousName(''), false);
      assert.deepEqual(getNamePreferenceOptions(''), []);
    });
  });
});
