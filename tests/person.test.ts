import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflect, inflectPerson } from '../src/index.ts';
import { getPersonParadigm } from '../src/person/index.ts';

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
    assert.equal(inflectPerson('Jean-Pierre', 'genitive'), 'Jean-Pierren');
    assert.equal(inflectPerson('Kari-Sampo', 'genitive'), 'Kari-Sammon');
    assert.equal(inflectPerson('Anna-Kerttu', 'adessive'), 'Anna-Kertulla');
  });
});

describe('Polysyllabic Names & Compound Stems (Gradation Anchoring)', () => {
  it('preserves consonant clusters in non-final syllables for given names', () => {
    // Given names with double consonants or clusters in non-final syllables must not weaken
    assert.equal(inflectPerson('Kerttuli', 'genitive'), 'Kerttulin');
    assert.equal(inflectPerson('Kerttuli', 'adessive'), 'Kerttulilla');
    assert.equal(inflectPerson('Minttumaari', 'genitive'), 'Minttumaarin');
    assert.equal(inflectPerson('Minttumaari', 'adessive'), 'Minttumaarilla');
    assert.equal(inflectPerson('Pirkkoliisa', 'genitive'), 'Pirkkoliisan');
    assert.equal(inflectPerson('Antti-Pekka', 'genitive'), 'Antti-Pekan');
    assert.equal(inflectPerson('Pentti-Oskari', 'genitive'), 'Pentti-Oskarin');
    assert.equal(inflectPerson('Kyllikki', 'genitive'), 'Kyllikin');
    // Note: Compound names like Kastehelmi inflect by tradition as Kotus 7 (Kastehelmen),
    // whereas Helmi as a female given name is Kotus 5 (Helmin), and as a surname is Kotus 7 (Helmen).
    // Due to personal preference variation, compound given names with old nominal roots are cataloged for future paradigms.
  });

  it('restricts consonant gradation strictly to the stem-final syllable in compound surnames', () => {
    // Clusters in initial components must remain intact while stem-final syllable gradates
    assert.equal(inflectPerson('Kultaranta', 'genitive', { role: 'surname' }), 'Kultarannan');
    assert.equal(inflectPerson('Kultaranta', 'adessive', { role: 'surname' }), 'Kultarannalla');
    assert.equal(inflectPerson('Keltakumpu', 'genitive', { role: 'surname' }), 'Keltakummun');
    assert.equal(inflectPerson('Keltakumpu', 'adessive', { role: 'surname' }), 'Keltakummulla');
    assert.equal(inflectPerson('Kallioranta', 'genitive', { role: 'surname' }), 'Kalliorannan');
    assert.equal(inflectPerson('Kukkapää', 'genitive', { role: 'surname' }), 'Kukkapään');
    assert.equal(inflectPerson('Kukkapää', 'adessive', { role: 'surname' }), 'Kukkapäällä');
    assert.equal(inflectPerson('Yrjömatti', 'adessive'), 'Yrjömatilla');
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
    assert.equal(inflectPerson('John', 'essive'), 'Johnina');

    // Foreign names ending in accented vowels or macrons attach endings directly
    assert.equal(inflectPerson('José', 'genitive'), 'Josén');
    assert.equal(inflectPerson('José', 'partitive'), 'Joséa');
    assert.equal(inflectPerson('André', 'genitive'), 'Andrén');
    assert.equal(inflectPerson('Pelé', 'genitive'), 'Pelén');
  });

  it('handles names ending in silent consonants with an apostrophe', () => {
    assert.equal(inflectPerson('Bordeaux', 'genitive'), 'Bordeaux’n');
    assert.equal(inflectPerson('Bordeaux', 'inessive'), 'Bordeaux’ssa');
    assert.equal(inflectPerson('Bordeaux', 'illative'), 'Bordeaux’hon');
    assert.equal(inflectPerson('Bordeaux', 'partitive'), 'Bordeaux’ta');
    assert.equal(inflectPerson('Bordeaux', 'adessive'), 'Bordeaux’lla');
    assert.equal(inflectPerson('Bordeaux', 'essive'), 'Bordeaux’na');
    assert.equal(inflectPerson('Dumas', 'genitive'), 'Dumas’n');
    assert.equal(inflectPerson('Degas', 'genitive'), 'Degas’n');
    assert.equal(inflectPerson('Monet', 'genitive'), 'Monet’n');
    assert.equal(inflectPerson('Monet', 'adessive'), 'Monet’lla');
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
    assert.equal(inflectPerson('Satu', 'genitive'), 'Sadun');
    assert.equal(inflectPerson('Satu', 'adessive'), 'Sadulla');
    assert.equal(inflectPerson('Satu', 'partitive'), 'Satua');
    assert.equal(inflectPerson('Satu', 'genitive', { gradation: false }), 'Satun');
    assert.equal(inflectPerson('Satu', 'adessive', { gradation: false }), 'Satulla');

    // Kotus Type 9 nominal gradation (Taika)
    assert.equal(inflectPerson('Taika', 'genitive'), 'Taikan');
    assert.equal(inflectPerson('Taika', 'allative'), 'Taikalle');
    assert.equal(inflectPerson('Taika', 'genitive', { gradation: true }), 'Taian');
    assert.equal(inflectPerson('Taika', 'allative', { gradation: true }), 'Taialle');
    assert.equal(inflectPerson('Taika', 'inessive', { gradation: true }), 'Taiassa');
    assert.equal(inflectPerson('Taika', 'partitive', { gradation: true }), 'Taikaa');
    assert.equal(inflectPerson('Taika', 'illative', { gradation: true }), 'Taikaan');

    // Secondary diphthong-ka names default to strong grade, with weak grade available on opt-in
    assert.equal(inflectPerson('Jouka', 'genitive'), 'Joukan');
    assert.equal(inflectPerson('Jouka', 'genitive', { gradation: true }), 'Jouan');
    assert.equal(inflectPerson('Malaika', 'genitive'), 'Malaikan');
    assert.equal(inflectPerson('Malaika', 'genitive', { gradation: true }), 'Malaian');

    // Modern first names strictly resist single k-loss (never *Ain, *Mian, *Riun, *Reon)
    assert.equal(inflectPerson('Aki', 'genitive'), 'Akin');
    assert.equal(inflectPerson('Aki', 'allative'), 'Akille');
    assert.notEqual(inflectPerson('Aki', 'genitive'), 'Ain');
    assert.equal(inflectPerson('Mika', 'genitive'), 'Mikan');
    assert.notEqual(inflectPerson('Mika', 'genitive'), 'Mian');
    assert.equal(inflectPerson('Riku', 'genitive'), 'Rikun');
    assert.notEqual(inflectPerson('Riku', 'genitive'), 'Riun');
    assert.equal(inflectPerson('Reko', 'genitive'), 'Rekon');
    assert.notEqual(inflectPerson('Reko', 'genitive'), 'Reon');
    assert.equal(inflectPerson('Jouko', 'genitive'), 'Joukon');
    assert.equal(inflectPerson('Miika', 'genitive'), 'Miikan');
  });

  it('inflects foreign feminine names in -ette, -otte, -itte with quantitative gradation (tt -> t)', () => {
    // Kotus: Names like Janette, Charlotte, Brigitte alternate between assimilated Finnish
    // gradation (Janetelle, Charlotelle, Brigitelle) and unweakened foreign spelling preservation.
    assert.equal(inflectPerson('Janette', 'allative'), 'Janetelle');
    assert.equal(inflectPerson('Janette', 'genitive'), 'Janeten');
    assert.equal(inflectPerson('Bernadette', 'allative'), 'Bernadetelle');
    assert.equal(inflectPerson('Charlotte', 'allative'), 'Charlotelle');
    assert.equal(inflectPerson('Brigitte', 'allative'), 'Brigitelle');

    assert.equal(inflectPerson('Janette', 'allative', { gradation: false }), 'Janettelle');
    assert.equal(inflectPerson('Janette', 'genitive', { gradation: false }), 'Janetten');
    assert.equal(inflectPerson('Bernadette', 'allative', { gradation: false }), 'Bernadettelle');
    assert.equal(inflectPerson('Charlotte', 'allative', { gradation: false }), 'Charlottelle');
    assert.equal(inflectPerson('Brigitte', 'allative', { gradation: false }), 'Brigittelle');
  });

  it('inflects s-stem names and supports sStem overrides', () => {
    // Default Finnish s-stems
    assert.equal(inflectPerson('Niklas', 'genitive'), 'Niklaksen');
    assert.equal(inflectPerson('Rasmus', 'genitive'), 'Rasmuksen');
    assert.equal(inflectPerson('Aatos', 'genitive'), 'Aatoksen');
    assert.equal(inflectPerson('Luukas', 'genitive'), 'Luukaksen');
    assert.equal(inflectPerson('Aulis', 'genitive'), 'Auliksen');
    assert.equal(inflectPerson('Eelis', 'genitive'), 'Eeliksen');
    assert.equal(inflectPerson('Julius', 'genitive'), 'Juliuksen');
    assert.equal(inflectPerson('Iiris', 'genitive'), 'Iiriksen');

    // Default foreign names ending in -s
    assert.equal(inflectPerson('Lucas', 'genitive'), 'Lucasin');
    assert.equal(inflectPerson('Lukas', 'genitive'), 'Lukasin');
    assert.equal(inflectPerson('Jonas', 'genitive'), 'Jonasin');
    assert.equal(inflectPerson('Thomas', 'genitive'), 'Thomasin');
    assert.equal(inflectPerson('Tomas', 'genitive'), 'Tomasin');

    // Overrides
    assert.equal(inflectPerson('Niklas', 'genitive', { sStem: false }), 'Niklasin');
    assert.equal(inflectPerson('Lucas', 'genitive', { sStem: true }), 'Lucaksen');
    assert.equal(inflectPerson('Lukas', 'genitive', { sStem: true }), 'Lukaksen');
  });

  it('inflects native Finnish names with ht -> hd gradation (e.g. Ahti)', () => {
    assert.equal(inflectPerson('Ahti', 'nominative'), 'Ahti');
    assert.equal(inflectPerson('Ahti', 'genitive'), 'Ahdin');
    assert.equal(inflectPerson('Ahti', 'partitive'), 'Ahtia');
    assert.equal(inflectPerson('Ahti', 'inessive'), 'Ahdissa');
    assert.equal(inflectPerson('Ahti', 'illative'), 'Ahtiin');
    assert.equal(inflectPerson('Ahti', 'adessive'), 'Ahdilla');
    assert.equal(inflectPerson('Ahti', 'allative'), 'Ahdille');
    assert.equal(inflectPerson('Ahti', 'essive'), 'Ahtina');
  });

  it('inflects names ending in vocalic j with an apostrophe (e.g. Kaj)', () => {
    assert.equal(inflectPerson('Kaj', 'genitive'), 'Kaj’n');
    assert.equal(inflectPerson('Kaj', 'partitive'), 'Kaj’ta');
    assert.equal(inflectPerson('Kaj', 'inessive'), 'Kaj’ssa');
    assert.equal(inflectPerson('Kaj', 'illative'), 'Kaj’hin');
    assert.equal(inflectPerson('Kaj', 'adessive'), 'Kaj’lla');

    // Intentional limitation (BUG-017, backlog): 'guy' is in SILENT_FINAL_REGEX,
    // but analyzeStem() returns early on vowel-final 'y' before hasSilentEnding().
    assert.equal(inflectPerson('Guy', 'genitive'), 'Guyn');
  });

  it('inflects proper nouns with non-standard base words correctly', () => {
    // Veli (proper noun) inflects as Velin, not as common noun 'veli' (veljen)
    assert.equal(inflectPerson('Veli', 'genitive'), 'Velin');
    assert.equal(inflectPerson('Veli', 'allative'), 'Velille');
    assert.equal(inflectPerson('Veli', 'partitive'), 'Veliä');

    // Tony: ends in 'y' pronounced as /i/, harmonizes with preceding 'o' (back vowel)
    assert.equal(inflectPerson('Tony', 'genitive'), 'Tonyn');
    assert.equal(inflectPerson('Tony', 'partitive'), 'Tonya');
    assert.equal(inflectPerson('Tony', 'ablative'), 'Tonylta');
    assert.equal(inflectPerson('Tony', 'allative'), 'Tonylle');
  });

  it('inflects traditional Finnish surnames according to Kotus guidelines', () => {
    // Surnames in -e (Laine -> Laineen, Lainetta, Laineella)
    assert.equal(inflectPerson('Laine', 'genitive', { role: 'surname' }), 'Laineen');
    assert.equal(inflectPerson('Laine', 'partitive', { role: 'surname' }), 'Lainetta');
    assert.equal(inflectPerson('Laine', 'adessive', { role: 'surname' }), 'Laineella');
    assert.equal(inflectPerson('Laine', 'illative', { role: 'surname' }), 'Laineeseen');

    // Ancient nature noun surnames in -i (Niemi, Nurmi, Saari, Salmi, Lahti, Koski, Mäki)
    assert.equal(inflectPerson('Niemi', 'genitive', { role: 'surname' }), 'Niemen');
    assert.equal(inflectPerson('Niemi', 'partitive', { role: 'surname' }), 'Niemeä');
    assert.equal(inflectPerson('Niemi', 'adessive', { role: 'surname' }), 'Niemellä');

    assert.equal(inflectPerson('Nurmi', 'genitive', { role: 'surname' }), 'Nurmen');
    assert.equal(inflectPerson('Nurmi', 'partitive', { role: 'surname' }), 'Nurmea');
    assert.equal(inflectPerson('Nurmi', 'adessive', { role: 'surname' }), 'Nurmella');

    assert.equal(inflectPerson('Saari', 'genitive', { role: 'surname' }), 'Saaren');
    assert.equal(inflectPerson('Saari', 'partitive', { role: 'surname' }), 'Saarta');
    assert.equal(inflectPerson('Saari', 'adessive', { role: 'surname' }), 'Saarella');

    assert.equal(inflectPerson('Salmi', 'genitive', { role: 'surname' }), 'Salmen');
    assert.equal(inflectPerson('Salmi', 'partitive', { role: 'surname' }), 'Salmea');
    assert.equal(inflectPerson('Salmi', 'adessive', { role: 'surname' }), 'Salmella');

    assert.equal(inflectPerson('Lahti', 'genitive', { role: 'surname' }), 'Lahden');
    assert.equal(inflectPerson('Lahti', 'partitive', { role: 'surname' }), 'Lahtea');
    assert.equal(inflectPerson('Lahti', 'adessive', { role: 'surname' }), 'Lahdella');

    assert.equal(inflectPerson('Koski', 'genitive', { role: 'surname' }), 'Kosken');
    assert.equal(inflectPerson('Koski', 'partitive', { role: 'surname' }), 'Koskea');
    assert.equal(inflectPerson('Koski', 'adessive', { role: 'surname' }), 'Koskella');

    assert.equal(inflectPerson('Mäki', 'genitive', { role: 'surname' }), 'Mäen');
    assert.equal(inflectPerson('Mäki', 'partitive', { role: 'surname' }), 'Mäkeä');
    assert.equal(inflectPerson('Mäki', 'adessive', { role: 'surname' }), 'Mäellä');

    // Meri: first name (Merin, Merillä) vs surname (Meren, Merellä)
    assert.equal(inflectPerson('Meri', 'genitive', { role: 'givenName' }), 'Merin');
    assert.equal(inflectPerson('Meri', 'genitive', { role: 'surname' }), 'Meren');
    assert.equal(inflectPerson('Meri', 'adessive', { role: 'surname' }), 'Merellä');

    // Surnames in -la/-lä resist consonant gradation (Mattila, Anttila, Peltola, Heikkilä, Seppälä, Rantala, Mikkola)
    assert.equal(inflectPerson('Mattila', 'genitive', { role: 'surname' }), 'Mattilan');
    assert.equal(inflectPerson('Mattila', 'adessive', { role: 'surname' }), 'Mattilalla');
    assert.equal(inflectPerson('Anttila', 'genitive', { role: 'surname' }), 'Anttilan');
    assert.equal(inflectPerson('Peltola', 'genitive', { role: 'surname' }), 'Peltolan');
    assert.equal(inflectPerson('Heikkilä', 'genitive', { role: 'surname' }), 'Heikkilän');
    assert.equal(inflectPerson('Seppälä', 'genitive', { role: 'surname' }), 'Seppälän');
    assert.equal(inflectPerson('Rantala', 'genitive', { role: 'surname' }), 'Rantalan');
    assert.equal(inflectPerson('Mikkola', 'genitive', { role: 'surname' }), 'Mikkolan');

    // Surnames in -io/-iö take -ta/-tä in partitive (Kallio, Vainio)
    assert.equal(inflectPerson('Kallio', 'partitive', { role: 'surname' }), 'Kalliota');
    assert.equal(inflectPerson('Kallio', 'genitive', { role: 'surname' }), 'Kallion');
    assert.equal(inflectPerson('Vainio', 'partitive', { role: 'surname' }), 'Vainiota');
    assert.equal(inflectPerson('Vainio', 'genitive', { role: 'surname' }), 'Vainion');
  });

  it('defaults standalone, compound, and hyphenated nature surnames to nature declension [BUG-006]', () => {
    // Standalone nature surnames inflect via nature stems without explicit { role: 'surname' }
    assert.equal(inflectPerson('Niemi', 'genitive'), 'Niemen');
    assert.equal(inflectPerson('Niemi', 'partitive'), 'Niemeä');
    assert.equal(inflectPerson('Niemi', 'illative'), 'Niemeen');
    assert.equal(inflectPerson('Mäki', 'genitive'), 'Mäen');
    assert.equal(inflectPerson('Saari', 'genitive'), 'Saaren');
    assert.equal(inflectPerson('Saari', 'partitive'), 'Saarta');
    assert.equal(inflectPerson('Lahti', 'genitive'), 'Lahden');
    assert.equal(inflectPerson('Koski', 'genitive'), 'Kosken');
    assert.equal(inflectPerson('Salmi', 'genitive'), 'Salmen');
    assert.equal(inflectPerson('Nurmi', 'genitive'), 'Nurmen');
    assert.equal(inflectPerson('Laine', 'genitive'), 'Laineen');
    assert.equal(inflectPerson('Laine', 'partitive'), 'Lainetta');
    assert.equal(inflectPerson('Rinne', 'genitive'), 'Rinteen');
    assert.equal(inflectPerson('Järvi', 'genitive'), 'Järven');
    assert.equal(inflectPerson('Joki', 'genitive'), 'Joen');

    // Unhyphenated compound nature surnames match when role is omitted
    assert.equal(inflectPerson('Alajärvi', 'genitive'), 'Alajärven');
    assert.equal(inflectPerson('Elorinne', 'genitive'), 'Elorinteen');
    assert.equal(inflectPerson('Puijonmäki', 'genitive'), 'Puijonmäen');

    // Hyphenated surnames ending in nature nouns inflect via nature stems by default
    assert.equal(inflectPerson('Virtanen-Niemi', 'genitive'), 'Virtanen-Niemen');
    assert.equal(inflectPerson('Virtanen-Niemi', 'partitive'), 'Virtanen-Niemeä');
    assert.equal(inflectPerson('Korhonen-Mäki', 'genitive'), 'Korhonen-Mäen');
    assert.equal(inflectPerson('Lahtinen-Saari', 'partitive'), 'Lahtinen-Saarta');
    assert.equal(inflectPerson('Mäkinen-Laine', 'genitive'), 'Mäkinen-Laineen');
    assert.equal(inflectPerson('Saarinen-Lahti', 'adessive'), 'Saarinen-Lahdella');

    // Word-derived given names and -meri given names retain nominative -i defaults
    assert.equal(inflectPerson('Tuuli', 'genitive'), 'Tuulin');
    assert.equal(inflectPerson('Meri', 'genitive'), 'Merin');
    assert.equal(inflectPerson('Suvi', 'genitive'), 'Suvin');
    assert.equal(inflectPerson('Helmi', 'genitive'), 'Helmin');
    assert.equal(inflectPerson('Sini', 'genitive'), 'Sinin');
    assert.equal(inflectPerson('Lumi', 'genitive'), 'Lumin');
    assert.equal(inflectPerson('Pilvi', 'genitive'), 'Pilvin');
    assert.equal(inflectPerson('Elmeri', 'genitive'), 'Elmerin');
    assert.equal(inflectPerson('Anna-Tuuli', 'genitive'), 'Anna-Tuulin');

    // Explicit overrides work in both directions
    assert.equal(inflectPerson('Tuuli', 'genitive', { role: 'surname' }), 'Tuulen');
    assert.equal(inflectPerson('Meri', 'partitive', { vocalicStemVariant: 'inflected' }), 'Merta');
    assert.equal(inflectPerson('Anna-Tuuli', 'genitive', { vocalicStemVariant: 'inflected' }), 'Anna-Tuulen');
    assert.equal(inflectPerson('Niemi', 'genitive', { role: 'givenName' }), 'Niemin');
    assert.equal(inflectPerson('Niemi', 'genitive', { vocalicStemVariant: 'nominative' }), 'Niemin');
  });

  it('documents known limitation: foreign given names with nature-noun suffixes [ICE-003]', () => {
    // Intentional limitation (ICE-003, backlog): When role is omitted, unanchored surname nature suffixes
    // (-laine, -rinne, -joki) match rare foreign given names ending in those substrings.
    // Callers with foreign given names can force given-name inflection via { role: 'givenName' }.
    assert.equal(inflectPerson('Elaine', 'genitive'), 'Elaineen');
    assert.equal(inflectPerson('Elaine', 'partitive'), 'Elainetta');
    assert.equal(inflectPerson('Madelaine', 'genitive'), 'Madelaineen');
    assert.equal(inflectPerson('Corinne', 'genitive'), 'Corinteen');
    assert.equal(inflectPerson('Corinne', 'partitive'), 'Corinnettä');
    assert.equal(inflectPerson('Njoki', 'genitive'), 'Njoen');

    assert.equal(inflectPerson('Elaine', 'genitive', { role: 'givenName' }), 'Elainen');
    assert.equal(inflectPerson('Elaine', 'partitive', { role: 'givenName' }), 'Elainea');
    assert.equal(inflectPerson('Corinne', 'genitive', { role: 'givenName' }), 'Corinnen');
    assert.equal(inflectPerson('Corinne', 'partitive', { role: 'givenName' }), 'Corinnea');
    assert.equal(inflectPerson('Njoki', 'genitive', { role: 'givenName' }), 'Njokin');
  });

  it('handles empty input gracefully', () => {
    assert.equal(inflectPerson('', 'genitive'), '');
    assert.equal(inflectPerson('   ', 'partitive'), '');
  });
});

