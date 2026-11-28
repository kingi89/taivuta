# taivuta Product Roadmap

This document outlines the strategic milestones, architectural direction, and release horizons for **`taivuta`**.

---

## Strategic Vision & Core Principles

- **Zero Runtime Dependencies**: The published package will indefinitely maintain `dependencies: {}`.
- **Strict Size Budgets**: Root bundle $\le 32$ kB minified; subpaths $\le 15$ kB minified.
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

### Milestone 6: Preferences Bundle Isolation, CI & Tooling Hygiene (v0.3.2) — ✅ Completed
- [x] **Preferences Bundle Isolation & Phonology Consolidation**: Decoupled `inflectPerson` and `stem.ts` from `taivuta/preferences` (keeping it under `10 kB`) and consolidated shared spoken-letter and Latin phonology primitives in `vowels.ts`.
- [x] **Security Hardening & Consumer Trust Policy**: Hardened runtime boundaries across all 6 subpaths (safe prototype lookups, $O(N)$ scaling, `1,000,000`-character proper-noun ceiling, consistent trimming, Kotus typographic `’` `U+2019` apostrophe, and `tests/security.test.ts`), published `SECURITY.md`, and added Node `>=18.0.0` `"engines"` with CI `18.x` runtime verification.
- [x] **CI Modernization, Demo Server & Fixture Pipeline**: Upgraded GitHub Actions and Pages workflows to Node 24-native releases, gated demo deployment on `npm run check`, added `scripts/**/*.ts` linting and version parity verification, extracted `scripts/serve-demo.ts`, retired obsolete/redundant fixture scripts, and documented active fixture workflows in `data/README.md`.

### Milestone 7: Algorithmic Place Paradigms & Finnish Regions (v0.4.0) — 🔄 Active Target
- [x] **Algorithmic Place Paradigm Generation (`[REFACTOR-001]`, `[OPT-001]`)**: Retired `IRREGULAR_PLACES` per-case string lookups in favor of unified `StemParadigm` assembly, replacing recurring static entries (Kotus type 48 *-e* stems, Kotus types 39–40 *-s* stems, plural *-inen* municipalities, solid congruent `Uusi`/`Iso` compounds, and regular *-lampi* stems) with algorithmic resolvers and 7 compact lexical paradigm specs, reducing `taivuta` root from `31.94 kB` to `25.50 kB` and `taivuta/place` from `23.69 kB` to `17.17 kB`.
- [ ] **State Compound Secondary Cases & 11-Case Paradigm Suite (`[BUG-015]`, `[TEST-003]`)**: Resolve missing secondary cases (`adessive`, `ablative`, `allative`, `essive`, `translative`) for geopolitical state compounds without bundle bloat, and verify all 11 cases across irregular/algorithmic places.
- [ ] **Finnish Administrative & Historical Regions (`[TASK-004]`)**: Comprehensive spatial and grammatical case support and benchmark coverage for all 19 Finnish regions (e.g. *Uusimaa $\to$ Uudellamaalla*, *Varsinais-Suomi $\to$ Varsinais-Suomessa*, *Pirkanmaa $\to$ Pirkanmaalla*).
- [ ] **Algorithmic Place Security & Demo Audit (`[SEC-003]`)**: Verify new algorithmic place resolvers against `tests/security.test.ts` invariants and audit `demo/index.html` DOM rendering for safe text insertion.
- [ ] **Morphology & Subpath Footprint Compaction (`[OPT-005]`)**: Compact shared `src/morphology/` lookup tables and regexes (`nature-nouns.ts`, `assembler.ts`/`colon.ts`, `gradation.ts`, `compounds.ts`) to restore comfortable bundle headroom in `taivuta/person` (< 11 kB) and `taivuta/preferences` ahead of `v0.5.0` and `v0.6.0`.

### Milestone 8: Comprehensive User Documentation & Verification (v0.5.0) — 📋 Planned
- [ ] **Architecture Documentation Synchronization (`[DOC-001]`)**: Align `ARCHITECTURE.md` with current `StemParadigm` fields, supported 11+3 case inventory, final-syllable gradation anchoring, and `-lahti` internal local case rules.
- [ ] **Comprehensive User & Preferences Guides (`[DOC-002]`)**: Author `docs/user-guide.md` (complete case reference, options, template syntax, role hints, and edge-case/fallback contract matrix) and `docs/preferences-guide.md` (onboarding UX and persistence recipes), linked from `README.md`.
- [ ] **Automated Documentation Verification (`[TEST-004]`)**: Add `scripts/verify-docs.ts` to `npm run check` to validate code examples across markdown guides and TSDoc blocks.

### Milestone 9: Personal Name Morphology & Disambiguation (v0.6.0) — 📋 Planned
- [ ] **Kotus Type 41 (*vieras*) Personal Names (`[TASK-005]`)**: Support Kotus Type 41 declension and preference disambiguation for traditional *-as/-äs* personal names (*Tuomas* $\to$ *Tuomaan*, *Tuomaalle*, *Tuomaaseen* alongside *Tuomaksen*).
- [ ] **Foreign Personal Name Morphology & Silent-Final Edge Cases (`[ICE-002]`, `[ICE-003]`, `[BUG-017]`)**: Safe handling for foreign *-tti* names (*Donizetti*, *Pavarotti*), preventing foreign given names (*Elaine*, *Corinne*, *Njoki*) from colliding with Finnish nature-noun surname paradigms, and resolving `'Guy'` in `SILENT_FINAL_REGEX`.
- [ ] **Hyphenated Farmstead Surname Disambiguation (`[ICE-004]`)**: Distinguish standalone `Iso-` and `Uusi-` surnames (*Iso-Anttilan*, *Uusi-Pietilän*) from congruently inflecting compound toponyms (*Iso-Britannia*, *Uusi-Seelanti*) when `role: 'person'` is omitted.

### Milestone 10: Production Release v1.0.0 (Release Candidate) — 📋 Planned
- [ ] Formal API freeze with stable semver guarantees.
- [ ] Production npm packaging, provenance signing, and release validation.
- [ ] Performance and adversarial fuzz benchmark verifying sub-millisecond execution and zero crashes over 100,000+ name and randomized Unicode inputs (`[ICE-001]`).
- [ ] **Long-Input Zero-Allocation & Fast-Path Optimizations (`[OPT-004]`)**: Replace `.split()` allocations and add length/suffix fast paths in phonology, person, and place hot paths for 100k–1M character inputs.
- [ ] **Script CLI Hygiene & Strict Tooling Linting (`[ICE-005]`)**: Standardize script exit codes and relative path logging across `scripts/` and tighten `eslint.config.js` complexity/depth/parameter rules for `scripts/**/*.ts`.

---

## Roadmap Lifecycle & Governance

The roadmap is assessed and updated at every **Minor release boundary** (e.g. v0.1 $\to$ v0.2 $\to$ v0.3) and **Major release candidate** (v1.0.0-rc) according to the 3-step review protocol defined in [`CONTRIBUTING.md`](CONTRIBUTING.md).
