import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { harmonize } from '../src/morphology/vowels.ts';
import { weakenConsonants } from '../src/morphology/gradation.ts';
import { matchNatureNoun, assembleCase } from '../src/morphology/index.ts';
import { inflectPlace } from '../src/place/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface CustomEntry {
  localCase: string;
  localFrom?: string;
  localTo?: string;
  localCaseType: 'in' | 'on';
  genitive: string;
  partitive?: string;
  illative?: string;
}

const CUSTOM_ENTRIES: Record<string, CustomEntry> = {
  // Manually verified entries
  'Koski Tl': { localCase: 'Koski Tl:llä', localFrom: 'Koski Tl:ltä', localTo: 'Koski Tl:lle', localCaseType: 'on', genitive: 'Koski Tl:n', partitive: 'Koski Tl:ää', illative: 'Koski Tl:ään' },
  'Pedersören kunta': { localCase: 'Pedersören kunnassa', localFrom: 'Pedersören kunnasta', localTo: 'Pedersören kuntaan', localCaseType: 'in', genitive: 'Pedersören kunnan', partitive: 'Pedersören kuntaa', illative: 'Pedersören kuntaan' },
  Brändö: { localCase: 'Brändössä', localCaseType: 'in', genitive: 'Brändön', partitive: 'Brändöä', illative: 'Brändöhön' },
  Föglö: { localCase: 'Föglössä', localCaseType: 'in', genitive: 'Föglön', partitive: 'Föglöä', illative: 'Föglöhön' },
  Geta: { localCase: 'Getassa', localFrom: 'Getasta', localTo: 'Getaan', localCaseType: 'in', genitive: 'Getan', partitive: 'Getaa', illative: 'Getaan' },
  Kumlinge: { localCase: 'Kumlingessa', localCaseType: 'in', genitive: 'Kumlingen', partitive: 'Kumlingea', illative: 'Kumlingeen' },
  Kuortane: { localCase: 'Kuortaneella', localFrom: 'Kuortaneelta', localTo: 'Kuortaneelle', localCaseType: 'on', genitive: 'Kuortaneen', partitive: 'Kuortanetta' },
  Lapua: { localCase: 'Lapualla', localCaseType: 'on', genitive: 'Lapuan', partitive: 'Lapuaa' },
  Lempäälä: { localCase: 'Lempäälässä', localCaseType: 'in', genitive: 'Lempäälän', partitive: 'Lempäälää', illative: 'Lempäälään' },
  Marttila: { localCase: 'Marttilassa', localCaseType: 'in', genitive: 'Marttilan', partitive: 'Marttilaa', illative: 'Marttilaan' },
  Multia: { localCase: 'Multialla', localCaseType: 'on', genitive: 'Multian', partitive: 'Multiaa' },
  Muurame: { localCase: 'Muuramessa', localCaseType: 'in', genitive: 'Muuramen', partitive: 'Muuramea', illative: 'Muurameen' },
  'Mänttä-Vilppula': { localCase: 'Mänttä-Vilppulassa', localCaseType: 'in', genitive: 'Mänttä-Vilppulan', partitive: 'Mänttä-Vilppulaa', illative: 'Mänttä-Vilppulaan' },
  Mäntyharju: { localCase: 'Mäntyharjulla', localCaseType: 'on', genitive: 'Mäntyharjun', partitive: 'Mäntyharjua' },

  // Compound vowel harmony and -pää head illative
  Järvenpää: { localCase: 'Järvenpäässä', localFrom: 'Järvenpäästä', localTo: 'Järvenpäähän', localCaseType: 'in', genitive: 'Järvenpään', partitive: 'Järvenpäätä', illative: 'Järvenpäähän' },
  Kankaanpää: { localCase: 'Kankaanpäässä', localFrom: 'Kankaanpäästä', localTo: 'Kankaanpäähän', localCaseType: 'in', genitive: 'Kankaanpään', partitive: 'Kankaanpäätä', illative: 'Kankaanpäähän' },
  Kruunupyy: { localCase: 'Kruunupyyssä', localFrom: 'Kruunupyystä', localTo: 'Kruunupyyhyn', localCaseType: 'in', genitive: 'Kruunupyyn', partitive: 'Kruunupyytä', illative: 'Kruunupyyhyn' },
  Oripää: { localCase: 'Oripäässä', localFrom: 'Oripäästä', localTo: 'Oripäähän', localCaseType: 'in', genitive: 'Oripään', partitive: 'Oripäätä', illative: 'Oripäähän' },
  Sodankylä: { localCase: 'Sodankylässä', localFrom: 'Sodankylästä', localTo: 'Sodankylään', localCaseType: 'in', genitive: 'Sodankylän', partitive: 'Sodankylää', illative: 'Sodankylään' },

  // Swedish/foreign consonant endings
  Hammarland: { localCase: 'Hammarlandissa', localCaseType: 'in', genitive: 'Hammarlandin', partitive: 'Hammarlandia', illative: 'Hammarlandiin' },
  Korsnäs: { localCase: 'Korsnäsissä', localCaseType: 'in', genitive: 'Korsnäsin', partitive: 'Korsnäsiä', illative: 'Korsnäsiin' },
  Kökar: { localCase: 'Kökarissa', localCaseType: 'in', genitive: 'Kökarin', partitive: 'Kökaria', illative: 'Kökariin' },
  Lemland: { localCase: 'Lemlandissa', localCaseType: 'in', genitive: 'Lemlandin', partitive: 'Lemlandia', illative: 'Lemlandiin' },
  Lumparland: { localCase: 'Lumparlandissa', localCaseType: 'in', genitive: 'Lumparlandin', partitive: 'Lumparlandia', illative: 'Lumparlandiin' },
  Saltvik: { localCase: 'Saltvikissa', localCaseType: 'in', genitive: 'Saltvikin', partitive: 'Saltvikia', illative: 'Saltvikiin' },
  Sund: { localCase: 'Sundissa', localCaseType: 'in', genitive: 'Sundin', partitive: 'Sundia', illative: 'Sundiin' },
  Kirkkonummi: { localCase: 'Kirkkonummella', localFrom: 'Kirkkonummelta', localTo: 'Kirkkonummelle', localCaseType: 'on', genitive: 'Kirkkonummen', partitive: 'Kirkkonummea' },
  Raahe: { localCase: 'Raahessa', localFrom: 'Raahesta', localTo: 'Raaheen', localCaseType: 'in', genitive: 'Raahen', partitive: 'Raahea', illative: 'Raaheen' },
  Uusikaupunki: { localCase: 'Uudessakaupungissa', localFrom: 'Uudestakaupungista', localTo: 'Uuteenkaupunkiin', localCaseType: 'in', genitive: 'Uudenkaupungin', partitive: 'Uuttakaupunkia', illative: 'Uuteenkaupunkiin' },
  Uusikaarlepyy: { localCase: 'Uudessakaarlepyyssä', localFrom: 'Uudestakaarlepyystä', localTo: 'Uuteenkaarlepyyhyn', localCaseType: 'in', genitive: 'Uudenkaarlepyyn', partitive: 'Uuttakaarlepyytä', illative: 'Uuteenkaarlepyyhyn' },
  Isokyrö: { localCase: 'Isossakyrössä', localFrom: 'Isostakyröstä', localTo: 'Isoonkyröön', localCaseType: 'in', genitive: 'Isonkyrön', partitive: 'Isoakyröä', illative: 'Isoonkyröön' },

  // Special external case municipal roots
  Alavus: { localCase: 'Alavudella', localFrom: 'Alavudelta', localTo: 'Alavudelle', localCaseType: 'on', genitive: 'Alavuden', partitive: 'Alavutta' },
  Enontekiö: { localCase: 'Enontekiöllä', localCaseType: 'on', genitive: 'Enontekiön', partitive: 'Enontekiötä' },
  Halsua: { localCase: 'Halsualla', localCaseType: 'on', genitive: 'Halsuan', partitive: 'Halsuaa' },
  Hyvinkää: { localCase: 'Hyvinkäällä', localCaseType: 'on', genitive: 'Hyvinkään', partitive: 'Hyvinkäätä' },
  Imatra: { localCase: 'Imatralla', localCaseType: 'on', genitive: 'Imatran', partitive: 'Imatraa' },
  Kaavi: { localCase: 'Kaavilla', localCaseType: 'on', genitive: 'Kaavin', partitive: 'Kaavia' },
  Kangasala: { localCase: 'Kangasalla', localFrom: 'Kangasalta', localTo: 'Kangasalle', localCaseType: 'on', genitive: 'Kangasalan', partitive: 'Kangasalaa' },
  Kaustinen: { localCase: 'Kaustisella', localCaseType: 'on', genitive: 'Kaustisen', partitive: 'Kaustista' },
  Kauhava: { localCase: 'Kauhavalla', localCaseType: 'on', genitive: 'Kauhavan', partitive: 'Kauhavaa' },
  Keitele: { localCase: 'Keiteleellä', localFrom: 'Keiteleeltä', localTo: 'Keiteleelle', localCaseType: 'on', genitive: 'Keiteleen', partitive: 'Keitelettä' },
  Kerava: { localCase: 'Keravalla', localCaseType: 'on', genitive: 'Keravan', partitive: 'Keravaa' },
  Kitee: { localCase: 'Kiteellä', localCaseType: 'on', genitive: 'Kiteen', partitive: 'Kiteetä' },
  Laihia: { localCase: 'Laihialla', localCaseType: 'on', genitive: 'Laihian', partitive: 'Laihiaa' },
  Lapinlahti: { localCase: 'Lapinlahdella', localCaseType: 'on', genitive: 'Lapinlahden', partitive: 'Lapinlahtea' },
  Lemi: { localCase: 'Lemillä', localCaseType: 'on', genitive: 'Lemin', partitive: 'Lemiä' },
  Leppävirta: { localCase: 'Leppävirralla', localCaseType: 'on', genitive: 'Leppävirran', partitive: 'Leppävirtaa' },
  Lohja: { localCase: 'Lohjalla', localCaseType: 'on', genitive: 'Lohjan', partitive: 'Lohjaa' },
  Loimaa: { localCase: 'Loimaalla', localCaseType: 'on', genitive: 'Loimaan', partitive: 'Loimaata' },
  Loppi: { localCase: 'Lopella', localFrom: 'Lopelta', localTo: 'Lopelle', localCaseType: 'on', genitive: 'Lopen', partitive: 'Loppea' },
  Luumäki: { localCase: 'Luumäellä', localCaseType: 'on', genitive: 'Luumäen', partitive: 'Luumäkeä' },
  Muhos: { localCase: 'Muhoksella', localFrom: 'Muhokselta', localTo: 'Muhokselle', localCaseType: 'on', genitive: 'Muhoksen', partitive: 'Muhosta' },
  Merikarvia: { localCase: 'Merikarvialla', localFrom: 'Merikarvialta', localTo: 'Merikarvialle', localCaseType: 'on', genitive: 'Merikarvian', partitive: 'Merikarviaa' },
  Nokia: { localCase: 'Nokialla', localCaseType: 'on', genitive: 'Nokian', partitive: 'Nokiaa' },
  Parainen: { localCase: 'Paraisilla', localCaseType: 'on', genitive: 'Paraisten', partitive: 'Paraisia' },
  Pertunmaa: { localCase: 'Pertunmaalla', localCaseType: 'on', genitive: 'Pertunmaan', partitive: 'Pertunmaata' },
  Pihtipudas: { localCase: 'Pihtiputaalla', localFrom: 'Pihtiputaalta', localTo: 'Pihtiputaalle', localCaseType: 'on', genitive: 'Pihtiputaan', partitive: 'Pihtipudasta' },
  Posio: { localCase: 'Posiolla', localCaseType: 'on', genitive: 'Posion', partitive: 'Posiota' },
  Punkalaidun: { localCase: 'Punkalaitumella', localFrom: 'Punkalaitumelta', localTo: 'Punkalaitumelle', localCaseType: 'on', genitive: 'Punkalaitumen', partitive: 'Punkalaidunta' },
  Puolanka: { localCase: 'Puolangalla', localCaseType: 'on', genitive: 'Puolangan', partitive: 'Puolankaa' },
  Pyhtää: { localCase: 'Pyhtäällä', localCaseType: 'on', genitive: 'Pyhtään', partitive: 'Pyhtäätä' },
  Pyhäntä: { localCase: 'Pyhännällä', localCaseType: 'on', genitive: 'Pyhännän', partitive: 'Pyhäntää' },
  Pälkäne: { localCase: 'Pälkäneellä', localFrom: 'Pälkäneeltä', localTo: 'Pälkäneelle', localCaseType: 'on', genitive: 'Pälkäneen', partitive: 'Pälkänettä' },
  Pöytyä: { localCase: 'Pöytyällä', localCaseType: 'on', genitive: 'Pöytyän', partitive: 'Pöytyää' },
  Ranua: { localCase: 'Ranualla', localCaseType: 'on', genitive: 'Ranuan', partitive: 'Ranuaa' },
  Rauma: { localCase: 'Raumalla', localCaseType: 'on', genitive: 'Rauman', partitive: 'Raumaa' },
  Rautalampi: { localCase: 'Rautalammilla', localFrom: 'Rautalammilta', localTo: 'Rautalammille', localCaseType: 'on', genitive: 'Rautalammin', partitive: 'Rautalampia' },
  Rovaniemi: { localCase: 'Rovaniemellä', localCaseType: 'on', genitive: 'Rovaniemen', partitive: 'Rovaniemeä' },
  Ruokolahti: { localCase: 'Ruokolahdella', localCaseType: 'on', genitive: 'Ruokolahden', partitive: 'Ruokolahtea' },
  Rusko: { localCase: 'Ruskolla', localCaseType: 'on', genitive: 'Ruskon', partitive: 'Ruskoa' },
  Savitaipale: { localCase: 'Savitaipaleella', localFrom: 'Savitaipaleelta', localTo: 'Savitaipaleelle', localCaseType: 'on', genitive: 'Savitaipaleen', partitive: 'Savitaipaletta' },
  Somero: { localCase: 'Somerolla', localCaseType: 'on', genitive: 'Someron', partitive: 'Someroa' },
  Sulkava: { localCase: 'Sulkavalla', localCaseType: 'on', genitive: 'Sulkavan', partitive: 'Sulkavaa' },
  Tampere: { localCase: 'Tampereella', localFrom: 'Tampereelta', localTo: 'Tampereelle', localCaseType: 'on', genitive: 'Tampereen', partitive: 'Tamperetta' },
  Teuva: { localCase: 'Teuvalla', localCaseType: 'on', genitive: 'Teuvan', partitive: 'Teuvaa' },
  Toholampi: { localCase: 'Toholammilla', localFrom: 'Toholammilta', localTo: 'Toholammille', localCaseType: 'on', genitive: 'Toholammin', partitive: 'Toholampia' },
  Tyrnävä: { localCase: 'Tyrnävällä', localCaseType: 'on', genitive: 'Tyrnävän', partitive: 'Tyrnävää' },
  Uurainen: { localCase: 'Uuraisilla', localCaseType: 'on', genitive: 'Uuraisten', partitive: 'Uuraisia' },
  Vantaa: { localCase: 'Vantaalla', localCaseType: 'on', genitive: 'Vantaan', partitive: 'Vantaata' },
  Vehmaa: { localCase: 'Vehmaalla', localCaseType: 'on', genitive: 'Vehmaan', partitive: 'Vehmaata' },
  Vesanto: { localCase: 'Vesannolla', localCaseType: 'on', genitive: 'Vesannon', partitive: 'Vesantoa' },
  Vieremä: { localCase: 'Vieremällä', localCaseType: 'on', genitive: 'Vieremän', partitive: 'Vieremää' },
  Virrat: { localCase: 'Virroilla', localFrom: 'Virroilta', localTo: 'Virroille', localCaseType: 'on', genitive: 'Virtojen', partitive: 'Virtoja' },
  Vöyri: { localCase: 'Vöyrillä', localCaseType: 'on', genitive: 'Vöyrin', partitive: 'Vöyriä' },
  Ylitornio: { localCase: 'Ylitorniolla', localCaseType: 'on', genitive: 'Ylitornion', partitive: 'Ylitorniota' },
  Ypäjä: { localCase: 'Ypäjällä', localCaseType: 'on', genitive: 'Ypäjän', partitive: 'Ypäjää' },

  // Exceptions to island suffix -saari / -luoto
  Pietarsaari: { localCase: 'Pietarsaaressa', localCaseType: 'in', genitive: 'Pietarsaaren', partitive: 'Pietarsaarta', illative: 'Pietarsaareen' },
  Mustasaari: { localCase: 'Mustasaaressa', localFrom: 'Mustasaaresta', localTo: 'Mustasaareen', localCaseType: 'in', genitive: 'Mustasaaren', partitive: 'Mustasaarta', illative: 'Mustasaareen' },
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
  Kannus: { localCase: 'Kannuksessa', localFrom: 'Kannuksesta', localTo: 'Kannukseen', localCaseType: 'in', genitive: 'Kannuksen', partitive: 'Kannusta', illative: 'Kannukseen' },
  Nurmes: { localCase: 'Nurmeksessa', localFrom: 'Nurmeksesta', localTo: 'Nurmekseen', localCaseType: 'in', genitive: 'Nurmeksen', partitive: 'Nurmesta', illative: 'Nurmekseen' },
  Varkaus: { localCase: 'Varkaudessa', localFrom: 'Varkaudesta', localTo: 'Varkauteen', localCaseType: 'in', genitive: 'Varkauden', partitive: 'Varkautta', illative: 'Varkauteen' },

  // Kempele lengthened e
  Kempele: { localCase: 'Kempeleessä', localFrom: 'Kempeleestä', localTo: 'Kempeleeseen', localCaseType: 'in', genitive: 'Kempeleen', partitive: 'Kempelettä', illative: 'Kempeleeseen' },

  // Plural -inen municipalities
  Huittinen: { localCase: 'Huittisissa', localFrom: 'Huittisista', localTo: 'Huittisiin', localCaseType: 'in', genitive: 'Huittisten', partitive: 'Huittisia', illative: 'Huittisiin' },
  Ikaalinen: { localCase: 'Ikaalisissa', localFrom: 'Ikaalisista', localTo: 'Ikaalisiin', localCaseType: 'in', genitive: 'Ikaalisten', partitive: 'Ikaalisia', illative: 'Ikaalisiin' },
  Jokioinen: { localCase: 'Jokioisissa', localFrom: 'Jokioisista', localTo: 'Jokioisiin', localCaseType: 'in', genitive: 'Jokioisten', partitive: 'Jokioisia', illative: 'Jokioisiin' },
  Joroinen: { localCase: 'Joroisissa', localFrom: 'Joroisista', localTo: 'Joroisiin', localCaseType: 'in', genitive: 'Joroisten', partitive: 'Joroisia', illative: 'Joroisiin' },
  Kaskinen: { localCase: 'Kaskisissa', localFrom: 'Kaskisista', localTo: 'Kaskisiin', localCaseType: 'in', genitive: 'Kaskisten', partitive: 'Kaskisia', illative: 'Kaskisiin' },
  Kauniainen: { localCase: 'Kauniaisissa', localFrom: 'Kauniaisista', localTo: 'Kauniaisiin', localCaseType: 'in', genitive: 'Kauniaisten', partitive: 'Kauniaisia', illative: 'Kauniaisiin' },
  Kuhmoinen: { localCase: 'Kuhmoisissa', localFrom: 'Kuhmoisista', localTo: 'Kuhmoisiin', localCaseType: 'in', genitive: 'Kuhmoisten', partitive: 'Kuhmoisia', illative: 'Kuhmoisiin' },
  Nousiainen: { localCase: 'Nousiaisissa', localFrom: 'Nousiaisista', localTo: 'Nousiaisiin', localCaseType: 'in', genitive: 'Nousiaisten', partitive: 'Nousiaisia', illative: 'Nousiaisiin' },
  Oulainen: { localCase: 'Oulaisissa', localFrom: 'Oulaisista', localTo: 'Oulaisiin', localCaseType: 'in', genitive: 'Oulaisten', partitive: 'Oulaisia', illative: 'Oulaisiin' },
  Pornainen: { localCase: 'Pornaisissa', localFrom: 'Pornaisista', localTo: 'Pornaisiin', localCaseType: 'in', genitive: 'Pornaisten', partitive: 'Pornaisia', illative: 'Pornaisiin' },
  Siikainen: { localCase: 'Siikaisissa', localFrom: 'Siikaisista', localTo: 'Siikaisiin', localCaseType: 'in', genitive: 'Siikaisten', partitive: 'Siikaisia', illative: 'Siikaisiin' }
};

