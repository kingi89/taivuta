# taivuta Development Backlog

This backlog tracks prioritized technical, linguistic, and architectural tasks for the `taivuta` project. For completed release history, see [`CHANGELOG.md`](CHANGELOG.md) and [`ROADMAP.md`](ROADMAP.md).

---

## Prioritization Model (P0–P3)

- **P0: Critical Hotfix**: Security vulnerability, broken build/CI, bundle budget breach, or benchmark regression. Handled immediately.
- **P1: Milestone Essential**: Committed deliverable for the active milestone in [`ROADMAP.md`](ROADMAP.md). Blocks milestone release.
- **P2: Strategic Enhancement**: High-value feature or linguistic edge case scheduled for an upcoming milestone.
- **P3: Icebox**: Exploratory thoughts, experimental features, or non-urgent optimizations.

---

## 1. Milestone Queues

### Active Queue — Milestone v0.3.2: Preferences Bundle Isolation, CI & Tooling Hygiene

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[CI-001]` | Upgrade GitHub Actions to `@v6` & Gate Demo Deploy on `check` | P1 | ✅ Completed. |
| `[CI-002]` | Upgrade GitHub Pages Actions to Node 24-Native Releases | P2 | ✅ Completed (verified warning-free on GitHub Actions). |
| `[MAINT-004]` | Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts` | P2 | ✅ Completed. |
| `[SEC-001]` | Runtime Security Hardening, Trimming Alignment & Adversarial Test Suite | P1 | Fix `Object.prototype` lookup bugs across 7 modules, replace unbounded compound-prefix recursion with $O(N)$ handling, align whitespace trimming across public entry points, guard against malformed JS inputs and $>1{,}000{,}000$-char proper nouns, and add `tests/security.test.ts`. |
| `[SEC-002]` | Security Policy (`SECURITY.md`), Governance & Release Trust Docs | P1 | Create `SECURITY.md` (7 trust guarantees, character integrity boundary, 1M-char bound, GitHub Private Vulnerability Reporting + fallback email without hard SLAs), add Security & Reliability summary to `README.md`, add Secure Coding Standards to `CONTRIBUTING.md`, and add `"engines"` to `package.json`. |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | P2 | Extract the inline Node HTTP server one-liner from `package.json` into a typed, linted `scripts/serve-demo.ts` script. |
| `[MAINT-006]` | Retire Obsolete `scripts/generate-places-matrix.ts` Prototype | P2 | Remove the obsolete pre-`v0.1.0` `scripts/generate-places-matrix.ts` prototype and its `generate:places-matrix` script entry in `package.json` before documenting active fixture scripts in `[MAINT-003]`. |
| `[MAINT-003]` | Evaluate `build-countries-fixture.ts` & Document Fixture Pipeline | P2 | Decide whether to keep (wire `build:countries-fixture` + clean up `main()`/`mkdirSync`/relative logs) or retire `scripts/build-countries-fixture.ts`, and document active fixture regeneration workflows (including `data/municipalities.txt` provenance) in `data/README.md`. |
| `[OPT-002]` | Decouple Heavy Inflection Engine from `taivuta/preferences` Subpath | P1 | ✅ Completed (`9.07 kB < 10 kB`). |
| `[OPT-003]` | Consolidate Spoken Letter & Latin Phonology Primitives | P2 | ✅ Completed (`taivuta` root `29.94 kB` $\to$ `29.42 kB`). |

