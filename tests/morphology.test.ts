import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getVowelHarmony,
  harmonize,
  weakenConsonants,
  analyzeStem
} from '../src/index.ts';

describe('Vowel Harmony (getVowelHarmony & harmonize)', () => {
  it('identifies back vowel harmony for names with a, o, u', () => {
    assert.equal(getVowelHarmony('Turku'), 'back');
    assert.equal(getVowelHarmony('Vaasa'), 'back');
    assert.equal(getVowelHarmony('Lontoo'), 'back');
    assert.equal(getVowelHarmony('Pariisi'), 'back');
    assert.equal(getVowelHarmony('Jukka'), 'back');
    assert.equal(getVowelHarmony('Markus'), 'back');
  });

  it('identifies front vowel harmony for names with ä, ö, y', () => {
    assert.equal(getVowelHarmony('Jyväskylä'), 'front');
    assert.equal(getVowelHarmony('Päivi'), 'front');
    assert.equal(getVowelHarmony('Ylöjärvi'), 'front');
    assert.equal(getVowelHarmony('Töölö'), 'front');
    assert.equal(getVowelHarmony('Kyllikki'), 'front');
  });

  it('identifies back vowel harmony for names with u, even with e (e.g. Kerttu)', () => {
    assert.equal(getVowelHarmony('Kerttu'), 'back');
  });

  it('defaults to front vowel harmony when only neutral vowels (e, i) are present', () => {
    assert.equal(getVowelHarmony('Helsinki'), 'front');
    assert.equal(getVowelHarmony('Heikki'), 'front');
    assert.equal(getVowelHarmony('Ville'), 'front');
    assert.equal(getVowelHarmony('Eeli'), 'front');
    assert.equal(getVowelHarmony('Meri'), 'front');
  });

  it('resolves compound and hyphenated words by the final component', () => {
    // Front + Back pair: Päivi (front) + Liisa (back) -> back harmony ("Päivi-Liisalla")
    assert.equal(getVowelHarmony('Päivi-Liisa'), 'back');
    // Back + Front pair: Pekka (back) + Yrjö (front) -> front harmony ("Pekka-Yrjöllä")
    assert.equal(getVowelHarmony('Pekka-Yrjö'), 'front');

    // Neutral final components
    assert.equal(getVowelHarmony('Anna-Kirsti'), 'front');
    assert.equal(getVowelHarmony('Ari-Ville'), 'front');

    // Space-separated compound
    assert.equal(getVowelHarmony('Uusi Seelanti'), 'back');
  });

  it('correctly harmonizes case suffixes according to stem harmony', () => {
    assert.equal(harmonize('ssa', 'Turku'), 'ssa');
    assert.equal(harmonize('ssa', 'Helsinki'), 'ssä');
    assert.equal(harmonize('lla', 'Tampere'), 'lla');
    assert.equal(harmonize('lla', 'Kemi'), 'llä');
    assert.equal(harmonize('sta', 'Espoo'), 'sta');
    assert.equal(harmonize('sta', 'Jyväskylä'), 'stä');
    assert.equal(harmonize('lla', 'Päivi-Liisa'), 'lla');
    assert.equal(harmonize('llä', 'Pekka-Yrjö'), 'llä');
  });
});

