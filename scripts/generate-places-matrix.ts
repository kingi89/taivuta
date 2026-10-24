/**
 * Script to generate the municipalities inflection matrix CSV
 * comparing Gemini predictions, algorithmic heuristics, and leaving
 * empty columns for human review.
 *
 * Command: node --experimental-strip-types scripts/generate-places-matrix.ts
 *
 * @packageDocumentation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getVowelHarmony, harmonize } from '../src/morphology/vowels.ts';
import { weakenConsonants } from '../src/morphology/gradation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface MunicipalityMeta {
  readonly localEnding: string;
  readonly reason: string;
  readonly localCase: 'in' | 'on';
  readonly plural?: boolean;
  readonly customStems?: {
    readonly nominative?: string;
    readonly genitive?: string;
    readonly partitive?: string;
    readonly inessive?: string;
    readonly elative?: string;
    readonly illative?: string;
    readonly adessive?: string;
    readonly ablative?: string;
    readonly allative?: string;
    readonly essive?: string;
    readonly translative?: string;
  };
}

/**
 * Toponym suffix heuristics for the pure baseline algorithm.
 */
function getAlgorithmicPrediction(name: string): { ending: string; reason: string; localCase: 'in' | 'on' } {
  const clean = name.replace(/\s+-\s+.*$/, '').replace(/\s+Tl$/, '').replace(/\s+kunta$/, '');
  const harmony = getVowelHarmony(clean);
  const inessiveSuffix = harmonize('ssa', clean);
  const adessiveSuffix = harmonize('lla', clean);

  if (/(?:järvi|vesi)$/i.test(clean)) {
    return { ending: '-llä', reason: 'Toponym suffix -järvi/-vesi (external)', localCase: 'on' };
  }
  if (/(?:mäki)$/i.test(clean)) {
    return { ending: '-llä', reason: 'Toponym suffix -mäki (external)', localCase: 'on' };
  }
  if (/(?:joki)$/i.test(clean)) {
    return { ending: '-lla', reason: 'Toponym suffix -joki (external)', localCase: 'on' };
  }
  if (/(?:vaara|harju|kangas|suo|vuori)$/i.test(clean)) {
    return { ending: `-${adessiveSuffix}`, reason: 'Toponym suffix -vaara/-harju/-kangas (external)', localCase: 'on' };
  }
  if (/(?:koski)$/i.test(clean)) {
    return { ending: '-lla', reason: 'Toponym suffix -koski (external)', localCase: 'on' };
  }
  if (/(?:salmi)$/i.test(clean)) {
    return { ending: '-lla', reason: 'Toponym suffix -salmi (external)', localCase: 'on' };
  }
  if (/(?:saari|luoto|kari)$/i.test(clean)) {
    return { ending: `-${adessiveSuffix}`, reason: 'Toponym suffix -saari/-luoto/-kari (external)', localCase: 'on' };
  }
  if (/(?:nummi)$/i.test(clean)) {
    return { ending: '-lla', reason: 'Toponym suffix -nummi (external)', localCase: 'on' };
  }
  if (/(?:kylä|lahti|linna|pelto)$/i.test(clean)) {
    return { ending: `-${inessiveSuffix}`, reason: 'Toponym suffix -kylä/-lahti/-linna (internal)', localCase: 'in' };
  }

  // Fallback defaults
  if (harmony === 'front' && /[äö]/i.test(clean)) {
    return { ending: `-${inessiveSuffix}`, reason: 'Default internal case with front vowel harmony', localCase: 'in' };
  }
  if (harmony === 'back') {
    return { ending: `-${inessiveSuffix}`, reason: 'Default internal case with back vowel harmony', localCase: 'in' };
  }
  return { ending: `-${inessiveSuffix}`, reason: 'Default without front or back vowel', localCase: 'in' };
}

/**
 * Curated local case data and morphological specialities for municipalities.
 */
