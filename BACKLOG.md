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
| `[BUG-006]` | Default Nature Noun Declension for Standalone and Hyphenated Surnames | Linguistic | P1 | 1 increment |
| `[BUG-012]` | Remove Unimplemented `{ inflectAll: true }` Claim from `inflect-person.ts` TSDoc | Documentation | P2 | (with `BUG-006`) |
| `[BUG-005]` | Entity Role Classification and Casing for Multi-Word Names with Nature Surnames | Linguistic | P1 | 1 increment |
| `[REFACTOR-002]` | Decompose `classifyProperNoun` into Discrete Pipeline Stages | Architecture | P1 | (with `BUG-005`) |
| `[BUG-013]` | Forward `givenName`/`surname` Roles and Place Preferences in `inflect()` & `format()` | API / Templates | P1 | 1 increment |
| `[TEST-002]` | Unified `inflect()` End-to-End Test Matrix for Ambiguous & Compound Nominals | Testing | P1 | (with `BUG-013`) |
| `[BUG-016]` | Kotus Type 32 `-tar`/`-tär` & `-tytär` Feminine Name Declension (*Ilmatar*) | Linguistic | P2 | 1 increment |

### Planned Queue — Milestone v0.3.2: Preferences Bundle Isolation, CI & Tooling Hygiene

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[CI-001]` | Upgrade GitHub Actions to `@v6` & Gate Demo Deploy on `check` | P1 | Replace `actions/checkout@v4` and `actions/setup-node@v4` with `@v6` in `ci.yml` and `deploy-demo.yml` to resolve Node 20 deprecation warnings; run `npm run check` before building in `deploy-demo.yml`. |
| `[MAINT-004]` | Lint `scripts/**/*.ts` & Enforce Version Parity in `verify-bundle.ts` | P2 | Add `'scripts/**/*.ts'` to `eslint.config.js` and verify `package.json`, `package-lock.json`, and `src/index.ts` (`VERSION`) match in `scripts/verify-bundle.ts`. |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | P2 | Extract the inline Node HTTP server one-liner from `package.json` into a typed, linted `scripts/serve-demo.ts` script. |
| `[MAINT-003]` | Wire `build:countries-fixture` & Document Fixture Pipeline | P2 | Add `build:countries-fixture` script to `package.json` alongside `build:municipalities-fixture` and document dataset regeneration in `data/README.md`. |
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

## 2. Active Milestone Specifications (v0.3.1)

### `[BUG-006]` Default Nature Noun Declension for Standalone and Hyphenated Surnames
- **Priority**: P1 | **Affected Components**: `src/person/stem-person.ts`, `src/person/inflect-person.ts`
- **Kotus Guideline**: Finnish surnames derived from nature nouns (*Niemi*, *Mäki*, *Saari*, *Lahti*, *Koski*, *Salmi*, *Järvi*) inflect via their traditional vowel-alternating stems (*Niemen*, *Mäen*), whereas word-derived given names (*Tuuli*, *Meri*, *Suvi*, *Lumi*, *Pilvi*, *Helmi*, *Sini*) default to nominative *-i* stems unless `{ vocalicStemVariant: 'inflected' }` or `{ role: 'surname' }` is specified.
- **Current Behavior**: `getPersonParadigm` only calls `matchNatureNoun(name)` when `role === 'surname'` or `vocalicStemVariant === 'inflected'`, causing `inflectPerson('Niemi', 'genitive')` and `inflectPerson('Virtanen-Niemi', 'genitive')` to return `'Niemin'` and `'Virtanen-Niemin'`.
- **Acceptance Criteria**: `inflectPerson('Niemi', 'genitive') === 'Niemen'`, `inflectPerson('Virtanen-Niemi', 'genitive') === 'Virtanen-Niemen'`, while `inflectPerson('Tuuli', 'genitive') === 'Tuulin'` unless `role: 'surname'` or `vocalicStemVariant: 'inflected'`.

### `[BUG-012]` Remove Unimplemented `{ inflectAll: true }` Claim from `inflect-person.ts` TSDoc
- **Priority**: P2 | **Affected Components**: `src/person/inflect-person.ts`
- **Problem**: Lines 5–6 of `src/person/inflect-person.ts` document an `{ inflectAll: true }` option (`"Matin Virtasen"`) that does not exist in `InflectPersonOptions` and has no valid use case for personal names.
- **Acceptance Criteria**: Remove the unimplemented `{ inflectAll: true }` sentence from `src/person/inflect-person.ts`.

### `[BUG-005]` & `[REFACTOR-002]` Entity Role Classification Pipeline and Casing for Multi-Word Names
- **Priority**: P1 | **Affected Components**: `src/cases/classify.ts`, `src/morphology/nature-nouns.ts`
- **Kotus Guideline**: Capitalized multi-word personal names (*Matti Niemi*, *Pekka Mäki*) represent people and inflect on the surname with preserved capitalization (*Matti Niemen*, *Pekka Mäen*).
- **Current Behavior**: `classifyProperNoun` checks `matchNatureNoun(trimmed)` before multi-token person checks, routing `'Matti Niemi'` to `inflectPlace`, and `capitalizeForm` in `nature-nouns.ts` lowercases the suffix when `base` is non-empty (`'Matti niemen'`).
- **Acceptance Criteria**: Decompose `classifyProperNoun` into clear pipeline stages so multi-word personal names classify as `'person'`, preserve casing in `nature-nouns.ts`, and satisfy `inflect('Matti Niemi', 'genitive') === 'Matti Niemen'`.

### `[BUG-013]` & `[TEST-002]` Forward `givenName`/`surname` Roles & Place Preferences in `inflect()` & `format()`
- **Priority**: P1 | **Affected Components**: `src/cases/types.ts`, `src/cases/inflect.ts`, `src/template/format.ts`, `tests/person.test.ts`, `tests/place.test.ts`
- **Problem**: `format('{$n:genitive:surname}', ...)` passes `role: 'surname'` to `inflect()`, which discards `'givenName'` and `'surname'` roles when calling `inflectPerson()`. Additionally, `FormatOptions.preferences` and `inflect()` do not support `PlacePreferenceParams` (`localCase`).
- **Acceptance Criteria**: `InflectOptions.role` accepts `'givenName' | 'surname'`, `inflect()` and `format()` forward sub-roles and place `localCase` preferences, and end-to-end tests (`[TEST-002]`) cover multi-word names, nature surnames, compounds, and template role hints.

### `[BUG-016]` Kotus Type 32 `-tar`/`-tär` & `-tytär` Feminine Name Declension (*Ilmatar*)
- **Priority**: P2 | **Affected Components**: `src/morphology/stem.ts`, `src/person/stem-person.ts`
- **Kotus Guideline**: Finnish feminine/mythological names ending in the derivational suffix *-tar/-tär* (*Ilmatar*, *Kuutar*, *Suometar*, *Päivätär*, *Aallotar*, *Sulotar*, *Ainotar*, *Valotar*, *Onnetar*, *Otavatar*, *Tuuletar*, *Suvetar*, *Hallatar*) and matronymics/patronymics ending in *-tytär* (*Matintytär*, *Saduntytär*) belong to Kotus nominal type 32 (*sisar*) with reverse quantitative gradation ($t \to tt$): vocalic stem *-ttare-/-ttäre-* (*Ilmattaren*, *Ilmattarella*, *Ilmattareen*) and consonant-stem partitive *-tarta/-tärtä* (*Ilmatarta*). Conversely, foreign consonant-final names ending in *-tar* (*Petar*, *Dimitar*, *Mukhtar*, *Sattar*, *Ottar*, *Ishtar*) take regular epenthetic *-i-* (*Petarin*, *Petarilla*).
- **Current Behavior**: `analyzeStem()` treats all `-tar/-tär` names as foreign consonant stems with linking vowel `-i-`, producing `*Ilmatarin`, `*Ilmatarilla`, `*Ilmataria`, `*Ilmatariin`.
- **Acceptance Criteria**: `inflectPerson('Ilmatar', 'adessive') === 'Ilmattarella'`, `inflectPerson('Ilmatar', 'genitive') === 'Ilmattaren'`, `inflectPerson('Ilmatar', 'partitive') === 'Ilmatarta'`, `inflectPerson('Ilmatar', 'illative') === 'Ilmattareen'`, `inflectPerson('Päivätär', 'adessive') === 'Päivättärellä'`, and `inflectPerson('Petar', 'adessive') === 'Petarilla'`.

---

## 3. Icebox (P3: Future Explorations)

- **`[OPT-003]` Consolidate Spoken Letter & Latin Phonology Primitives**: Consolidate shared Latin letter sets, diacritic regexes, and sibilant arrays between `vowels.ts` and `colon.ts`.
- **`[ICE-001]` Bulk Execution Performance Suite**: Benchmark execution speed and allocation pressure over 100,000 name iterations for `v1.0.0`.
- **`[ICE-002]` Foreign Given Names and Surnames Ending in `-tti`**: Research safe heuristics or curated registries for foreign *-tti* names (*Donizetti*, *Pavarotti*, *Anetti*) without false-positive gradation resistance on native Finnish *-tti* names (*Matti*, *Antti*, *Pentti*, *Martti*, *Tytti*).
- **`[ICE-003]` Foreign & Global Personal Name Disambiguation (`Elaine`, `Corinne`, `Njoki`)**: Design heuristics or role/language awareness to prevent foreign given names ending in coincidental Finnish nature-noun substrings (*-laine*, *-rinne*, *-joki*) from matching surname nature-noun paradigms when `{ role: 'givenName' }` is omitted, as part of broader foreign/global personal name support.
