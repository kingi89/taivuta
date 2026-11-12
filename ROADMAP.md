# taivuta Product Roadmap

This document outlines the strategic milestones, architectural direction, and release horizons for **`taivuta`**.

---

## Strategic Vision & Core Principles

- **Zero Runtime Dependencies**: The published package will indefinitely maintain `dependencies: {}`.
- **Strict Size Budgets**: Root bundle $\le 30$ kB minified; subpaths $\le 15$ kB minified.
- **Linguistic Fidelity**: Kotus (Institute for the Languages of Finland) standards serve as the baseline authority for proper noun inflection.
- **Name-Holder Authority**: When multiple declensions exist, the name holder's preference is primary. Heuristics supply safe defaults when omitted.

---

## Release Milestones

### Milestone 1: Foundational Morphology & Toponyms (v0.1.0) — ✅ Completed
- [x] Dual module builds (clean ESM `.mjs`, CommonJS `.cjs`, and TypeScript `.d.ts` declaration maps).
- [x] Finnish consonant gradation engine (quantitative stops and native qualitative clusters).
- [x] Vowel harmony resolver supporting front, back, and neutral vowel stems.
- [x] 100% accuracy benchmark on all 309 official Finnish municipalities for spatial cases (*sisä-* vs. *ulkopaikallissijat*).
- [x] Top-500 Finnish given names and surnames benchmark ($\ge 95\%$ accuracy).
- [x] Zero-dependency native Node.js 22 test runner with native coverage reporting.

### Milestone 2: Name-Holder Preference & Disambiguation (v0.1.1) — ✅ Completed
- [x] Dedicated `taivuta/preferences` subpath for detecting ambiguous names (< 15 kB budget).
- [x] Support for qualitative gradation variation (*Satu*, *Sampo*), *s*-stem alternation (*Lucas*, *Niklas*), word-derived nominal stems (*Tuuli*, *Meri*, *Lumi*), all-caps acronym colons (*KELA*), and trailing symbol/digit vowel harmony (*Agent007*).
- [x] Cartesian option deduplication ensuring users only receive distinct linguistic choices.
- [x] String template formatter (`format()`) and tagged template literal helper (`t`) supporting preference maps.
- [x] Interactive 3-tab browser demo featuring an onboarding simulation and technical implementation panel.

### Milestone 3: Advanced Nominal Paradigms (v0.2.0) — ✅ Completed
- [x] **Kotus Type 9 Nominal Gradation**: Support intervocalic single-$k$ loss ($k \to \emptyset$) for ambiguous word-derived first names (*Taika $\to$ Taian* vs. *Taikan*) with diphthong/hiatus handling.
- [x] **Foreign Feminine Geminates**: Support quantitative gradation preferences for foreign feminine names ending in *-ette/-otte/-itte* (*Janette $\to$ Janetelle* vs. *Janettelle*).
- [x] **Single-Letter Proper Noun & Acronym Inflection**: Phonetic letter name inflection for single Latin letters (A–Ö, foreign diacritics Á, Ø, and Š, Ž), colon attachment after periods (`P.:lle`), arbitrary alphanumeric tokens ending in isolated letters (`foo123x:ään`), and pure punctuation (`...:ssa`).
- [x] **Bundle Footprint Preservation**: Tuple optimization for `NATURE_NOUN_RULES` to maintain `taivuta/preferences` strictly within the 15 kB budget.

