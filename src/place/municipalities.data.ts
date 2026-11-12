/**
 * Curated municipal local case data and morphological exceptions.
 * Based on Finnish municipality toponymic conventions.
 *
 * @packageDocumentation
 */

import type { LocalCaseType } from '../cases/types.ts';

/**
 * Shape of custom stem overrides for irregular places.
 */
export interface PlaceOverride {
  readonly localCaseType?: LocalCaseType;
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
}

/**
 * Closed set of Finnish municipalities that conventionally take external local cases (-lla/-llä),
 * excluding regular nature suffixes.
 */
export const EXTERNAL_CASE_MUNICIPALITIES: ReadonlySet<string> = new Set([
  'Alavus',
  'Enontekiö',
  'Halsua',
  'Hyvinkää',
  'Imatra',
  'Kaavi',
  'Kangasala',
  'Kaustinen',
  'Kauhava',
  'Keitele',
  'Kerava',
  'Kitee',
  'Koski Tl',
  'Kuortane',
  'Laihia',
  'Lapinlahti',
  'Lapua',
  'Lemi',
  'Leppävirta',
  'Lohja',
  'Loimaa',
  'Loppi',
  'Luumäki',
  'Muhos',
  'Multia',
  'Nokia',
  'Parainen',
  'Pertunmaa',
  'Pihtipudas',
  'Posio',
  'Punkalaidun',
  'Puolanka',
  'Pyhtää',
  'Pyhäntä',
  'Pälkäne',
  'Pöytyä',
  'Ranua',
  'Rauma',
  'Rautalampi',
  'Rovaniemi',
  'Ruokolahti',
  'Rusko',
  'Savitaipale',
  'Somero',
  'Sulkava',
  'Tampere',
  'Teuva',
  'Toholampi',
  'Tyrnävä',
  'Uurainen',
  'Vantaa',
  'Vehmaa',
  'Vesanto',
  'Vieremä',
  'Virrat',
  'Vöyri',
  'Ylitornio',
  'Ypäjä'
]);

/**
 * Exceptions to the island suffix rule (-saari/-luoto), which conventionally take
 * internal local cases (-ssa/-ssä).
 */
export const ISLAND_INTERNAL_EXCEPTIONS: ReadonlySet<string> = new Set([
  'Pietarsaari',
  'Hailuoto',
  'Luoto'
]);

/**
 * Municipalities and settlements that resist consonant gradation.
 */
export const GRADATION_RESISTANT_PLACES: ReadonlySet<string> = new Set([
  'Asikkala',
  'Djibouti',
  'Haiti',
  'Humppila',
  'Kiribati',
  'Kokkola',
  'Lempäälä',
  'Malta',
  'Marttila',
  'Mikkeli',
  'Naantali',
  'Nakkila',
  'Orimattila',
  'Parikkala',
  'Pukkila',
  'Sri Lanka',
  'Vanuatu'
]);

/**
 * Explicit stem overrides for irregular places, compounds, and administrative entries.
 */
