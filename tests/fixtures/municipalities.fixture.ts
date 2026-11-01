/**
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

export const MUNICIPALITY_TEST_CASES: readonly MunicipalityTestCase[] = [
  {
    "name": "Akaa",
    "localCase": "Akaassa",
    "localCaseType": "in",
    "genitive": "Akaan"
  },
  {
    "name": "Alajärvi",
    "localCase": "Alajärvellä",
    "localCaseType": "on",
    "genitive": "Alajärven",
    "partitive": "Alajärveä",
    "illative": "Alajärveen"
  },
  {
    "name": "Alavieska",
    "localCase": "Alavieskassa",
    "localCaseType": "in",
    "genitive": "Alavieskan"
  },
  {
    "name": "Alavus",
    "localCase": "Alavudella",
    "localCaseType": "on",
    "genitive": "Alavuden",
    "partitive": "Alavutta"
  },
  {
    "name": "Asikkala",
    "localCase": "Asikkalassa",
    "localCaseType": "in",
    "genitive": "Asikkalan"
  },
  {
    "name": "Askola",
    "localCase": "Askolassa",
    "localCaseType": "in",
    "genitive": "Askolan"
  },
  {
    "name": "Aura",
    "localCase": "Aurassa",
    "localCaseType": "in",
    "genitive": "Auran"
  },
  {
    "name": "Brändö",
    "localCase": "Brändössä",
    "localCaseType": "in",
    "genitive": "Brändön",
    "partitive": "Brändöä",
    "illative": "Brändöhön"
  },
  {
    "name": "Eckerö",
    "localCase": "Eckerössä",
    "localCaseType": "in",
    "genitive": "Eckerön"
  },
  {
    "name": "Enonkoski",
    "localCase": "Enonkoskella",
    "localCaseType": "on",
    "genitive": "Enonkosken",
    "partitive": "Enonkoskea",
    "illative": "Enonkoskeen"
  },
  {
    "name": "Enontekiö",
    "localCase": "Enontekiöllä",
    "localCaseType": "on",
    "genitive": "Enontekiön",
    "partitive": "Enontekiötä"
  },
  {
    "name": "Espoo",
    "localCase": "Espoossa",
    "localCaseType": "in",
    "genitive": "Espoon"
  },
  {
    "name": "Eura",
    "localCase": "Eurassa",
    "localCaseType": "in",
    "genitive": "Euran"
  },
  {
    "name": "Eurajoki",
    "localCase": "Eurajoella",
    "localCaseType": "on",
    "genitive": "Eurajoen",
    "partitive": "Eurajokea",
    "illative": "Eurajokeen"
  },
  {
    "name": "Evijärvi",
    "localCase": "Evijärvellä",
    "localCaseType": "on",
    "genitive": "Evijärven",
    "partitive": "Evijärveä",
    "illative": "Evijärveen"
  },
  {
    "name": "Finström",
    "localCase": "Finströmissä",
    "localCaseType": "in",
    "genitive": "Finströmin"
  },
  {
    "name": "Forssa",
    "localCase": "Forssassa",
    "localCaseType": "in",
    "genitive": "Forssan"
  },
  {
    "name": "Föglö",
    "localCase": "Föglössä",
    "localCaseType": "in",
    "genitive": "Föglön",
    "partitive": "Föglöä",
    "illative": "Föglöhön"
  },
  {
    "name": "Geta",
    "localCase": "Getassa",
    "localCaseType": "in",
    "genitive": "Getan",
    "partitive": "Getaa",
    "illative": "Getaan"
  },
  {
    "name": "Haapajärvi",
    "localCase": "Haapajärvellä",
    "localCaseType": "on",
    "genitive": "Haapajärven",
    "partitive": "Haapajärveä",
    "illative": "Haapajärveen"
  },
  {
    "name": "Haapavesi",
    "localCase": "Haapavedellä",
    "localCaseType": "on",
    "genitive": "Haapaveden",
    "partitive": "Haapavettä",
    "illative": "Haapaveteen"
  },
  {
    "name": "Hailuoto",
    "localCase": "Hailuodossa",
    "localCaseType": "in",
    "genitive": "Hailuodon",
    "partitive": "Hailuotoa",
    "illative": "Hailuotoon"
  },
  {
    "name": "Halsua",
    "localCase": "Halsualla",
    "localCaseType": "on",
    "genitive": "Halsuan",
    "partitive": "Halsuaa"
  },
  {
    "name": "Hamina",
    "localCase": "Haminassa",
    "localCaseType": "in",
    "genitive": "Haminan"
  },
  {
    "name": "Hammarland",
    "localCase": "Hammarlandissa",
    "localCaseType": "in",
    "genitive": "Hammarlandin",
    "partitive": "Hammarlandia",
    "illative": "Hammarlandiin"
  },
  {
    "name": "Hankasalmi",
    "localCase": "Hankasalmella",
    "localCaseType": "on",
    "genitive": "Hankasalmen",
    "partitive": "Hankasalmea",
    "illative": "Hankasalmeen"
  },
  {
    "name": "Hanko",
    "localCase": "Hangossa",
    "localCaseType": "in",
    "genitive": "Hangon"
  },
  {
    "name": "Harjavalta",
    "localCase": "Harjavallassa",
    "localCaseType": "in",
    "genitive": "Harjavallan"
  },
  {
    "name": "Hartola",
    "localCase": "Hartolassa",
    "localCaseType": "in",
    "genitive": "Hartolan"
  },
  {
    "name": "Hattula",
    "localCase": "Hattulassa",
    "localCaseType": "in",
    "genitive": "Hattulan"
  },
  {
    "name": "Hausjärvi",
    "localCase": "Hausjärvellä",
    "localCaseType": "on",
    "genitive": "Hausjärven",
    "partitive": "Hausjärveä",
    "illative": "Hausjärveen"
  },
  {
    "name": "Heinola",
    "localCase": "Heinolassa",
    "localCaseType": "in",
    "genitive": "Heinolan"
  },
  {
    "name": "Heinävesi",
    "localCase": "Heinävedellä",
    "localCaseType": "on",
    "genitive": "Heinäveden",
    "partitive": "Heinävettä",
    "illative": "Heinäveteen"
  },
  {
    "name": "Helsinki",
    "localCase": "Helsingissä",
    "localCaseType": "in",
    "genitive": "Helsingin"
  },
  {
    "name": "Hirvensalmi",
    "localCase": "Hirvensalmella",
    "localCaseType": "on",
    "genitive": "Hirvensalmen",
    "partitive": "Hirvensalmea",
    "illative": "Hirvensalmeen"
  },
  {
    "name": "Hollola",
    "localCase": "Hollolassa",
    "localCaseType": "in",
    "genitive": "Hollolan"
  },
  {
    "name": "Huittinen",
    "localCase": "Huittisissa",
    "localCaseType": "in",
    "genitive": "Huittisten",
    "partitive": "Huittisia",
    "illative": "Huittisiin"
  },
  {
    "name": "Humppila",
    "localCase": "Humppilassa",
    "localCaseType": "in",
    "genitive": "Humppilan"
  },
  {
    "name": "Hyrynsalmi",
    "localCase": "Hyrynsalmella",
    "localCaseType": "on",
    "genitive": "Hyrynsalmen",
    "partitive": "Hyrynsalmea",
    "illative": "Hyrynsalmeen"
  },
  {
    "name": "Hyvinkää",
    "localCase": "Hyvinkäällä",
    "localCaseType": "on",
    "genitive": "Hyvinkään",
    "partitive": "Hyvinkäätä"
  },
  {
    "name": "Hämeenkyrö",
    "localCase": "Hämeenkyrössä",
    "localCaseType": "in",
    "genitive": "Hämeenkyrön"
  },
  {
    "name": "Hämeenlinna",
    "localCase": "Hämeenlinnassa",
    "localCaseType": "in",
    "genitive": "Hämeenlinnan"
  },
  {
    "name": "Ii",
    "localCase": "Iissä",
    "localCaseType": "in",
    "genitive": "Iin"
  },
  {
    "name": "Iisalmi",
    "localCase": "Iisalmella",
    "localCaseType": "on",
    "genitive": "Iisalmen",
    "partitive": "Iisalmea",
    "illative": "Iisalmeen"
  },
  {
    "name": "Iitti",
    "localCase": "Iitissä",
    "localCaseType": "in",
    "genitive": "Iitin"
  },
  {
    "name": "Ikaalinen",
    "localCase": "Ikaalisissa",
    "localCaseType": "in",
    "genitive": "Ikaalisten",
    "partitive": "Ikaalisia",
    "illative": "Ikaalisiin"
  },
  {
    "name": "Ilmajoki",
    "localCase": "Ilmajoella",
    "localCaseType": "on",
    "genitive": "Ilmajoen",
    "partitive": "Ilmajokea",
    "illative": "Ilmajokeen"
  },
  {
    "name": "Ilomantsi",
    "localCase": "Ilomantsissa",
    "localCaseType": "in",
    "genitive": "Ilomantsin"
  },
  {
    "name": "Imatra",
    "localCase": "Imatralla",
    "localCaseType": "on",
    "genitive": "Imatran",
    "partitive": "Imatraa"
  },
  {
    "name": "Inari",
    "localCase": "Inarissa",
    "localCaseType": "in",
    "genitive": "Inarin"
  },
  {
    "name": "Inkoo",
    "localCase": "Inkoossa",
    "localCaseType": "in",
    "genitive": "Inkoon"
  },
  {
    "name": "Isojoki",
    "localCase": "Isojoella",
    "localCaseType": "on",
    "genitive": "Isojoen",
    "partitive": "Isojokea",
    "illative": "Isojokeen"
  },
  {
    "name": "Isokyrö",
    "localCase": "Isossakyrössä",
    "localCaseType": "in",
    "genitive": "Isonkyrön",
    "partitive": "Isoakyröä",
    "illative": "Isoonkyröön"
  },
  {
    "name": "Janakkala",
    "localCase": "Janakkalassa",
    "localCaseType": "in",
    "genitive": "Janakkalan"
  },
  {
    "name": "Joensuu",
    "localCase": "Joensuussa",
    "localCaseType": "in",
    "genitive": "Joensuun"
  },
  {
    "name": "Jokioinen",
    "localCase": "Jokioisissa",
    "localCaseType": "in",
    "genitive": "Jokioisten",
    "partitive": "Jokioisia",
    "illative": "Jokioisiin"
  },
  {
    "name": "Jomala",
    "localCase": "Jomalassa",
    "localCaseType": "in",
    "genitive": "Jomalan"
  },
  {
    "name": "Joroinen",
    "localCase": "Joroisissa",
    "localCaseType": "in",
    "genitive": "Joroisten",
    "partitive": "Joroisia",
    "illative": "Joroisiin"
  },
  {
    "name": "Joutsa",
    "localCase": "Joutsassa",
    "localCaseType": "in",
    "genitive": "Joutsan"
  },
  {
    "name": "Juuka",
    "localCase": "Juukassa",
    "localCaseType": "in",
    "genitive": "Juukan"
  },
  {
    "name": "Juupajoki",
    "localCase": "Juupajoella",
    "localCaseType": "on",
    "genitive": "Juupajoen",
    "partitive": "Juupajokea",
    "illative": "Juupajokeen"
  },
  {
    "name": "Juva",
    "localCase": "Juvassa",
    "localCaseType": "in",
    "genitive": "Juvan"
  },
  {
    "name": "Jyväskylä",
    "localCase": "Jyväskylässä",
    "localCaseType": "in",
    "genitive": "Jyväskylän"
  },
  {
    "name": "Jämijärvi",
    "localCase": "Jämijärvellä",
    "localCaseType": "on",
    "genitive": "Jämijärven",
    "partitive": "Jämijärveä",
    "illative": "Jämijärveen"
  },
  {
    "name": "Jämsä",
    "localCase": "Jämsässä",
    "localCaseType": "in",
    "genitive": "Jämsän"
  },
  {
    "name": "Järvenpää",
    "localCase": "Järvenpäässä",
    "localCaseType": "in",
    "genitive": "Järvenpään"
  },
  {
    "name": "Kaarina",
    "localCase": "Kaarinassa",
    "localCaseType": "in",
    "genitive": "Kaarinan"
  },
  {
    "name": "Kaavi",
    "localCase": "Kaavilla",
    "localCaseType": "on",
    "genitive": "Kaavin",
    "partitive": "Kaavia"
  },
  {
    "name": "Kajaani",
    "localCase": "Kajaanissa",
    "localCaseType": "in",
    "genitive": "Kajaanin"
  },
  {
    "name": "Kalajoki",
    "localCase": "Kalajoella",
    "localCaseType": "on",
    "genitive": "Kalajoen",
    "partitive": "Kalajokea",
    "illative": "Kalajokeen"
  },
  {
    "name": "Kangasala",
    "localCase": "Kangasalla",
    "localCaseType": "on",
    "genitive": "Kangasalan",
    "partitive": "Kangasalaa"
  },
  {
    "name": "Kangasniemi",
    "localCase": "Kangasniemellä",
    "localCaseType": "on",
    "genitive": "Kangasniemen",
    "partitive": "Kangasniemeä",
    "illative": "Kangasniemeen"
  },
  {
    "name": "Kankaanpää",
    "localCase": "Kankaanpäässa",
    "localCaseType": "in",
    "genitive": "Kankaanpään"
  },
  {
    "name": "Kannonkoski",
    "localCase": "Kannonkoskella",
    "localCaseType": "on",
    "genitive": "Kannonkosken",
    "partitive": "Kannonkoskea",
    "illative": "Kannonkoskeen"
  },
  {
    "name": "Kannus",
    "localCase": "Kannuksessa",
    "localCaseType": "in",
    "genitive": "Kannuksen",
    "partitive": "Kannusta",
    "illative": "Kannukseen"
  },
  {
    "name": "Karijoki",
    "localCase": "Karijoella",
    "localCaseType": "on",
    "genitive": "Karijoen",
    "partitive": "Karijokea",
    "illative": "Karijokeen"
  },
  {
    "name": "Karkkila",
    "localCase": "Karkkilassa",
    "localCaseType": "in",
    "genitive": "Karkkilan"
  },
  {
    "name": "Karstula",
    "localCase": "Karstulassa",
    "localCaseType": "in",
    "genitive": "Karstulan"
  },
  {
    "name": "Karvia",
    "localCase": "Karviassa",
    "localCaseType": "in",
    "genitive": "Karvian"
  },
  {
    "name": "Kaskinen",
    "localCase": "Kaskisissa",
    "localCaseType": "in",
    "genitive": "Kaskisten",
    "partitive": "Kaskisia",
    "illative": "Kaskisiin"
  },
  {
    "name": "Kauhajoki",
    "localCase": "Kauhajoella",
    "localCaseType": "on",
    "genitive": "Kauhajoen",
    "partitive": "Kauhajokea",
    "illative": "Kauhajokeen"
  },
  {
    "name": "Kauhava",
    "localCase": "Kauhavalla",
    "localCaseType": "on",
    "genitive": "Kauhavan",
    "partitive": "Kauhavaa"
  },
  {
    "name": "Kauniainen",
    "localCase": "Kauniaisissa",
    "localCaseType": "in",
    "genitive": "Kauniaisten",
    "partitive": "Kauniaisia",
    "illative": "Kauniaisiin"
  },
  {
    "name": "Kaustinen",
    "localCase": "Kaustisella",
    "localCaseType": "on",
    "genitive": "Kaustisen",
    "partitive": "Kaustista"
  },
  {
    "name": "Keitele",
    "localCase": "Keiteleellä",
    "localCaseType": "on",
    "genitive": "Keiteleen",
    "partitive": "Keitelettä"
  },
  {
    "name": "Kemi",
    "localCase": "Kemissä",
    "localCaseType": "in",
    "genitive": "Kemin"
  },
  {
    "name": "Kemijärvi",
    "localCase": "Kemijärvellä",
    "localCaseType": "on",
    "genitive": "Kemijärven",
    "partitive": "Kemijärveä",
    "illative": "Kemijärveen"
  },
  {
    "name": "Keminmaa",
    "localCase": "Keminmaassa",
    "localCaseType": "in",
    "genitive": "Keminmaan"
  },
  {
    "name": "Kemiönsaari",
    "localCase": "Kemiönsaarella",
    "localCaseType": "on",
    "genitive": "Kemiönsaaren",
    "partitive": "Kemiönsaarta",
    "illative": "Kemiönsaareen"
  },
  {
    "name": "Kempele",
    "localCase": "Kempeleessä",
    "localCaseType": "in",
    "genitive": "Kempeleen",
    "partitive": "Kempelettä",
    "illative": "Kempeleeseen"
  },
  {
    "name": "Kerava",
    "localCase": "Keravalla",
    "localCaseType": "on",
    "genitive": "Keravan",
    "partitive": "Keravaa"
  },
  {
    "name": "Keuruu",
    "localCase": "Keuruussa",
    "localCaseType": "in",
    "genitive": "Keuruun"
  },
  {
    "name": "Kihniö",
    "localCase": "Kihniössä",
    "localCaseType": "in",
    "genitive": "Kihniön"
  },
  {
    "name": "Kinnula",
    "localCase": "Kinnulassa",
    "localCaseType": "in",
    "genitive": "Kinnulan"
  },
  {
    "name": "Kirkkonummi",
    "localCase": "Kirkkonummella",
    "localCaseType": "on",
    "genitive": "Kirkkonummen",
    "partitive": "Kirkkonummea"
  },
  {
    "name": "Kitee",
    "localCase": "Kiteellä",
    "localCaseType": "on",
    "genitive": "Kiteen",
    "partitive": "Kiteetä"
  },
  {
    "name": "Kittilä",
    "localCase": "Kittilässä",
    "localCaseType": "in",
    "genitive": "Kittilän"
  },
  {
    "name": "Kiuruvesi",
    "localCase": "Kiuruvedellä",
    "localCaseType": "on",
    "genitive": "Kiuruveden",
    "partitive": "Kiuruvettä",
    "illative": "Kiuruveteen"
  },
  {
    "name": "Kivijärvi",
    "localCase": "Kivijärvellä",
    "localCaseType": "on",
    "genitive": "Kivijärven",
    "partitive": "Kivijärveä",
    "illative": "Kivijärveen"
  },
  {
    "name": "Kokemäki",
    "localCase": "Kokemäellä",
    "localCaseType": "on",
    "genitive": "Kokemäen",
    "partitive": "Kokemäkeä",
    "illative": "Kokemäkeen"
  },
  {
    "name": "Kokkola",
    "localCase": "Kokkolassa",
    "localCaseType": "in",
    "genitive": "Kokkolan"
  },
  {
    "name": "Kolari",
    "localCase": "Kolarissa",
    "localCaseType": "in",
    "genitive": "Kolarin"
  },
  {
    "name": "Konnevesi",
    "localCase": "Konnevedellä",
    "localCaseType": "on",
    "genitive": "Konneveden",
    "partitive": "Konnevettä",
    "illative": "Konneveteen"
  },
  {
    "name": "Kontiolahti",
    "localCase": "Kontiolahdessa",
    "localCaseType": "in",
    "genitive": "Kontiolahden",
    "partitive": "Kontiolahtea",
    "illative": "Kontiolahteen"
  },
  {
    "name": "Korsnäs",
    "localCase": "Korsnäsissä",
    "localCaseType": "in",
    "genitive": "Korsnäsin",
    "partitive": "Korsnäsiä",
    "illative": "Korsnäsiin"
  },
  {
    "name": "Koski Tl",
    "localCase": "Koski Tl:llä",
    "localCaseType": "on",
    "genitive": "Koski Tl:n",
    "partitive": "Koski Tl:ää",
    "illative": "Koski Tl:ään"
  },
  {
    "name": "Kotka",
    "localCase": "Kotkassa",
    "localCaseType": "in",
    "genitive": "Kotkan"
  },
  {
    "name": "Kouvola",
    "localCase": "Kouvolassa",
    "localCaseType": "in",
    "genitive": "Kouvolan"
  },
  {
    "name": "Kristiinankaupunki",
    "localCase": "Kristiinankaupungissa",
    "localCaseType": "in",
    "genitive": "Kristiinankaupungin"
  },
  {
    "name": "Kruunupyy",
    "localCase": "Kruunupyyssa",
    "localCaseType": "in",
    "genitive": "Kruunupyyn"
  },
  {
    "name": "Kuhmo",
    "localCase": "Kuhmossa",
    "localCaseType": "in",
    "genitive": "Kuhmon"
  },
  {
    "name": "Kuhmoinen",
    "localCase": "Kuhmoisissa",
    "localCaseType": "in",
    "genitive": "Kuhmoisten",
    "partitive": "Kuhmoisia",
    "illative": "Kuhmoisiin"
  },
  {
    "name": "Kumlinge",
    "localCase": "Kumlingessa",
    "localCaseType": "in",
    "genitive": "Kumlingen",
    "partitive": "Kumlingea",
    "illative": "Kumlingeen"
  },
  {
    "name": "Kuopio",
    "localCase": "Kuopiossa",
    "localCaseType": "in",
    "genitive": "Kuopion"
  },
  {
    "name": "Kuortane",
    "localCase": "Kuortaneella",
    "localCaseType": "on",
    "genitive": "Kuortaneen",
    "partitive": "Kuortanetta"
  },
  {
    "name": "Kurikka",
    "localCase": "Kurikassa",
    "localCaseType": "in",
    "genitive": "Kurikan"
  },
  {
    "name": "Kustavi",
    "localCase": "Kustavissa",
    "localCaseType": "in",
    "genitive": "Kustavin"
  },
  {
    "name": "Kuusamo",
    "localCase": "Kuusamossa",
    "localCaseType": "in",
    "genitive": "Kuusamon"
  },
  {
    "name": "Kyyjärvi",
    "localCase": "Kyyjärvellä",
    "localCaseType": "on",
    "genitive": "Kyyjärven",
    "partitive": "Kyyjärveä",
    "illative": "Kyyjärveen"
  },
  {
    "name": "Kärkölä",
    "localCase": "Kärkölässä",
    "localCaseType": "in",
    "genitive": "Kärkölän"
  },
  {
    "name": "Kärsämäki",
    "localCase": "Kärsämäellä",
    "localCaseType": "on",
    "genitive": "Kärsämäen",
    "partitive": "Kärsämäkeä",
    "illative": "Kärsämäkeen"
  },
  {
    "name": "Kökar",
    "localCase": "Kökarissa",
    "localCaseType": "in",
    "genitive": "Kökarin",
    "partitive": "Kökaria",
    "illative": "Kökariin"
  },
  {
    "name": "Lahti",
    "localCase": "Lahdessa",
    "localCaseType": "in",
    "genitive": "Lahden",
    "partitive": "Lahtea",
    "illative": "Lahteen"
  },
  {
    "name": "Laihia",
    "localCase": "Laihialla",
    "localCaseType": "on",
    "genitive": "Laihian",
    "partitive": "Laihiaa"
  },
  {
    "name": "Laitila",
    "localCase": "Laitilassa",
    "localCaseType": "in",
    "genitive": "Laitilan"
  },
  {
    "name": "Lapinjärvi",
    "localCase": "Lapinjärvellä",
    "localCaseType": "on",
    "genitive": "Lapinjärven",
    "partitive": "Lapinjärveä",
    "illative": "Lapinjärveen"
  },
  {
    "name": "Lapinlahti",
    "localCase": "Lapinlahdella",
    "localCaseType": "on",
    "genitive": "Lapinlahden",
    "partitive": "Lapinlahtea"
  },
  {
    "name": "Lappajärvi",
    "localCase": "Lappajärvellä",
    "localCaseType": "on",
    "genitive": "Lappajärven",
    "partitive": "Lappajärveä",
    "illative": "Lappajärveen"
  },
  {
    "name": "Lappeenranta",
    "localCase": "Lappeenrannassa",
    "localCaseType": "in",
    "genitive": "Lappeenrannan",
    "partitive": "Lappeenrantaa",
    "illative": "Lappeenrantaan"
  },
  {
    "name": "Lapua",
    "localCase": "Lapualla",
    "localCaseType": "on",
    "genitive": "Lapuan",
    "partitive": "Lapuaa"
  },
  {
    "name": "Laukaa",
    "localCase": "Laukaassa",
    "localCaseType": "in",
    "genitive": "Laukaan"
  },
  {
    "name": "Lemi",
    "localCase": "Lemillä",
    "localCaseType": "on",
    "genitive": "Lemin",
    "partitive": "Lemiä"
  },
  {
    "name": "Lemland",
    "localCase": "Lemlandissa",
    "localCaseType": "in",
    "genitive": "Lemlandin",
    "partitive": "Lemlandia",
    "illative": "Lemlandiin"
  },
  {
    "name": "Lempäälä",
    "localCase": "Lempäälässä",
    "localCaseType": "in",
    "genitive": "Lempäälän",
    "partitive": "Lempäälää",
    "illative": "Lempäälään"
  },
  {
    "name": "Leppävirta",
    "localCase": "Leppävirralla",
    "localCaseType": "on",
    "genitive": "Leppävirran",
    "partitive": "Leppävirtaa"
  },
  {
    "name": "Lestijärvi",
    "localCase": "Lestijärvellä",
    "localCaseType": "on",
    "genitive": "Lestijärven",
    "partitive": "Lestijärveä",
    "illative": "Lestijärveen"
  },
  {
    "name": "Lieksa",
    "localCase": "Lieksassa",
    "localCaseType": "in",
    "genitive": "Lieksan"
  },
  {
    "name": "Lieto",
    "localCase": "Liedossa",
    "localCaseType": "in",
    "genitive": "Liedon"
  },
  {
    "name": "Liminka",
    "localCase": "Limingassa",
    "localCaseType": "in",
    "genitive": "Limingan"
  },
  {
    "name": "Liperi",
    "localCase": "Liperissä",
    "localCaseType": "in",
    "genitive": "Liperin"
  },
  {
    "name": "Lohja",
    "localCase": "Lohjalla",
    "localCaseType": "on",
    "genitive": "Lohjan",
    "partitive": "Lohjaa"
  },
  {
    "name": "Loimaa",
    "localCase": "Loimaalla",
    "localCaseType": "on",
    "genitive": "Loimaan",
    "partitive": "Loimaata"
  },
  {
    "name": "Loppi",
    "localCase": "Lopella",
    "localCaseType": "on",
    "genitive": "Lopen",
    "partitive": "Loppea"
  },
  {
    "name": "Loviisa",
    "localCase": "Loviisassa",
    "localCaseType": "in",
    "genitive": "Loviisan"
  },
  {
    "name": "Luhanka",
    "localCase": "Luhangassa",
    "localCaseType": "in",
    "genitive": "Luhangan"
  },
  {
    "name": "Lumijoki",
    "localCase": "Lumijoella",
    "localCaseType": "on",
    "genitive": "Lumijoen",
    "partitive": "Lumijokea",
    "illative": "Lumijokeen"
  },
  {
    "name": "Lumparland",
    "localCase": "Lumparlandissa",
    "localCaseType": "in",
    "genitive": "Lumparlandin",
    "partitive": "Lumparlandia",
    "illative": "Lumparlandiin"
  },
  {
    "name": "Luoto",
    "localCase": "Luodossa",
    "localCaseType": "in",
    "genitive": "Luodon",
    "partitive": "Luotoa",
    "illative": "Luotoon"
  },
  {
    "name": "Luumäki",
    "localCase": "Luumäellä",
    "localCaseType": "on",
    "genitive": "Luumäen",
    "partitive": "Luumäkeä"
  },
  {
    "name": "Maalahti",
    "localCase": "Maalahdessa",
    "localCaseType": "in",
    "genitive": "Maalahden",
    "partitive": "Maalahtea",
    "illative": "Maalahteen"
  },
  {
    "name": "Maarianhamina",
    "localCase": "Maarianhaminassa",
    "localCaseType": "in",
    "genitive": "Maarianhaminan"
  },
  {
    "name": "Marttila",
    "localCase": "Marttilassa",
    "localCaseType": "in",
    "genitive": "Marttilan",
    "partitive": "Marttilaa",
    "illative": "Marttilaan"
  },
  {
    "name": "Masku",
    "localCase": "Maskussa",
    "localCaseType": "in",
    "genitive": "Maskun"
  },
  {
    "name": "Merijärvi",
    "localCase": "Merijärvellä",
    "localCaseType": "on",
    "genitive": "Merijärven",
    "partitive": "Merijärveä",
    "illative": "Merijärveen"
  },
  {
    "name": "Merikarvia",
    "localCase": "Merikarviassa",
    "localCaseType": "in",
    "genitive": "Merikarvian"
  },
  {
    "name": "Miehikkälä",
    "localCase": "Miehikkälässä",
    "localCaseType": "in",
    "genitive": "Miehikkälän"
  },
  {
    "name": "Mikkeli",
    "localCase": "Mikkelissä",
    "localCaseType": "in",
    "genitive": "Mikkelin",
    "partitive": "Mikkeliä",
    "illative": "Mikkeliin"
  },
  {
    "name": "Muhos",
    "localCase": "Muhoksella",
    "localCaseType": "on",
    "genitive": "Muhoksen",
    "partitive": "Muhosta"
  },
  {
    "name": "Multia",
    "localCase": "Multialla",
    "localCaseType": "on",
    "genitive": "Multian",
    "partitive": "Multiaa"
  },
  {
    "name": "Muonio",
    "localCase": "Muoniossa",
    "localCaseType": "in",
    "genitive": "Muonion"
  },
  {
    "name": "Mustasaari",
    "localCase": "Mustasaarella",
    "localCaseType": "on",
    "genitive": "Mustasaaren",
    "partitive": "Mustasaarta",
    "illative": "Mustasaareen"
  },
  {
    "name": "Muurame",
    "localCase": "Muuramessa",
    "localCaseType": "in",
    "genitive": "Muuramen",
    "partitive": "Muuramea",
    "illative": "Muurameen"
  },
  {
    "name": "Mynämäki",
    "localCase": "Mynämäellä",
    "localCaseType": "on",
    "genitive": "Mynämäen",
    "partitive": "Mynämäkeä",
    "illative": "Mynämäkeen"
  },
  {
    "name": "Myrskylä",
    "localCase": "Myrskylässä",
    "localCaseType": "in",
    "genitive": "Myrskylän"
  },
  {
    "name": "Mäntsälä",
    "localCase": "Mäntsälässä",
    "localCaseType": "in",
    "genitive": "Mäntsälän"
  },
  {
    "name": "Mänttä-Vilppula",
    "localCase": "Mänttä-Vilppulassa",
    "localCaseType": "in",
    "genitive": "Mänttä-Vilppulan",
    "partitive": "Mänttä-Vilppulaa",
    "illative": "Mänttä-Vilppulaan"
  },
  {
    "name": "Mäntyharju",
    "localCase": "Mäntyharjulla",
    "localCaseType": "on",
    "genitive": "Mäntyharjun",
    "partitive": "Mäntyharjua"
  },
  {
    "name": "Naantali",
    "localCase": "Naantalissa",
    "localCaseType": "in",
    "genitive": "Naantalin",
    "partitive": "Naantalia",
    "illative": "Naantaliin"
  },
  {
    "name": "Nakkila",
    "localCase": "Nakkilassa",
    "localCaseType": "in",
    "genitive": "Nakkilan"
  },
  {
    "name": "Nivala",
    "localCase": "Nivalassa",
    "localCaseType": "in",
    "genitive": "Nivalan"
  },
  {
    "name": "Nokia",
    "localCase": "Nokialla",
    "localCaseType": "on",
    "genitive": "Nokian",
    "partitive": "Nokiaa"
  },
  {
    "name": "Nousiainen",
    "localCase": "Nousiaisissa",
    "localCaseType": "in",
    "genitive": "Nousiaisten",
    "partitive": "Nousiaisia",
    "illative": "Nousiaisiin"
  },
  {
    "name": "Nurmes",
    "localCase": "Nurmeksessa",
    "localCaseType": "in",
    "genitive": "Nurmeksen",
    "partitive": "Nurmesta",
    "illative": "Nurmekseen"
  },
  {
    "name": "Nurmijärvi",
    "localCase": "Nurmijärvellä",
    "localCaseType": "on",
    "genitive": "Nurmijärven",
    "partitive": "Nurmijärveä",
    "illative": "Nurmijärveen"
  },
  {
    "name": "Närpiö",
    "localCase": "Närpiössä",
    "localCaseType": "in",
    "genitive": "Närpiön"
  },
  {
    "name": "Orimattila",
    "localCase": "Orimattilassa",
    "localCaseType": "in",
    "genitive": "Orimattilan"
  },
  {
    "name": "Oripää",
    "localCase": "Oripäässa",
    "localCaseType": "in",
    "genitive": "Oripään"
  },
  {
    "name": "Orivesi",
    "localCase": "Orivedellä",
    "localCaseType": "on",
    "genitive": "Oriveden",
    "partitive": "Orivettä",
    "illative": "Oriveteen"
  },
  {
    "name": "Oulainen",
    "localCase": "Oulaisissa",
    "localCaseType": "in",
    "genitive": "Oulaisten",
    "partitive": "Oulaisia",
    "illative": "Oulaisiin"
  },
  {
    "name": "Oulu",
    "localCase": "Oulussa",
    "localCaseType": "in",
    "genitive": "Oulun"
  },
  {
    "name": "Outokumpu",
    "localCase": "Outokummussa",
    "localCaseType": "in",
    "genitive": "Outokummun"
  },
  {
    "name": "Padasjoki",
    "localCase": "Padasjoella",
    "localCaseType": "on",
    "genitive": "Padasjoen",
    "partitive": "Padasjokea",
    "illative": "Padasjokeen"
  },
  {
    "name": "Paimio",
    "localCase": "Paimiossa",
    "localCaseType": "in",
    "genitive": "Paimion"
  },
  {
    "name": "Paltamo",
    "localCase": "Paltamossa",
    "localCaseType": "in",
    "genitive": "Paltamon"
  },
  {
    "name": "Parainen",
    "localCase": "Paraisilla",
    "localCaseType": "on",
    "genitive": "Paraisten",
    "partitive": "Paraisia"
  },
  {
    "name": "Parikkala",
    "localCase": "Parikkalassa",
    "localCaseType": "in",
    "genitive": "Parikkalan"
  },
  {
    "name": "Parkano",
    "localCase": "Parkanossa",
    "localCaseType": "in",
    "genitive": "Parkanon"
  },
  {
    "name": "Pedersören kunta",
    "localCase": "Pedersören kunnassa",
    "localCaseType": "in",
    "genitive": "Pedersören kunnan",
    "partitive": "Pedersören kuntaa",
    "illative": "Pedersören kuntaan"
  },
  {
    "name": "Pelkosenniemi",
    "localCase": "Pelkosenniemellä",
    "localCaseType": "on",
    "genitive": "Pelkosenniemen",
    "partitive": "Pelkosenniemeä",
    "illative": "Pelkosenniemeen"
  },
  {
    "name": "Pello",
    "localCase": "Pellossa",
    "localCaseType": "in",
    "genitive": "Pellon"
  },
  {
    "name": "Perho",
    "localCase": "Perhossa",
    "localCaseType": "in",
    "genitive": "Perhon"
  },
  {
    "name": "Petäjävesi",
    "localCase": "Petäjävedellä",
    "localCaseType": "on",
    "genitive": "Petäjäveden",
    "partitive": "Petäjävettä",
    "illative": "Petäjäveteen"
  },
  {
    "name": "Pieksämäki",
    "localCase": "Pieksämäellä",
    "localCaseType": "on",
    "genitive": "Pieksämäen",
    "partitive": "Pieksämäkeä",
    "illative": "Pieksämäkeen"
  },
  {
    "name": "Pielavesi",
    "localCase": "Pielavedellä",
    "localCaseType": "on",
    "genitive": "Pielaveden",
    "partitive": "Pielavettä",
    "illative": "Pielaveteen"
  },
  {
    "name": "Pietarsaari",
    "localCase": "Pietarsaaressa",
    "localCaseType": "in",
    "genitive": "Pietarsaaren",
    "partitive": "Pietarsaarta",
    "illative": "Pietarsaareen"
  },
  {
    "name": "Pihtipudas",
    "localCase": "Pihtiputaalla",
    "localCaseType": "on",
    "genitive": "Pihtiputaan",
    "partitive": "Pihtipudasta"
  },
  {
    "name": "Pirkkala",
    "localCase": "Pirkkalassa",
    "localCaseType": "in",
    "genitive": "Pirkkalan"
  },
  {
    "name": "Polvijärvi",
    "localCase": "Polvijärvellä",
    "localCaseType": "on",
    "genitive": "Polvijärven",
    "partitive": "Polvijärveä",
    "illative": "Polvijärveen"
  },
  {
    "name": "Pomarkku",
    "localCase": "Pomarkussa",
    "localCaseType": "in",
    "genitive": "Pomarkun"
  },
  {
    "name": "Pori",
    "localCase": "Porissa",
    "localCaseType": "in",
    "genitive": "Porin"
  },
  {
    "name": "Pornainen",
    "localCase": "Pornaisissa",
    "localCaseType": "in",
    "genitive": "Pornaisten",
    "partitive": "Pornaisia",
    "illative": "Pornaisiin"
  },
  {
    "name": "Porvoo",
    "localCase": "Porvoossa",
    "localCaseType": "in",
    "genitive": "Porvoon"
  },
  {
    "name": "Posio",
    "localCase": "Posiolla",
    "localCaseType": "on",
    "genitive": "Posion",
    "partitive": "Posiota"
  },
  {
    "name": "Pudasjärvi",
    "localCase": "Pudasjärvellä",
    "localCaseType": "on",
    "genitive": "Pudasjärven",
    "partitive": "Pudasjärveä",
    "illative": "Pudasjärveen"
  },
  {
    "name": "Pukkila",
    "localCase": "Pukkilassa",
    "localCaseType": "in",
    "genitive": "Pukkilan"
  },
  {
    "name": "Punkalaidun",
    "localCase": "Punkalaitumella",
    "localCaseType": "on",
    "genitive": "Punkalaitumen",
    "partitive": "Punkalaidunta"
  },
  {
    "name": "Puolanka",
    "localCase": "Puolangalla",
    "localCaseType": "on",
    "genitive": "Puolangan",
    "partitive": "Puolankaa"
  },
  {
    "name": "Puumala",
    "localCase": "Puumalassa",
    "localCaseType": "in",
    "genitive": "Puumalan"
  },
  {
    "name": "Pyhtää",
    "localCase": "Pyhtäällä",
    "localCaseType": "on",
    "genitive": "Pyhtään",
    "partitive": "Pyhtäätä"
  },
  {
    "name": "Pyhäjoki",
    "localCase": "Pyhäjoella",
    "localCaseType": "on",
    "genitive": "Pyhäjoen",
    "partitive": "Pyhäjokea",
    "illative": "Pyhäjokeen"
  },
  {
    "name": "Pyhäjärvi",
    "localCase": "Pyhäjärvellä",
    "localCaseType": "on",
    "genitive": "Pyhäjärven",
    "partitive": "Pyhäjärveä",
    "illative": "Pyhäjärveen"
  },
  {
    "name": "Pyhäntä",
    "localCase": "Pyhännällä",
    "localCaseType": "on",
    "genitive": "Pyhännän",
    "partitive": "Pyhäntää"
  },
  {
    "name": "Pyhäranta",
    "localCase": "Pyhärannassa",
    "localCaseType": "in",
    "genitive": "Pyhärannan",
    "partitive": "Pyhärantaa",
    "illative": "Pyhärantaan"
  },
  {
    "name": "Pälkäne",
    "localCase": "Pälkäneellä",
    "localCaseType": "on",
    "genitive": "Pälkäneen",
    "partitive": "Pälkänettä"
  },
  {
    "name": "Pöytyä",
    "localCase": "Pöytyällä",
    "localCaseType": "on",
    "genitive": "Pöytyän",
    "partitive": "Pöytyää"
  },
  {
    "name": "Raahe",
    "localCase": "Raahessa",
    "localCaseType": "in",
    "genitive": "Raahen",
    "partitive": "Raahea",
    "illative": "Raaheen"
  },
  {
    "name": "Raasepori",
    "localCase": "Raaseporissa",
    "localCaseType": "in",
    "genitive": "Raaseporin"
  },
  {
    "name": "Raisio",
    "localCase": "Raisiossa",
    "localCaseType": "in",
    "genitive": "Raision"
  },
  {
    "name": "Rantasalmi",
    "localCase": "Rantasalmella",
    "localCaseType": "on",
    "genitive": "Rantasalmen",
    "partitive": "Rantasalmea",
    "illative": "Rantasalmeen"
  },
  {
    "name": "Ranua",
    "localCase": "Ranualla",
    "localCaseType": "on",
    "genitive": "Ranuan",
    "partitive": "Ranuaa"
  },
  {
    "name": "Rauma",
    "localCase": "Raumalla",
    "localCaseType": "on",
    "genitive": "Rauman",
    "partitive": "Raumaa"
  },
  {
    "name": "Rautalampi",
    "localCase": "Rautalammilla",
    "localCaseType": "on",
    "genitive": "Rautalammin",
    "partitive": "Rautalampia"
  },
  {
    "name": "Rautavaara",
    "localCase": "Rautavaaralla",
    "localCaseType": "on",
    "genitive": "Rautavaaran"
  },
  {
    "name": "Rautjärvi",
    "localCase": "Rautjärvellä",
    "localCaseType": "on",
    "genitive": "Rautjärven",
    "partitive": "Rautjärveä",
    "illative": "Rautjärveen"
  },
  {
    "name": "Reisjärvi",
    "localCase": "Reisjärvellä",
    "localCaseType": "on",
    "genitive": "Reisjärven",
    "partitive": "Reisjärveä",
    "illative": "Reisjärveen"
  },
  {
    "name": "Riihimäki",
    "localCase": "Riihimäellä",
    "localCaseType": "on",
    "genitive": "Riihimäen",
    "partitive": "Riihimäkeä",
    "illative": "Riihimäkeen"
  },
  {
    "name": "Ristijärvi",
    "localCase": "Ristijärvellä",
    "localCaseType": "on",
    "genitive": "Ristijärven",
    "partitive": "Ristijärveä",
    "illative": "Ristijärveen"
  },
  {
    "name": "Rovaniemi",
    "localCase": "Rovaniemellä",
    "localCaseType": "on",
    "genitive": "Rovaniemen",
    "partitive": "Rovaniemeä"
  },
  {
    "name": "Ruokolahti",
    "localCase": "Ruokolahdella",
    "localCaseType": "on",
    "genitive": "Ruokolahden",
    "partitive": "Ruokolahtea"
  },
  {
    "name": "Ruovesi",
    "localCase": "Ruovedellä",
    "localCaseType": "on",
    "genitive": "Ruoveden",
    "partitive": "Ruovettä",
    "illative": "Ruoveteen"
  },
  {
    "name": "Rusko",
    "localCase": "Ruskolla",
    "localCaseType": "on",
    "genitive": "Ruskon",
    "partitive": "Ruskoa"
  },
  {
    "name": "Rääkkylä",
    "localCase": "Rääkkylässä",
    "localCaseType": "in",
    "genitive": "Rääkkylän"
  },
  {
    "name": "Saarijärvi",
    "localCase": "Saarijärvellä",
    "localCaseType": "on",
    "genitive": "Saarijärven",
    "partitive": "Saarijärveä",
    "illative": "Saarijärveen"
  },
  {
    "name": "Salla",
    "localCase": "Sallassa",
    "localCaseType": "in",
    "genitive": "Sallan"
  },
  {
    "name": "Salo",
    "localCase": "Salossa",
    "localCaseType": "in",
    "genitive": "Salon"
  },
  {
    "name": "Saltvik",
    "localCase": "Saltvikissa",
    "localCaseType": "in",
    "genitive": "Saltvikin",
    "partitive": "Saltvikia",
    "illative": "Saltvikiin"
  },
  {
    "name": "Sastamala",
    "localCase": "Sastamalassa",
    "localCaseType": "in",
    "genitive": "Sastamalan"
  },
  {
    "name": "Sauvo",
    "localCase": "Sauvossa",
    "localCaseType": "in",
    "genitive": "Sauvon"
  },
  {
    "name": "Savitaipale",
    "localCase": "Savitaipaleella",
    "localCaseType": "on",
    "genitive": "Savitaipaleen",
    "partitive": "Savitaipaletta"
  },
  {
    "name": "Savonlinna",
    "localCase": "Savonlinnassa",
    "localCaseType": "in",
    "genitive": "Savonlinnan"
  },
  {
    "name": "Savukoski",
    "localCase": "Savukoskella",
    "localCaseType": "on",
    "genitive": "Savukosken",
    "partitive": "Savukoskea",
    "illative": "Savukoskeen"
  },
  {
    "name": "Seinäjoki",
    "localCase": "Seinäjoella",
    "localCaseType": "on",
    "genitive": "Seinäjoen",
    "partitive": "Seinäjokea",
    "illative": "Seinäjokeen"
  },
  {
    "name": "Sievi",
    "localCase": "Sievissä",
    "localCaseType": "in",
    "genitive": "Sievin"
  },
  {
    "name": "Siikainen",
    "localCase": "Siikaisissa",
    "localCaseType": "in",
    "genitive": "Siikaisten",
    "partitive": "Siikaisia",
    "illative": "Siikaisiin"
  },
  {
    "name": "Siikajoki",
    "localCase": "Siikajoella",
    "localCaseType": "on",
    "genitive": "Siikajoen",
    "partitive": "Siikajokea",
    "illative": "Siikajokeen"
  },
  {
    "name": "Siikalatva",
    "localCase": "Siikalatvassa",
    "localCaseType": "in",
    "genitive": "Siikalatvan"
  },
  {
    "name": "Siilinjärvi",
    "localCase": "Siilinjärvellä",
    "localCaseType": "on",
    "genitive": "Siilinjärven",
    "partitive": "Siilinjärveä",
    "illative": "Siilinjärveen"
  },
  {
    "name": "Simo",
    "localCase": "Simossa",
    "localCaseType": "in",
    "genitive": "Simon"
  },
  {
    "name": "Sipoo",
    "localCase": "Sipoossa",
    "localCaseType": "in",
    "genitive": "Sipoon"
  },
  {
    "name": "Siuntio",
    "localCase": "Siuntiossa",
    "localCaseType": "in",
    "genitive": "Siuntion"
  },
  {
    "name": "Sodankylä",
    "localCase": "Sodankylässa",
    "localCaseType": "in",
    "genitive": "Sodankylän"
  },
  {
    "name": "Soini",
    "localCase": "Soinissa",
    "localCaseType": "in",
    "genitive": "Soinin"
  },
  {
    "name": "Somero",
    "localCase": "Somerolla",
    "localCaseType": "on",
    "genitive": "Someron",
    "partitive": "Someroa"
  },
  {
    "name": "Sonkajärvi",
    "localCase": "Sonkajärvellä",
    "localCaseType": "on",
    "genitive": "Sonkajärven",
    "partitive": "Sonkajärveä",
    "illative": "Sonkajärveen"
  },
  {
    "name": "Sotkamo",
    "localCase": "Sotkamossa",
    "localCaseType": "in",
    "genitive": "Sotkamon"
  },
  {
    "name": "Sottunga",
    "localCase": "Sottungassa",
    "localCaseType": "in",
    "genitive": "Sottungan"
  },
  {
    "name": "Sulkava",
    "localCase": "Sulkavalla",
    "localCaseType": "on",
    "genitive": "Sulkavan",
    "partitive": "Sulkavaa"
  },
  {
    "name": "Sund",
    "localCase": "Sundissa",
    "localCaseType": "in",
    "genitive": "Sundin",
    "partitive": "Sundia",
    "illative": "Sundiin"
  },
  {
    "name": "Suomussalmi",
    "localCase": "Suomussalmella",
    "localCaseType": "on",
    "genitive": "Suomussalmen",
    "partitive": "Suomussalmea",
    "illative": "Suomussalmeen"
  },
  {
    "name": "Suonenjoki",
    "localCase": "Suonenjoella",
    "localCaseType": "on",
    "genitive": "Suonenjoen",
    "partitive": "Suonenjokea",
    "illative": "Suonenjokeen"
  },
  {
    "name": "Sysmä",
    "localCase": "Sysmässä",
    "localCaseType": "in",
    "genitive": "Sysmän"
  },
  {
    "name": "Säkylä",
    "localCase": "Säkylässä",
    "localCaseType": "in",
    "genitive": "Säkylän"
  },
  {
    "name": "Taipalsaari",
    "localCase": "Taipalsaarella",
    "localCaseType": "on",
    "genitive": "Taipalsaaren",
    "partitive": "Taipalsaarta",
    "illative": "Taipalsaareen"
  },
  {
    "name": "Taivalkoski",
    "localCase": "Taivalkoskella",
    "localCaseType": "on",
    "genitive": "Taivalkosken",
    "partitive": "Taivalkoskea",
    "illative": "Taivalkoskeen"
  },
  {
    "name": "Taivassalo",
    "localCase": "Taivassalossa",
    "localCaseType": "in",
    "genitive": "Taivassalon"
  },
  {
    "name": "Tammela",
    "localCase": "Tammelassa",
    "localCaseType": "in",
    "genitive": "Tammelan"
  },
  {
    "name": "Tampere",
    "localCase": "Tampereella",
    "localCaseType": "on",
    "genitive": "Tampereen",
    "partitive": "Tamperetta"
  },
  {
    "name": "Tervo",
    "localCase": "Tervossa",
    "localCaseType": "in",
    "genitive": "Tervon"
  },
  {
    "name": "Tervola",
    "localCase": "Tervolassa",
    "localCaseType": "in",
    "genitive": "Tervolan"
  },
  {
    "name": "Teuva",
    "localCase": "Teuvalla",
    "localCaseType": "on",
    "genitive": "Teuvan",
    "partitive": "Teuvaa"
  },
  {
    "name": "Tohmajärvi",
    "localCase": "Tohmajärvellä",
    "localCaseType": "on",
    "genitive": "Tohmajärven",
    "partitive": "Tohmajärveä",
    "illative": "Tohmajärveen"
  },
  {
    "name": "Toholampi",
    "localCase": "Toholammilla",
    "localCaseType": "on",
    "genitive": "Toholammin",
    "partitive": "Toholampia"
  },
  {
    "name": "Toivakka",
    "localCase": "Toivakassa",
    "localCaseType": "in",
    "genitive": "Toivakan"
  },
  {
    "name": "Tornio",
    "localCase": "Torniossa",
    "localCaseType": "in",
    "genitive": "Tornion"
  },
  {
    "name": "Turku",
    "localCase": "Turussa",
    "localCaseType": "in",
    "genitive": "Turun"
  },
  {
    "name": "Tuusniemi",
    "localCase": "Tuusniemellä",
    "localCaseType": "on",
    "genitive": "Tuusniemen",
    "partitive": "Tuusniemeä",
    "illative": "Tuusniemeen"
  },
  {
    "name": "Tuusula",
    "localCase": "Tuusulassa",
    "localCaseType": "in",
    "genitive": "Tuusulan"
  },
  {
    "name": "Tyrnävä",
    "localCase": "Tyrnävällä",
    "localCaseType": "on",
    "genitive": "Tyrnävän",
    "partitive": "Tyrnävää"
  },
  {
    "name": "Ulvila",
    "localCase": "Ulvilassa",
    "localCaseType": "in",
    "genitive": "Ulvilan"
  },
  {
    "name": "Urjala",
    "localCase": "Urjalassa",
    "localCaseType": "in",
    "genitive": "Urjalan"
  },
  {
    "name": "Utajärvi",
    "localCase": "Utajärvellä",
    "localCaseType": "on",
    "genitive": "Utajärven",
    "partitive": "Utajärveä",
    "illative": "Utajärveen"
  },
  {
    "name": "Utsjoki",
    "localCase": "Utsjoella",
    "localCaseType": "on",
    "genitive": "Utsjoen",
    "partitive": "Utsjokea",
    "illative": "Utsjokeen"
  },
  {
    "name": "Uurainen",
    "localCase": "Uuraisilla",
    "localCaseType": "on",
    "genitive": "Uuraisten",
    "partitive": "Uuraisia"
  },
  {
    "name": "Uusikaarlepyy",
    "localCase": "Uudessakaarlepyyssä",
    "localCaseType": "in",
    "genitive": "Uudenkaarlepyyn",
    "partitive": "Uuttakaarlepyytä",
    "illative": "Uuteenkaarlepyyhyn"
  },
  {
    "name": "Uusikaupunki",
    "localCase": "Uudessakaupungissa",
    "localCaseType": "in",
    "genitive": "Uudenkaupungin",
    "partitive": "Uuttakaupunkia",
    "illative": "Uuteenkaupunkiin"
  },
  {
    "name": "Vaala",
    "localCase": "Vaalassa",
    "localCaseType": "in",
    "genitive": "Vaalan"
  },
  {
    "name": "Vaasa",
    "localCase": "Vaasassa",
    "localCaseType": "in",
    "genitive": "Vaasan"
  },
  {
    "name": "Valkeakoski",
    "localCase": "Valkeakoskella",
    "localCaseType": "on",
    "genitive": "Valkeakosken",
    "partitive": "Valkeakoskea",
    "illative": "Valkeakoskeen"
  },
  {
    "name": "Vantaa",
    "localCase": "Vantaalla",
    "localCaseType": "on",
    "genitive": "Vantaan",
    "partitive": "Vantaata"
  },
  {
    "name": "Varkaus",
    "localCase": "Varkaudessa",
    "localCaseType": "in",
    "genitive": "Varkauden",
    "partitive": "Varkautta",
    "illative": "Varkauteen"
  },
  {
    "name": "Vehmaa",
    "localCase": "Vehmaalla",
    "localCaseType": "on",
    "genitive": "Vehmaan",
    "partitive": "Vehmaata"
  },
  {
    "name": "Vesanto",
    "localCase": "Vesannolla",
    "localCaseType": "on",
    "genitive": "Vesannon",
    "partitive": "Vesantoa"
  },
  {
    "name": "Vesilahti",
    "localCase": "Vesilahdessa",
    "localCaseType": "in",
    "genitive": "Vesilahden",
    "partitive": "Vesilahtea",
    "illative": "Vesilahteen"
  },
  {
    "name": "Veteli",
    "localCase": "Vetelissä",
    "localCaseType": "in",
    "genitive": "Vetelin"
  },
  {
    "name": "Vieremä",
    "localCase": "Vieremällä",
    "localCaseType": "on",
    "genitive": "Vieremän",
    "partitive": "Vieremää"
  },
  {
    "name": "Vihti",
    "localCase": "Vihdissä",
    "localCaseType": "in",
    "genitive": "Vihdin"
  },
  {
    "name": "Viitasaari",
    "localCase": "Viitasaarella",
    "localCaseType": "on",
    "genitive": "Viitasaaren",
    "partitive": "Viitasaarta",
    "illative": "Viitasaareen"
  },
  {
    "name": "Vimpeli",
    "localCase": "Vimpelissä",
    "localCaseType": "in",
    "genitive": "Vimpelin"
  },
  {
    "name": "Virolahti",
    "localCase": "Virolahdessa",
    "localCaseType": "in",
    "genitive": "Virolahden",
    "partitive": "Virolahtea",
    "illative": "Virolahteen"
  },
  {
    "name": "Virrat",
    "localCase": "Virroilla",
    "localCaseType": "on",
    "genitive": "Virtojen",
    "partitive": "Virtoja"
  },
  {
    "name": "Vårdö",
    "localCase": "Vårdössä",
    "localCaseType": "in",
    "genitive": "Vårdön"
  },
  {
    "name": "Vöyri",
    "localCase": "Vöyrillä",
    "localCaseType": "on",
    "genitive": "Vöyrin",
    "partitive": "Vöyriä"
  },
  {
    "name": "Ylitornio",
    "localCase": "Ylitorniolla",
    "localCaseType": "on",
    "genitive": "Ylitornion",
    "partitive": "Ylitorniota"
  },
  {
    "name": "Ylivieska",
    "localCase": "Ylivieskassa",
    "localCaseType": "in",
    "genitive": "Ylivieskan"
  },
  {
    "name": "Ylöjärvi",
    "localCase": "Ylöjärvellä",
    "localCaseType": "on",
    "genitive": "Ylöjärven",
    "partitive": "Ylöjärveä",
    "illative": "Ylöjärveen"
  },
  {
    "name": "Ypäjä",
    "localCase": "Ypäjällä",
    "localCaseType": "on",
    "genitive": "Ypäjän",
    "partitive": "Ypäjää"
  },
  {
    "name": "Ähtäri",
    "localCase": "Ähtärissä",
    "localCaseType": "in",
    "genitive": "Ähtärin"
  },
  {
    "name": "Äänekoski",
    "localCase": "Äänekoskella",
    "localCaseType": "on",
    "genitive": "Äänekosken",
    "partitive": "Äänekoskea",
    "illative": "Äänekoskeen"
  }
] as const;
