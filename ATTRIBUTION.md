# Data Sources & Attribution

The `taivuta` library utilizes open data from official Finnish public agencies in accordance with their respective open data licenses:

---

## 1. Digi- ja väestötietovirasto (DVV)

- **Dataset**: *Etunimitilasto* (First names statistics) and *Sukunimitilasto* (Surname statistics), snapshot 2026-08-04.
- **Provider**: Digi- ja väestötietovirasto (Finnish Digital and Population Data Services Agency).
- **Source**: [https://dvv.fi](https://dvv.fi) / [https://avoindata.fi](https://avoindata.fi)
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Usage**: Used to verify declension accuracy against the Top-500 Finnish given names and Top-100 Finnish surnames in automated benchmark test suites.
- **Extraction**: Raw spreadsheets placed in `data/names/` are extracted into `tests/fixtures/dvv-top-names.json` using the project's zero-dependency extraction script:
  ```bash
  npm run extract:names
  ```
  The raw `.xlsx` files are ignored by git to keep repository footprint minimal.

---

## 2. Kotimaisten kielten keskus (Kotus)

- **Dataset**: *Asutusnimihakemisto* (Settlement and place names directory) and nominal morphology guidelines.
- **Provider**: Kotimaisten kielten keskus (Institute for the Languages of Finland).
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Usage**: Used to determine standard internal (*sisä-*) vs external (*ulko-*) local case preferences (*Turussa* vs *Tampereella*) for Finnish place names.
