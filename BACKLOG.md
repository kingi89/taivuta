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

### Active Queue — Milestone v0.3.1: Personal Name Accuracy, Disambiguation & Templates

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[BUG-002]` | Given Name Disambiguation False Positives on Liquid-k Stems (*Marko*) | Linguistic / Preferences | P1 | ✅ Completed |
| `[BUG-014]` | Hyphenated & Compound Personal Name Disambiguation (*Marja-Satu*) | Linguistic / Preferences | P2 | ✅ Completed |
| `[BUG-006]` | Default Nature Noun Declension for Standalone and Hyphenated Surnames | Linguistic | P1 | ✅ Completed |
| `[BUG-012]` | Remove Unimplemented `{ inflectAll: true }` Claim from `inflect-person.ts` TSDoc | Documentation | P2 | ✅ Completed |
| `[BUG-005]` | Entity Role Classification and Casing for Multi-Word Names with Nature Surnames | Linguistic | P1 | ✅ Completed |
| `[REFACTOR-002]` | Decompose `classifyProperNoun` into Discrete Pipeline Stages | Architecture | P1 | ✅ Completed |
| `[BUG-013]` | Forward `givenName`/`surname` Roles and Place Preferences in `inflect()` & `format()` | API / Templates | P1 | ✅ Completed |
| `[TEST-002]` | Unified `inflect()` End-to-End Test Matrix for Ambiguous & Compound Nominals | Testing | P1 | ✅ Completed |
| `[BUG-016]` | Kotus Type 32 `-tar`/`-tär` & `-tytär` Feminine Name Declension (*Ilmatar*) | Linguistic | P2 | ✅ Completed |

### Planned Queue — Milestone v0.3.2: Preferences Bundle Isolation, CI & Tooling Hygiene

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[CI-001]` | Upgrade GitHub Actions to `@v6` & Gate Demo Deploy on `check` | P1 | Replace `actions/checkout@v4` and `actions/setup-node@v4` with `@v6` in `ci.yml` and `deploy-demo.yml` to resolve Node 20 deprecation warnings; run `npm run check` before building in `deploy-demo.yml`. |
| `[MAINT-004]` | Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts` | P2 | Add `'scripts/**/*.ts'` to `eslint.config.js` and verify `package.json`, `package-lock.json`, and `src/index.ts` (`VERSION`) match in `scripts/verify-bundle.ts`. |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | P2 | Extract the inline Node HTTP server one-liner from `package.json` into a typed, linted `scripts/serve-demo.ts` script. |
| `[MAINT-003]` | Wire `build:countries-fixture` & Document Fixture Pipeline | P2 | Add `build:countries-fixture` script to `package.json` alongside `build:municipalities-fixture` and document dataset regeneration in `data/README.md`. |
| `[MAINT-005]` | Update/Override `picomatch` `devDependency` for GHSA-fc5q-39xc-vjpf | P2 | Once an upstream `picomatch` patch (`>=4.0.8`) is published, update `package-lock.json` (or add an `overrides` entry in `package.json`) and verify `npm audit` and `npm run check` pass. |
| `[OPT-002]` | Decouple Heavy Inflection Engine from `taivuta/preferences` Subpath | P1 | Generate disambiguation examples in `src/preferences/detect.ts` without bundling the full `taivuta/person` and `taivuta/morphology` engines, reducing `taivuta/preferences` from ~14.16 kB to ~6 kB. |

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

## 2. Icebox (P3: Future Explorations)

- **`[OPT-003]` Consolidate Spoken Letter & Latin Phonology Primitives**: Consolidate shared Latin letter sets, diacritic regexes, and sibilant arrays between `vowels.ts` and `colon.ts`.
- **`[ICE-001]` Bulk Execution Performance Suite**: Benchmark execution speed and allocation pressure over 100,000 name iterations for `v1.0.0`.
- **`[ICE-002]` Foreign Given Names and Surnames Ending in `-tti`**: Research safe heuristics or curated registries for foreign *-tti* names (*Donizetti*, *Pavarotti*, *Anetti*) without false-positive gradation resistance on native Finnish *-tti* names (*Matti*, *Antti*, *Pentti*, *Martti*, *Tytti*).
- **`[ICE-003]` Foreign & Global Personal Name Disambiguation (`Elaine`, `Corinne`, `Njoki`)**: Design heuristics or role/language awareness to prevent foreign given names ending in coincidental Finnish nature-noun substrings (*-laine*, *-rinne*, *-joki*) from matching surname nature-noun paradigms when `{ role: 'givenName' }` is omitted, as part of broader foreign/global personal name support.
- **`[ICE-004]` Hyphenated `Iso-` and `Uusi-` Surname Disambiguation (`Iso-Anttila`, `Uusi-Pietilä`)**: Distinguish standalone Finnish farmstead surnames starting with `Iso-` and `Uusi-` (which per Kotus keep the prefix uninflected: *Iso-Anttilan*, *Uusi-Pietilän*) from congruently inflecting compound toponyms (*Iso-Britannia $\to$ Ison-Britannian*, *Uusi-Seelanti $\to$ Uuden-Seelannin*) when `inflect()` is called without an explicit `role: 'person'` hint.
