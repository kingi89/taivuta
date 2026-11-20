import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import {
  inflect,
  inflectPerson,
  inflectPlace,
  detectLocalCase,
  detectEntityRole,
  format,
  t,
  createTemplateEngine,
  assembleCase,
  createStemParadigm,
  analyzeStem,
  weakenConsonants,
  getVowelHarmony,
  harmonize,
  isBackSpokenLetter
} from '../src/index.ts';
import {
  matchNatureNoun,
  inflectNatureNounSurname,
  decomposeCompound,
  needsColon,
  inflectColonWord
} from '../src/morphology/index.ts';
import { applyHarmony } from '../src/morphology/vowels.ts';
import { getPersonParadigm, resolvePersonPreference } from '../src/person/index.ts';
import { getPlaceParadigm } from '../src/place/stem-places.ts';
import {
  detectNameDisambiguation,
  isAmbiguousName,
  getNamePreferenceOptions
} from '../src/preferences/index.ts';

function measureMinMs(fn: () => void, samples = 3): number {
  fn();
  let minMs = Number.POSITIVE_INFINITY;
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    fn();
    minMs = Math.min(minMs, performance.now() - start);
  }
  return minMs;
}

describe('Security & Consumer Trust Invariants', () => {
  it('blocks Object.prototype collisions and non-case metadata property leaks', () => {
    const prototypeKeys = ['toString', 'valueOf', 'constructor', '__proto__', 'hasOwnProperty'];
    const paradigm = createStemParadigm('Matti', {
      strong: 'Matti',
      weak: 'Mati',
      partitive: 'Mattia',
      illative: 'Mattiin'
    });

    for (const key of prototypeKeys) {
      assert.equal(inflect('Matti', key as never), 'Matti');
      assert.equal(inflectPerson('Matti', key as never), 'Matti');
      assert.equal(inflectPlace('Helsinki', key as never), 'Helsinki');
      assert.equal(inflectPlace('Tampere', key as never), 'Tampere');
      assert.equal(assembleCase(paradigm, key as never), 'Matti');
      assert.equal(inflectColonWord('HJK', key as never), 'HJK');
      assert.equal(inflectPerson('Satu', 'allative', { preference: key as never }), 'Sadulle');
      assert.deepEqual(resolvePersonPreference({ preference: key as never }), { preference: key as never });
    }

    // Non-case own property on irregular place overrides and state compound lookup safety
    assert.equal(inflectPlace('Tampere', 'localCaseType' as never), 'Tampere');
    assert.equal(inflectPlace('Alankomaat', 'toString' as never), 'Alankomaat');
    assert.equal(inflectPlace('Yhdysvallat', 'toString' as never), 'Yhdysvallat');
    assert.equal(inflectPlace('Filippiinit', 'toString' as never), 'Filippiinit');
    assert.equal(inflectPlace('Yhdistynyt kuningaskunta', 'toString' as never), 'Yhdistynyt kuningaskunta');
    assert.equal(inflectPlace('Yhdistyneet arabiemiirikunnat', 'toString' as never), 'Yhdistyneet arabiemiirikunnat');
    assert.equal(inflectPlace('Dominikaaninen tasavalta', 'toString' as never), 'Dominikaaninen tasavalta');

    assert.equal(decomposeCompound('Uusi-Seelanti', 'toString' as never)?.prefix, 'Uusi-');
    assert.equal(
      format('{$toString:genitive}{$constructor:genitive}{$__proto__:genitive}{$valueOf}', {}),
      ''
    );
    assert.equal(
      format('{$user:allative}', { user: 'Satu' }, { preferences: Object.create(null) as never }),
      'Sadulle'
    );
    assert.equal(format('{$toString:genitive}', { toString: 'Matti' } as never), 'Matin');
  });

  it('handles malformed JS runtime inputs gracefully without throwing', () => {
    const boxedName = new String('Matti');
    const invalidInputs: readonly unknown[] = [null, undefined, 123, {}, Object.create(null), boxedName];

    for (const bad of invalidInputs) {
      assert.equal(inflect(bad as never, 'genitive'), '');
      assert.equal(inflectPerson(bad as never, 'genitive'), '');
      assert.equal(inflectPlace(bad as never, 'local'), '');
      assert.equal(detectLocalCase(bad as never), 'in');
      assert.equal(detectEntityRole(bad as never), 'person');
      assert.equal(detectNameDisambiguation(bad as never), null);
      assert.equal(isAmbiguousName(bad as never), false);
      assert.deepEqual(getNamePreferenceOptions(bad as never), []);
      assert.equal(weakenConsonants(bad as never), '');
      assert.equal(getVowelHarmony(bad as never), 'front');
      assert.equal(applyHarmony(bad as never, 'front'), '');
      assert.equal(harmonize(bad as never, 'Matti'), '');
      assert.equal(isBackSpokenLetter(bad as never), false);
      assert.equal(needsColon(bad as never), false);
      assert.equal(inflectColonWord(bad as never, 'genitive'), '');
      assert.equal(analyzeStem(bad as never).stem, '');
      assert.equal(matchNatureNoun(bad as never), null);
      assert.equal(inflectNatureNounSurname(bad as never, 'genitive', {} as never), '');
      assert.equal(decomposeCompound(bad as never), null);
      assert.equal(getPersonParadigm(bad as never).nominative, '');
      assert.equal(getPlaceParadigm(bad as never).nominative, '');
    }

    assert.equal(harmonize('ssa', null as never), 'ssa');
    assert.equal(inflect('Matti', 'genitive', null as never), 'Matin');
    assert.equal(inflect('Matti', 'genitive', { preference: { params: null } } as never), 'Matin');
    assert.equal(inflect('Matti', 'genitive', { localCase: 'invalid' } as never), 'Matin');
    assert.equal(inflectPlace('Helsinki', 'local', null as never), 'Helsingissä');
    assert.equal(inflectPlace('Helsinki', 'local', { localCase: 'invalid' } as never), 'Helsingissä');
    assert.equal(inflectPerson('Satu', 'allative', null as never), 'Sadulle');
    assert.equal(inflectPerson('Satu', 'allative', { preference: { params: null } } as never), 'Sadulle');
    assert.deepEqual(resolvePersonPreference(null as never), {});
    assert.equal(inflectColonWord('HJK', 'inessive', null as never), 'HJK:ssa');
    assert.equal(inflectColonWord('HJK', 'inessive', { harmony: 'invalid' } as never), 'HJK:ssa');
    assert.equal(weakenConsonants('Matti', null as never), 'Mati');
    assert.equal(assembleCase(null as never, 'genitive'), '');
    assert.equal(assembleCase({} as never, 'genitive'), '');
    assert.equal(assembleCase(createStemParadigm('Matti', null as never, null as never), 'genitive'), 'Mattin');
    assert.equal(inflectNatureNounSurname('Xyz', 'genitive', null as never), 'Xyz');

    assert.equal(format(null as never, null as never, null as never), '');
    assert.equal(format('{$a:genitive}', null as never, null as never), '');
    assert.equal(t(null as never), '');
    assert.equal(t([null, ''] as never, 'ignored'), 'ignored');

    // Intentional numeric interpolation remains supported in template engines
    assert.equal(format('{$n:genitive}', { n: 7 }), '7:n');
    assert.equal(t`Numero ${7}`, 'Numero 7');
    const customEngine = createTemplateEngine(inflectPerson);
    assert.equal(customEngine.format(null as never, null as never), '');
  });

  it('preserves raw characters without escaping/unescaping and keeps templates single-pass', () => {
    assert.equal(inflect('<a>', 'inessive'), '<a>:ssa');
    assert.equal(inflect('&lt;a&gt;', 'inessive'), '&lt;a&gt;:ssa');
    assert.equal(inflect('<script>alert(1)</script>', 'genitive'), '<script>alert(1)</script>:n');
    assert.equal(inflect(':', 'inessive'), '::ssä');
    assert.equal(inflect(':ssa', 'inessive'), ':ssassa');
    assert.equal(
      format('{$a}', { a: '{$b:genitive}', b: 'Matti' }),
      '{$b:genitive}'
    );
  });

  it('uses Kotus typographic apostrophe (U+2019) and never synthesizes quote or tag metacharacters from clean inputs', () => {
    const nonNominativeCases = [
      'genitive',
      'partitive',
      'inessive',
      'elative',
      'illative',
      'adessive',
      'ablative',
      'allative',
      'essive',
      'translative'
    ] as const;
    const silentFinalNames = [
      'Kaj',
      'Maj',
      'Dumas',
      'Camus',
      'Descartes',
      'Monet',
      'Manet',
      'Degas',
      'Renoir',
      'Bordeaux',
      'Margaux',
      'Choux'
    ] as const;

    for (const name of silentFinalNames) {
      for (const targetCase of nonNominativeCases) {
        const unified = inflect(name, targetCase);
        const person = inflectPerson(name, targetCase);
        for (const result of [unified, person]) {
          assert.ok(result.includes('\u2019'), `Expected U+2019 in ${name}:${targetCase} -> ${result}`);
          assert.ok(!result.includes('\u0027'), `Unexpected ASCII apostrophe in ${name}:${targetCase} -> ${result}`);
        }
      }
    }

    assert.equal(format("<button title='{$name:genitive}'>", { name: 'Kaj' }), "<button title='Kaj\u2019n'>");

    const allCases = ['nominative', ...nonNominativeCases, 'local', 'localFrom', 'localTo'] as const;
    const cleanInputs = [
      'Matti',
      'Virtanen',
      'Tuomas',
      'Ilmatar',
      'Niemi',
      'John',
      'Kaj',
      'Bordeaux',
      'Helsinki',
      'Tampere',
      'Yhdysvallat',
      'HJK'
    ] as const;
    const forbiddenMetachars = /['"<>&\\]/;

    for (const input of cleanInputs) {
      for (const targetCase of allCases) {
        const result = inflect(input, targetCase);
        assert.ok(
          !forbiddenMetachars.test(result),
          `Synthesized metacharacter in ${input}:${targetCase} -> ${result}`
        );
      }
    }
  });

  it('trims proper-noun whitespace consistently while preserving outer template whitespace', () => {
    assert.equal(inflect('  Helsinki  ', 'local'), 'Helsingissä');
    assert.equal(inflect('  Matti  ', 'nominative'), 'Matti');
    assert.equal(inflect('   ', 'genitive'), '');
    assert.equal(inflectPlace('  Helsinki  ', 'local'), 'Helsingissä');
    assert.equal(inflectPlace('   ', 'local'), '');
    assert.equal(detectLocalCase('  Tampere  '), 'on');
    assert.equal(detectLocalCase('   '), 'in');
    assert.equal(detectEntityRole('  Tampere  '), 'place');
    assert.equal(inflectColonWord('  Agent007  ', 'genitive'), 'Agent007:n');
    assert.equal(detectNameDisambiguation('  Satu  ')?.name, 'Satu');
    assert.equal(weakenConsonants('  Matti  '), 'Mati');
    assert.equal(decomposeCompound('  Uusi-Seelanti  ', 'inessive')?.prefix, 'Uudessa-');
    assert.equal(format('  Hei {$user:allative}!  ', { user: '  Matti  ' }), '  Hei Matille!  ');
  });

  it('bounds recursion, avoids ReDoS, and enforces the 1,000,000-char proper-noun ceiling', () => {
    const shortPrefixes = 'Uusi-'.repeat(1_000) + 'Seelanti';
    const repeatedPrefixes = 'Uusi-'.repeat(20_000) + 'Seelanti';
    assert.equal(detectLocalCase(repeatedPrefixes), 'in');
    assert.equal(detectLocalCase('Uusi-'.repeat(20_000) + 'Tampere'), 'on');
    assert.equal(detectLocalCase('Uusi-'), 'in');
    assert.equal(inflectPlace('Uusi-', 'inessive'), 'Uusi-:ssä');
    const inflectedPrefixes = inflectPlace(repeatedPrefixes, 'inessive');
    assert.ok(inflectedPrefixes.startsWith('Uudessa-Uudessa-'));
    assert.ok(inflectedPrefixes.endsWith('Uudessa-Seelannissa'));
    const baselinePrefixMs = measureMinMs(() => {
      for (let i = 0; i < 20; i++) {
        detectLocalCase(shortPrefixes);
        inflectPlace(shortPrefixes, 'inessive');
      }
    });
    const scaledPrefixMs = measureMinMs(() => {
      detectLocalCase(repeatedPrefixes);
      inflectPlace(repeatedPrefixes, 'inessive');
    });
    assert.ok(
      scaledPrefixMs <= Math.max(baselinePrefixMs, 1) * 10,
      `Expected linear prefix scaling (scaled=${scaledPrefixMs.toFixed(2)}ms, baseline=${baselinePrefixMs.toFixed(2)}ms)`
    );

    const shortDots = '.'.repeat(2_000) + 'a';
    const dotRedos = '.'.repeat(100_000) + 'a';
    assert.equal(needsColon(dotRedos), true);
    assert.equal(getVowelHarmony(dotRedos), 'back');
    assert.equal(inflectColonWord(dotRedos, 'genitive'), `${dotRedos}:n`);
    const baselineDotsMs = measureMinMs(() => {
      for (let i = 0; i < 50; i++) {
        needsColon(shortDots);
        getVowelHarmony(shortDots);
        inflectColonWord(shortDots, 'genitive');
      }
    });
    const scaledDotsMs = measureMinMs(() => {
      needsColon(dotRedos);
      getVowelHarmony(dotRedos);
      inflectColonWord(dotRedos, 'genitive');
    });
    assert.ok(
      scaledDotsMs <= Math.max(baselineDotsMs, 1) * 15,
      `Expected linear dot-stripping scaling (scaled=${scaledDotsMs.toFixed(2)}ms, baseline=${baselineDotsMs.toFixed(2)}ms)`
    );

    const oneMillion = 'a'.repeat(1_000_000);
    assert.equal(inflect(oneMillion, 'genitive'), `${oneMillion}n`);

    const overLimit = 'a'.repeat(1_000_001);
    assert.equal(inflect(overLimit, 'genitive'), overLimit);
    assert.equal(inflectPerson(overLimit, 'genitive'), overLimit);
    assert.equal(inflectPlace(overLimit, 'local'), overLimit);
    assert.equal(inflectColonWord(overLimit, 'genitive'), overLimit);
    assert.equal(weakenConsonants(overLimit), overLimit);
    assert.equal(harmonize('ssa', overLimit), 'ssa');
    assert.equal(applyHarmony(overLimit, 'front'), overLimit);
    assert.equal(detectLocalCase(overLimit), 'in');
    assert.equal(detectEntityRole(overLimit), 'person');
    assert.equal(detectNameDisambiguation(overLimit), null);
    assert.equal(needsColon(overLimit), false);
    assert.equal(isBackSpokenLetter(overLimit), false);
    assert.equal(getVowelHarmony(overLimit), 'front');

    // Note: [OPT-004] tracks future zero-allocation splitting for very long multi-token inputs.
    const longMultiToken = 'a '.repeat(25_000) + 'Matti';
    assert.ok(inflectPerson(longMultiToken, 'genitive').endsWith('Matin'));

    const longTemplate = 'x'.repeat(1_000_050) + '{$user:genitive}';
    const formattedLong = format(longTemplate, { user: 'Matti' });
    assert.equal(formattedLong.length, 1_000_055);
    assert.ok(formattedLong.endsWith('Matin'));
  });
});
