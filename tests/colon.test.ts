import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inflect, inflectPerson, inflectPlace, isBackSpokenLetter } from '../src/index.ts';
import { needsColon, inflectColonWord } from '../src/morphology/colon.ts';

describe('needsColon() Edge Cases & Identification', () => {
  it('identifies single vowel and consonant letters as requiring a colon', () => {
    assert.equal(needsColon('A'), true);
    assert.equal(needsColon('E'), true);
    assert.equal(needsColon('I'), true);
    assert.equal(needsColon('O'), true);
    assert.equal(needsColon('U'), true);
    assert.equal(needsColon('Y'), true);
    assert.equal(needsColon('Å'), true);
    assert.equal(needsColon('Ä'), true);
    assert.equal(needsColon('Ö'), true);
    assert.equal(needsColon('X'), true);
    assert.equal(needsColon('x'), true);
    assert.equal(needsColon('e'), true);
    assert.equal(needsColon('Á'), true);
    assert.equal(needsColon('Ø'), true);
  });

  it('identifies arbitrary strings ending in an isolated letter as requiring a colon', () => {
    assert.equal(needsColon('foo123x'), true);
    assert.equal(needsColon('foo123Á'), true);
    assert.equal(needsColon('bar___y'), true);
    assert.equal(needsColon('3D'), true);
  });

  it('identifies strings ending in a single letter + period as requiring a colon', () => {
    assert.equal(needsColon('P.'), true);
    assert.equal(needsColon('E.'), true);
    assert.equal(needsColon('abc!xy$z.'), true);
  });

  it('identifies vowel-less acronyms and non-Latin endings as requiring a colon', () => {
    assert.equal(needsColon('HJK'), true);
    assert.equal(needsColon('VR'), true);
    assert.equal(needsColon('Koski Tl'), true);
    assert.equal(needsColon('Agent007'), true);
    assert.equal(needsColon('Studio_'), true);
    assert.equal(needsColon('...'), true);
    assert.equal(needsColon('.'), true);
  });

  it('returns false for regular names, words, and empty inputs', () => {
    assert.equal(needsColon('Matti'), false);
    assert.equal(needsColon('Virtanen'), false);
    assert.equal(needsColon('Anne'), false);
    assert.equal(needsColon('Taika'), false);
    assert.equal(needsColon(''), false);
    assert.equal(needsColon('   '), false);
  });
});