### Milestone 4: Toponym Spatial Accuracy & Full Case Benchmark (v0.3.0) — 🔄 Active Target
- [x] **309-Municipality Triad Benchmark (`[TEST-001]`)**: Expand benchmark fixture and test suite to assert `local` (*missä*), `localFrom` (*mistä*), and `localTo` (*mihin*) on all 309 official Finnish municipalities.
- [x] **Missing Elative/Ablative in Irregular Municipalities (`[BUG-003]`)**: Populate missing *-sta/-stä* and *-lta/-ltä* overrides for 20 municipalities (e.g. *Kuortaneelta*, *Keiteleeltä*, *Kempeleestä*, *Alavudelta*, *Pihtiputaalta*).
- [ ] **Compound Place Prefix Retention in localFrom (`[BUG-004]`)**: Ensure prefix elements inflect in *mistä* cases (*Uudestakaupungista*, *Uudestakaarlepyystä*, *Isostakyröstä*).
- [ ] **Plural -inen Municipality External Cases (`[BUG-007]`)**: Provide correct plural external cases for 11 municipalities (*Kauniaisille*, *Kauniaisilla*, *Kauniaisilta*).
- [ ] **Toponym Edge Overrides (`[BUG-008]`, `[BUG-009]`, `[TEST-003]`)**: Correct *Mauritius* illative (*Mauritiukseen*), add *Virrat* inessive (*Virroissa*), and verify 11-case paradigms.

### Milestone 5: Personal Name Accuracy & Disambiguation (v0.3.1) — 📋 Planned
- [ ] **Liquid-k Given Name Disambiguation (`[BUG-002]`)**: Prevent false-positive qualitative gradation detection for Finnish given names ending in *-rko/-lko* (*Marko*, *Mirko*, *Arko*).
- [ ] **Nature Surnames Role Classification & Casing (`[BUG-005]`)**: Prevent people with nature noun surnames (*Matti Niemi*, *Pekka Mäki*) from being classified as places and decapitalized (*Matti niemen*).
- [ ] **Nature Surnames Default Declension (`[BUG-006]`)**: Ensure standalone (*Niemi*) and hyphenated (*Virtanen-Niemi*) surnames default to nature noun declension (*Niemen*, *Virtanen-Niemen*).
- [ ] **Unified inflect() End-to-End Matrix (`[TEST-002]`)**: Add comprehensive multi-word and compound nominal tests across the high-level `inflect()` API.

### Milestone 6: Maintainability, Bundle Optimization & Regions (v0.4.0) — 📋 Planned
- [ ] **Irregular Places Data Compression (`[OPT-001]`)**: Compact `IRREGULAR_PLACES` into stem tuple representations, saving ~2.5 kB.
- [ ] **Preferences Subpath Isolation (`[OPT-002]`)**: Decouple heavy inflection engine from `taivuta/preferences`, reducing bundle footprint from 14.15 kB to ~6 kB.
- [ ] **Unified Place Stem Paradigm Resolution (`[REFACTOR-001]`)**: Refactor irregular place inflection to produce complete `StemParadigm` models.
- [ ] **Entity Classification Pipeline Refactoring (`[REFACTOR-002]`)**: Decompose `classifyProperNoun` into modular, predictable stages.
- [ ] **Finnish Administrative & Historical Regions (`[TASK-004]`)**: Comprehensive support for all 19 Finnish regions (e.g. *Uusimaa $\to$ Uudellamaalla*, *Varsinais-Suomi*, *Pirkanmaa*).
- [ ] **Developer Tooling & Scripts Hygiene (`[MAINT-001]`, `[MAINT-003]`)**: Replace inline demo script with `scripts/serve-demo.ts`, wire and document fixture builders.

### Milestone 7: Production Release v1.0.0 (Release Candidate) — 📋 Planned
- [ ] Formal API freeze with stable semver guarantees.
- [ ] Expanded internationalization guide and Kotus citation cross-reference index.
- [ ] Production npm packaging, provenance signing, and release validation.
- [ ] Performance benchmark verifying sub-millisecond execution over 100,000 name iterations.

---

## Roadmap Lifecycle & Governance

The roadmap is assessed and updated at every **Minor release boundary** (e.g. v0.1 $\to$ v0.2 $\to$ v0.3) and **Major release candidate** (v1.0.0-rc) according to the 3-step review protocol defined in [`CONTRIBUTING.md`](CONTRIBUTING.md).