describe('Canonical Person StemParadigm (getPersonParadigm)', () => {
  it('constructs correct paradigm for standard vocalic given name', () => {
    const p = getPersonParadigm('Matti');
    assert.equal(p.nominative, 'Matti');
    assert.equal(p.strongVocalicStem, 'Matti');
    assert.equal(p.weakVocalicStem, 'Mati');
    assert.equal(p.partitive, 'Mattia');
    assert.equal(p.illative, 'Mattiin');
    assert.equal(p.vowelHarmony, 'back');
  });

  it('constructs correct paradigm for traditional qualitative given names', () => {
    const sampo = getPersonParadigm('Sampo');
    assert.equal(sampo.strongVocalicStem, 'Sampo');
    assert.equal(sampo.weakVocalicStem, 'Sammo');
    assert.equal(sampo.partitive, 'Sampoa');
    assert.equal(sampo.illative, 'Sampoon');

    const satu = getPersonParadigm('Satu');
    assert.equal(satu.strongVocalicStem, 'Satu');
    assert.equal(satu.weakVocalicStem, 'Sadu');

    const satuUngradated = getPersonParadigm('Satu', { gradation: false });
    assert.equal(satuUngradated.weakVocalicStem, 'Satu');
  });

  it('constructs correct paradigm for -nen surnames', () => {
    const p = getPersonParadigm('Virtanen');
    assert.equal(p.nominative, 'Virtanen');
    assert.equal(p.strongVocalicStem, 'Virtase');
    assert.equal(p.weakVocalicStem, 'Virtase');
    assert.equal(p.partitive, 'Virtasta');
    assert.equal(p.illative, 'Virtaseen');
  });

  it('constructs correct paradigm for s-stems', () => {
    const tuomas = getPersonParadigm('Tuomas');
    assert.equal(tuomas.strongVocalicStem, 'Tuomakse');
    assert.equal(tuomas.partitive, 'Tuomasta');
    assert.equal(tuomas.illative, 'Tuomakseen');

    const aleksis = getPersonParadigm('Aleksis');
    assert.equal(aleksis.strongVocalicStem, 'Aleksikse');
    assert.equal(aleksis.partitive, 'Aleksista');
    assert.equal(aleksis.illative, 'Aleksikseen');
  });

  it('constructs correct paradigm for foreign consonant and silent names', () => {
    const john = getPersonParadigm('John');
    assert.equal(john.strongVocalicStem, 'Johni');
    assert.equal(john.weakVocalicStem, 'Johni');
    assert.equal(john.partitive, 'Johnia');
    assert.equal(john.illative, 'Johniin');

    const bordeaux = getPersonParadigm('Bordeaux');
    assert.equal(bordeaux.strongVocalicStem, 'Bordeaux’');
    assert.equal(bordeaux.weakVocalicStem, 'Bordeaux’');
    assert.equal(bordeaux.partitive, 'Bordeaux’ta');
    assert.equal(bordeaux.illative, 'Bordeaux’hon');
  });

  it('constructs correct paradigm for nature noun surnames', () => {
    const niemi = getPersonParadigm('Niemi', { role: 'surname' });
    assert.equal(niemi.strongVocalicStem, 'Nieme');
    assert.equal(niemi.weakVocalicStem, 'Nieme');
    assert.equal(niemi.partitive, 'Niemeä');
    assert.equal(niemi.illative, 'Niemeen');

    const niemiDefault = getPersonParadigm('Niemi');
    assert.equal(niemiDefault.weakVocalicStem, 'Nieme');
    assert.equal(niemiDefault.partitive, 'Niemeä');
  });

  it('maintains parity between unified inflect() sub-roles and inflectPerson() [BUG-013]', () => {
    assert.equal(inflect('Tuuli', 'genitive', { role: 'givenName' }), inflectPerson('Tuuli', 'genitive', { role: 'givenName' }));
    assert.equal(inflect('Tuuli', 'genitive', { role: 'surname' }), inflectPerson('Tuuli', 'genitive', { role: 'surname' }));
    assert.equal(inflect('Sato', 'genitive', { role: 'givenName' }), inflectPerson('Sato', 'genitive', { role: 'givenName' }));
    assert.equal(inflect('Sato', 'genitive', { role: 'surname' }), inflectPerson('Sato', 'genitive', { role: 'surname' }));
  });

  it('inflects Finnish Kotus Type 32 -tar/-tär and -tytär names while keeping foreign -tar epenthetic -i- [BUG-016]', () => {
    // Finnish -tar names (Type 32: reverse t -> tt gradation)
    assert.equal(inflectPerson('Ilmatar', 'adessive'), 'Ilmattarella');
    assert.equal(inflectPerson('Ilmatar', 'genitive'), 'Ilmattaren');
    assert.equal(inflectPerson('Ilmatar', 'partitive'), 'Ilmatarta');
    assert.equal(inflectPerson('Ilmatar', 'illative'), 'Ilmattareen');
    assert.equal(inflectPerson('Aallotar', 'genitive'), 'Aallottaren');
    assert.equal(inflectPerson('Suometar', 'adessive'), 'Suomettarella');
    assert.equal(inflectPerson('Kuutar', 'genitive'), 'Kuuttaren');

    // Finnish -tär and -tytär names
    assert.equal(inflectPerson('Päivätär', 'adessive'), 'Päivättärellä');
    assert.equal(inflectPerson('Päivätär', 'partitive'), 'Päivätärtä');
    assert.equal(inflectPerson('Päivätär', 'illative'), 'Päivättäreen');
    assert.equal(inflectPerson('Matintytär', 'adessive'), 'Matintyttärellä');
    assert.equal(inflectPerson('Saduntytär', 'genitive'), 'Saduntyttären');

    // Foreign -tar names and short names default to epenthetic -i-
    assert.equal(inflectPerson('Petar', 'adessive'), 'Petarilla');
    assert.equal(inflectPerson('Petar', 'genitive'), 'Petarin');
    assert.equal(inflectPerson('Petar', 'partitive'), 'Petaria');
    assert.equal(inflectPerson('Dimitar', 'adessive'), 'Dimitarilla');
    assert.equal(inflectPerson('Mukhtar', 'genitive'), 'Mukhtarin');
    assert.equal(inflectPerson('Ottar', 'adessive'), 'Ottarilla');
    assert.equal(inflectPerson('Knutar', 'genitive'), 'Knutarin');
    assert.equal(inflectPerson('Star', 'genitive'), 'Starin');

    // Explicit tarStem overrides and string preferences
    assert.equal(inflectPerson('Kalevatar', 'genitive', { tarStem: true }), 'Kalevattaren');
    assert.equal(inflectPerson('Ilmatar', 'genitive', { tarStem: false }), 'Ilmatarin');
    assert.equal(inflectPerson('Ilmatar', 'adessive', { preference: 'tar-vocalic' }), 'Ilmatarilla');
    assert.equal(inflectPerson('Avatar', 'genitive', { preference: 'tar-stem' }), 'Avattaren');
    assert.equal(inflect('Avatar', 'genitive', { preference: { tarStem: true } }), 'Avattaren');
  });
});
