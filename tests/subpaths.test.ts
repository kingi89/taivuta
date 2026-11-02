/**
 * Tests for modular subpath exports (person, place, morphology, template).
 */

import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { inflectPerson } from '../src/person/index.ts';
import { inflectPlace, detectLocalCase, TOPONYM_SUFFIX_REGEX } from '../src/place/index.ts';
import { getVowelHarmony, harmonize, weakenConsonants, analyzeStem } from '../src/morphology/index.ts';
import { format, t } from '../src/template/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Modular Subpath Exports (Source)', () => {
  it('correctly inflects person names via person subpath', () => {
    assert.equal(inflectPerson('Matti', 'genitive'), 'Matin');
    assert.equal(inflectPerson('Virtanen', 'partitive'), 'Virtasta');
    assert.equal(inflectPerson('Marja-Liisa', 'allative'), 'Marja-Liisalle');
  });

  it('correctly inflects place names via place subpath', () => {
    assert.equal(detectLocalCase('Helsinki'), 'in');
    assert.equal(detectLocalCase('Tampere'), 'on');
    assert.equal(inflectPlace('Tampere', 'local'), 'Tampereella');
    assert.equal(inflectPlace('Helsinki', 'localTo'), 'Helsinkiin');
    assert.ok(TOPONYM_SUFFIX_REGEX.test('Alajärvi'));
  });

  it('correctly computes phonology via morphology subpath', () => {
    assert.equal(getVowelHarmony('Pekka'), 'back');
    assert.equal(getVowelHarmony('Väinö'), 'front');
    assert.equal(harmonize('ssa', 'Väinö'), 'ssä');
    assert.equal(weakenConsonants('Kerttu'), 'Kertu');
    const stem = analyzeStem('Virtanen');
    assert.equal(stem.stem, 'Virtase');
  });

  it('correctly interpolates templates via template subpath', () => {
    assert.equal(format('Hei {$name:illative}!', { name: 'Matti' }), 'Hei Mattiin!');
    const name = 'Tampere';
    assert.equal(t`Matkustan ${[name, 'localTo']}.`, 'Matkustan Tampereelle.');
  });
});

describe('Distribution Subpaths & Bundle Independence', () => {
  it('ensures person distribution bundle excludes municipality dataset', () => {
    const personBundlePath = path.join(projectRoot, 'dist', 'person', 'index.mjs');
    if (fs.existsSync(personBundlePath)) {
      const content = fs.readFileSync(personBundlePath, 'utf8');
      // The person submodule should not bundle the 308-municipality dataset
      assert.ok(!content.includes('Pedersören kunta'), 'person bundle must not include municipality entries');
      assert.ok(!content.includes('Uusikaarlepyy'), 'person bundle must not include municipality entries');
    }
  });

  it('ensures morphology distribution bundle is lightweight and standalone', () => {
    const morphBundlePath = path.join(projectRoot, 'dist', 'morphology', 'index.mjs');
    if (fs.existsSync(morphBundlePath)) {
      const content = fs.readFileSync(morphBundlePath, 'utf8');
      assert.ok(!content.includes('inflectPerson'), 'morphology bundle must not include person engine');
      assert.ok(!content.includes('inflectPlace'), 'morphology bundle must not include place engine');
      assert.ok(!content.includes('Pedersören kunta'), 'morphology bundle must not include municipality entries');
      assert.ok(!content.includes('Uusikaarlepyy'), 'morphology bundle must not include municipality entries');
      assert.ok(!content.includes('EXTERNAL_CASE_MUNICIPALITIES'), 'morphology bundle must not include municipality dataset');
    }
  });
});