const TOPONYMIC_EXCEPTIONS: Record<string, MunicipalityMeta> = {
  Helsinki: {
    localEnding: '-gissä',
    reason: 'Internal dictionary with äng gradation',
    localCase: 'in'
  },
  Turku: {
    localEnding: '-ussa',
    reason: 'Internal case with rk->r gradation (Turussa)',
    localCase: 'in'
  },
  Tampere: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Tampere takes external case (Tampereella)',
    localCase: 'on',
    customStems: {
      genitive: 'Tampereen',
      partitive: 'Tamperetta',
      inessive: 'Tampereessa',
      elative: 'Tampereesta',
      illative: 'Tampereeseen',
      adessive: 'Tampereella',
      ablative: 'Tampereelta',
      allative: 'Tampereelle',
      essive: 'Tampereena',
      translative: 'Tampereeksi'
    }
  },
  Vantaa: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Vantaa takes external case (Vantaalla)',
    localCase: 'on'
  },
  Rovaniemi: {
    localEnding: '-llä',
    reason: 'Toponymic external case with niemi->nieme stem (Rovaniemellä)',
    localCase: 'on'
  },
  Rauma: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Rauma takes external case (Raumalla)',
    localCase: 'on'
  },
  Lohja: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Lohja takes external case (Lohjalla)',
    localCase: 'on'
  },
  Nokia: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Nokia takes external case (Nokialla)',
    localCase: 'on'
  },
  Kangasala: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Kangasala takes external case on shortened stem (Kangasalla)',
    localCase: 'on',
    customStems: {
      genitive: 'Kangasalan',
      partitive: 'Kangasalaa',
      inessive: 'Kangasalla',
      elative: 'Kangasalta',
      illative: 'Kangasalle',
      adessive: 'Kangasalla',
      ablative: 'Kangasalta',
      allative: 'Kangasalle'
    }
  },
  Imatra: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Imatra takes external case (Imatralla)',
    localCase: 'on'
  },
  Kerava: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Kerava takes external case (Keravalla)',
    localCase: 'on'
  },
  Hyvinkää: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Hyvinkää takes external case (Hyvinkäällä)',
    localCase: 'on'
  },
  Kaustinen: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Kaustinen takes singular external case (Kaustisella)',
    localCase: 'on',
    customStems: {
      nominative: 'Kaustinen',
      genitive: 'Kaustisen',
      partitive: 'Kaustista',
      inessive: 'Kaustisessa',
      elative: 'Kaustisesta',
      illative: 'Kaustiseen',
      adessive: 'Kaustisella',
      ablative: 'Kaustiselta',
      allative: 'Kaustiselle',
      essive: 'Kaustisena',
      translative: 'Kaustiseksi'
    }
  },
  Alavus: {
    localEnding: '-della',
    reason: 'Toponymic external case with s->de gradation (Alavudella)',
    localCase: 'on',
    customStems: {
      nominative: 'Alavus',
      genitive: 'Alavuden',
      partitive: 'Alavutta',
      inessive: 'Alavudessa',
      elative: 'Alavudesta',
      illative: 'Alavuteen',
      adessive: 'Alavudella',
      ablative: 'Alavudelta',
      allative: 'Alavudelle',
      essive: 'Alavutena',
      translative: 'Alavudeksi'
    }
  },
  Enontekiö: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Enontekiö takes external case (Enontekiöllä)',
    localCase: 'on',
    customStems: {
      nominative: 'Enontekiö',
      genitive: 'Enontekiön',
      partitive: 'Enontekiötä',
      inessive: 'Enontekiössä',
      elative: 'Enontekiöstä',
      illative: 'Enontekiöön',
      adessive: 'Enontekiöllä',
      ablative: 'Enontekiöltä',
      allative: 'Enontekiölle',
      essive: 'Enontekiönä',
      translative: 'Enontekiöksi'
    }
  },
  Loimaa: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Loimaa takes external case (Loimaalla)',
    localCase: 'on'
  },
  Uusikaupunki: {
    localEnding: '-ssa',
    reason: 'Compound adjective: both parts inflect in internal case (Uudessakaupungissa)',
    localCase: 'in',
    customStems: {
      genitive: 'Uudenkaupungin',
      partitive: 'Uuttakaupunkia',
      inessive: 'Uudessakaupungissa',
      elative: 'Uudestakaupungista',
      illative: 'Uuteenkaupunkiin',
      adessive: 'Uudellakaupungilla',
      ablative: 'Uudeltakaupungilta',
      allative: 'Uudellekaupungille',
      essive: 'Uutenakaupunkina',
      translative: 'Uudeksikaupungiksi'
    }
  },
  Kauniainen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Kauniaisissa)',
    localCase: 'in',
    plural: true
  },
  Huittinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Huittisissa)',
    localCase: 'in',
    plural: true
  },
  Ikaalinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Ikaalisissa)',
    localCase: 'in',
    plural: true
  },
  Jokioinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Jokioisissa)',
    localCase: 'in',
    plural: true
  },
  Joroinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Joroisissa)',
    localCase: 'in',
    plural: true
  },
  Oulainen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Oulaisissa)',
    localCase: 'in',
    plural: true
  },
  Nousiainen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Nousiaisissa)',
    localCase: 'in',
    plural: true
  },
  Pornainen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Pornaisissa)',
    localCase: 'in',
    plural: true
  },
  Kaskinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Kaskisissa)',
    localCase: 'in',
    plural: true
  },
  Kuhmoinen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Kuhmoisissa)',
    localCase: 'in',
    plural: true
  },
  Siikainen: {
    localEnding: '-sissa',
    reason: 'Toponymic plural internal case (Siikaisissa)',
    localCase: 'in',
    plural: true
  },
  Parainen: {
    localEnding: '-silla',
    reason: 'Toponymic plural external case (Paraisilla)',
    localCase: 'on',
    plural: true
  },
  Uurainen: {
    localEnding: '-silla',
    reason: 'Toponymic plural external case (Uuraisilla)',
    localCase: 'on',
    plural: true
  },
  Pietarsaari: {
    localEnding: '-ssa',
    reason: 'Toponymic convention: Pietarsaari takes internal case (Pietarsaaressa)',
    localCase: 'in'
  },
  Hailuoto: {
    localEnding: '-ssa',
    reason: 'Toponymic convention: Hailuoto takes internal case (Hailuodossa)',
    localCase: 'in'
  },
  Pyhtää: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Pyhtää takes external case (Pyhtäällä)',
    localCase: 'on'
  },
  Teuva: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Teuva takes external case (Teuvalla)',
    localCase: 'on'
  },
  Tyrnävä: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Tyrnävä takes external case (Tyrnävällä)',
    localCase: 'on'
  },
  Pyhäntä: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Pyhäntä takes external case (Pyhännällä)',
    localCase: 'on'
  },
  Lemi: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Lemi takes external case (Lemillä)',
    localCase: 'on'
  },
  Savitaipale: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Savitaipale takes external case (Savitaipaleella)',
    localCase: 'on'
  },
  Luumäki: {
    localEnding: '-llä',
    reason: 'Toponymic convention: Luumäki takes external case (Luumäellä)',
    localCase: 'on'
  },
  Ruokolahti: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Ruokolahti takes external case (Ruokolahdella)',
    localCase: 'on'
  },
  Posio: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Posio takes external case (Posiolla)',
    localCase: 'on'
  },
  Ranua: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Ranua takes external case (Ranualla)',
    localCase: 'on'
  },
  Kannus: {
    localEnding: '-ssa',
    reason: 'Toponymic internal case (Kannuksessa)',
    localCase: 'in',
    customStems: {
      genitive: 'Kannuksen',
      partitive: 'Kannusta',
      inessive: 'Kannuksessa',
      elative: 'Kannuksesta',
      illative: 'Kannukseen',
      adessive: 'Kannuksella',
      ablative: 'Kannukselta',
      allative: 'Kannukselle',
      essive: 'Kannuksena',
      translative: 'Kannukseksi'
    }
  },
  Muhos: {
    localEnding: '-lla',
    reason: 'Toponymic external case (Muhoksella)',
    localCase: 'on',
    customStems: {
      genitive: 'Muhoksen',
      partitive: 'Muhosta',
      inessive: 'Muhoksessa',
      elative: 'Muhoksesta',
      illative: 'Muhokseen',
      adessive: 'Muhoksella',
      ablative: 'Muhokselta',
      allative: 'Muhokselle',
      essive: 'Muhoksena',
      translative: 'Muhokseksi'
    }
  },
  Nurmes: {
    localEnding: '-ssa',
    reason: 'Toponymic internal case (Nurmeksessa)',
    localCase: 'in',
    customStems: {
      genitive: 'Nurmeksen',
      partitive: 'Nurmesta',
      inessive: 'Nurmeksessa',
      elative: 'Nurmeksesta',
      illative: 'Nurmekseen',
      adessive: 'Nurmeksella',
      ablative: 'Nurmekselta',
      allative: 'Nurmekselle',
      essive: 'Nurmeksena',
      translative: 'Nurmekseksi'
    }
  },
  Pihtipudas: {
    localEnding: '-lla',
    reason: 'Toponymic external case with s-stem gradation (Pihtiputaalla)',
    localCase: 'on',
    customStems: {
      genitive: 'Pihtiputaan',
      partitive: 'Pihtipudasta',
      inessive: 'Pihtiputaassa',
      elative: 'Pihtiputaasta',
      illative: 'Pihtiputaaseen',
      adessive: 'Pihtiputaalla',
      ablative: 'Pihtiputaalta',
      allative: 'Pihtiputaalle',
      essive: 'Pihtiputaana',
      translative: 'Pihtiputaaksi'
    }
  },
  Punkalaidun: {
    localEnding: '-lla',
    reason: 'Toponymic external case with laidun->laitumella stem (Punkalaitumella)',
    localCase: 'on',
    customStems: {
      genitive: 'Punkalaitumen',
      partitive: 'Punkalaidunta',
      inessive: 'Punkalaitumessa',
      elative: 'Punkalaitumesta',
      illative: 'Punkalaitumeen',
      adessive: 'Punkalaitumella',
      ablative: 'Punkalaitumelta',
      allative: 'Punkalaitumelle',
      essive: 'Punkalaitumena',
      translative: 'Punkalaitumeksi'
    }
  },
  Virrat: {
    localEnding: '-lla',
    reason: 'Toponymic plural external case (Virroilla)',
    localCase: 'on',
    customStems: {
      genitive: 'Virtojen',
      partitive: 'Virtoja',
      inessive: 'Virroissa',
      elative: 'Virroista',
      illative: 'Virtoihin',
      adessive: 'Virroilla',
      ablative: 'Virroilta',
      allative: 'Virroille',
      essive: 'Virtoina',
      translative: 'Virroiksi'
    }
  },
  Kitee: {
    localEnding: '-llä',
    reason: 'Toponymic external case (Kiteellä)',
    localCase: 'on',
    customStems: {
      genitive: 'Kiteen',
      partitive: 'Kiteetä',
      inessive: 'Kiteessä',
      elative: 'Kiteestä',
      illative: 'Kiteeseen',
      adessive: 'Kiteellä',
      ablative: 'Kiteeltä',
      allative: 'Kiteelle',
      essive: 'Kiteenä',
      translative: 'Kiteeksi'
    }
  },
  'Koski Tl': {
    localEnding: '-lla',
    reason: 'Toponym Koski takes external case with Tl modifier (Koskella Tl)',
    localCase: 'on'
  },
  'Pedersören kunta': {
    localEnding: '-ssa',
    reason: 'Official entry contains "kunta" modifier; inflects as Pedersören kunnassa (commonly Pedersöressä)',
    localCase: 'in',
    customStems: {
      genitive: 'Pedersören kunnan',
      partitive: 'Pedersören kuntaa',
      inessive: 'Pedersören kunnassa',
      elative: 'Pedersören kunnasta',
      illative: 'Pedersören kuntaan',
      adessive: 'Pedersören kunnalla',
      ablative: 'Pedersören kunnalta',
      allative: 'Pedersören kunnalle',
      essive: 'Pedersören kuntana',
      translative: 'Pedersören kunnaksi'
    }
  },
  Karkkila: {
    localEnding: '-ssa',
    reason: 'Internal case (Karkkilassa)',
    localCase: 'in'
  },
  Kemi: {
    localEnding: '-ssä',
    reason: 'Internal case (Kemissä)',
    localCase: 'in'
  },
  Keminmaa: {
    localEnding: '-ssa',
    reason: 'Internal case (Keminmaassa / Keminmaahan)',
    localCase: 'in'
  },
  Kempele: {
    localEnding: '-ssä',
    reason: 'Internal case with lengthened e (Kempeleessä)',
    localCase: 'in'
  },
  Kokkola: {
    localEnding: '-ssa',
    reason: 'Internal case with kk->k gradation (Kokkolassa)',
    localCase: 'in'
  },
  Kotka: {
    localEnding: '-ssa',
    reason: 'Internal case with tk resisting gradation (Kotkassa)',
    localCase: 'in'
  },
  Kouvola: {
    localEnding: '-ssa',
    reason: 'Internal case (Kouvolassa)',
    localCase: 'in'
  },
  Kuopio: {
    localEnding: '-ssa',
    reason: 'Internal case (Kuopiossa)',
    localCase: 'in'
  },
  Lahti: {
    localEnding: '-ssa',
    reason: 'Internal case with ht->hd gradation (Lahdessa)',
    localCase: 'in'
  },
  Lappeenranta: {
    localEnding: '-ssa',
    reason: 'Internal case with nt->nn gradation (Lappeenrannassa)',
    localCase: 'in'
  },
  Mikkeli: {
    localEnding: '-ssä',
    reason: 'Internal case (Mikkelissä)',
    localCase: 'in'
  },
  Mänttä: {
    localEnding: '-ssä',
    reason: 'Internal case with tt->t gradation (Mäntässä)',
    localCase: 'in'
  },
  Naantali: {
    localEnding: '-ssa',
    reason: 'Internal case (Naantalissa)',
    localCase: 'in'
  },
  Oulu: {
    localEnding: '-ssa',
    reason: 'Internal case (Oulussa)',
    localCase: 'in'
  },
  Pori: {
    localEnding: '-ssa',
    reason: 'Internal case (Porissa)',
    localCase: 'in'
  },
  Porvoo: {
    localEnding: '-ssa',
    reason: 'Internal case (Porvoossa)',
    localCase: 'in'
  },
  Raahe: {
    localEnding: '-ssa',
    reason: 'Internal case (Raahessa)',
    localCase: 'in'
  },
  Salo: {
    localEnding: '-ssa',
    reason: 'Internal case with l-stem resistance (Salossa)',
    localCase: 'in'
  },
  Savonlinna: {
    localEnding: '-ssa',
    reason: 'Internal case (Savonlinnassa)',
    localCase: 'in'
  },
  Seinäjoki: {
    localEnding: '-lla',
    reason: 'Toponym suffix -joki takes external case (Seinäjoella)',
    localCase: 'on'
  },
  Tornio: {
    localEnding: '-ssa',
    reason: 'Internal case (Torniossa)',
    localCase: 'in'
  },
  Ulvila: {
    localEnding: '-ssa',
    reason: 'Internal case (Ulvilassa)',
    localCase: 'in'
  },
  Varkaus: {
    localEnding: '-dessa',
    reason: 'Internal case with s->de gradation (Varkaudessa)',
    localCase: 'in',
    customStems: {
      genitive: 'Varkauden',
      partitive: 'Varkautta',
      inessive: 'Varkaudessa',
      elative: 'Varkaudesta',
      illative: 'Varkauteen',
      adessive: 'Varkaudella',
      ablative: 'Varkaudelta',
      allative: 'Varkaudelle',
      essive: 'Varkautena',
      translative: 'Varkaudeksi'
    }
  },
  Vihti: {
    localEnding: '-ssä',
    reason: 'Internal case with ht->hd gradation (Vihdissä)',
    localCase: 'in'
  },
  Ylitornio: {
    localEnding: '-lla',
    reason: 'Toponymic convention: Ylitornio takes external case (Ylitorniolla)',
    localCase: 'on'
  }
};

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/**
 * Inflects a place name into the 11 nominal cases.
 */