function deriveSpatialTriad(
  name: string,
  localCase: string,
  localCaseType: 'in' | 'on',
  illative?: string
): { localFrom: string; localTo: string } {
  const isFront = /[äöy]/i.test(localCase.slice(-3));
  if (localCaseType === 'on') {
    return {
      localFrom: `${localCase.slice(0, -3)}${isFront ? 'ltä' : 'lta'}`,
      localTo: `${localCase.slice(0, -3)}lle`
    };
  }
  return {
    localFrom: `${localCase.slice(0, -3)}${isFront ? 'stä' : 'sta'}`,
    localTo: illative ?? inflectPlace(name, 'localTo')
  };
}

function main(): void {
  const inputPath = path.join(projectRoot, 'data', 'municipalities.txt');
  const names = fs.readFileSync(inputPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const testCases: Array<Record<string, unknown>> = [];

  for (const name of names) {
    if (CUSTOM_ENTRIES[name]) {
      const c = CUSTOM_ENTRIES[name];
      const fallbackTriad = deriveSpatialTriad(name, c.localCase, c.localCaseType, c.illative);
      testCases.push({
        name,
        localCase: c.localCase,
        localFrom: c.localFrom ?? fallbackTriad.localFrom,
        localTo: c.localTo ?? fallbackTriad.localTo,
        localCaseType: c.localCaseType,
        genitive: c.genitive,
        ...(c.partitive ? { partitive: c.partitive } : {}),
        ...(c.illative ? { illative: c.illative } : {})
      });
      continue;
    }

    const clean = name;

    // Nature suffix heuristics using canonical morphology engine
    const nature = matchNatureNoun(name);
    if (nature) {
      testCases.push({
        name,
        localCase: assembleCase(nature, 'local'),
        localFrom: assembleCase(nature, 'localFrom'),
        localTo: assembleCase(nature, 'localTo'),
        localCaseType: nature.defaultSpatialCase,
        genitive: assembleCase(nature, 'genitive'),
        partitive: assembleCase(nature, 'partitive'),
        illative: assembleCase(nature, 'illative')
      });
      continue;
    }

    if (/(?:vaara|harju|kangas|suo)$/i.test(clean)) {
      const adSuffix = harmonize('lla', clean);
      const weak = weakenConsonants(clean);
      const localCase = `${weak}${adSuffix}`;
      const triad = deriveSpatialTriad(name, localCase, 'on');
      testCases.push({
        name,
        localCase,
        localFrom: triad.localFrom,
        localTo: triad.localTo,
        localCaseType: 'on',
        genitive: `${weak}n`
      });
      continue;
    }

    // Swedish/foreign consonant endings
    if (/[bcdfghjklmnpqrstvwxz]$/i.test(clean)) {
      const inSuffix = harmonize('ssä', clean);
      const localCase = `${clean}i${inSuffix}`;
      const triad = deriveSpatialTriad(name, localCase, 'in');
      testCases.push({
        name,
        localCase,
        localFrom: triad.localFrom,
        localTo: triad.localTo,
        localCaseType: 'in',
        genitive: `${clean}in`
      });
      continue;
    }

    // Long vowel endings (Akaa, Espoo, Ii)
    if (/(?:aa|ää|oo|öö|uu|yy|ii)$/i.test(clean)) {
      const inSuffix = harmonize('ssa', clean);
      const localCase = `${clean}${inSuffix}`;
      const triad = deriveSpatialTriad(name, localCase, 'in');
      testCases.push({
        name,
        localCase,
        localFrom: triad.localFrom,
        localTo: triad.localTo,
        localCaseType: 'in',
        genitive: `${clean}n`
      });
      continue;
    }

    // Default internal case with consonant gradation
    const weak = weakenConsonants(clean);
    const inSuffix = harmonize('ssa', clean);
    const localCase = `${weak}${inSuffix}`;
    const triad = deriveSpatialTriad(name, localCase, 'in');
    testCases.push({
      name,
      localCase,
      localFrom: triad.localFrom,
      localTo: triad.localTo,
      localCaseType: 'in',
      genitive: `${weak}n`
    });
  }

  const jsonPath = path.join(projectRoot, 'tests', 'fixtures', 'municipalities.json');
  const jsonLines = testCases.map((tc) => `  ${JSON.stringify(tc)}`).join(',\n');
  const jsonContent = `[\n${jsonLines}\n]\n`;

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, jsonContent, 'utf8');
  console.log(`Generated ${testCases.length} municipality test cases in ${jsonPath}`);
}

main();
