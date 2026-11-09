# taivuta Development Backlog

This backlog maintains prioritized technical, linguistic, and architectural tasks for the `taivuta` project.

---

## Prioritization Model (P0–P3)

- **P0: Critical Hotfix**: Security vulnerability, broken build/CI, bundle budget breach, or benchmark regression. Handled immediately.
- **P1: Milestone Essential**: Committed deliverable for the active milestone in [`ROADMAP.md`](ROADMAP.md). Blocks milestone release.
- **P2: Strategic Enhancement**: High-value feature or linguistic edge case scheduled for the upcoming milestone.
- **P3: Icebox**: Exploratory thoughts, experimental features, or non-urgent optimizations.

---

## 1. Active Queue (Milestone v0.3.0: Place Name Fixes & Toponym Benchmark)

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[TEST-001]` | Full 309-Municipality Triad Benchmark (`missä`, `mistä`, `mihin`) | Testing / Data | P1 | 1 increment |
| `[BUG-003]` | Missing Elative/Ablative Overrides for 20 Irregular Municipalities | Linguistic | P1 | 1 increment |
| `[BUG-004]` | Compound Place Prefix Inflection Loss in `localFrom` (`Uusikaupunki`, `Isokyrö`) | Linguistic | P1 | 1 increment |
| `[BUG-007]` | Complete External Case Paradigms for Plural *-inen* Municipalities | Linguistic | P1 | 1 increment |
| `[BUG-008]` | Correct Mauritius Illative Form to *Mauritiukseen* | Linguistic | P2 | 1 increment |
| `[BUG-009]` | Add Inessive Override for *Virrat* (*Virroissa*) | Linguistic | P2 | 1 increment |
| `[TEST-003]` | 11-Case Paradigm Verification for Irregular Municipalities | Testing | P2 | 1 increment |

### Upcoming Queue (Milestone v0.3.1: Person Name Fixes)

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[BUG-002]` | Given Name Disambiguation False Positives on Liquid-k Stems (*Marko*) | Linguistic | P1 | 1 increment |
| `[BUG-005]` | Entity Role Classification and Casing for Multi-Word Names with Nature Surnames | Linguistic | P1 | 1 increment |
| `[BUG-006]` | Default Nature Noun Declension for Standalone and Hyphenated Surnames | Linguistic | P1 | 1 increment |
| `[TEST-002]` | Unified `inflect()` End-to-End Test Matrix for Ambiguous & Compound Nominals | Testing | P1 | 1 increment |