function resolveLongVowelIllativeEnding(clean: string): string {
  if (clean === 'Ii') return 'hin';
  if (clean.endsWith('uu')) return 'hun';
  if (clean.endsWith('yy')) return 'hyn';
  return 'seen';
}

function resolveStandardGenitive(clean: string, weakStem: string, isEPlace: boolean): string {
  if (isEPlace) {
    return `${clean}en`;
  }
  return `${weakStem}n`;
}

function resolveStandardPartitive(clean: string, isEPlace: boolean): string {
  if (/(?:io|iö)$/i.test(clean)) {
    return `${clean}${harmonize('ta', clean)}`;
  }
  if (isEPlace) {
    return `${clean}${harmonize('tta', clean)}`;
  }
  return `${clean}${harmonize('a', clean)}`;
}

function resolveStandardIllative(clean: string, isEPlace: boolean): string {
  if (isEPlace) {
    return `${clean}eseen`;
  }
  const lastVowel = clean.slice(-1);
  return `${clean}${lastVowel}n`;
}

function inflectPlaceAllCases(name: string, meta: { localCase: 'in' | 'on'; customStems?: Record<string, string>; plural?: boolean }): Record<string, string> {
  const clean = name.replace(/\s+-\s+.*$/, '').replace(/\s+Tl$/, '').replace(/\s+kunta$/, '');
  const isTl = name.endsWith(' Tl');
  const tlSuffix = isTl ? ' Tl' : '';

  if (meta.customStems) {
    const res: Record<string, string> = { nominative: name };
    for (const c of ['genitive', 'partitive', 'inessive', 'elative', 'illative', 'adessive', 'ablative', 'allative', 'essive', 'translative']) {
      res[c] = (meta.customStems[c] ?? clean) + tlSuffix;
    }
    return res;
  }

  // Handle plural -inen (Kauniainen -> Kauniaisissa, Huittinen -> Huittisissa)
  if (meta.plural && clean.endsWith('nen')) {
    const sStem = clean.endsWith('ainen')
      ? clean.slice(0, -5) + 'aisi'
      : clean.endsWith('inen')
        ? clean.slice(0, -4) + 'isi'
        : clean.slice(0, -3) + 'isi';
    const plStem = clean === 'Kauniainen'
      ? 'Kauniaisi'
      : clean === 'Huittinen'
        ? 'Huittisi'
        : clean === 'Parainen'
          ? 'Paraisi'
          : sStem;
    const baseStem = plStem.slice(0, -1);
    const inSuffix = harmonize('ssa', clean);
    const elSuffix = harmonize('sta', clean);
    const adSuffix = harmonize('lla', clean);
    const abSuffix = harmonize('lta', clean);
    const alSuffix = harmonize('lle', clean);
    const esSuffix = harmonize('na', clean);
    const trSuffix = harmonize('ksi', clean);
    const partSuffix = harmonize('a', clean);

    return {
      nominative: name,
      genitive: `${baseStem}ten${tlSuffix}`, // Kauniaisten / Huittisten
      partitive: `${plStem}${partSuffix}${tlSuffix}`, // Kauniaisia / Huittisia
      inessive: `${plStem}${inSuffix}${tlSuffix}`,
      elative: `${plStem}${elSuffix}${tlSuffix}`,
      illative: `${plStem}in${tlSuffix}`, // Kauniaisiin
      adessive: `${plStem}${adSuffix}${tlSuffix}`,
      ablative: `${plStem}${abSuffix}${tlSuffix}`,
      allative: `${plStem}${alSuffix}${tlSuffix}`,
      essive: `${plStem}${esSuffix}${tlSuffix}`,
      translative: `${plStem}${trSuffix}${tlSuffix}`
    };
  }

  // Handle toponymic nature suffixes (-järvi, -joki, -mäki, -vesi, -saari, -salmi, -koski, -niemi)
  if (/(?:järvi|joki|mäki|vesi|saari|salmi|koski|niemi)$/i.test(clean)) {
    let strongStem = clean;
    let weakStem = clean;
    let partitive = clean;
    let illative = clean;
    let suffixHarmony: 'front' | 'back' = 'back';

    const lower = clean.toLowerCase();
    if (lower.endsWith('järvi')) {
      const base = clean.slice(0, -5);
      strongStem = base + 'järve';
      weakStem = base + 'järve';
      partitive = base + 'järveä';
      illative = base + 'järveen';
      suffixHarmony = 'front';
    } else if (lower.endsWith('joki')) {
      const base = clean.slice(0, -4);
      strongStem = base + (clean.endsWith('Joki') ? 'Joke' : 'joke');
      weakStem = base + (clean.endsWith('Joki') ? 'Joe' : 'joe');
      partitive = base + (clean.endsWith('Joki') ? 'Jokea' : 'jokea');
      illative = base + (clean.endsWith('Joki') ? 'Jokeen' : 'jokeen');
      suffixHarmony = 'back';
    } else if (lower.endsWith('mäki')) {
      const base = clean.slice(0, -4);
      strongStem = base + (clean.endsWith('Mäki') ? 'Mäke' : 'mäke');
      weakStem = base + (clean.endsWith('Mäki') ? 'Mäe' : 'mäe');
      partitive = base + (clean.endsWith('Mäki') ? 'Mäkeä' : 'mäkeä');
      illative = base + (clean.endsWith('Mäki') ? 'Mäkeen' : 'mäkeen');
      suffixHarmony = 'front';
    } else if (lower.endsWith('vesi')) {
      const base = clean.slice(0, -4);
      strongStem = base + (clean.endsWith('Vesi') ? 'Vete' : 'vete');
      weakStem = base + (clean.endsWith('Vesi') ? 'Vede' : 'vede');
      partitive = base + (clean.endsWith('Vesi') ? 'Vettä' : 'vettä');
      illative = base + (clean.endsWith('Vesi') ? 'Veteen' : 'veteen');
      suffixHarmony = 'front';
    } else if (lower.endsWith('saari')) {
      const base = clean.slice(0, -5);
      const sWord = clean.endsWith('Saari') ? 'Saare' : 'saare';
      const sPart = clean.endsWith('Saari') ? 'Saarta' : 'saarta';
      const sIll = clean.endsWith('Saari') ? 'Saareen' : 'saareen';
      strongStem = base + sWord;
      weakStem = base + sWord;
      partitive = base + sPart;
      illative = base + sIll;
      suffixHarmony = 'back';
    } else if (lower.endsWith('salmi')) {
      const base = clean.slice(0, -5);
      const sWord = clean.endsWith('Salmi') ? 'Salme' : 'salme';
      const sPart = clean.endsWith('Salmi') ? 'Salmea' : 'salmea';
      const sIll = clean.endsWith('Salmi') ? 'Salmeen' : 'salmeen';
      strongStem = base + sWord;
      weakStem = base + sWord;
      partitive = base + sPart;
      illative = base + sIll;
      suffixHarmony = 'back';
    } else if (lower.endsWith('koski')) {
      const base = clean.slice(0, -5);
      const sWord = clean.endsWith('Koski') ? 'Koske' : 'koske';
      const sPart = clean.endsWith('Koski') ? 'Koskea' : 'koskea';
      const sIll = clean.endsWith('Koski') ? 'Koskeen' : 'koskeen';
      strongStem = base + sWord;
      weakStem = base + sWord;
      partitive = base + sPart;
      illative = base + sIll;
      suffixHarmony = 'back';
    } else if (lower.endsWith('niemi')) {
      const base = clean.slice(0, -5);
      const sWord = clean.endsWith('Niemi') ? 'Nieme' : 'nieme';
      const sPart = clean.endsWith('Niemi') ? 'Niemeä' : 'niemeä';
      const sIll = clean.endsWith('Niemi') ? 'Niemeen' : 'niemeen';
      strongStem = base + sWord;
      weakStem = base + sWord;
      partitive = base + sPart;
      illative = base + sIll;
      suffixHarmony = 'front';
    }

    const inSuffix = suffixHarmony === 'front' ? 'ssä' : 'ssa';
    const elSuffix = suffixHarmony === 'front' ? 'stä' : 'sta';
    const adSuffix = suffixHarmony === 'front' ? 'llä' : 'lla';
    const abSuffix = suffixHarmony === 'front' ? 'ltä' : 'lta';
    const alSuffix = 'lle';
    const esSuffix = suffixHarmony === 'front' ? 'nä' : 'na';
    const trSuffix = 'ksi';

    return {
      nominative: name,
      genitive: `${weakStem}n${tlSuffix}`,
      partitive: `${partitive}${tlSuffix}`,
      inessive: `${weakStem}${inSuffix}${tlSuffix}`,
      elative: `${weakStem}${elSuffix}${tlSuffix}`,
      illative: `${illative}${tlSuffix}`,
      adessive: `${weakStem}${adSuffix}${tlSuffix}`,
      ablative: `${weakStem}${abSuffix}${tlSuffix}`,
      allative: `${weakStem}${alSuffix}${tlSuffix}`,
      essive: `${strongStem}${esSuffix}${tlSuffix}`,
      translative: `${weakStem}${trSuffix}${tlSuffix}`
    };
  }

  // Handle foreign/Swedish consonant endings like Finström, Kökar, Hammarland, Lemland, Lumparland, Saltvik, Sund, Korsnäs
  if (/[bcdfghjklmnpqrstvwxz]$/i.test(clean)) {
    const harmony = getVowelHarmony(clean);
    const inSuffix = harmony === 'front' ? 'ssä' : 'ssa';
    const elSuffix = harmony === 'front' ? 'stä' : 'sta';
    const adSuffix = harmony === 'front' ? 'llä' : 'lla';
    const abSuffix = harmony === 'front' ? 'ltä' : 'lta';
    const esSuffix = harmony === 'front' ? 'nä' : 'na';
    const partSuffix = harmony === 'front' ? 'ä' : 'a';

    return {
      nominative: name,
      genitive: `${clean}in${tlSuffix}`,
      partitive: `${clean}i${partSuffix}${tlSuffix}`,
      inessive: `${clean}i${inSuffix}${tlSuffix}`,
      elative: `${clean}i${elSuffix}${tlSuffix}`,
      illative: `${clean}iin${tlSuffix}`,
      adessive: `${clean}i${adSuffix}${tlSuffix}`,
      ablative: `${clean}i${abSuffix}${tlSuffix}`,
      allative: `${clean}ille${tlSuffix}`,
      essive: `${clean}i${esSuffix}${tlSuffix}`,
      translative: `${clean}iksi${tlSuffix}`
    };
  }

  // Handle long vowel endings (-aa, -ää, -oo, -öö, -uu, -yy, -ii, -ee)
  if (/(?:aa|ää|oo|öö|uu|yy|ii|ee)$/i.test(clean)) {
    const inSuffix = harmonize('ssa', clean);
    const elSuffix = harmonize('sta', clean);
    const adSuffix = harmonize('lla', clean);
    const abSuffix = harmonize('lta', clean);
    const alSuffix = harmonize('lle', clean);
    const esSuffix = harmonize('na', clean);
    const trSuffix = harmonize('ksi', clean);
    const taSuffix = harmonize('ta', clean);
    const illativeEnd = resolveLongVowelIllativeEnding(clean);

    return {
      nominative: name,
      genitive: `${clean}n${tlSuffix}`,
      partitive: `${clean}${taSuffix}${tlSuffix}`,
      inessive: `${clean}${inSuffix}${tlSuffix}`,
      elative: `${clean}${elSuffix}${tlSuffix}`,
      illative: `${clean}${illativeEnd}${tlSuffix}`,
      adessive: `${clean}${adSuffix}${tlSuffix}`,
      ablative: `${clean}${abSuffix}${tlSuffix}`,
      allative: `${clean}${alSuffix}${tlSuffix}`,
      essive: `${clean}${esSuffix}${tlSuffix}`,
      translative: `${clean}${trSuffix}${tlSuffix}`
    };
  }

  const strongStem = clean;
  const weakStem = weakenConsonants(clean);
  const inSuffix = harmonize('ssa', clean);
  const elSuffix = harmonize('sta', clean);
  const adSuffix = harmonize('lla', clean);
  const abSuffix = harmonize('lta', clean);
  const alSuffix = harmonize('lle', clean);
  const esSuffix = harmonize('na', clean);
  const trSuffix = harmonize('ksi', clean);

  const isEPlace = clean.endsWith('e') && !/(?:ee)$/i.test(clean);

  const genitive = `${resolveStandardGenitive(clean, weakStem, isEPlace)}${tlSuffix}`;
  const partitive = `${resolveStandardPartitive(clean, isEPlace)}${tlSuffix}`;
  const inessive = `${weakStem + inSuffix}${tlSuffix}`;
  const elative = `${weakStem + elSuffix}${tlSuffix}`;
  const illative = `${resolveStandardIllative(clean, isEPlace)}${tlSuffix}`;
  const adessive = `${weakStem + adSuffix}${tlSuffix}`;
  const ablative = `${weakStem + abSuffix}${tlSuffix}`;
  const allative = `${weakStem + alSuffix}${tlSuffix}`;
  const essive = `${clean + esSuffix}${tlSuffix}`;
  const translative = `${weakStem + trSuffix}${tlSuffix}`;

  return {
    nominative: name,
    genitive,
    partitive,
    inessive,
    elative,
    illative,
    adessive,
    ablative,
    allative,
    essive,
    translative
  };
}