### Planned Queue — Milestone v0.4.0: Algorithmic Place Paradigms & Finnish Regions

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[REFACTOR-001]` | Unify Place Paradigm Resolution on `StemParadigm` Model | P1 | Resolve irregular and specialized toponyms into canonical `StemParadigm` models in `src/place/` instead of per-case string lookups. |
| `[OPT-001]` | Algorithmic Generation for Recurring Irregular Place Classes | P1 | Algorithmically generate paradigms for Type 78 lengthened *-e* stems (*Kuortane*, *Keitele*, *Tampere*), Type 39–41 *-s* stems (*Alavus*, *Kannus*), plural *-inen* municipalities (*Kauniainen*), and unhyphenated inflecting-prefix compounds (*Uusikaupunki*), leaving only true exceptions in `IRREGULAR_PLACES`. |
| `[BUG-015]` | Secondary Case Coverage for Geopolitical State Compounds | P2 | Support `adessive`, `ablative`, `allative`, `essive`, and `translative` for plural archipelagos (*Filippiinit*) and state compounds (*Dominikaaninen tasavalta*, *Yhdistynyt kuningaskunta*) in `src/place/state-places.ts` using a bundle-size-neutral mechanism. |
| `[TEST-003]` | 11-Case Paradigm Verification for Irregular & Algorithmic Places | P2 | Verify all 11 grammatical cases in `tests/place.test.ts` across representative irregular, algorithmic, and state-compound toponyms. |
| `[TASK-004]` | Finnish Administrative & Historical Regions Support | P1 | Full spatial (`local`, `localFrom`, `localTo`) and grammatical case support and 100% fixture benchmark for all 19 Finnish regions (*Uusimaa $\to$ Uudellamaalla*, *Varsinais-Suomi $\to$ Varsinais-Suomessa*, *Pirkanmaa $\to$ Pirkanmaalla*, *Ahvenanmaa*, *Kainuu*). |
| `[MAINT-007]` | Decouple `build-municipalities-fixture.ts` from `src/` Imports | P2 | Eliminate the circular dependency where `scripts/build-municipalities-fixture.ts` imports `src/` inflection code to generate `tests/fixtures/municipalities.json` (either freeze the verified static fixture or generate independently), fix L238 `harmonize('ssä', clean)`, add header docs, and log relative paths. |
| `[SEC-003]` | Security Regression Coverage for Algorithmic Place Resolvers & Demo Audit | P2 | Verify new algorithmic place resolvers (`[REFACTOR-001]`/`[OPT-001]`/`[TASK-004]`) against `tests/security.test.ts` invariants (`Object.hasOwn`, linear bounds) and audit `demo/index.html` DOM rendering for safe text insertion. |

### Planned Queue — Milestone v0.5.0: Comprehensive User Documentation & Verification

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[DOC-001]` | Synchronize `ARCHITECTURE.md` with Current Engine Implementation | P2 | Update `StemParadigm` interface documentation, supported 11+3 case inventory, final-syllable regex gradation explanation, and `-lahti` internal local case classification in `ARCHITECTURE.md`. |
| `[DOC-002]` | Author Comprehensive User & Preferences Guides (`docs/`) | P1 | Create `docs/user-guide.md` (all cases, options, template syntax, role hints, and edge-case/fallback contract matrix) and `docs/preferences-guide.md` (onboarding UX and persistence recipes), linked from `README.md`. |
| `[TEST-004]` | Automated Documentation Example Verification (`scripts/verify-docs.ts`) | P2 | Add a zero-dependency script wired into `npm run check` that extracts and validates code examples from `README.md`, `docs/*.md`, and TSDoc `@example` blocks. |

---

## 2. Active Milestone Specifications (v0.3.2)

### `[SEC-001]` Runtime Security Hardening, Trimming Alignment & Adversarial Test Suite
- **Priority**: P1 | **Affected Components**: `src/template/format.ts`, `src/morphology/assembler.ts`, `src/morphology/colon.ts`, `src/morphology/compounds.ts`, `src/person/stem-person.ts`, `src/person/inflect-person.ts`, `src/place/inflect-place.ts`, `src/place/state-places.ts`, `src/cases/inflect.ts`, `src/preferences/detect.ts`, `tests/security.test.ts`
- **Problem**: Plain-object dictionary lookups without `Object.hasOwn()` leak `Object.prototype` properties or throw on keys such as `'toString'`; repeated `Uusi-`/`Iso-` prefixes cause unbounded recursion stack overflows; JS callers passing `null`, non-strings, or malformed options trigger unhandled `TypeError`s; whitespace trimming is inconsistent across `inflectPerson` vs. `inflectPlace`/`detectLocalCase`; and no documented input ceiling or adversarial regression test suite exists.
- **Desired Behavior**: Replace unsafe lookups with `Object.hasOwn()`/`Map`/`Object.create(null)`, eliminate recursive stack overflows with $O(N)$ linear-time prefix handling, align whitespace trimming across all public entry points, guard public API boundaries against malformed JS inputs without throwing, enforce a `1,000,000`-character proper-noun length ceiling (returning input unchanged above the cap while keeping `format()` templates unbounded), and add `tests/security.test.ts` covering all 7 trust principles.

### `[SEC-002]` Security Policy (`SECURITY.md`), Governance & Release Trust Docs
- **Priority**: P1 | **Affected Components**: `SECURITY.md`, `README.md`, `CONTRIBUTING.md`, `package.json`
- **Problem**: The repository lacks a public `SECURITY.md` documenting consumer trust guarantees, vulnerability disclosure channels, and transparent remediation practices; `CONTRIBUTING.md` lacks explicit secure-coding standards; and `package.json` omits an `"engines"` constraint.
- **Desired Behavior**: Add `SECURITY.md` (consumer trust guarantees, raw character preservation / consumer output-escaping boundary, 1,000,000-character proper-noun bound, supported versions, GitHub Private Vulnerability Reporting primary + `taivuta.maintainers@kingi89.fi` fallback with no fixed response SLA, transparent GHSA/`CHANGELOG.md`/`npm deprecate` remediation), add a Security & Reliability summary to `README.md`, add Secure & Defensive Engineering Standards to `CONTRIBUTING.md`, and add `"engines"` (and `SECURITY.md` in `files`) in `package.json`.

