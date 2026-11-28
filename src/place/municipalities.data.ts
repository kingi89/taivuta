/**
 * Curated municipal local case data and morphological exceptions.
 * Based on Finnish municipality toponymic conventions.
 *
 * @packageDocumentation
 */

/**
 * Canonical stem specification for lexically irregular Finnish toponyms.
 */
export interface IrregularPlaceSpec {
  readonly strong: string;
  readonly weak: string;
  readonly partitive: string;
  readonly illative: string;
  readonly genitive?: string;
  readonly isPlural?: boolean;
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
  'Merikarvia',
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
  'Mustasaari',
  'Hailuoto',
  'Luoto'
]);

/**
 * Municipalities and settlements that resist consonant gradation.
 */
export const GRADATION_RESISTANT_PLACES: ReadonlySet<string> = new Set([
  'Asikkala',
  'Djibouti',
  'Geta',
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
 * Finnish municipalities ending in -inen that inflect as pluralia tantum
 * using the plural -isi- stem and -isten genitive (unlike singular -inen
 * municipalities such as Kaustinen).
 */
export const PLURAL_INEN_PLACES: ReadonlySet<string> = new Set([
  'Huittinen',
  'Ikaalinen',
  'Jokioinen',
  'Joroinen',
  'Kaskinen',
  'Kauniainen',
  'Kuhmoinen',
  'Nousiainen',
  'Oulainen',
  'Parainen',
  'Pornainen',
  'Siikainen',
  'Uurainen'
]);

/**
 * Toponyms following Kotus type 48 (*hame*) lengthened -e declension,
 * where the vocalic stem doubles -e- and the partitive takes -tta/-ttä.
 */
export const TYPE_48_E_PLACES: ReadonlySet<string> = new Set([
  'Keitele',
  'Kempele',
  'Kuortane',
  'Pälkäne',
  'Savitaipale',
  'Tampere'
]);

/**
 * Toponyms following Kotus type 39 (*vastaus*) -s declension,
 * alternating -s in nominative/partitive with -kse- in vocalic cases.
 */
export const TYPE_39_S_PLACES: ReadonlySet<string> = new Set([
  'Kannus',
  'Kypros',
  'Mauritius',
  'Muhos',
  'Nurmes'
]);

/**
 * Toponyms following Kotus type 40 (*kalleus*) -us declension,
 * alternating -ute- (strong), -ude- (weak), and -utta/-yttä (partitive).
 */
export const TYPE_40_US_PLACES: ReadonlySet<string> = new Set([
  'Alavus',
  'Varkaus'
]);

/**
 * Solid (unhyphenated) compound toponyms whose leading adjective (Uusi or Iso)
 * inflects congruently with the head element.
 */
export const UNHYPHENATED_INFLECTING_PREFIX_PLACES: ReadonlySet<string> = new Set([
  'Isokyrö',
  'Uusikaarlepyy',
  'Uusikaupunki'
]);

/**
 * Toponyms ending in -lampi that follow regular i-stem consonant gradation (-lammin, -lampia)
 * rather than the dialectal -lampi -> -lammen nature-noun alternation.
 */
export const NATURE_NOUN_BYPASS_PLACES: ReadonlySet<string> = new Set([
  'Rautalampi',
  'Toholampi'
]);

/**
 * Canonical StemParadigm specifications for lexically irregular places whose stems
 * combine irregular vowel shifts, gradation exceptions, or plural/suppletive forms.
 */
export const IRREGULAR_PLACE_PARADIGMS: ReadonlyMap<string, IrregularPlaceSpec> = new Map<string, IrregularPlaceSpec>([
  ['Brändö', {
    strong: 'Brändö',
    weak: 'Brändö',
    partitive: 'Brändöä',
    illative: 'Brändöhön'
  }],
  ['Föglö', {
    strong: 'Föglö',
    weak: 'Föglö',
    partitive: 'Föglöä',
    illative: 'Föglöhön'
  }],
  ['Loppi', {
    strong: 'Loppe',
    weak: 'Lope',
    partitive: 'Loppea',
    illative: 'Loppeen'
  }],
  ['Pihtipudas', {
    strong: 'Pihtiputaa',
    weak: 'Pihtiputaa',
    partitive: 'Pihtipudasta',
    illative: 'Pihtiputaaseen'
  }],
  ['Punkalaidun', {
    strong: 'Punkalaitume',
    weak: 'Punkalaitume',
    partitive: 'Punkalaidunta',
    illative: 'Punkalaitumeen'
  }],
  ['Suomi', {
    strong: 'Suome',
    weak: 'Suome',
    partitive: 'Suomea',
    illative: 'Suomeen'
  }],
  ['Virrat', {
    strong: 'Virtoi',
    weak: 'Virroi',
    partitive: 'Virtoja',
    illative: 'Virtoihin',
    genitive: 'Virtojen',
    isPlural: true
  }]
]);

/**
 * Checks whether a place name belongs to a known irregular or specialized morphological class.
 *
 * @param name - Normalized place name token.
 * @returns True if the place belongs to an irregular paradigm or specialized place set.
 *
 * @example
 * ```ts
 * isKnownSpecialPlace('Kauniainen'); // true
 * isKnownSpecialPlace('Helsinki');   // false
 * ```
 */
export function isKnownSpecialPlace(name: string): boolean {
  return (
    IRREGULAR_PLACE_PARADIGMS.has(name) ||
    PLURAL_INEN_PLACES.has(name) ||
    TYPE_48_E_PLACES.has(name) ||
    TYPE_39_S_PLACES.has(name) ||
    TYPE_40_US_PLACES.has(name) ||
    UNHYPHENATED_INFLECTING_PREFIX_PLACES.has(name)
  );
}