describe('Consonant Gradation (weakenConsonants)', () => {
  it('applies quantitative gradation (geminate stops shortening)', () => {
    assert.equal(weakenConsonants('Pekka'), 'Peka');
    assert.equal(weakenConsonants('Mikko'), 'Miko');
    assert.equal(weakenConsonants('Jukka'), 'Juka');
    assert.equal(weakenConsonants('Seppo'), 'Sepo');
    assert.equal(weakenConsonants('Matti'), 'Mati');
    assert.equal(weakenConsonants('Arttu'), 'Artu');
    assert.equal(weakenConsonants('Kerttu'), 'Kertu');
    assert.equal(weakenConsonants('Antti'), 'Anti');
  });

  it('preserves geminate stops in trisyllabic names in -eri (e.g. Valtteri, Petteri)', () => {
    // Kotus: Valtteri : Valtterin, Petteri : Petterin (no gradation)
    assert.equal(weakenConsonants('Valtteri'), 'Valtteri');
    assert.equal(weakenConsonants('Petteri'), 'Petteri');
  });

  it('applies qualitative gradation for place names and general stems', () => {
    assert.equal(weakenConsonants('Hanko'), 'Hango');
    assert.equal(weakenConsonants('Sampo'), 'Sammo');
    assert.equal(weakenConsonants('Lieto'), 'Liedo');
    assert.equal(weakenConsonants('Satu'), 'Sadu');
    assert.equal(weakenConsonants('Taito'), 'Taido');
    assert.equal(weakenConsonants('Turku'), 'Turu');
    assert.equal(weakenConsonants('Kulta'), 'Kulla');
    assert.equal(weakenConsonants('Parta'), 'Parra');
    // Kotus Type 9 intervocalic single k-loss (Taika -> Taia) when singleKLoss is explicitly enabled
    assert.equal(weakenConsonants('Taika', { singleKLoss: true }), 'Taia');
    assert.equal(weakenConsonants('Jouka', { singleKLoss: true }), 'Joua');
    assert.equal(weakenConsonants('Malaika', { singleKLoss: true }), 'Malaia');
    // General stems and place names resist single k-loss by default
    assert.equal(weakenConsonants('Taika'), 'Taika');
    assert.equal(weakenConsonants('Jouka'), 'Jouka');
    assert.equal(weakenConsonants('Malaika'), 'Malaika');
    assert.equal(weakenConsonants('Jamaika'), 'Jamaika');
    // Modern given names resisting single k-loss even in qualitative mode
    assert.equal(weakenConsonants('Aki'), 'Aki');
    assert.equal(weakenConsonants('Mika'), 'Mika');
    assert.equal(weakenConsonants('Riku'), 'Riku');
    assert.equal(weakenConsonants('Reko'), 'Reko');
    assert.equal(weakenConsonants('Jouko'), 'Jouko');
  });

  it('restricts consonant gradation to the stem-final syllable and preserves earlier syllables', () => {
    // Trisyllabic stems must not have their antepenultimate or earlier syllables weakened
    assert.equal(weakenConsonants('Tampere'), 'Tampere');
    assert.equal(weakenConsonants('Lempäälä'), 'Lempäälä');
    assert.equal(weakenConsonants('Kangasala'), 'Kangasala');
    assert.equal(weakenConsonants('Helsinki'), 'Helsingi'); // only nk in final syllable weakens
    assert.equal(weakenConsonants('Kankaanpää'), 'Kankaanpää');
  });

  it('resists qualitative gradation when doubleOnly is specified', () => {
    assert.equal(weakenConsonants('Aki', { doubleOnly: true }), 'Aki');
    assert.equal(weakenConsonants('Riku', { doubleOnly: true }), 'Riku');
    assert.equal(weakenConsonants('Niko', { doubleOnly: true }), 'Niko');
    assert.equal(weakenConsonants('Mika', { doubleOnly: true }), 'Mika');
    assert.equal(weakenConsonants('Pekka', { doubleOnly: true }), 'Peka');
  });

  it('handles edge cases gracefully', () => {
    assert.equal(weakenConsonants(''), '');
    assert.equal(weakenConsonants('A'), 'A');
  });
});

describe('Stem Analysis (analyzeStem)', () => {
  it('analyzes Finnish surnames ending in -nen', () => {
    const virtanen = analyzeStem('Virtanen');
    assert.equal(virtanen.stem, 'Virtase');
    assert.equal(virtanen.isNen, true);
    assert.equal(virtanen.linkingVowel, '');
    assert.equal(virtanen.needsApostrophe, false);

    const korhonen = analyzeStem('Korhonen');
    assert.equal(korhonen.stem, 'Korhose');
    assert.equal(korhonen.isNen, true);
  });

  it('analyzes s-stem given names (-as, -äs, -us, -os, -es)', () => {
    const tuomas = analyzeStem('Tuomas');
    assert.equal(tuomas.stem, 'Tuomakse');
    assert.equal(tuomas.isSStem, true);

    const matias = analyzeStem('Matias');
    assert.equal(matias.stem, 'Matiakse');

    const markus = analyzeStem('Markus');
    assert.equal(markus.stem, 'Markukse');

    const johannes = analyzeStem('Johannes');
    assert.equal(johannes.stem, 'Johannekse');
  });

  it('analyzes vowel-ending names directly', () => {
    const ville = analyzeStem('Ville');
    assert.equal(ville.stem, 'Ville');
    assert.equal(ville.linkingVowel, '');

    const matti = analyzeStem('Matti');
    assert.equal(matti.stem, 'Matti');

    const anna = analyzeStem('Anna');
    assert.equal(anna.stem, 'Anna');
  });

  it('analyzes consonant-ending foreign names with linking vowel i', () => {
    const john = analyzeStem('John');
    assert.equal(john.stem, 'John');
    assert.equal(john.linkingVowel, 'i');
    assert.equal(john.needsApostrophe, false);

    const david = analyzeStem('David');
    assert.equal(david.stem, 'David');
    assert.equal(david.linkingVowel, 'i');
  });

  it('flags silent-consonant foreign names for apostrophe insertion', () => {
    const bordeaux = analyzeStem('Bordeaux');
    assert.equal(bordeaux.stem, 'Bordeaux');
    assert.equal(bordeaux.needsApostrophe, true);
    assert.equal(bordeaux.linkingVowel, 'i');
  });

  it('handles empty input safely', () => {
    const empty = analyzeStem('');
    assert.equal(empty.stem, '');
    assert.equal(empty.nominative, '');
  });
});
