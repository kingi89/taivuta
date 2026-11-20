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

### Milestone 5: Personal Name Accuracy, Disambiguation & Templates (v0.3.1) — ✅ Completed
- [x] **Nature Surname & Type 32 `-tar`/`-tär` Declension**: Defaulted standalone and hyphenated nature surnames (*Niemi*, *Virtanen-Niemi*) to nature-noun declension, preserved multi-word suffix capitalization (*Matti Niemen*), and added Kotus Type 32 support for *-tar/-tär* and *-tytär* names (*Ilmatar*, *Päivätär*, *Matintytär*) with `tarStem` disambiguation.
- [x] **Given Name & Hyphenated Disambiguation**: Prevented false-positive qualitative gradation detection for *-rko/-lko* given names (*Marko*, *Jyrki*) and supported hyphenated personal name disambiguation (*Marja-Satu*).
- [x] **Classification Pipeline & Template Forwarding**: Decomposed entity role classification into discrete stages so multi-word names classify as people, forwarded `'givenName'`/`'surname'` roles and `PlacePreferenceParams` through `inflect()` and `format()`, and verified end-to-end coverage across ambiguous and compound nominals.

### Milestone 6: Preferences Bundle Isolation, CI & Tooling Hygiene (v0.3.2) — 🔄 Active Target
- [x] **GitHub Actions Modernization & Quality Gates (`[CI-001]`, `[CI-002]`, `[MAINT-004]`)**: Upgraded workflows and GitHub Pages actions to Node 24-native releases, gated demo deployment on `npm run check`, added ESLint coverage for `scripts/**/*.ts`, and enforced automated version parity in `scripts/verify-bundle.ts`.
- [ ] **Developer Tooling & Fixture Scripts (`[MAINT-001]`, `[MAINT-006]`, `[MAINT-003]`)**: Replace the inline `package.json` demo server one-liner with `scripts/serve-demo.ts`, retire obsolete `scripts/generate-places-matrix.ts`, evaluate `scripts/build-countries-fixture.ts`, and document active fixture workflows in `data/README.md`.
- [x] **Preferences Subpath Isolation (`[OPT-002]`)**: Decoupled `inflectPerson` and `stem.ts` from `taivuta/preferences`, reducing its bundle footprint from `14.98 kB` to `9.07 kB` (`< 10 kB`).
- [x] **Latin Phonology Consolidation (`[OPT-003]`)**: Consolidated shared Latin vowel, spoken-letter, segment, and harmony primitives in `vowels.ts` for reuse across `colon.ts`, `stem.ts`, and `assembler.ts`, reducing `taivuta` root from `29.94 kB` to `29.42 kB`.
- [ ] **Security Hardening & Trust Policy (`[SEC-001]`, `[SEC-002]`)**: Harden runtime boundaries (safe prototype lookups, $O(N)$ prefix handling, aligned trimming, 1,000,000-character proper-noun bound, `tests/security.test.ts`) and publish `SECURITY.md`, consumer trust guarantees in `README.md`, and secure-coding standards in `CONTRIBUTING.md`.

### Milestone 7: Algorithmic Place Paradigms & Finnish Regions (v0.4.0) — 📋 Planned
- [ ] **Algorithmic Place Paradigm Generation (`[REFACTOR-001]`, `[OPT-001]`)**: Replace recurring static entries in `IRREGULAR_PLACES` (Type 78 lengthened *-e* stems, Type 39–41 *-s* stems, plural *-inen* municipalities, and unhyphenated inflecting-prefix compounds) with algorithmic `StemParadigm` resolvers and compact overrides for true exceptions.
- [ ] **State Compound Secondary Cases & 11-Case Paradigm Suite (`[BUG-015]`, `[TEST-003]`)**: Resolve missing secondary cases (`adessive`, `ablative`, `allative`, `essive`, `translative`) for geopolitical state compounds without bundle bloat, and verify all 11 cases across irregular/algorithmic places.
- [ ] **Finnish Administrative & Historical Regions (`[TASK-004]`)**: Comprehensive spatial and grammatical case support and benchmark coverage for all 19 Finnish regions (e.g. *Uusimaa $\to$ Uudellamaalla*, *Varsinais-Suomi $\to$ Varsinais-Suomessa*, *Pirkanmaa $\to$ Pirkanmaalla*).
- [ ] **Algorithmic Place Security & Demo Audit (`[SEC-003]`)**: Verify new algorithmic place resolvers against `tests/security.test.ts` invariants and audit `demo/index.html` DOM rendering for safe text insertion.

### Milestone 8: Comprehensive User Documentation & Verification (v0.5.0) — 📋 Planned
- [ ] **Architecture Documentation Synchronization (`[DOC-001]`)**: Align `ARCHITECTURE.md` with current `StemParadigm` fields, supported 11+3 case inventory, final-syllable gradation anchoring, and `-lahti` internal local case rules.
- [ ] **Comprehensive User & Preferences Guides (`[DOC-002]`)**: Author `docs/user-guide.md` (complete case reference, options, template syntax, role hints, and edge-case/fallback contract matrix) and `docs/preferences-guide.md` (onboarding UX and persistence recipes), linked from `README.md`.
- [ ] **Automated Documentation Verification (`[TEST-004]`)**: Add `scripts/verify-docs.ts` to `npm run check` to validate code examples across markdown guides and TSDoc blocks.

### Milestone 9: Production Release v1.0.0 (Release Candidate) — 📋 Planned
- [ ] Formal API freeze with stable semver guarantees.
- [ ] Production npm packaging, provenance signing, and release validation.
- [ ] Performance and adversarial fuzz benchmark verifying sub-millisecond execution and zero crashes over 100,000+ name and randomized Unicode inputs (`[ICE-001]`).

---

## Roadmap Lifecycle & Governance

The roadmap is assessed and updated at every **Minor release boundary** (e.g. v0.1 $\to$ v0.2 $\to$ v0.3) and **Major release candidate** (v1.0.0-rc) according to the 3-step review protocol defined in [`CONTRIBUTING.md`](CONTRIBUTING.md).