export const IRREGULAR_PLACES: ReadonlyMap<string, PlaceOverride> = new Map<string, PlaceOverride>([
  ['Ahvenanmaa', {
    localCaseType: 'on',
    adessive: 'Ahvenanmaalla',
    ablative: 'Ahvenanmaalta',
    allative: 'Ahvenanmaalle',
    genitive: 'Ahvenanmaan',
    partitive: 'Ahvenanmaata'
  }],
  ['Suomi', {
    localCaseType: 'in',
    genitive: 'Suomen',
    partitive: 'Suomea',
    inessive: 'Suomessa',
    elative: 'Suomesta',
    illative: 'Suomeen'
  }],
  ['Kypros', {
    localCaseType: 'in',
    genitive: 'Kyproksen',
    partitive: 'Kyprosta',
    inessive: 'Kyproksessa',
    elative: 'Kyproksesta',
    illative: 'Kyprokseen'
  }],
  ['Mauritius', {
    localCaseType: 'on',
    genitive: 'Mauritiuksen',
    partitive: 'Mauritiusta',
    adessive: 'Mauritiuksella',
    ablative: 'Mauritiukselta',
    allative: 'Mauritiukselle',
    illative: 'Mauritiukselle'
  }],
  ['Koski Tl', {
    localCaseType: 'on',
    genitive: 'Koski Tl:n',
    partitive: 'Koski Tl:ää',
    adessive: 'Koski Tl:llä',
    ablative: 'Koski Tl:ltä',
    allative: 'Koski Tl:lle',
    illative: 'Koski Tl:ään'
  }],
  ['Pedersören kunta', {
    localCaseType: 'in',
    genitive: 'Pedersören kunnan',
    partitive: 'Pedersören kuntaa',
    inessive: 'Pedersören kunnassa',
    illative: 'Pedersören kuntaan'
  }],
  ['Brändö', {
    illative: 'Brändöhön'
  }],
  ['Föglö', {
    illative: 'Föglöhön'
  }],
  ['Geta', {
    genitive: 'Getan',
    partitive: 'Getaa',
    inessive: 'Getassa',
    elative: 'Getasta',
    illative: 'Getaan'
  }],
  ['Kumlinge', {
    genitive: 'Kumlingen',
    partitive: 'Kumlingea',
    illative: 'Kumlingeen'
  }],
  ['Muurame', {
    genitive: 'Muuramen',
    partitive: 'Muuramea',
    illative: 'Muurameen'
  }],
  ['Raahe', {
    genitive: 'Raahen',
    partitive: 'Raahea',
    inessive: 'Raahessa',
    illative: 'Raaheen'
  }],
  ['Kirkkonummi', {
    localCaseType: 'on',
    adessive: 'Kirkkonummella',
    ablative: 'Kirkkonummelta',
    genitive: 'Kirkkonummen',
    partitive: 'Kirkkonummea',
    allative: 'Kirkkonummelle'
  }],
  ['Korsnäs', {
    inessive: 'Korsnäsissä',
    elative: 'Korsnäsistä',
    genitive: 'Korsnäsin',
    partitive: 'Korsnäsiä',
    illative: 'Korsnäsiin'
  }],
  ['Enontekiö', {
    localCaseType: 'on',
    adessive: 'Enontekiöllä',
    ablative: 'Enontekiöltä',
    genitive: 'Enontekiön',
    partitive: 'Enontekiötä',
    allative: 'Enontekiölle'
  }],
  ['Keitele', {
    localCaseType: 'on',
    adessive: 'Keiteleellä',
    ablative: 'Keiteleeltä',
    genitive: 'Keiteleen',
    partitive: 'Keitelettä',
    allative: 'Keiteleelle',
    illative: 'Keiteleeseen'
  }],
  ['Kuortane', {
    localCaseType: 'on',
    adessive: 'Kuortaneella',
    ablative: 'Kuortaneelta',
    genitive: 'Kuortaneen',
    partitive: 'Kuortanetta',
    allative: 'Kuortaneelle',
    illative: 'Kuortaneeseen'
  }],
  ['Lapinlahti', {
    localCaseType: 'on',
    adessive: 'Lapinlahdella',
    genitive: 'Lapinlahden',
    partitive: 'Lapinlahtea',
    allative: 'Lapinlahdelle'
  }],
  ['Lapua', {
    localCaseType: 'on',
    adessive: 'Lapualla',
    genitive: 'Lapuan',
    partitive: 'Lapuaa',
    allative: 'Lapualle'
  }],
  ['Leppävirta', {
    localCaseType: 'on',
    adessive: 'Leppävirralla',
    genitive: 'Leppävirran',
    partitive: 'Leppävirtaa',
    allative: 'Leppävirralle'
  }],
  ['Loppi', {
    localCaseType: 'on',
    adessive: 'Lopella',
    ablative: 'Lopelta',
    genitive: 'Lopen',
    partitive: 'Loppea',
    allative: 'Lopelle'
  }],
  ['Muhos', {
    localCaseType: 'on',
    adessive: 'Muhoksella',
    ablative: 'Muhokselta',
    genitive: 'Muhoksen',
    partitive: 'Muhosta',
    allative: 'Muhokselle'
  }],
  ['Multia', {
    localCaseType: 'on',
    adessive: 'Multialla',
    genitive: 'Multian',
    partitive: 'Multiaa',
    allative: 'Multialle'
  }],
  ['Pälkäne', {
    localCaseType: 'on',
    adessive: 'Pälkäneellä',
    ablative: 'Pälkäneeltä',
    genitive: 'Pälkäneen',
    partitive: 'Pälkänettä',
    allative: 'Pälkäneelle',
    illative: 'Pälkäneeseen'
  }],
  ['Ruokolahti', {
    localCaseType: 'on',
    adessive: 'Ruokolahdella',
    genitive: 'Ruokolahden',
    partitive: 'Ruokolahtea',
    allative: 'Ruokolahdelle'
  }],
  ['Savitaipale', {
    localCaseType: 'on',
    adessive: 'Savitaipaleella',
    ablative: 'Savitaipaleelta',
    genitive: 'Savitaipaleen',
    partitive: 'Savitaipaletta',
    allative: 'Savitaipaleelle',
    illative: 'Savitaipaleeseen'
  }],
  ['Mänttä-Vilppula', {
    localCaseType: 'in',
    genitive: 'Mänttä-Vilppulan',
    partitive: 'Mänttä-Vilppulaa',
    inessive: 'Mänttä-Vilppulassa',
    illative: 'Mänttä-Vilppulaan'
  }],
  ['Mäntyharju', {
    localCaseType: 'on',
    genitive: 'Mäntyharjun',
    partitive: 'Mäntyharjua',
    adessive: 'Mäntyharjulla',
    allative: 'Mäntyharjulle'
  }],
  ['Uusikaupunki', {
    localCaseType: 'in',
    genitive: 'Uudenkaupungin',
    partitive: 'Uuttakaupunkia',
    inessive: 'Uudessakaupungissa',
    elative: 'Uudestakaupungista',
    illative: 'Uuteenkaupunkiin'
  }],
  ['Uusikaarlepyy', {
    localCaseType: 'in',
    genitive: 'Uudenkaarlepyyn',
    partitive: 'Uuttakaarlepyytä',
    inessive: 'Uudessakaarlepyyssä',
    elative: 'Uudestakaarlepyystä',
    illative: 'Uuteenkaarlepyyhyn'
  }],
  ['Isokyrö', {
    localCaseType: 'in',
    genitive: 'Isonkyrön',
    partitive: 'Isoakyröä',
    inessive: 'Isossakyrössä',
    elative: 'Isostakyröstä',
    illative: 'Isoonkyröön'
  }],
  ['Kangasala', {
    localCaseType: 'on',
    genitive: 'Kangasalan',
    partitive: 'Kangasalaa',
    adessive: 'Kangasalla',
    ablative: 'Kangasalta',
    allative: 'Kangasalle'
  }],
  ['Alavus', {
    localCaseType: 'on',
    genitive: 'Alavuden',
    partitive: 'Alavutta',
    adessive: 'Alavudella',
    ablative: 'Alavudelta',
    allative: 'Alavudelle'
  }],
  ['Kaustinen', {
    localCaseType: 'on',
    genitive: 'Kaustisen',
    partitive: 'Kaustista',
    adessive: 'Kaustisella',
    allative: 'Kaustiselle'
  }],
  ['Parainen', {
    localCaseType: 'on',
    genitive: 'Paraisten',
    partitive: 'Paraisia',
    adessive: 'Paraisilla',
    ablative: 'Paraisilta',
    allative: 'Paraisille'
  }],
  ['Uurainen', {
    localCaseType: 'on',
    genitive: 'Uuraisten',
    partitive: 'Uuraisia',
    adessive: 'Uuraisilla',
    ablative: 'Uuraisilta',
    allative: 'Uuraisille'
  }],
  ['Pihtipudas', {
    localCaseType: 'on',
    genitive: 'Pihtiputaan',
    partitive: 'Pihtipudasta',
    adessive: 'Pihtiputaalla',
    ablative: 'Pihtiputaalta',
    allative: 'Pihtiputaalle'
  }],
  ['Punkalaidun', {
    localCaseType: 'on',
    genitive: 'Punkalaitumen',
    partitive: 'Punkalaidunta',
    adessive: 'Punkalaitumella',
    ablative: 'Punkalaitumelta',
    allative: 'Punkalaitumelle'
  }],
  ['Virrat', {
    localCaseType: 'on',
    genitive: 'Virtojen',
    partitive: 'Virtoja',
    adessive: 'Virroilla',
    ablative: 'Virroilta',
    allative: 'Virroille',
    elative: 'Virroilta',
    illative: 'Virtoihin'
  }],
  ['Rautalampi', {
    localCaseType: 'on',
    genitive: 'Rautalammin',
    partitive: 'Rautalampia',
    adessive: 'Rautalammilla',
    ablative: 'Rautalammilta',
    allative: 'Rautalammille'
  }],
  ['Toholampi', {
    localCaseType: 'on',
    genitive: 'Toholammin',
    partitive: 'Toholampia',
    adessive: 'Toholammilla',
    ablative: 'Toholammilta',
    allative: 'Toholammille'
  }],
  ['Tampere', {
    localCaseType: 'on',
    genitive: 'Tampereen',
    partitive: 'Tamperetta',
    inessive: 'Tampereessa',
    elative: 'Tampereesta',
    illative: 'Tampereeseen',
    adessive: 'Tampereella',
    ablative: 'Tampereelta',
    allative: 'Tampereelle',
    essive: 'Tampereena'
  }],
  ['Kempele', {
    genitive: 'Kempeleen',
    partitive: 'Kempelettä',
    inessive: 'Kempeleessä',
    elative: 'Kempeleestä',
    illative: 'Kempeleeseen'
  }],
  ['Kannus', {
    genitive: 'Kannuksen',
    partitive: 'Kannusta',
    inessive: 'Kannuksessa',
    elative: 'Kannuksesta',
    illative: 'Kannukseen'
  }],
  ['Nurmes', {
    genitive: 'Nurmeksen',
    partitive: 'Nurmesta',
    inessive: 'Nurmeksessa',
    elative: 'Nurmeksesta',
    illative: 'Nurmekseen'
  }],
  ['Varkaus', {
    genitive: 'Varkauden',
    partitive: 'Varkautta',
    inessive: 'Varkaudessa',
    elative: 'Varkaudesta',
    illative: 'Varkauteen'
  }],
  ['Huittinen', {
    genitive: 'Huittisten',
    partitive: 'Huittisia',
    inessive: 'Huittisissa',
    elative: 'Huittisista',
    illative: 'Huittisiin'
  }],
  ['Ikaalinen', {
    genitive: 'Ikaalisten',
    partitive: 'Ikaalisia',
    inessive: 'Ikaalisissa',
    elative: 'Ikaalisista',
    illative: 'Ikaalisiin'
  }],
  ['Jokioinen', {
    genitive: 'Jokioisten',
    partitive: 'Jokioisia',
    inessive: 'Jokioisissa',
    elative: 'Jokioisista',
    illative: 'Jokioisiin'
  }],
  ['Joroinen', {
    genitive: 'Joroisten',
    partitive: 'Joroisia',
    inessive: 'Joroisissa',
    elative: 'Joroisista',
    illative: 'Joroisiin'
  }],
  ['Kaskinen', {
    genitive: 'Kaskisten',
    partitive: 'Kaskisia',
    inessive: 'Kaskisissa',
    elative: 'Kaskisista',
    illative: 'Kaskisiin'
  }],
  ['Kauniainen', {
    genitive: 'Kauniaisten',
    partitive: 'Kauniaisia',
    inessive: 'Kauniaisissa',
    elative: 'Kauniaisista',
    illative: 'Kauniaisiin'
  }],
  ['Kuhmoinen', {
    genitive: 'Kuhmoisten',
    partitive: 'Kuhmoisia',
    inessive: 'Kuhmoisissa',
    elative: 'Kuhmoisista',
    illative: 'Kuhmoisiin'
  }],
  ['Nousiainen', {
    genitive: 'Nousiaisten',
    partitive: 'Nousiaisia',
    inessive: 'Nousiaisissa',
    elative: 'Nousiaisista',
    illative: 'Nousiaisiin'
  }],
  ['Oulainen', {
    genitive: 'Oulaisten',
    partitive: 'Oulaisia',
    inessive: 'Oulaisissa',
    elative: 'Oulaisista',
    illative: 'Oulaisiin'
  }],
  ['Pornainen', {
    genitive: 'Pornaisten',
    partitive: 'Pornaisia',
    inessive: 'Pornaisissa',
    elative: 'Pornaisista',
    illative: 'Pornaisiin'
  }],
  ['Siikainen', {
    genitive: 'Siikaisten',
    partitive: 'Siikaisia',
    inessive: 'Siikaisissa',
    elative: 'Siikaisista',
    illative: 'Siikaisiin'
  }]
]);
