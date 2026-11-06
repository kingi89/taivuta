/**
 * Unit and integration tests for template formatting and unified inflection API.
 *
 * @packageDocumentation
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { format, t, createTemplateEngine } from '../src/index.ts';
import { inflect, detectEntityRole } from '../src/cases/inflect.ts';
import { inflectPerson } from '../src/person/index.ts';

describe('Unified inflect() Function', () => {
  it('inflects person names accurately with explicit or auto role', () => {
    assert.equal(inflect('Matti', 'genitive', { role: 'person' }), 'Matin');
    assert.equal(inflect('Virtanen', 'partitive', { role: 'person' }), 'Virtasta');
    assert.equal(inflect('Matti', 'genitive'), 'Matin');
  });

  it('accurately detects entity roles for compound countries and personal names', () => {
    assert.equal(detectEntityRole('Uusi-Seelanti'), 'place');
    assert.equal(detectEntityRole('Iso-Britannia'), 'place');
    assert.equal(detectEntityRole('Venäjä'), 'place');
    assert.equal(detectEntityRole('Ahvenanmaa'), 'place');
    assert.equal(detectEntityRole('Tampere'), 'place');
    assert.equal(detectEntityRole('Thaimaa'), 'place');
    assert.equal(detectEntityRole('Lahti'), 'place');
    assert.equal(detectEntityRole('Virrat'), 'place');
    assert.equal(detectEntityRole('Matti'), 'person');
    assert.equal(detectEntityRole('Virtanen'), 'person');
    assert.equal(detectEntityRole('Pekka'), 'person');
  });

  it('inflects place names accurately with explicit or auto role', () => {
    assert.equal(inflect('Helsinki', 'local', { role: 'place' }), 'Helsingissä');
    assert.equal(inflect('Tampere', 'localTo', { role: 'place' }), 'Tampereelle');
    assert.equal(inflect('Turku', 'local'), 'Turussa');
  });

  it('honors preferences passed to unified inflect()', () => {
    assert.equal(inflect('Satu', 'allative', { preference: 'no-gradation' }), 'Satulle');
    assert.equal(inflect('Satu', 'allative', { preference: 'gradation' }), 'Sadulle');
    assert.equal(inflect('Lucas', 'genitive', { preference: 's-stem' }), 'Lucaksen');
    assert.equal(inflect('Niklas', 'genitive', { preference: 'vocalic' }), 'Niklasin');
    assert.equal(inflect('Tuuli', 'genitive', { preference: 'inflected' }), 'Tuulen');
    assert.equal(inflect('KELA', 'allative', { preference: 'acronym' }), 'KELA:lle');
    assert.equal(inflect('Agent007', 'adessive', { preference: 'harmony-back' }), 'Agent007:lla');
    assert.equal(inflect('Tampere', 'local', { localCase: 'in' }), 'Tampereessa');
  });

  it('handles edge cases safely without throwing exceptions', () => {
    assert.equal(inflect('', 'genitive'), '');
    assert.equal(inflect('Helsinki', 'nominative'), 'Helsinki');
    // Fallback on invalid case cast at runtime
    assert.equal(inflect('Helsinki', 'unknownCase' as unknown as 'genitive'), 'Helsinki');
    assert.equal(inflect('Virtanen', 'invalid' as unknown as 'genitive'), 'Virtanen');
  });
});

describe('format() Template String Engine', () => {
  it('interpolates simple grammatical case expressions {$name:case}', () => {
    const template = 'Tänään on {$user:genitive} syntymäpäivä.';
    const result = format(template, { user: 'Erkki' });
    assert.equal(result, 'Tänään on Erkin syntymäpäivä.');
  });

  it('interpolates contextual local cases for places', () => {
    const template = 'Tervetuloa {$city:localTo} ja viihdy {$city:local}!';
    const res1 = format(template, { city: 'Tampere' });
    assert.equal(res1, 'Tervetuloa Tampereelle ja viihdy Tampereella!');

    const res2 = format(template, { city: 'Helsinki' });
    assert.equal(res2, 'Tervetuloa Helsinkiin ja viihdy Helsingissä!');
  });

  it('supports explicit role specifier {$name:case:role}', () => {
    // Distinguishes homonymic proper nouns (e.g. Salo as surname vs. Salo as municipality)
    const template = 'Tapasimme {$target:genitive:person} {$target:local:place}.';
    const result = format(template, { target: 'Salo' });
    // Salo as person (surname) -> Salon; Salo as place -> Salossa
    assert.equal(result, 'Tapasimme Salon Salossa.');
  });

  it('honors nameholder preferences in format() options', () => {
    const template = 'Lähetä viesti {$user:allative}!';
    assert.equal(
      format(template, { user: 'Satu' }, { preferences: { user: 'no-gradation' } }),
      'Lähetä viesti Satulle!'
    );
    assert.equal(
      format(template, { user: 'Satu' }, { preferences: { user: 'gradation' } }),
      'Lähetä viesti Sadulle!'
    );

    const dual = 'Terveisiä {$user:allative} ja {$friend:allative}!';
    assert.equal(
      format(dual, { user: 'Satu', friend: 'Lucas' }, {
        preferences: { user: 'no-gradation', friend: 's-stem' }
      }),
      'Terveisiä Satulle ja Lucakselle!'
    );
  });

  it('interpolates uninflected variables when no case is specified', () => {
    const template = 'Hei {$user}, tervetuloa {$city:localTo}!';
    const result = format(template, { user: 'Anna', city: 'Oulu' });
    assert.equal(result, 'Hei Anna, tervetuloa Ouluun!');
  });

  it('preserves unescaped literal curly braces or unknown variables gracefully', () => {
    const template = 'Hei {$missing:genitive}, koodi on {test}.';
    const result = format(template, {});
    assert.equal(result, 'Hei , koodi on {test}.');
  });

  it('preserves malformed and unclosed tokens without throwing', () => {
    assert.equal(format('Terve {user ja {city', { user: 'Matti' }), 'Terve {user ja {city');
    assert.equal(format('Terve {$user ja {$city:genitive', { user: 'Matti' }), 'Terve {$user ja {$city:genitive');
    assert.equal(format('Syntynyt {$user:invalidCase}', { user: 'Matti' }), 'Syntynyt Matti');
  });
});

describe('t Tagged Template Literal Function', () => {
  it('formats tagged template expressions with case wrappers', () => {
    const user = 'Liisa';
    const city = 'Rovaniemi';
    const result = t`Onnea ${[user, 'genitive']} päivänä! Terveisiä ${[city, 'localFrom']}!`;
    assert.equal(result, 'Onnea Liisan päivänä! Terveisiä Rovaniemeltä!');
  });

  it('handles plain string interpolations alongside case-wrapped values', () => {
    const greeting = 'Moi';
    const place = 'Espoo';
    const count = 5;
    const result = t`${greeting}, nähdään ${[place, 'local']} ${count} päivän kuluttua.`;
    assert.equal(result, 'Moi, nähdään Espoossa 5 päivän kuluttua.');
  });

  it('honors nameholder preferences in tagged template t', () => {
    const satu = 'Satu';
    const lucas = 'Lucas';
    const bot = 'AGENT007';
    assert.equal(t`Lähetä paketti ${[satu, 'allative', { preference: 'no-gradation' }]}!`, 'Lähetä paketti Satulle!');
    assert.equal(t`Soita ${[lucas, 'allative', { preference: 's-stem' }]}!`, 'Soita Lucakselle!');
    assert.equal(
      t`${[bot, 'adessive', { preference: ['acronym', 'harmony-back'] }]} on asiaa!`,
      'AGENT007:lla on asiaa!'
    );
  });

  it('supports isolated custom template engine via createTemplateEngine', () => {
    const customEngine = createTemplateEngine(inflectPerson);
    assert.equal(customEngine.format('Terveisiä {$user:ablative}!', { user: 'Pekka' }), 'Terveisiä Pekalta!');
    const user = 'Kari-Pekka';
    assert.equal(customEngine.t`Moi ${[user, 'allative']}!`, 'Moi Kari-Pekalle!');
  });
});