function main(): void {
  const inputPath = path.join(projectRoot, 'data', 'municipalities.txt');
  const outputPath = path.join(projectRoot, 'data', 'municipalities-matrix.csv');

  if (!fs.existsSync(inputPath)) {
    console.error(`Missing input file: ${inputPath}`);
    return;
  }

  const names = fs.readFileSync(inputPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const headers = [
    'Place name',
    'Gemini thinks it is',
    'Gemini reason',
    'Algorithm think it is',
    'Algorithm reason',
    'Human think it is',
    'Human reason',
    'nominative',
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
  ];

  const rows: string[] = [headers.map(escapeCsv).join(',')];

  for (const name of names) {
    const algo = getAlgorithmicPrediction(name);
    const geminiMeta = TOPONYMIC_EXCEPTIONS[name];

    const geminiEnding = geminiMeta?.localEnding ?? algo.ending;
    const geminiReason = geminiMeta?.reason ?? algo.reason;
    const localCase = geminiMeta?.localCase ?? algo.localCase;

    const cases = inflectPlaceAllCases(name, {
      localCase,
      customStems: geminiMeta?.customStems as Record<string, string> | undefined,
      plural: geminiMeta?.plural
    });

    const row = [
      name,
      geminiEnding,
      geminiReason,
      algo.ending,
      algo.reason,
      '', // Human think it is
      '', // Human reason
      cases.nominative ?? name,
      cases.genitive ?? '',
      cases.partitive ?? '',
      cases.inessive ?? '',
      cases.elative ?? '',
      cases.illative ?? '',
      cases.adessive ?? '',
      cases.ablative ?? '',
      cases.allative ?? '',
      cases.essive ?? '',
      cases.translative ?? ''
    ];

    rows.push(row.map(escapeCsv).join(','));
  }

  fs.writeFileSync(outputPath, rows.join('\n') + '\n', 'utf8');
  console.log(`Successfully generated: ${outputPath}`);
  console.log(`Total municipalities processed: ${names.length}`);
}

main();