### Planned Queue (Milestone v0.4.0: Maintainability, Architecture & Regions)

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[OPT-001]` | Municipality Override Table Compression to Stem Tuples | Performance | P1 | 1 increment |
| `[OPT-002]` | Decouple Heavy Inflection Engine from `taivuta/preferences` Subpath | Architecture | P1 | 1 increment |
| `[REFACTOR-001]` | Unify Place Paradigm Resolution on `StemParadigm` Model | Architecture | P1 | 1 increment |
| `[REFACTOR-002]` | Decompose `classifyProperNoun` into Discrete Pipeline Stages | Architecture | P2 | 1 increment |
| `[TASK-004]` | Finnish Administrative & Historical Regions Support (*Uusimaa*, *Varsinais-Suomi*) | Linguistic | P1 | 1–2 increments |
| `[MAINT-001]` | Replace Inline Demo Script in `package.json` with `scripts/serve-demo.ts` | Maintainability | P2 | 1 increment |
| `[MAINT-003]` | Add `package.json` Scripts and Documentation for Fixture Builders | Maintainability | P2 | 1 increment |

### Completed Milestones

#### Milestone v0.2.0 — ✅ Released
| ID | Title | Category | Status |
| :--- | :--- | :--- | :--- |
| `[TASK-001]` | Kotus Type 9 Intervocalic Single-k Loss (*Taika*) | Linguistic | ✅ Completed |
| `[TASK-003]` | Single-Letter Proper Noun & Acronym Inflection | Linguistic | ✅ Completed |
| `[TASK-002]` | Foreign Feminine -ette/-otte/-itte Quantitative Gradation (*Janette*) | Linguistic | ✅ Completed |
| `[BUG-001]` | GitHub Pages Demo First Two Tabs Malfunctioning | Web Demo | ✅ Completed |

---

## 2. Detailed Task Specifications

### [TASK-001] Kotus Type 9 Intervocalic Single-k Loss
- **Priority**: P2
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.2.0
- **Affected Components**: `src/morphology/gradation.ts`, `src/preferences/detect.ts`
- **Kotus Guideline**: Nouns belonging to Kotus nominal type 9 (*kala*) with single intervocalic *k* undergo qualitative gradation ($k \to \emptyset$), creating a vowel hiatus or diphthong (*Taika $\to$ Taian, Taialle*). While modern given names resist single *k*-loss (*Aki $\to$ Akin, Reko $\to$ Rekon*), word-derived names like *Taika* can take either form.
- **Current Behavior**: Single *k* only weakens after liquids (*rk, lk*). *Taika* inflects solely as *Taikan/Taikalle* and is classified as unambiguous.
- **Target Behavior**: Detect *Taika* as ambiguous; offer weak grade (*Taian, Taialle*) and strong grade (*Taikan, Taikalle*).
- **Acceptance Criteria**:
  - `inflectPerson('Taika', 'genitive', { preference: 'gradation' }) === 'Taian'`
  - `inflectPerson('Taika', 'genitive', { preference: 'no-gradation' }) === 'Taikan'`
  - Names resisting single *k*-loss (*Aki, Mika, Riku, Reko*) remain unweakened by default.
  - Test suite coverage $\ge 95\%$, complexity $\le 10$.

### [TASK-002] Foreign Feminine -ette/-otte/-itte Quantitative Gradation
- **Priority**: P2
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.2.0
- **Affected Components**: `src/morphology/gradation.ts`, `src/preferences/detect.ts`
- **Kotus Guideline**: Foreign feminine names ending in *-ette/-otte/-itte* (*Janette, Bernadette, Juliette, Charlotte, Brigitte*) alternate between standard Finnish quantitative gradation ($tt \to t$: *Janetelle, Janeten*) and foreign spelling/sound preservation ($tt \to tt$: *Janettelle, Janetten*).
- **Current Behavior**: Geminate stop shortening ($tt \to t$) is applied universally; names are marked unambiguous.
- **Target Behavior**: Detect *-ette/-otte/-itte* foreign names as ambiguous; provide options for standard Finnish gradation vs. foreign spelling preservation.
- **Acceptance Criteria**:
  - `inflectPerson('Janette', 'allative', { preference: 'gradation' }) === 'Janetelle'`
  - `inflectPerson('Janette', 'allative', { preference: 'no-gradation' }) === 'Janettelle'`

### [TASK-003] Single-Letter Proper Noun & Acronym Inflection
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.2.0
- **Affected Components**: `src/morphology/colon.ts`, `src/morphology/vowels.ts`, `src/person/stem-person.ts`
- **Kotus Guideline**: Single-letter proper nouns, initials, and letter designations are read by their spoken letter names (e.g. *X* = "äks", *E* = "ee", *H* = "hoo", *K* = "koo") and require a colon before case suffixes (*X:ään, E:hen, H:hon*).
- **Current Behavior**:
  - `inflectPerson('X', 'illative')` outputs `'X:iin'` (incorrect vowel harmony/linking vowel; should be `'X:ään'`).
  - `inflectPerson('E', 'illative')` outputs `'EEn'` (missing colon and proper *hVn* suffixation; should be `'E:hen'`).
- **Target Behavior**:
  - Systematically map single letters (A–Ö, foreign Latin letters) to their phonetic letter-name stems and vowel harmony classes.
  - Require colon suffixation for single-letter tokens by default.
  - Produce correct case forms across all cases (e.g. *X:ään, X:ää, X:ssä; E:hen, E:tä, E:ssä; H:hon, H:ta, H:ssa*).
- **Acceptance Criteria**:
  - `inflectPerson('X', 'illative') === 'X:ään'`
  - `inflectPerson('E', 'illative') === 'E:hen'`
  - `inflectPerson('X', 'inessive') === 'X:ssä'`
  - `inflectPerson('H', 'illative') === 'H:hon'`
  - Single letter names have complete TSDoc coverage and test suite coverage $\ge 95\%$.

### [BUG-001] GitHub Pages Demo First Two Tabs Malfunctioning
- **Priority**: P2
- **Category**: Web Demo
- **Target Milestone**: v0.2.0
- **Affected Components**: `demo/index.html`
- **Current Behavior**: The interactive onboarding simulation and case tester tabs fail to render or update in GitHub Pages.
- **Target Behavior**: All three tabs (interactive tester, onboarding preview, technical reference) function reliably without runtime errors.

### [BUG-002] Given Name Disambiguation False Positives on Liquid-k Stems (Marko)
- **Priority**: P1
- **Category**: Linguistic Accuracy / Preferences
- **Target Milestone**: v0.3.1
- **Affected Components**: `src/preferences/detect.ts`
- **Kotus Guideline**: Modern Finnish given names ending in liquid + *k* clusters (*Marko*, *Mirko*, *Arko*) resist consonant gradation ($rk \to r$) and are unambiguously unweakened (*Markon, Markolle*). While common nouns (*arka* $\to$ *aran*, *pelko* $\to$ *pelon*) undergo qualitative gradation, personal given names with *-rko/-lko* do not alternate.
- **Current Behavior**: `inflectPerson('Marko', 'genitive')` defaults correctly to `'Markon'`. However, `QUALITATIVE_GRADATION_REGEX` in `src/preferences/detect.ts` matches `[rl]k` stems, and because `Marko` does not end in *-ka/-kä*, `defaultChoiceId` evaluates to `'gradation'`. Consequently, `detectNameDisambiguation('Marko')` falsely marks the name as ambiguous and suggests `'Maron'` and `'Marolle'` as the default choices.
- **Target Behavior**: Detect *Marko* (and similar non-alternating liquid-*k* given names) as unambiguous (`isAmbiguous: false`), or ensure default choice is `'no-gradation'` (*Markon, Markolle*).
- **Acceptance Criteria**:
  - `isAmbiguousName('Marko') === false`
  - `detectNameDisambiguation('Marko').isAmbiguous === false`

### [TEST-001] Full 309-Municipality Triad Benchmark (missä, mistä, mihin)
- **Priority**: P1
- **Category**: Testing / Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `tests/fixtures/municipalities.fixture.ts`, `tests/place.test.ts`
- **Context**: The existing municipal fixture only tests `local` (*missä*) and `genitive`. It omits `localFrom` (*mistä*) and `localTo` (*mihin*) across the 309 official municipalities, creating a major blind spot where 20 municipalities had broken *mistä* forms without failing tests.
- **Target Behavior**: Expand `tests/fixtures/municipalities.fixture.ts` and `tests/place.test.ts` to assert all three spatial cases (`local`, `localFrom`, `localTo`) for 100% of Finnish municipalities.

### [BUG-003] Missing Elative and Ablative Overrides for 20 Irregular Municipalities
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/place/municipalities.data.ts`, `src/place/inflect-place.ts`
- **Kotus Guideline**: Toponyms with stem lengthening (Type 78 / *hame*, e.g. *Kuortane : Kuortaneella : Kuortaneelta*), consonant gradation resistance (*Geta : Getassa : Getasta*), or *s*-stem alternation (*Alavus : Alavudella : Alavudelta*, *Kannus : Kannuksessa : Kannuksesta*) retain their inflected stems across all local cases.
- **Current Behavior**: Overrides define only `inessive` or `adessive`. Unmapped `elative` or `ablative` cases fall back to naive vocalic stems: *Kuortanelta* (missing double-e), *Alavusilta* (broken *s*-stem), *Kannusista*, *Kempelestä*, *Pihtipudasilta*, *Lopilta*, etc.
- **Target Behavior**: Supply correct `elative` and `ablative` forms for all 20 affected municipalities in `IRREGULAR_PLACES`.

