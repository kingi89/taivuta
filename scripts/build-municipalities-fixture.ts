import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getVowelHarmony, harmonize } from '../src/morphology/vowels.ts';
import { weakenConsonants } from '../src/morphology/gradation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface CustomEntry {
  localCase: string;
  localCaseType: 'in' | 'on';
  genitive: string;
  partitive?: string;
  illative?: string;
}

const CUSTOM_ENTRIES: Record<string, CustomEntry> = {
  // Manually verified entries
  'Koski Tl': { localCase: 'Koski Tl:llä', localCaseType: 'on', genitive: 'Koski Tl:n', partitive: 'Koski Tl:ää', illative: 'Koski Tl:ään' },
  'Pedersören kunta': { localCase: 'Pedersören kunnassa', localCaseType: 'in', genitive: 'Pedersören kunnan', partitive: 'Pedersören kuntaa', illative: 'Pedersören kuntaan' },
  Brändö: { localCase: 'Brändössä', localCaseType: 'in', genitive: 'Brändön', partitive: 'Brändöä', illative: 'Brändöhön' },
  Föglö: { localCase: 'Föglössä', localCaseType: 'in', genitive: 'Föglön', partitive: 'Föglöä', illative: 'Föglöhön' },
  Geta: { localCase: 'Getassa', localCaseType: 'in', genitive: 'Getan', partitive: 'Getaa', illative: 'Getaan' },
  Kumlinge: { localCase: 'Kumlingessa', localCaseType: 'in', genitive: 'Kumlingen', partitive: 'Kumlingea', illative: 'Kumlingeen' },
  Kuortane: { localCase: 'Kuortaneella', localCaseType: 'on', genitive: 'Kuortaneen', partitive: 'Kuortanetta' },
  Lapua: { localCase: 'Lapualla', localCaseType: 'on', genitive: 'Lapuan', partitive: 'Lapuaa' },
  Lempäälä: { localCase: 'Lempäälässä', localCaseType: 'in', genitive: 'Lempäälän', partitive: 'Lempäälää', illative: 'Lempäälään' },
  Marttila: { localCase: 'Marttilassa', localCaseType: 'in', genitive: 'Marttilan', partitive: 'Marttilaa', illative: 'Marttilaan' },
  Multia: { localCase: 'Multialla', localCaseType: 'on', genitive: 'Multian', partitive: 'Multiaa' },
  Muurame: { localCase: 'Muuramessa', localCaseType: 'in', genitive: 'Muuramen', partitive: 'Muuramea', illative: 'Muurameen' },
  'Mänttä-Vilppula': { localCase: 'Mänttä-Vilppulassa', localCaseType: 'in', genitive: 'Mänttä-Vilppulan', partitive: 'Mänttä-Vilppulaa', illative: 'Mänttä-Vilppulaan' },
  Mäntyharju: { localCase: 'Mäntyharjulla', localCaseType: 'on', genitive: 'Mäntyharjun', partitive: 'Mäntyharjua' },

  // Swedish/foreign consonant endings
  Hammarland: { localCase: 'Hammarlandissa', localCaseType: 'in', genitive: 'Hammarlandin', partitive: 'Hammarlandia', illative: 'Hammarlandiin' },
  Korsnäs: { localCase: 'Korsnäsissä', localCaseType: 'in', genitive: 'Korsnäsin', partitive: 'Korsnäsiä', illative: 'Korsnäsiin' },
  Kökar: { localCase: 'Kökarissa', localCaseType: 'in', genitive: 'Kökarin', partitive: 'Kökaria', illative: 'Kökariin' },
  Lemland: { localCase: 'Lemlandissa', localCaseType: 'in', genitive: 'Lemlandin', partitive: 'Lemlandia', illative: 'Lemlandiin' },
  Lumparland: { localCase: 'Lumparlandissa', localCaseType: 'in', genitive: 'Lumparlandin', partitive: 'Lumparlandia', illative: 'Lumparlandiin' },
  Saltvik: { localCase: 'Saltvikissa', localCaseType: 'in', genitive: 'Saltvikin', partitive: 'Saltvikia', illative: 'Saltvikiin' },
  Sund: { localCase: 'Sundissa', localCaseType: 'in', genitive: 'Sundin', partitive: 'Sundia', illative: 'Sundiin' },
  Kirkkonummi: { localCase: 'Kirkkonummella', localCaseType: 'on', genitive: 'Kirkkonummen', partitive: 'Kirkkonummea' },
  Raahe: { localCase: 'Raahessa', localCaseType: 'in', genitive: 'Raahen', partitive: 'Raahea', illative: 'Raaheen' },
  Uusikaupunki: { localCase: 'Uudessakaupungissa', localCaseType: 'in', genitive: 'Uudenkaupungin', partitive: 'Uuttakaupunkia', illative: 'Uuteenkaupunkiin' },
  Uusikaarlepyy: { localCase: 'Uudessakaarlepyyssä', localCaseType: 'in', genitive: 'Uudenkaarlepyyn', partitive: 'Uuttakaarlepyytä', illative: 'Uuteenkaarlepyyhyn' },
  Isokyrö: { localCase: 'Isossakyrössä', localCaseType: 'in', genitive: 'Isonkyrön', partitive: 'Isoakyröä', illative: 'Isoonkyröön' },

  // Special external case municipal roots
  Alavus: { localCase: 'Alavudella', localCaseType: 'on', genitive: 'Alavuden', partitive: 'Alavutta' },
  Enontekiö: { localCase: 'Enontekiöllä', localCaseType: 'on', genitive: 'Enontekiön', partitive: 'Enontekiötä' },
  Halsua: { localCase: 'Halsualla', localCaseType: 'on', genitive: 'Halsuan', partitive: 'Halsuaa' },
  Hyvinkää: { localCase: 'Hyvinkäällä', localCaseType: 'on', genitive: 'Hyvinkään', partitive: 'Hyvinkäätä' },
  Imatra: { localCase: 'Imatralla', localCaseType: 'on', genitive: 'Imatran', partitive: 'Imatraa' },
  Kaavi: { localCase: 'Kaavilla', localCaseType: 'on', genitive: 'Kaavin', partitive: 'Kaavia' },
  Kangasala: { localCase: 'Kangasalla', localCaseType: 'on', genitive: 'Kangasalan', partitive: 'Kangasalaa' },
  Kaustinen: { localCase: 'Kaustisella', localCaseType: 'on', genitive: 'Kaustisen', partitive: 'Kaustista' },
  Kauhava: { localCase: 'Kauhavalla', localCaseType: 'on', genitive: 'Kauhavan', partitive: 'Kauhavaa' },
  Keitele: { localCase: 'Keiteleellä', localCaseType: 'on', genitive: 'Keiteleen', partitive: 'Keitelettä' },
  Kerava: { localCase: 'Keravalla', localCaseType: 'on', genitive: 'Keravan', partitive: 'Keravaa' },
  Kitee: { localCase: 'Kiteellä', localCaseType: 'on', genitive: 'Kiteen', partitive: 'Kiteetä' },
  Laihia: { localCase: 'Laihialla', localCaseType: 'on', genitive: 'Laihian', partitive: 'Laihiaa' },
  Lapinlahti: { localCase: 'Lapinlahdella', localCaseType: 'on', genitive: 'Lapinlahden', partitive: 'Lapinlahtea' },
  Lemi: { localCase: 'Lemillä', localCaseType: 'on', genitive: 'Lemin', partitive: 'Lemiä' },
  Leppävirta: { localCase: 'Leppävirralla', localCaseType: 'on', genitive: 'Leppävirran', partitive: 'Leppävirtaa' },
  Lohja: { localCase: 'Lohjalla', localCaseType: 'on', genitive: 'Lohjan', partitive: 'Lohjaa' },
  Loimaa: { localCase: 'Loimaalla', localCaseType: 'on', genitive: 'Loimaan', partitive: 'Loimaata' },
  Loppi: { localCase: 'Lopella', localCaseType: 'on', genitive: 'Lopen', partitive: 'Loppea' },
  Luumäki: { localCase: 'Luumäellä', localCaseType: 'on', genitive: 'Luumäen', partitive: 'Luumäkeä' },
  Muhos: { localCase: 'Muhoksella', localCaseType: 'on', genitive: 'Muhoksen', partitive: 'Muhosta' },
  Nokia: { localCase: 'Nokialla', localCaseType: 'on', genitive: 'Nokian', partitive: 'Nokiaa' },
  Parainen: { localCase: 'Paraisilla', localCaseType: 'on', genitive: 'Paraisten', partitive: 'Paraisia' },
  Pertunmaa: { localCase: 'Pertunmaalla', localCaseType: 'on', genitive: 'Pertunmaan', partitive: 'Pertunmaata' },
  Pihtipudas: { localCase: 'Pihtiputaalla', localCaseType: 'on', genitive: 'Pihtiputaan', partitive: 'Pihtipudasta' },
  Posio: { localCase: 'Posiolla', localCaseType: 'on', genitive: 'Posion', partitive: 'Posiota' },
  Punkalaidun: { localCase: 'Punkalaitumella', localCaseType: 'on', genitive: 'Punkalaitumen', partitive: 'Punkalaidunta' },
  Puolanka: { localCase: 'Puolangalla', localCaseType: 'on', genitive: 'Puolangan', partitive: 'Puolankaa' },
  Pyhtää: { localCase: 'Pyhtäällä', localCaseType: 'on', genitive: 'Pyhtään', partitive: 'Pyhtäätä' },
  Pyhäntä: { localCase: 'Pyhännällä', localCaseType: 'on', genitive: 'Pyhännän', partitive: 'Pyhäntää' },
  Pälkäne: { localCase: 'Pälkäneellä', localCaseType: 'on', genitive: 'Pälkäneen', partitive: 'Pälkänettä' },
  Pöytyä: { localCase: 'Pöytyällä', localCaseType: 'on', genitive: 'Pöytyän', partitive: 'Pöytyää' },
  Ranua: { localCase: 'Ranualla', localCaseType: 'on', genitive: 'Ranuan', partitive: 'Ranuaa' },
  Rauma: { localCase: 'Raumalla', localCaseType: 'on', genitive: 'Rauman', partitive: 'Raumaa' },
  Rautalampi: { localCase: 'Rautalammilla', localCaseType: 'on', genitive: 'Rautalammin', partitive: 'Rautalampia' },
  Rovaniemi: { localCase: 'Rovaniemellä', localCaseType: 'on', genitive: 'Rovaniemen', partitive: 'Rovaniemeä' },
  Ruokolahti: { localCase: 'Ruokolahdella', localCaseType: 'on', genitive: 'Ruokolahden', partitive: 'Ruokolahtea' },
  Rusko: { localCase: 'Ruskolla', localCaseType: 'on', genitive: 'Ruskon', partitive: 'Ruskoa' },
  Savitaipale: { localCase: 'Savitaipaleella', localCaseType: 'on', genitive: 'Savitaipaleen', partitive: 'Savitaipaletta' },
  Somero: { localCase: 'Somerolla', localCaseType: 'on', genitive: 'Someron', partitive: 'Someroa' },
  Sulkava: { localCase: 'Sulkavalla', localCaseType: 'on', genitive: 'Sulkavan', partitive: 'Sulkavaa' },
  Tampere: { localCase: 'Tampereella', localCaseType: 'on', genitive: 'Tampereen', partitive: 'Tamperetta' },
  Teuva: { localCase: 'Teuvalla', localCaseType: 'on', genitive: 'Teuvan', partitive: 'Teuvaa' },
  Toholampi: { localCase: 'Toholammilla', localCaseType: 'on', genitive: 'Toholammin', partitive: 'Toholampia' },
  Tyrnävä: { localCase: 'Tyrnävällä', localCaseType: 'on', genitive: 'Tyrnävän', partitive: 'Tyrnävää' },
  Uurainen: { localCase: 'Uuraisilla', localCaseType: 'on', genitive: 'Uuraisten', partitive: 'Uuraisia' },
  Vantaa: { localCase: 'Vantaalla', localCaseType: 'on', genitive: 'Vantaan', partitive: 'Vantaata' },
  Vehmaa: { localCase: 'Vehmaalla', localCaseType: 'on', genitive: 'Vehmaan', partitive: 'Vehmaata' },
  Vesanto: { localCase: 'Vesannolla', localCaseType: 'on', genitive: 'Vesannon', partitive: 'Vesantoa' },
  Vieremä: { localCase: 'Vieremällä', localCaseType: 'on', genitive: 'Vieremän', partitive: 'Vieremää' },
  Virrat: { localCase: 'Virroilla', localCaseType: 'on', genitive: 'Virtojen', partitive: 'Virtoja' },
  Vöyri: { localCase: 'Vöyrillä', localCaseType: 'on', genitive: 'Vöyrin', partitive: 'Vöyriä' },
  Ylitornio: { localCase: 'Ylitorniolla', localCaseType: 'on', genitive: 'Ylitornion', partitive: 'Ylitorniota' },
  Ypäjä: { localCase: 'Ypäjällä', localCaseType: 'on', genitive: 'Ypäjän', partitive: 'Ypäjää' },

  // Exceptions to island suffix -saari / -luoto
  Pietarsaari: { localCase: 'Pietarsaaressa', localCaseType: 'in', genitive: 'Pietarsaaren', partitive: 'Pietarsaarta', illative: 'Pietarsaareen' },
  Hailuoto: { localCase: 'Hailuodossa', localCaseType: 'in', genitive: 'Hailuodon', partitive: 'Hailuotoa', illative: 'Hailuotoon' },
  Luoto: { localCase: 'Luodossa', localCaseType: 'in', genitive: 'Luodon', partitive: 'Luotoa', illative: 'Luotoon' },

  // Gradation resistance for settlement names in -kkila, -ttila, -ppila, -keli, -ntali
  Asikkala: { localCase: 'Asikkalassa', localCaseType: 'in', genitive: 'Asikkalan' },
  Kokkola: { localCase: 'Kokkolassa', localCaseType: 'in', genitive: 'Kokkolan' },
  Mikkeli: { localCase: 'Mikkelissä', localCaseType: 'in', genitive: 'Mikkelin', partitive: 'Mikkeliä', illative: 'Mikkeliin' },
  Naantali: { localCase: 'Naantalissa', localCaseType: 'in', genitive: 'Naantalin', partitive: 'Naantalia', illative: 'Naantaliin' },
  Nakkila: { localCase: 'Nakkilassa', localCaseType: 'in', genitive: 'Nakkilan' },
  Orimattila: { localCase: 'Orimattilassa', localCaseType: 'in', genitive: 'Orimattilan' },
  Parikkala: { localCase: 'Parikkalassa', localCaseType: 'in', genitive: 'Parikkalan' },
  Pukkila: { localCase: 'Pukkilassa', localCaseType: 'in', genitive: 'Pukkilan' },
  Humppila: { localCase: 'Humppilassa', localCaseType: 'in', genitive: 'Humppilan' },

  // S-stems
  Kannus: { localCase: 'Kannuksessa', localCaseType: 'in', genitive: 'Kannuksen', partitive: 'Kannusta', illative: 'Kannukseen' },
  Nurmes: { localCase: 'Nurmeksessa', localCaseType: 'in', genitive: 'Nurmeksen', partitive: 'Nurmesta', illative: 'Nurmekseen' },
  Varkaus: { localCase: 'Varkaudessa', localCaseType: 'in', genitive: 'Varkauden', partitive: 'Varkautta', illative: 'Varkauteen' },

  // Kempele lengthened e
  Kempele: { localCase: 'Kempeleessä', localCaseType: 'in', genitive: 'Kempeleen', partitive: 'Kempelettä', illative: 'Kempeleeseen' },

  // Plural -inen municipalities
  Huittinen: { localCase: 'Huittisissa', localCaseType: 'in', genitive: 'Huittisten', partitive: 'Huittisia', illative: 'Huittisiin' },
  Ikaalinen: { localCase: 'Ikaalisissa', localCaseType: 'in', genitive: 'Ikaalisten', partitive: 'Ikaalisia', illative: 'Ikaalisiin' },
  Jokioinen: { localCase: 'Jokioisissa', localCaseType: 'in', genitive: 'Jokioisten', partitive: 'Jokioisia', illative: 'Jokioisiin' },
  Joroinen: { localCase: 'Joroisissa', localCaseType: 'in', genitive: 'Joroisten', partitive: 'Joroisia', illative: 'Joroisiin' },
  Kaskinen: { localCase: 'Kaskisissa', localCaseType: 'in', genitive: 'Kaskisten', partitive: 'Kaskisia', illative: 'Kaskisiin' },
  Kauniainen: { localCase: 'Kauniaisissa', localCaseType: 'in', genitive: 'Kauniaisten', partitive: 'Kauniaisia', illative: 'Kauniaisiin' },
  Kuhmoinen: { localCase: 'Kuhmoisissa', localCaseType: 'in', genitive: 'Kuhmoisten', partitive: 'Kuhmoisia', illative: 'Kuhmoisiin' },
  Nousiainen: { localCase: 'Nousiaisissa', localCaseType: 'in', genitive: 'Nousiaisten', partitive: 'Nousiaisia', illative: 'Nousiaisiin' },
  Oulainen: { localCase: 'Oulaisissa', localCaseType: 'in', genitive: 'Oulaisten', partitive: 'Oulaisia', illative: 'Oulaisiin' },
  Pornainen: { localCase: 'Pornaisissa', localCaseType: 'in', genitive: 'Pornaisten', partitive: 'Pornaisia', illative: 'Pornaisiin' },
  Siikainen: { localCase: 'Siikaisissa', localCaseType: 'in', genitive: 'Siikaisten', partitive: 'Siikaisia', illative: 'Siikaisiin' }
};

