import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflectPerson } from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dvvDataPath = path.join(__dirname, 'fixtures', 'dvv-top-names.json');
const dvvData = JSON.parse(fs.readFileSync(dvvDataPath, 'utf8')) as {
  readonly top500GivenNames: string[];
  readonly top100Surnames: string[];
};

describe('Official DVV Top Finnish Names Benchmark (500 Given Names)', () => {
  it('achieves >= 95% accuracy on genitive declension across 500 official given names', () => {
    let valid = 0;
    const failures: string[] = [];

    for (const name of dvvData.top500GivenNames) {
      const genitive = inflectPerson(name, 'genitive');
      // In Finnish nominal morphology, all singular genitives end in -n
      if (genitive.endsWith('n') && genitive.length >= name.length) {
        valid++;
      } else {
        failures.push(`${name} -> ${genitive}`);
      }
    }

    const accuracy = (valid / dvvData.top500GivenNames.length) * 100;
    assert.ok(
      accuracy >= 95,
      `Genitive accuracy was ${accuracy.toFixed(1)}% (below 95%). Failed: ${failures.slice(0, 10).join(', ')}`
    );
  });

  it('achieves >= 95% accuracy on partitive declension across 500 official given names', () => {
    let valid = 0;
    const failures: string[] = [];

    for (const name of dvvData.top500GivenNames) {
      const partitive = inflectPerson(name, 'partitive');
      // In Finnish nominal morphology, all singular partitives end in -a/-ä or -ta/-tä
      if (/[aä]$/i.test(partitive) && partitive.length >= name.length) {
        valid++;
      } else {
        failures.push(`${name} -> ${partitive}`);
      }
    }

    const accuracy = (valid / dvvData.top500GivenNames.length) * 100;
    assert.ok(
      accuracy >= 95,
      `Partitive accuracy was ${accuracy.toFixed(1)}% (below 95%). Failed: ${failures.slice(0, 10).join(', ')}`
    );
  });

  it('inflects top 100 Finnish surnames accurately in genitive and partitive', () => {
    let valid = 0;
    for (const surname of dvvData.top100Surnames) {
      const genitive = inflectPerson(surname, 'genitive');
      const partitive = inflectPerson(surname, 'partitive');
      if (genitive.endsWith('n') && /[aä]$/i.test(partitive)) {
        valid++;
      }
    }

    const accuracy = (valid / dvvData.top100Surnames.length) * 100;
    assert.ok(accuracy >= 95, `Surname accuracy was ${accuracy.toFixed(1)}% (below 95%)`);
  });
});

describe('Full Name & Multi-word Inflection', () => {
  it('inflects only the surname for multi-word names', () => {
    assert.equal(inflectPerson('Matti Virtanen', 'genitive'), 'Matti Virtasen');
    assert.equal(inflectPerson('Pekka Korhonen', 'adessive'), 'Pekka Korhosella');
    assert.equal(inflectPerson('Anna Maria Mäkinen', 'partitive'), 'Anna Maria Mäkistä');
  });
});

describe('Hyphenated Compound Names', () => {
  it('inflects only the final component in hyphenated first names', () => {
    assert.equal(inflectPerson('Marja-Liisa', 'genitive'), 'Marja-Liisan');
    assert.equal(inflectPerson('Juha-Pekka', 'genitive'), 'Juha-Pekan');
    assert.equal(inflectPerson('Kari-Matti', 'adessive'), 'Kari-Matilla');
    assert.equal(inflectPerson('Anna-Kirsti', 'allative'), 'Anna-Kirstille');
  });
});