### [BUG-004] Compound Place Prefix Inflection Loss in localFrom (Uusikaupunki, Isokyrö)
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/place/municipalities.data.ts`
- **Kotus Guideline**: Finnish compound place names whose first element is an inflecting adjective (*Uusi-*, *Iso-*) must inflect both parts across all cases: *Uudessakaupungissa $\to$ Uudestakaupungista*, *Isossakyrössä $\to$ Isostakyröstä*, *Uudessakaarlepyyssä $\to$ Uudestakaarlepyystä*.
- **Current Behavior**: `IRREGULAR_PLACES` omits `elative`. `localFrom` inflects only the head word while prefix remains in nominative: `'Uusikaupungista'`, `'Isokyrösta'`, `'Uusikaarlepyysta'`.
- **Target Behavior**: Populate complete compound overrides for *Uusikaupunki*, *Isokyrö*, and *Uusikaarlepyy*.

### [BUG-007] Complete External Case Paradigms for Plural -inen Municipalities
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/place/municipalities.data.ts`
- **Kotus Guideline**: Finnish municipalities ending in *-inen* (*Kauniainen*, *Joroinen*, *Huittinen*, etc.) are plural toponyms (*Kauniaisten, Kauniaisissa, Kauniaisiin*). Their external cases must also be plural (*Kauniaisille, Kauniaisilla, Kauniaisilta*).
- **Current Behavior**: Missing external case overrides cause fallback to singular *-selle*: `inflectPlace('Kauniainen', 'allative') === 'Kauniaiselle'`.
- **Target Behavior**: Provide complete plural external cases (*allative*, *adessive*, *ablative*) for all 11 *-inen* municipalities in `IRREGULAR_PLACES`.