function main(): void {
  const inputPath = path.join(projectRoot, 'data', 'municipalities.txt');
  const names = fs.readFileSync(inputPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const testCases: any[] = [];

  for (const name of names) {
    if (CUSTOM_ENTRIES[name]) {
      const c = CUSTOM_ENTRIES[name];
      testCases.push({
        name,
        localCase: c.localCase,
        localCaseType: c.localCaseType,
        genitive: c.genitive,
        ...(c.partitive ? { partitive: c.partitive } : {}),
        ...(c.illative ? { illative: c.illative } : {})
      });
      continue;
    }

    const clean = name;
    const lower = clean.toLowerCase();

    // Nature suffix heuristics
    if (lower.endsWith('järvi')) {
      const base = clean.slice(0, -5);
      testCases.push({
        name,
        localCase: `${base}järvellä`,
        localCaseType: 'on',
        genitive: `${base}järven`,
        partitive: `${base}järveä`,
        illative: `${base}järveen`
      });
      continue;
    }

    if (lower.endsWith('joki')) {
      const base = clean.slice(0, -4);
      testCases.push({
        name,
        localCase: `${base}joella`,
        localCaseType: 'on',
        genitive: `${base}joen`,
        partitive: `${base}jokea`,
        illative: `${base}jokeen`
      });
      continue;
    }

    if (lower.endsWith('mäki')) {
      const base = clean.slice(0, -4);
      testCases.push({
        name,
        localCase: `${base}mäellä`,
        localCaseType: 'on',
        genitive: `${base}mäen`,
        partitive: `${base}mäkeä`,
        illative: `${base}mäkeen`
      });
      continue;
    }

    if (lower.endsWith('vesi')) {
      const base = clean.slice(0, -4);
      testCases.push({
        name,
        localCase: `${base}vedellä`,
        localCaseType: 'on',
        genitive: `${base}veden`,
        partitive: `${base}vettä`,
        illative: `${base}veteen`
      });
      continue;
    }

    if (lower.endsWith('koski')) {
      const base = clean.slice(0, -5);
      testCases.push({
        name,
        localCase: `${base}koskella`,
        localCaseType: 'on',
        genitive: `${base}kosken`,
        partitive: `${base}koskea`,
        illative: `${base}koskeen`
      });
      continue;
    }

    if (lower.endsWith('salmi')) {
      const base = clean.slice(0, -5);
      testCases.push({
        name,
        localCase: `${base}salmella`,
        localCaseType: 'on',
        genitive: `${base}salmen`,
        partitive: `${base}salmea`,
        illative: `${base}salmeen`
      });
      continue;
    }

    if (lower.endsWith('saari')) {
      const base = clean.slice(0, -5);
      testCases.push({
        name,
        localCase: `${base}saarella`,
        localCaseType: 'on',
        genitive: `${base}saaren`,
        partitive: `${base}saarta`,
        illative: `${base}saareen`
      });
      continue;
    }

    if (lower.endsWith('niemi')) {
      const base = clean.slice(0, -5);
      testCases.push({
        name,
        localCase: `${base}niemellä`,
        localCaseType: 'on',
        genitive: `${base}niemen`,
        partitive: `${base}niemeä`,
        illative: `${base}niemeen`
      });
      continue;
    }

    if (lower.endsWith('lahti')) {
      const base = clean.slice(0, -5);
      const isCap = (clean[0] ?? '').toUpperCase() === clean[0];
      const weak = base ? `${base}lahde` : isCap ? 'Lahde' : 'lahde';
      const strong = base ? `${base}lahte` : isCap ? 'Lahte' : 'lahte';
      testCases.push({
        name,
        localCase: `${weak}ssa`,
        localCaseType: 'in',
        genitive: `${weak}n`,
        partitive: `${strong}a`,
        illative: `${strong}en`
      });
      continue;
    }

    if (/(?:vaara|harju|kangas|suo)$/i.test(clean)) {
      const adSuffix = harmonize('lla', clean);
      const weak = weakenConsonants(clean);
      testCases.push({
        name,
        localCase: `${weak}${adSuffix}`,
        localCaseType: 'on',
        genitive: `${weak}n`
      });
      continue;
    }

    // Swedish/foreign consonant endings
    if (/[bcdfghjklmnpqrstvwxz]$/i.test(clean)) {
      const inSuffix = harmonize('ssä', clean);
      testCases.push({
        name,
        localCase: `${clean}i${inSuffix}`,
        localCaseType: 'in',
        genitive: `${clean}in`
      });
      continue;
    }

    // Long vowel endings (Akaa, Espoo, Ii)
    if (/(?:aa|ää|oo|öö|uu|yy|ii)$/i.test(clean)) {
      const inSuffix = harmonize('ssa', clean);
      testCases.push({
        name,
        localCase: `${clean}${inSuffix}`,
        localCaseType: 'in',
        genitive: `${clean}n`
      });
      continue;
    }

    // Default internal case with consonant gradation
    const weak = weakenConsonants(clean);
    const inSuffix = harmonize('ssa', clean);
    testCases.push({
      name,
      localCase: `${weak}${inSuffix}`,
      localCaseType: 'in',
      genitive: `${weak}n`
    });
  }

  const outPath = path.join(projectRoot, 'tests', 'fixtures', 'municipalities.fixture.ts');
  const code = `/**
 * Official Finnish Municipalities Benchmark Fixture (308 Municipalities).
 * Toponymic local case and base inflection test data.
 *
 * @packageDocumentation
 */

export interface MunicipalityTestCase {
  readonly name: string;
  readonly localCase: string;
  readonly localCaseType: 'in' | 'on';
  readonly genitive: string;
  readonly partitive?: string;
  readonly illative?: string;
}

export const MUNICIPALITY_TEST_CASES: readonly MunicipalityTestCase[] = ${JSON.stringify(testCases, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, code, 'utf8');
  console.log(`Generated ${testCases.length} municipality test cases in ${outPath}`);
}

main();
