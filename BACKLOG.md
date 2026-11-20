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
| `[MAINT-004]` | Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts` | P2 | Add `'scripts/**/*.ts'` to `eslint.config.js` and verify `package.json`, `package-lock.json`, and `src/index.ts` (`VERSION`) match in `scripts/verify-bundle.ts`. |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | P2 | Extract the inline Node HTTP server one-liner from `package.json` into a typed, linted `scripts/serve-demo.ts` script. |
| `[MAINT-003]` | Wire `build:countries-fixture` & Document Fixture Pipeline | P2 | Add `build:countries-fixture` script to `package.json` alongside `build:municipalities-fixture` and document dataset regeneration in `data/README.md`. |
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

### Planned Queue — Milestone v0.5.0: Comprehensive User Documentation & Verification

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[DOC-001]` | Synchronize `ARCHITECTURE.md` with Current Engine Implementation | P2 | Update `StemParadigm` interface documentation, supported 11+3 case inventory, final-syllable regex gradation explanation, and `-lahti` internal local case classification in `ARCHITECTURE.md`. |
| `[DOC-002]` | Author Comprehensive User & Preferences Guides (`docs/`) | P1 | Create `docs/user-guide.md` (all cases, options, template syntax, role hints) and `docs/preferences-guide.md` (onboarding UX and persistence recipes), linked from `README.md`. |
| `[TEST-004]` | Automated Documentation Example Verification (`scripts/verify-docs.ts`) | P2 | Add a zero-dependency script wired into `npm run check` that extracts and validates code examples from `README.md`, `docs/*.md`, and TSDoc `@example` blocks. |

---

## 2. Active Milestone Specifications (v0.3.2)

### `[MAINT-004]` Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts`
- **Priority**: P2 | **Affected Components**: `eslint.config.js`, `scripts/verify-bundle.ts`, `scripts/*.ts`
- **Problem**: Scripts in `scripts/` are excluded from ESLint checks, and version bumps require manual parity across `package.json`, `package-lock.json`, and `src/index.ts` (`VERSION`).
- **Desired Behavior**: Add `'scripts/**/*.ts'` to `eslint.config.js` (resolving any lint violations in existing scripts) and assert in `scripts/verify-bundle.ts` that `package.json`, `package-lock.json`, and `src/index.ts` share the exact same `version` string.

### `[MAINT-001]` Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts`
- **Priority**: P2 | **Affected Components**: `package.json`, `scripts/serve-demo.ts`
- **Problem**: The `"demo"` npm script embeds a long inline `node -e` HTTP server string in `package.json`.
- **Desired Behavior**: Extract it into a typed, ESLint-clean `scripts/serve-demo.ts` script executed via `node --experimental-strip-types scripts/serve-demo.ts` with proper MIME types and safe path handling inside the repo.

### `[MAINT-003]` Wire `build:countries-fixture` & Document Fixture Pipeline
- **Priority**: P2 | **Affected Components**: `package.json`, `data/README.md`
- **Problem**: `scripts/build-countries-fixture.ts` has no npm script entry, and `data/README.md` omits fixture regeneration instructions for municipalities and countries.
- **Desired Behavior**: Add `"build:countries-fixture"` to `package.json` alongside `"build:municipalities-fixture"`, and document `build:municipalities-fixture`, `build:countries-fixture`, and `generate:places-matrix` in `data/README.md`.

---

## 3. Icebox (P3: Future Explorations)

- **`[ICE-001]` Bulk Execution Performance Suite**: Benchmark execution speed and allocation pressure over 100,000 name iterations for `v1.0.0`.
- **`[ICE-002]` Foreign Given Names and Surnames Ending in `-tti`**: Research safe heuristics or curated registries for foreign *-tti* names (*Donizetti*, *Pavarotti*, *Anetti*) without false-positive gradation resistance on native Finnish *-tti* names (*Matti*, *Antti*, *Pentti*, *Martti*, *Tytti*).
- **`[ICE-003]` Foreign & Global Personal Name Disambiguation (`Elaine`, `Corinne`, `Njoki`)**: Design heuristics or role/language awareness to prevent foreign given names ending in coincidental Finnish nature-noun substrings (*-laine*, *-rinne*, *-joki*) from matching surname nature-noun paradigms when `{ role: 'givenName' }` is omitted, as part of broader foreign/global personal name support.
- **`[ICE-004]` Hyphenated `Iso-` and `Uusi-` Surname Disambiguation (`Iso-Anttila`, `Uusi-Pietilä`)**: Distinguish standalone Finnish farmstead surnames starting with `Iso-` and `Uusi-` (which per Kotus keep the prefix uninflected: *Iso-Anttilan*, *Uusi-Pietilän*) from congruently inflecting compound toponyms (*Iso-Britannia $\to$ Ison-Britannian*, *Uusi-Seelanti $\to$ Uuden-Seelannin*) when `inflect()` is called without an explicit `role: 'person'` hint.