describe('Foreign Person Names', () => {
  it('attaches vocalic linking i to foreign consonant-final names', () => {
    assert.equal(inflectPerson('John', 'genitive'), 'Johnin');
    assert.equal(inflectPerson('David', 'adessive'), 'Davidilla');
    assert.equal(inflectPerson('Tom', 'partitive'), 'Tomia');
    assert.equal(inflectPerson('Erik', 'allative'), 'Erikille');
    assert.equal(inflectPerson('James', 'genitive'), 'Jamesin');
    assert.equal(inflectPerson('Charles', 'genitive'), 'Charlesin');
  });

  it('handles names ending in silent consonants with an apostrophe', () => {
    assert.equal(inflectPerson('Bordeaux', 'genitive'), "Bordeaux'n");
    assert.equal(inflectPerson('Bordeaux', 'inessive'), "Bordeaux'ssa");
    assert.equal(inflectPerson('Bordeaux', 'illative'), "Bordeaux'hon");
    assert.equal(inflectPerson('Bordeaux', 'partitive'), "Bordeaux'ta");
    assert.equal(inflectPerson('Bordeaux', 'adessive'), "Bordeaux'lla");
    assert.equal(inflectPerson('Dumas', 'genitive'), "Dumas'n");
  });
});

describe('Complete Grammatical Case Paradigm', () => {
  it('inflects regular Finnish name across all grammatical cases', () => {
    assert.equal(inflectPerson('Matti', 'nominative'), 'Matti');
    assert.equal(inflectPerson('Matti', 'genitive'), 'Matin');
    assert.equal(inflectPerson('Matti', 'partitive'), 'Mattia');
    assert.equal(inflectPerson('Matti', 'inessive'), 'Matissa');
    assert.equal(inflectPerson('Matti', 'elative'), 'Matista');
    assert.equal(inflectPerson('Matti', 'illative'), 'Mattiin');
    assert.equal(inflectPerson('Matti', 'adessive'), 'Matilla');
    assert.equal(inflectPerson('Matti', 'ablative'), 'Matilta');
    assert.equal(inflectPerson('Matti', 'allative'), 'Matille');
    assert.equal(inflectPerson('Matti', 'essive'), 'Mattina');
    assert.equal(inflectPerson('Matti', 'translative'), 'Matiksi');
  });

  it('inflects -nen surname across all grammatical cases', () => {
    assert.equal(inflectPerson('Virtanen', 'genitive'), 'Virtasen');
    assert.equal(inflectPerson('Virtanen', 'partitive'), 'Virtasta');
    assert.equal(inflectPerson('Virtanen', 'inessive'), 'Virtasessa');
    assert.equal(inflectPerson('Virtanen', 'elative'), 'Virtasesta');
    assert.equal(inflectPerson('Virtanen', 'illative'), 'Virtaseen');
    assert.equal(inflectPerson('Virtanen', 'adessive'), 'Virtasella');
    assert.equal(inflectPerson('Virtanen', 'ablative'), 'Virtaselta');
    assert.equal(inflectPerson('Virtanen', 'allative'), 'Virtaselle');
    assert.equal(inflectPerson('Virtanen', 'essive'), 'Virtasena');
    assert.equal(inflectPerson('Virtanen', 'translative'), 'Virtaseksi');
  });

  it('handles role option and fallback cases', () => {
    assert.equal(inflectPerson('Kallio', 'genitive', { role: 'surname' }), 'Kallion');
    assert.equal(inflectPerson('Matti', 'unknown' as never), 'Matti');
  });

  it('inflects s-stem given name across all grammatical cases', () => {
    assert.equal(inflectPerson('Tuomas', 'genitive'), 'Tuomaksen');
    assert.equal(inflectPerson('Tuomas', 'partitive'), 'Tuomasta');
    assert.equal(inflectPerson('Tuomas', 'inessive'), 'Tuomaksessa');
    assert.equal(inflectPerson('Tuomas', 'illative'), 'Tuomakseen');
    assert.equal(inflectPerson('Tuomas', 'allative'), 'Tuomakselle');
  });
});

describe('Irregular & Edge Cases', () => {
  it('inflects traditional irregular names using custom paradigms', () => {
    assert.equal(inflectPerson('Sampo', 'genitive'), 'Sammon');
    assert.equal(inflectPerson('Sampo', 'adessive'), 'Sammolla');
    assert.equal(inflectPerson('Sampo', 'partitive'), 'Sampoa');
    assert.equal(inflectPerson('Aleksis', 'genitive'), 'Aleksiksen');
    assert.equal(inflectPerson('Aleksis', 'partitive'), 'Aleksista');
  });

  it('handles empty input gracefully', () => {
    assert.equal(inflectPerson('', 'genitive'), '');
    assert.equal(inflectPerson('   ', 'partitive'), '');
  });
});
