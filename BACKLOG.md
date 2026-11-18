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
| `[CI-001]` | Upgrade GitHub Actions to `@v6` & Gate Demo Deploy on `check` | P1 | Replace `actions/checkout@v4` and `actions/setup-node@v4` with `@v6` in `ci.yml` and `deploy-demo.yml` to resolve Node 20 deprecation warnings; run `npm run check` before building in `deploy-demo.yml`. |
| `[MAINT-004]` | Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts` | P2 | Add `'scripts/**/*.ts'` to `eslint.config.js` and verify `package.json`, `package-lock.json`, and `src/index.ts` (`VERSION`) match in `scripts/verify-bundle.ts`. |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | P2 | Extract the inline Node HTTP server one-liner from `package.json` into a typed, linted `scripts/serve-demo.ts` script. |
| `[MAINT-003]` | Wire `build:countries-fixture` & Document Fixture Pipeline | P2 | Add `build:countries-fixture` script to `package.json` alongside `build:municipalities-fixture` and document dataset regeneration in `data/README.md`. |
| `[OPT-002]` | Decouple Heavy Inflection Engine from `taivuta/preferences` Subpath | P1 | Generate disambiguation examples in `src/preferences/detect.ts` without bundling the full `taivuta/person` and `taivuta/morphology` engines, reducing `taivuta/preferences` from ~14.98 kB to ~6 kB. |
| `[OPT-003]` | Consolidate Spoken Letter & Latin Phonology Primitives | P2 | Consolidate shared Latin vowel sets, diacritic regexes, and sibilant/spoken-letter primitives across `vowels.ts`, `colon.ts`, and `stem.ts` to reclaim `taivuta` root bundle headroom. |

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

### `[OPT-002]` Decouple Heavy Inflection Engine from `taivuta/preferences` Subpath
- **Priority**: P1 | **Affected Components**: `src/preferences/detect.ts`, `scripts/verify-bundle.ts`
- **Problem**: `src/preferences/detect.ts` imports `inflectPerson` and `isFinnishTarName`, pulling the full `person` and `morphology` engines into `dist/preferences/index.mjs` (`14.98 kB / 15.00 kB`).
- **Desired Behavior**: Generate the 5 disambiguation preview examples (`genitive`, `allative`, `illative`, `adessive`, `ablative`) using lightweight preference-local logic without bundling `inflectPerson` or `nature-nouns`, reducing `taivuta/preferences` to `<= 8 kB` (target `~6 kB`) while keeping 100% parity with existing `tests/preferences.test.ts` outputs.

### `[OPT-003]` Consolidate Spoken Letter & Latin Phonology Primitives
- **Priority**: P2 | **Affected Components**: `src/morphology/vowels.ts`, `src/morphology/colon.ts`, `src/morphology/stem.ts`
- **Problem**: `taivuta` (root) is at `29.94 kB / 30.00 kB`, and `vowels.ts`, `colon.ts`, and `stem.ts` define overlapping Latin vowel sets and regexes.
- **Desired Behavior**: Consolidate shared vowel and phonology primitives in `src/morphology/vowels.ts` and reuse them in `colon.ts` and `stem.ts`, reclaiming root bundle headroom with zero behavioral or API changes.

### `[CI-001]` Upgrade GitHub Actions to `@v6` & Gate Demo Deploy on `check`
- **Priority**: P1 | **Affected Components**: `.github/workflows/ci.yml`, `.github/workflows/deploy-demo.yml`
- **Problem**: Both workflows still use `actions/checkout@v4` and `actions/setup-node@v4`, and `deploy-demo.yml` deploys after `npm run build` without running `npm run check`.
- **Desired Behavior**: Upgrade `checkout` and `setup-node` to `@v6` in both workflows (matching `release.yml`) and replace `npm run build` with `npm run check` in `deploy-demo.yml` so broken builds or failing tests cannot deploy to GitHub Pages.

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