describe('Single Latin Letter Inflection (TASK-003)', () => {
  it('inflects single consonant letters with double-vowel names (-ää/-ään)', () => {
    // Spoken: "äffä", "ällä", "ämmä", "ännä", "ärrä", "ässä", "äksä"
    assert.equal(inflectPerson('X', 'illative'), 'X:ään');
    assert.equal(inflectPerson('X', 'partitive'), 'X:ää');
    assert.equal(inflectPerson('X', 'inessive'), 'X:ssä');
    assert.equal(inflectPerson('X', 'genitive'), 'X:n');

    assert.equal(inflectPerson('F', 'illative'), 'F:ään');
    assert.equal(inflectPerson('F', 'partitive'), 'F:ää');
    assert.equal(inflectPerson('L', 'illative'), 'L:ään');
    assert.equal(inflectPerson('M', 'illative'), 'M:ään');
    assert.equal(inflectPerson('N', 'illative'), 'N:ään');
    assert.equal(inflectPerson('R', 'illative'), 'R:ään');
    assert.equal(inflectPerson('S', 'illative'), 'S:ään');
    assert.equal(inflectPerson('Š', 'illative'), 'Š:ään');
  });

  it('inflects single letters with spoken names in -ee (-tä/-hen)', () => {
    // Spoken: "bee", "see", "dee", "ee", "gee", "pee", "tee", "vee", "kaksoisvee"
    assert.equal(inflectPerson('E', 'illative'), 'E:hen');
    assert.equal(inflectPerson('E', 'partitive'), 'E:tä');
    assert.equal(inflectPerson('E', 'inessive'), 'E:ssä');
    assert.equal(inflectPerson('E', 'genitive'), 'E:n');

    assert.equal(inflectPerson('B', 'illative'), 'B:hen');
    assert.equal(inflectPerson('B', 'partitive'), 'B:tä');
    assert.equal(inflectPerson('C', 'illative'), 'C:hen');
    assert.equal(inflectPerson('D', 'illative'), 'D:hen');
    assert.equal(inflectPerson('G', 'illative'), 'G:hen');
    assert.equal(inflectPerson('P', 'illative'), 'P:hen');
    assert.equal(inflectPerson('T', 'illative'), 'T:hen');
    assert.equal(inflectPerson('V', 'illative'), 'V:hen');
    assert.equal(inflectPerson('W', 'illative'), 'W:hen');
  });

  it('inflects single letters with back vowel names in -oo, -uu, -aa', () => {
    // Spoken: "aa", "hoo", "koo", "oo", "kuu", "uu", "ruotsalainen oo"
    assert.equal(inflectPerson('A', 'illative'), 'A:han');
    assert.equal(inflectPerson('A', 'partitive'), 'A:ta');
    assert.equal(inflectPerson('A', 'inessive'), 'A:ssa');

    assert.equal(inflectPerson('H', 'illative'), 'H:hon');
    assert.equal(inflectPerson('H', 'partitive'), 'H:ta');
    assert.equal(inflectPerson('H', 'inessive'), 'H:ssa');

    assert.equal(inflectPerson('K', 'illative'), 'K:hon');
    assert.equal(inflectPerson('K', 'partitive'), 'K:ta');

    assert.equal(inflectPerson('O', 'illative'), 'O:hon');
    assert.equal(inflectPerson('O', 'partitive'), 'O:ta');

    assert.equal(inflectPerson('Q', 'illative'), 'Q:hun');
    assert.equal(inflectPerson('Q', 'partitive'), 'Q:ta');

    assert.equal(inflectPerson('U', 'illative'), 'U:hun');
    assert.equal(inflectPerson('U', 'partitive'), 'U:ta');

    assert.equal(inflectPerson('Å', 'illative'), 'Å:hon');
    assert.equal(inflectPerson('Å', 'partitive'), 'Å:ta');
  });

  it('inflects single letters with front vowels (-ii, -yy, -ää, -öö)', () => {
    // Spoken: "ii", "jii", "yy", "ää", "öö"
    assert.equal(inflectPerson('I', 'illative'), 'I:hin');
    assert.equal(inflectPerson('I', 'partitive'), 'I:tä');

    assert.equal(inflectPerson('J', 'illative'), 'J:hin');
    assert.equal(inflectPerson('J', 'partitive'), 'J:tä');

    assert.equal(inflectPerson('Y', 'illative'), 'Y:hyn');
    assert.equal(inflectPerson('Y', 'partitive'), 'Y:tä');

    assert.equal(inflectPerson('Ä', 'illative'), 'Ä:hän');
    assert.equal(inflectPerson('Ä', 'partitive'), 'Ä:tä');

    assert.equal(inflectPerson('Ö', 'illative'), 'Ö:hön');
    assert.equal(inflectPerson('Ö', 'partitive'), 'Ö:tä');
  });

  it('inflects foreign Latin letters with diacritics (Á, Ø)', () => {
    assert.equal(inflectPerson('Á', 'illative'), 'Á:han');
    assert.equal(inflectPerson('Á', 'partitive'), 'Á:ta');
    assert.equal(inflectPerson('Á', 'inessive'), 'Á:ssa');

    assert.equal(inflectPerson('Ø', 'illative'), 'Ø:hön');
    assert.equal(inflectPerson('Ø', 'partitive'), 'Ø:tä');
    assert.equal(inflectPerson('Ø', 'inessive'), 'Ø:ssä');

    assert.equal(isBackSpokenLetter('Á'), true);
    assert.equal(isBackSpokenLetter('A'), true);
    assert.equal(isBackSpokenLetter('E'), false);
  });

  it('inflects Z and Ž with back harmony tseta-phonology (-aa/-aan)', () => {
    assert.equal(inflectPerson('Z', 'illative'), 'Z:aan');
    assert.equal(inflectPerson('Z', 'partitive'), 'Z:aa');
    assert.equal(inflectPerson('Z', 'inessive'), 'Z:ssa');
    assert.equal(inflectPerson('Ž', 'illative'), 'Ž:aan');
  });

  it('inflects lowercase letters accurately with lowercase endings', () => {
    assert.equal(inflectPerson('x', 'illative'), 'x:ään');
    assert.equal(inflectPerson('x', 'partitive'), 'x:ää');
    assert.equal(inflectPerson('e', 'illative'), 'e:hen');
    assert.equal(inflectPerson('a', 'illative'), 'a:han');
  });

  it('assembles all 11 grammatical cases accurately for a single letter', () => {
    assert.equal(inflectPerson('X', 'nominative'), 'X');
    assert.equal(inflectPerson('X', 'genitive'), 'X:n');
    assert.equal(inflectPerson('X', 'partitive'), 'X:ää');
    assert.equal(inflectPerson('X', 'illative'), 'X:ään');
    assert.equal(inflectPerson('X', 'inessive'), 'X:ssä');
    assert.equal(inflectPerson('X', 'elative'), 'X:stä');
    assert.equal(inflectPerson('X', 'allative'), 'X:lle');
    assert.equal(inflectPerson('X', 'adessive'), 'X:llä');
    assert.equal(inflectPerson('X', 'ablative'), 'X:ltä');
    assert.equal(inflectPerson('X', 'essive'), 'X:nä');
    assert.equal(inflectPerson('X', 'translative'), 'X:ksi');
  });
});

