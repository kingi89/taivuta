# Data Sources & Benchmarks

This directory contains data resources and instructions for reproducing or updating the linguistic benchmark datasets used by `taivuta`.

---

## Overview

| Output Artifact | Input / Source | Regeneration / Update | Verifying Suite |
| :--- | :--- | :--- | :--- |
| `tests/fixtures/dvv-top-names.json` | DVV `.xlsx` workbooks in `data/names/` | `npm run extract:names` | `tests/person.test.ts` |
| `data/names-matrix.csv` | `tests/fixtures/dvv-top-names.json` | `npm run generate:matrix` | Manual CSV review |
| `tests/fixtures/municipalities.json` | `data/municipalities.txt` + overrides | `npm run build:municipalities-fixture` | `tests/place.test.ts` |
| `tests/fixtures/un-countries.json` | Curated static JSON | Edit JSON directly | `tests/countries.test.ts` |
| `tests/fixtures/country-variants.json` | Curated static JSON | Edit JSON directly | `tests/countries.test.ts` |

---

## 1. DVV Name Statistics (Etunimet & Sukunimet)

The personal name benchmark (`tests/fixtures/dvv-top-names.json`) is derived from open datasets published by Digi- ja väestötietovirasto (DVV, Digital and Population Data Services Agency).

### How to Update the Benchmark

1. **Download the Latest Data**:
   - Visit DVV's open data portal on [avoindata.fi](https://www.avoindata.fi/data/fi/dataset/etunimitilasto) or [dvv.fi](https://dvv.fi/etunimitilasto).
   - Download the Excel files for:
     - First names (*Etunimitilasto*, e.g. `etunimitilasto-<pvm>-dvv.xlsx`)
     - Surnames (*Sukunimitilasto*, e.g. `sukunimitilasto-<pvm>-dvv.xlsx`)
2. **Place Files into `data/names/`**:
   Drop the downloaded `.xlsx` files into `data/names/`. (They are ignored by Git to avoid repository bloat).
3. **Run the Extraction Script**:
   ```bash
   npm run extract:names
   ```
   The script automatically detects any files matching `*etunimi*.xlsx` and `*sukunimi*.xlsx` in `data/names/`, extracts the top 500 given names (250 male, 250 female) and top 100 surnames, and regenerates `tests/fixtures/dvv-top-names.json`.

4. **Custom File Paths**:
   You can also specify explicit file paths via CLI arguments:
   ```bash
   npm run extract:names -- --first-names path/to/etunimet.xlsx --surnames path/to/sukunimet.xlsx
   ```

### Expected Spreadsheet Format

- **First Names Workbook**:
  - Sheets: `Miehet ens` (men's first names) and `Naiset ens` (women's first names)
  - Columns: First column `Etunimi`, second column `Lukumäärä`
- **Surnames Workbook**:
  - Sheet: `Nimet` (or `Sukunimet`)
  - Columns: First column `Sukunimi`, second column count

---

## 2. Inflection Matrix Generator (`generate:matrix`)

To review the library's inflections across all cases for top DVV names, generate a CSV inflection matrix:

```bash
npm run generate:matrix
```

By default, this writes `data/names-matrix.csv` containing 600 names (500 given names + 100 surnames) inflected across all 11 grammatical cases (`nominative`, `genitive`, `partitive`, `inessive`, `elative`, `illative`, `adessive`, `ablative`, `allative`, `essive`, `translative`).

You can also specify a custom output path:
```bash
npm run generate:matrix -- --output path/to/matrix.csv
```

---

## 3. Finnish Municipalities Benchmark (`build:municipalities-fixture`)

To regenerate the Finnish municipalities benchmark (`tests/fixtures/municipalities.json`, 308 entries, verified by `tests/place.test.ts`), run:

```bash
npm run build:municipalities-fixture
```

This reads `data/municipalities.txt` (a local, gitignored UTF-8 file via `data/*.txt` containing one Finnish municipality name per line) and writes `tests/fixtures/municipalities.json`.

---

## 4. UN Member States & Country Variants Benchmark

The country benchmarks are maintained directly as curated static JSON fixtures (one JSON object per line, loaded via `tests/fixtures/un-countries.fixture.ts` and verified by `tests/countries.test.ts`):

- `tests/fixtures/un-countries.json` — 197 UN member state entries (`name`, `localCase`, `localFrom`, `localTo`, `genitive`, `localCaseType`).
- `tests/fixtures/country-variants.json` — 5 commonly used alternative country name entries (*Arabiemiirikunnat*, *Bosnia-Hertsegovina*, *Eesti*, *Iso-Britannia*, *Kongo*).

Updates are edited directly in these JSON files and verified via `npm run check`.

---

## License & Attribution

All derived datasets must be attributed in accordance with the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license. See [ATTRIBUTION.md](../ATTRIBUTION.md) for details.