### `[MAINT-001]` Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts`
- **Priority**: P2 | **Affected Components**: `package.json`, `scripts/serve-demo.ts`
- **Problem**: The `"demo"` npm script embeds a long inline `node -e` HTTP server string in `package.json`.
- **Desired Behavior**: Extract it into a typed, ESLint-clean `scripts/serve-demo.ts` script executed via `node --experimental-strip-types scripts/serve-demo.ts` with proper MIME types and safe path handling inside the repo.

### `[MAINT-006]` Retire Obsolete `scripts/generate-places-matrix.ts` Prototype
- **Priority**: P2 | **Affected Components**: `scripts/generate-places-matrix.ts`, `package.json`
- **Problem**: `scripts/generate-places-matrix.ts` (1,034 lines) is an obsolete pre-`v0.1.0` prototype that never imports `src/place/` and maintains a drifted parallel fork of municipality rules.
- **Desired Behavior**: Delete `scripts/generate-places-matrix.ts` and remove `"generate:places-matrix"` from `package.json` before `[MAINT-003]` documents the active fixture pipeline, keeping `npm run check` green.

### `[MAINT-003]` Evaluate `build-countries-fixture.ts` & Document Fixture Pipeline
- **Priority**: P2 | **Affected Components**: `package.json`, `scripts/build-countries-fixture.ts`, `data/README.md`
- **Problem**: `scripts/build-countries-fixture.ts` is unwired in `package.json` and duplicates static data already committed in `tests/fixtures/un-countries.json` and `country-variants.json` without external input; `data/README.md` also omits fixture regeneration instructions and `data/municipalities.txt` provenance.
- **Desired Behavior**: After `[MAINT-006]` retires `generate-places-matrix.ts`, decide whether to keep `scripts/build-countries-fixture.ts` as a typed source (wiring `"build:countries-fixture"`, wrapping top-level side effects in `main()`, adding `mkdirSync` + `'utf8'`, and logging relative paths) or retire it in favor of the JSON fixtures directly, and document active fixture regeneration workflows in `data/README.md`.

---

## 3. Icebox (P3: Future Explorations)

- **`[ICE-001]` Bulk Execution Performance & Adversarial Fuzz Suite**: Benchmark execution speed and allocation pressure over 100,000 name iterations and run randomized Unicode/adversarial stability sweeps (verifying zero throws and bounded linear latency) for `v1.0.0`.
- **`[ICE-002]` Foreign Given Names and Surnames Ending in `-tti`**: Research safe heuristics or curated registries for foreign *-tti* names (*Donizetti*, *Pavarotti*, *Anetti*) without false-positive gradation resistance on native Finnish *-tti* names (*Matti*, *Antti*, *Pentti*, *Martti*, *Tytti*).
- **`[ICE-003]` Foreign & Global Personal Name Disambiguation (`Elaine`, `Corinne`, `Njoki`)**: Design heuristics or role/language awareness to prevent foreign given names ending in coincidental Finnish nature-noun substrings (*-laine*, *-rinne*, *-joki*) from matching surname nature-noun paradigms when `{ role: 'givenName' }` is omitted, as part of broader foreign/global personal name support.
- **`[ICE-004]` Hyphenated `Iso-` and `Uusi-` Surname Disambiguation (`Iso-Anttila`, `Uusi-Pietilä`)**: Distinguish standalone Finnish farmstead surnames starting with `Iso-` and `Uusi-` (which per Kotus keep the prefix uninflected: *Iso-Anttilan*, *Uusi-Pietilän*) from congruently inflecting compound toponyms (*Iso-Britannia $\to$ Ison-Britannian*, *Uusi-Seelanti $\to$ Uuden-Seelannin*) when `inflect()` is called without an explicit `role: 'person'` hint.
- **`[ICE-005]` Script CLI Hygiene & Strict ESLint Rules for `scripts/**/*.ts`**: Standardize non-zero exit codes on missing inputs and relative path logging across `scripts/`, fix the `mtime` sorting comment in `extract-dvv-names.ts`, and tighten `eslint.config.js` for `scripts/**/*.ts` (`complexity <= 10`, `max-depth <= 3`, `max-params <= 3`) once legacy scripts are retired or refactored.