describe('Arbitrary Strings, Periods & Acronym Inflection', () => {
  it('inflects arbitrary strings ending in an isolated letter based on that letter', () => {
    assert.equal(inflectPerson('foo123x', 'illative'), 'foo123x:ään');
    assert.equal(inflectPerson('foo123x', 'partitive'), 'foo123x:ää');
    assert.equal(inflectPerson('foo123x', 'inessive'), 'foo123x:ssä');

    assert.equal(inflectPerson('bar___y', 'illative'), 'bar___y:hyn');
    assert.equal(inflectPerson('bar___y', 'partitive'), 'bar___y:tä');
    assert.equal(inflectPerson('bar___y', 'inessive'), 'bar___y:ssä');

    assert.equal(inflectPerson('3D', 'illative'), '3D:hen');
    assert.equal(inflectPerson('3D', 'partitive'), '3D:tä');
    assert.equal(inflectPerson('3D', 'inessive'), '3D:ssä');
  });

  it('places colon after trailing periods on initials and strings', () => {
    assert.equal(inflectPerson('P.', 'allative'), 'P.:lle');
    assert.equal(inflectPerson('P.', 'genitive'), 'P.:n');
    assert.equal(inflectPerson('P.', 'illative'), 'P.:hen');
    assert.equal(inflectPerson('E.', 'illative'), 'E.:hen');

    assert.equal(inflectPerson('abc!xy$z.', 'illative'), 'abc!xy$z.:aan');
    assert.equal(inflectPerson('abc!xy$z.', 'partitive'), 'abc!xy$z.:aa');
    assert.equal(inflectPerson('abc!xy$z.', 'inessive'), 'abc!xy$z.:ssa');
  });

  it('inflects multi-letter acronyms based on the final letter phonology', () => {
    assert.equal(inflectPlace('HJK', 'illative'), 'HJK:hon');
    assert.equal(inflectPlace('HJK', 'partitive'), 'HJK:ta');
    assert.equal(inflectPlace('HJK', 'local'), 'HJK:ssa');

    assert.equal(inflectPlace('VR', 'illative'), 'VR:ään');
    assert.equal(inflectPlace('VR', 'partitive'), 'VR:ää');
    assert.equal(inflectPlace('VR', 'adessive'), 'VR:llä');

    assert.equal(inflectPerson('STT', 'illative'), 'STT:hen');
    assert.equal(inflectPerson('STT', 'partitive'), 'STT:tä');

    assert.equal(inflectPerson('THL', 'illative'), 'THL:ään');
    assert.equal(inflectPerson('THL', 'partitive'), 'THL:ää');
  });

  it('honors explicit harmony overrides on colon words', () => {
    assert.equal(inflectPerson('Z', 'illative', { harmony: 'front' }), 'Z:ään');
    assert.equal(inflectPerson('Z', 'partitive', { harmony: 'front' }), 'Z:ää');
    assert.equal(inflectPerson('X', 'illative', { harmony: 'back' }), 'X:aan');
    assert.equal(inflectPerson('X', 'partitive', { harmony: 'back' }), 'X:aa');
  });

  it('works via unified inflect() entry point', () => {
    assert.equal(inflect('X', 'illative'), 'X:ään');
    assert.equal(inflect('E', 'illative'), 'E:hen');
    assert.equal(inflect('H', 'illative'), 'H:hon');
    assert.equal(inflect('foo123x', 'inessive'), 'foo123x:ssä');
  });

  it('handles inflectColonWord directly with edge case arguments', () => {
    assert.equal(inflectColonWord('X', 'nominative'), 'X');
  });
});