### [BUG-008] Correct Mauritius Illative Form to Mauritiukseen
- **Priority**: P2
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/place/municipalities.data.ts`
- **Current Behavior**: `Mauritius` has `illative: 'Mauritiukselle'` (copy-pasted allative form).
- **Target Behavior**: `inflectPlace('Mauritius', 'illative') === 'Mauritiukseen'`.

### [BUG-009] Add Inessive Override for Virrat
- **Priority**: P2
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/place/municipalities.data.ts`
- **Current Behavior**: `inflectPlace('Virrat', 'inessive') === 'Virratissa'` because internal cases are missing.
- **Target Behavior**: `inflectPlace('Virrat', 'inessive') === 'Virroissa'`.

### [TEST-003] 11-Case Paradigm Verification for Irregular Municipalities
- **Priority**: P2
- **Category**: Testing
- **Target Milestone**: v0.3.0
- **Affected Components**: `tests/place.test.ts`
- **Target Behavior**: Add unit test verifying that all 11 grammatical cases for irregular municipalities (*Tampere*, *Kauniainen*, *Virrat*, *Kuortane*, *Alavus*, *Uusikaupunki*) produce expected forms without unexpected vocalic fallbacks.

### [BUG-005] Entity Role Classification and Casing for Multi-Word Names with Nature Surnames
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.1
- **Affected Components**: `src/cases/classify.ts`, `src/morphology/nature-nouns.ts`
- **Kotus Guideline**: Capitalized multi-word personal names (*Matti Niemi*, *Pekka Mäki*, *Antti Koski*) represent human beings and must be inflected as person names with preserved capitalization (*Matti Niemen*, *Pekka Mäen*).
- **Current Behavior**: `classifyProperNoun` matches nature nouns before multi-token person checks, classifying full names as places and decapitalizing surnames: `inflect('Matti Niemi', 'genitive') === 'Matti niemen'`.
- **Target Behavior**: Correct role routing and casing so `inflect('Matti Niemi', 'genitive') === 'Matti Niemen'`.

### [BUG-006] Default Nature Noun Declension for Standalone and Hyphenated Surnames
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.3.1
- **Affected Components**: `src/person/stem-person.ts`, `src/person/inflect-person.ts`
- **Kotus Guideline**: Finnish surnames derived from ancient nature nouns (*Niemi*, *Mäki*, *Saari*, *Lahti*, *Koski*, *Salmi*, *Järvi*) inflect via their traditional vowel-alternating stems (*Niemen*, *Mäen*, *Saaren*), including in standalone and hyphenated surname compounds (*Virtanen-Niemen*).
- **Current Behavior**: `getPersonParadigm` only matches nature nouns when `{ role: 'surname' }` is passed explicitly; otherwise defaults to vocalic given name inflection (*Niemin*, *Mäkin*, *Virtanen-Niemin*).
- **Target Behavior**: Standalone nature nouns and hyphenated surnames default to nature noun declension in person contexts.

### [TEST-002] Unified inflect() End-to-End Test Matrix for Ambiguous & Compound Nominals
- **Priority**: P1
- **Category**: Testing
- **Target Milestone**: v0.3.1
- **Affected Components**: `tests/person.test.ts`, `tests/place.test.ts`
- **Target Behavior**: Add end-to-end test matrix asserting `inflect()` behavior across multi-word names, nature surnames, hyphenated compounds, and mixed person/place nominals.

### [OPT-001] Municipality Override Table Compression to Stem Tuples
- **Priority**: P1
- **Category**: Performance / Bundle Footprint
- **Target Milestone**: v0.4.0
- **Affected Components**: `src/place/municipalities.data.ts`
- **Context**: `IRREGULAR_PLACES` stores ~50 objects with repeated property keys. Storing them as compact tuple representations `[name, stem, defaultLocalCase, flags]` will save ~2.0–3.0 kB across minified bundles while preventing case omissions.

