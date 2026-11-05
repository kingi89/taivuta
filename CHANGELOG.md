# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-11-05

### Added
- **Unified Nominal Inflection**: High-level `inflect()` function supporting automatic entity role detection (person vs. place) and all Finnish grammatical and contextual local cases.
- **Place Name Inflection & Local Case Detection**:
  - `inflectPlace()` and `detectLocalCase()` covering all 308 active Finnish municipalities.
  - Contextual spatial cases: `'local'` (*missä*), `'localFrom'` (*mistä*), `'localTo'` (*mihin*).
  - Geopolitical sovereign country names (UN member states) and toponymic nature formatives.
- **Person Name Inflection**:
  - `inflectPerson()` supporting given names, surnames, hyphenated compounds, and full multi-word names.
  - Consonant gradation (*astevaihtelu*) with given name single-stop resistance (*Aki* $\to$ *Akin*, *Riku* $\to$ *Rikun*).
  - Finnish *-nen* surnames, *s*-stem names (*Tuomas*, *Aleksis*), nature noun surnames (*Niemi*, *Mäki*, *Saari*, *Laine*), and foreign consonant/silent names (*John*, *Bordeaux*).
  - Canonical paradigm generator `getPersonParadigm()` and declarative traditional qualitative gradation registry (*Sampo*, *Satu*).
- **Decoupled Template Engine**:
  - `createTemplateEngine()` factory enabling featherweight, zero-dataset custom templating engines.
  - Root `format()` with `{$variable:case[:role]}` expression syntax and tagged template literal helper `t`.
- **Morphological Primitives**:
  - Canonical `StemParadigm` model and `assembleCase()` dispatcher for the 11 primary Finnish nominal cases.
  - Vowel harmony scanning (`getVowelHarmony`) and harmonization (`harmonize`).
  - Quantitative and qualitative consonant gradation (`weakenConsonants`).
  - Nominal stem analysis (`analyzeStem`) and colon suffixation for acronyms (`needsColon`, `inflectColonWord`).
- **Modular Subpath Exports**:
  - Dedicated zero-dependency entry points: `taivuta/person`, `taivuta/place`, `taivuta/morphology`, and `taivuta/template`.
  - First-class dual module distribution (ESM & CommonJS) with TypeScript `.d.ts` declaration maps.
