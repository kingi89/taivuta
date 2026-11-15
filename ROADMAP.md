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

### Milestone 4: Toponym Spatial Accuracy & Full Case Benchmark (v0.3.0) — ✅ Completed
- [x] **Full Spatial Triad Benchmark**: 100% accuracy across all Finnish municipalities for `local` (*missä*), `localFrom` (*mistä*), `localTo` (*mihin*), and `genitive`.
- [x] **Compound Vowel Harmony & -pää/-pyy Illatives**: Resolve vowel harmony from the final harmony-bearing vowel across compound words (*Sodankylässä*, *Yrjömatilla*) and form Kotus Type 18 *-hVn* illatives for *-pää* and *-pyy* stems (*Järvenpäähän*, *Kankaanpäähän*, *Oripäähän*, *Kruunupyyhyn*).
- [x] **Expanded Municipality & Toponym Paradigms**: Support congruent prefix inflection in `localFrom` (*Uudestakaupungista*, *Isostakyröstä*), plural external cases for *-inen* municipalities (*Kauniaisille*, *Kauniaisilla*, *Kauniaisilta*), and complete local case coverage across irregular toponyms (*Kuortaneelta*, *Alavudelta*, *Virroissa*, *Mustasaaressa*, *Merikarvialla*, *Mauritiukseen*).

### Milestone 5: Personal Name Accuracy & Disambiguation (v0.3.1) — 🔄 Active Target
- [ ] **Liquid-k Given Name Disambiguation (`[BUG-002]`)**: Prevent false-positive qualitative gradation detection for Finnish given names ending in *-rko/-lko* (*Marko*, *Mirko*, *Arko*).
- [ ] **Nature Surnames Role Classification & Casing (`[BUG-005]`)**: Prevent people with nature noun surnames (*Matti Niemi*, *Pekka Mäki*) from being classified as places and decapitalized (*Matti niemen*).
- [ ] **Nature Surnames Default Declension (`[BUG-006]`)**: Ensure standalone (*Niemi*) and hyphenated (*Virtanen-Niemi*) surnames default to nature noun declension (*Niemen*, *Virtanen-Niemen*).
- [ ] **Unified inflect() End-to-End Matrix (`[TEST-002]`)**: Add comprehensive multi-word and compound nominal tests across the high-level `inflect()` API.

### Milestone 6: Maintainability, Bundle Optimization & Regions (v0.4.0) — 📋 Planned
- [ ] **Irregular Places Data Compression (`[OPT-001]`)**: Compact `IRREGULAR_PLACES` into stem tuple representations, saving ~2.5 kB.
- [ ] **Preferences Subpath Isolation (`[OPT-002]`)**: Decouple heavy inflection engine from `taivuta/preferences`, reducing bundle footprint from 14.15 kB to ~6 kB.
- [ ] **Unified Place Stem Paradigm Resolution & 11-Case Verification (`[REFACTOR-001]`, `[TEST-003]`)**: Refactor irregular place inflection to produce complete `StemParadigm` models and verify full 11-case paradigms.
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
