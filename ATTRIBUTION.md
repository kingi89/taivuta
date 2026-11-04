# Data Sources & Attribution

The `taivuta` project utilizes and references the following open datasets:

---

## 1. Digi- ja väestötietovirasto (DVV)

- **Dataset**: *Etunimitilasto* (First names statistics) and *Sukunimitilasto* (Surname statistics), snapshot 2026-08-04.
- **Provider**: Digi- ja väestötietovirasto (Finnish Digital and Population Data Services Agency).
- **Source**: [https://dvv.fi](https://dvv.fi) / [https://avoindata.fi](https://avoindata.fi)
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Usage**: Used in automated test suites (`tests/fixtures/dvv-top-names.json`) to verify inflection accuracy against popular Finnish given names and surnames.
- **Extraction**: Raw spreadsheets placed in `data/names/` are parsed using:
  ```bash
  npm run extract:names
  ```

---

## 2. Kotimaisten kielten keskus (Kotus)

- **Dataset**: *Asutusnimihakemisto* (Directory of Finnish settlement names).
- **Provider**: Kotimaisten kielten keskus (Institute for the Languages of Finland).
- **Source**: [https://kaino.kotus.fi/asutusnimihakemisto/](https://kaino.kotus.fi/asutusnimihakemisto/)
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Usage**: Consulted as an authoritative reference for conventional local case selection (*sisäpaikallissijat* vs *ulkopaikallissijat*) for Finnish place names and municipalities.