### [OPT-002] Decouple Heavy Inflection Engine from taivuta/preferences Subpath
- **Priority**: P1
- **Category**: Architecture / Bundle Footprint
- **Target Milestone**: v0.4.0
- **Affected Components**: `src/preferences/detect.ts`
- **Context**: `taivuta/preferences` bundles `taivuta/person` and `taivuta/morphology` solely for example strings in `createExamples()`, reaching 14.15 kB (near the 15 kB budget). Decoupling example generation will drop the subpath to ~6 kB.

### [REFACTOR-001] Unify Place Paradigm Resolution on StemParadigm Model
- **Priority**: P1
- **Category**: Architecture
- **Target Milestone**: v0.4.0
- **Affected Components**: `src/place/stem-places.ts`, `src/place/inflect-place.ts`
- **Context**: Refactor irregular place inflection to resolve into complete canonical `StemParadigm` models instead of query-by-query string lookups.

### [REFACTOR-002] Decompose classifyProperNoun into Discrete Pipeline Stages
- **Priority**: P2
- **Category**: Architecture
- **Target Milestone**: v0.4.0
- **Affected Components**: `src/cases/classify.ts`
- **Context**: Separate multi-word personal name detection, known geographic datasets, and morphological heuristics into modular pipeline steps.

### [TASK-004] Finnish Administrative & Historical Regions Support
- **Priority**: P1
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.4.0
- **Affected Components**: `src/place/state-places.ts`, `src/place/municipalities.data.ts`
- **Kotus Guideline**: Finnish regions (maakunnat) have defined local case preferences and irregular declensions: *Uusimaa $\to$ Uudellamaalla / Uudeltamaalta / Uudellemaalle*, *Varsinais-Suomi $\to$ Varsinais-Suomessa*, *Pirkanmaa $\to$ Pirkanmaalla*, *Ahvenanmaa $\to$ Ahvenanmaalla*, *Kainuu $\to$ Kainuussa*.
- **Target Behavior**: Full spatial and grammatical case support for all 19 Finnish regions with 100% test fixture coverage.

### [MAINT-001] Replace Inline Demo Script in package.json with scripts/serve-demo.ts
- **Priority**: P2
- **Category**: Maintainability
- **Target Milestone**: v0.4.0
- **Affected Components**: `package.json`, `scripts/serve-demo.ts`
- **Target Behavior**: Replace the 200-character inline Node one-liner in `package.json` with a dedicated, typed, linted `scripts/serve-demo.ts` file.

### [MAINT-003] Add package.json Scripts and Documentation for Fixture Builders
- **Priority**: P2
- **Category**: Maintainability
- **Target Milestone**: v0.4.0
- **Affected Components**: `package.json`, `data/README.md`
- **Target Behavior**: Wire fixture generation scripts (`build-countries-fixture.ts`, `build-municipalities-fixture.ts`) into `package.json` scripts and document their workflows.

---

## 3. Icebox (P3: Future Explorations)

- **[OPT-003] Consolidate Spoken Letter & Latin Phonology Primitives**: Consolidate shared Latin letter sets, diacritic regexes, and sibilant arrays between `vowels.ts` and `colon.ts` to reduce code duplication.
- **[ICE-001] Bulk Execution Performance Suite**: Author benchmark testing execution speed and allocation pressure over 100,000 name iterations.
- **[ICE-002] Foreign Given Names and Surnames Ending in -tti**:
  - **Category**: Linguistic Accuracy
  - **Context**: Decoupled from `[TASK-002]` to safeguard native Finnish names ending in *-tti* (*Matti*, *Antti*, *Pentti*, *Martti*, *Nuutti*, *Taavetti*, *Aaretti*, *Tytti*), which strictly undergo quantitative gradation ($tt \to t$: *Matin*, *Antin*, *Taavetin*).
  - **Kotus Guideline**: Foreign surnames ending in *-i* generally resist consonant gradation (*Donizetti : Donizettin, Pavarotti : Pavarottin*), while rare foreign-derived given names (*Anetti*, *Lotti*, *Betti*) may alternate between assimilated Finnish gradation and foreign spelling preservation.
  - **Goal**: Research and design safe heuristics or curated registries to support foreign *-tti* names without introducing false-positive ambiguity detection for core native Finnish names.
