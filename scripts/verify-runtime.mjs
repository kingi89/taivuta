import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as rootEsm from 'taivuta';
import * as personEsm from 'taivuta/person';
import * as placeEsm from 'taivuta/place';
import * as morphologyEsm from 'taivuta/morphology';
import * as templateEsm from 'taivuta/template';
import * as preferencesEsm from 'taivuta/preferences';

const require = createRequire(import.meta.url);
const rootCjs = require('taivuta');
const personCjs = require('taivuta/person');
const placeCjs = require('taivuta/place');
const morphologyCjs = require('taivuta/morphology');
const templateCjs = require('taivuta/template');
const preferencesCjs = require('taivuta/preferences');

function verifyBundle(label, mod) {
  assert.equal(typeof mod.VERSION, 'string', `${label}: VERSION missing`);
  assert.ok(mod.VERSION.length > 0, `${label}: VERSION empty`);

  assert.equal(mod.inflect('Matti', 'genitive'), 'Matin');
  assert.equal(mod.inflect('Tampere', 'local'), 'Tampereella');
  assert.equal(mod.inflectPlace('Helsinki', 'local'), 'Helsingissä');
  assert.equal(mod.detectLocalCase('Tampere'), 'on');

  assert.equal(mod.inflect('Kaj', 'genitive'), 'Kaj\u2019n');
  assert.equal(mod.inflectPerson('Bordeaux', 'inessive'), 'Bordeaux\u2019ssa');

  assert.equal(mod.inflect('<a>', 'inessive'), '<a>:ssa');
  assert.equal(mod.format('{$a}', { a: '{$b:genitive}', b: 'Matti' }), '{$b:genitive}');
  assert.equal(mod.t`Hei ${['Matti', 'allative']}!`, 'Hei Matille!');

  assert.equal(mod.inflect('Matti', 'toString'), 'Matti');
  assert.equal(mod.inflectPlace('Tampere', 'localCaseType'), 'Tampere');
  assert.equal(mod.inflect(null, 'genitive'), '');
  const overLimit = 'a'.repeat(1_000_001);
  assert.equal(mod.inflect(overLimit, 'genitive'), overLimit);

  assert.equal(mod.weakenConsonants('Matti'), 'Mati');
  assert.equal(mod.analyzeStem('Bordeaux').needsApostrophe, true);
  assert.equal(
    mod.createTemplateEngine(mod.inflectPerson).format('Hei {$u:allative}!', { u: 'Satu' }),
    'Hei Sadulle!'
  );
  assert.equal(mod.detectNameDisambiguation('Satu')?.isAmbiguous, true);
}

const esmApi = {
  ...rootEsm,
  ...personEsm,
  ...placeEsm,
  ...morphologyEsm,
  ...templateEsm,
  ...preferencesEsm
};
const cjsApi = {
  ...rootCjs,
  ...personCjs,
  ...placeCjs,
  ...morphologyCjs,
  ...templateCjs,
  ...preferencesCjs
};

verifyBundle('ESM', esmApi);
verifyBundle('CJS', cjsApi);
assert.equal(esmApi.VERSION, cjsApi.VERSION);

console.log(
  `✅ Verified compiled ESM & CJS runtime compatibility across all 6 subpaths on Node ${process.version} (v${esmApi.VERSION})`
);
