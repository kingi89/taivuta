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

### Active Queue — Milestone v0.4.0: Algorithmic Place Paradigms & Finnish Regions

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[REFACTOR-001]` | Unify Place Paradigm Resolution on `StemParadigm` Model | P1 | ✅ Completed. |
| `[OPT-001]` | Algorithmic Generation for Recurring Irregular Place Classes | P1 | ✅ Completed (`taivuta` root `31.94 kB` $\to$ `25.50 kB`, `taivuta/place` `23.69 kB` $\to$ `17.17 kB`). |
| `[BUG-015]` | Secondary Case Coverage for Geopolitical State Compounds | P2 | Support `adessive`, `ablative`, `allative`, `essive`, and `translative` for plural archipelagos (*Filippiinit*) and state compounds (*Dominikaaninen tasavalta*, *Yhdistynyt kuningaskunta*) in `src/place/state-places.ts` using a bundle-size-neutral mechanism. |
| `[TEST-003]` | 11-Case Paradigm Verification for Irregular & Algorithmic Places | P2 | Verify all 11 grammatical cases in `tests/place.test.ts` across representative irregular, algorithmic, and state-compound toponyms. |
| `[TASK-004]` | Finnish Administrative & Historical Regions Support | P1 | Full spatial (`local`, `localFrom`, `localTo`) and grammatical case support and 100% fixture benchmark for all 19 Finnish regions (*Uusimaa $\to$ Uudellamaalla*, *Varsinais-Suomi $\to$ Varsinais-Suomessa*, *Pirkanmaa $\to$ Pirkanmaalla*, *Ahvenanmaa*, *Kainuu*). |
| `[MAINT-007]` | Decouple `build-municipalities-fixture.ts` from `src/` Imports | P2 | Eliminate the circular dependency where `scripts/build-municipalities-fixture.ts` imports `src/` inflection code to generate `tests/fixtures/municipalities.json` (either freeze the verified static fixture or generate independently), fix L238 `harmonize('ssä', clean)`, add header docs, and log relative paths. |
| `[SEC-003]` | Security Regression Coverage for Algorithmic Place Resolvers & Demo Audit | P2 | Verify new algorithmic place resolvers (`[REFACTOR-001]`/`[OPT-001]`/`[TASK-004]`) against `tests/security.test.ts` invariants (`Object.hasOwn`, linear bounds) and audit `demo/index.html` DOM rendering for safe text insertion. |
| `[OPT-005]` | Morphology & Subpath Footprint Compaction | P2 | Compact `RAW_NATURE_NOUN_RULES` defaults in `src/morphology/nature-nouns.ts`, share `STANDARD_SUFFIXES` between `assembler.ts` and `colon.ts`, compact stop-gradation regexes in `gradation.ts`, and replace static `INFLECTING_PREFIXES` strings in `compounds.ts` with `StemParadigm` assembly to reclaim ~1.5–1.9 kB minified across `taivuta/person`, `taivuta/morphology`, `taivuta/preferences`, and root ahead of `v0.5.0`/`v0.6.0`. |

### Planned Queue — Milestone v0.5.0: Comprehensive User Documentation & Verification

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[DOC-001]` | Synchronize `ARCHITECTURE.md` with Current Engine Implementation | P2 | Update `StemParadigm` interface documentation, supported 11+3 case inventory, final-syllable regex gradation explanation, and `-lahti` internal local case classification in `ARCHITECTURE.md`. |
| `[DOC-002]` | Author Comprehensive User & Preferences Guides (`docs/`) | P1 | Create `docs/user-guide.md` (all cases, options, template syntax, role hints, and edge-case/fallback contract matrix) and `docs/preferences-guide.md` (onboarding UX and persistence recipes), linked from `README.md`. |
| `[TEST-004]` | Automated Documentation Example Verification (`scripts/verify-docs.ts`) | P2 | Add a zero-dependency script wired into `npm run check` that extracts and validates code examples from `README.md`, `docs/*.md`, and TSDoc `@example` blocks. |
| `[SEC-005]` | Freeze Exported Static Registries Against Runtime Mutation | P2 | Freeze `NATURE_NOUN_RULES` (and rule objects) in `src/morphology/nature-nouns.ts` and protect `WORD_DERIVED_GIVEN_NAMES` in `src/preferences/ambiguous-names.data.ts` against accidental downstream mutation. |
| `[BUG-018]` | Include `tarStem`, `colon`, and `harmony` in `hasPersonOptions()` | P2 | Update `hasPersonOptions()` in `src/cases/inflect.ts` so explicit `tarStem`, `colon`, or `harmony` options are honored instead of being silently dropped on place-like tokens. |
| `[BUG-019]` | Anchor `tt`/`kk` Geminate Exclusion Regexes in `weakenQualitative()` | P2 | Add trailing `$` anchors to the `tt` and `kk` checks in `src/morphology/gradation.ts` (L102, L110) so earlier-syllable geminates do not suppress final-syllable qualitative gradation in compounds. |
| `[BUG-020]` | Validate `options.localCase` Override in `assembleCase()` | P2 | Check `options.localCase === 'in' \|\| options.localCase === 'on'` in `src/morphology/assembler.ts` so invalid strings fall back to `paradigm.defaultSpatialCase` instead of coercing to `'in'`. |
| `[DOC-003]` | Update Stale `taivuta/preferences` Bundle Budget in `demo/index.html` | P2 | Update the technical panel text in `demo/index.html` (L523) from `< 15 kB` to `< 10 kB` to match the current subpath budget. |

### Planned Queue — Milestone v0.6.0: Personal Name Morphology & Disambiguation

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[TASK-005]` | Kotus Type 41 (*vieras*) Personal Name Declension (`Tuomas` $\to$ `Tuomaan`) | P1 | Support Kotus Type 41 (*vieras*) declension and disambiguation options for traditional *-as/-äs* personal names (*Tuomas* $\to$ *Tuomaan*, *Tuomaalle*, *Tuomaaseen* alongside *Tuomaksen*). |
| `[ICE-002]` | Foreign Given Names and Surnames Ending in `-tti` | P2 | Research safe heuristics or curated registries for foreign *-tti* names (*Donizetti*, *Pavarotti*, *Anetti*) without false-positive gradation resistance on native Finnish *-tti* names (*Matti*, *Antti*, *Pentti*, *Martti*, *Tytti*). |
| `[ICE-003]` | Foreign & Global Personal Name Disambiguation (`Elaine`, `Corinne`, `Njoki`) | P2 | Design heuristics or role/language awareness to prevent foreign given names ending in coincidental Finnish nature-noun substrings (*-laine*, *-rinne*, *-joki*) from matching surname nature-noun paradigms when `{ role: 'givenName' }` is omitted. |
| `[ICE-004]` | Hyphenated `Iso-` and `Uusi-` Surname Disambiguation (`Iso-Anttila`, `Uusi-Pietilä`) | P2 | Distinguish standalone Finnish farmstead surnames starting with `Iso-` and `Uusi-` (prefix uninflected: *Iso-Anttilan*, *Uusi-Pietilän*) from congruently inflecting compound toponyms (*Iso-Britannia* $\to$ *Ison-Britannian*, *Uusi-Seelanti* $\to$ *Uuden-Seelannin*) when `role: 'person'` is omitted. |
| `[BUG-017]` | Unreachable `'Guy'` Entry in `SILENT_FINAL_REGEX` | P2 | Decide per Kotus foreign-name apostrophe guidance whether to check `SILENT_FINAL_REGEX` before the vowel-final fast path in `src/morphology/stem.ts` (for vocalic diphthong `/gai/` $\to$ `Guy’n`) or remove the dead `'guy'` branch. |

### Planned Queue — Milestone v1.0.0-RC: Production Release Candidate

| ID | Title | Priority | Target Outcome & Constraints |
| :--- | :--- | :--- | :--- |
| `[ICE-001]` | Bulk Execution Performance & Adversarial Fuzz Suite | P1 | Benchmark execution speed and allocation pressure over 100,000+ name iterations and run randomized Unicode/adversarial stability sweeps verifying sub-millisecond latency and zero crashes. |
| `[OPT-004]` | Zero-Allocation Token Splitting & Fast-Path Scans for Very Long Inputs | P2 | Replace `.split()` array allocations in `src/morphology/vowels.ts` (`getLastSegment`) and `src/person/inflect-person.ts`, reverse-scan `scanVowels()`, and add length/suffix fast paths in `normalizeForeignAccents()` and `inflectPluralIslandArchipelago()` on 100k–1M char inputs. |
| `[ICE-005]` | Script CLI Hygiene & Strict ESLint Rules for `scripts/**/*.ts` | P2 | Standardize non-zero exit codes on missing inputs and relative path logging across `scripts/`, fix the `mtime` sorting comment in `extract-dvv-names.ts`, and tighten `eslint.config.js` for `scripts/**/*.ts` (`complexity <= 10`, `max-depth <= 3`, `max-params <= 3`). |

---

## 2. Active Milestone Specifications (v0.4.0)

### `[BUG-015]` Secondary Case Coverage for Geopolitical State Compounds
- **Priority**: P2 | **Affected Components**: `src/place/state-places.ts`, `tests/countries.test.ts`
- **Problem**: `inflectStateCompound()` and `inflectPluralIslandArchipelago()` return `null` for secondary cases (`adessive`, `ablative`, `allative`, `essive`, `translative`), causing fallback or missing inflection on state compounds.
- **Desired Behavior**: Support all 11 grammatical cases for plural archipelagos (*Filippiinit*) and state compounds (*Dominikaaninen tasavalta*, *Yhdistynyt kuningaskunta*) in `src/place/state-places.ts` without breaching bundle budgets.

### `[TEST-003]` 11-Case Paradigm Verification for Irregular & Algorithmic Places
- **Priority**: P2 | **Affected Components**: `tests/place.test.ts`
- **Problem**: Place tests primarily verify the spatial triad (`local`, `localFrom`, `localTo`) and `genitive`, leaving secondary cases under-tested across irregular and algorithmic paradigms.
- **Desired Behavior**: Assert all 11 grammatical cases in `tests/place.test.ts` across representative irregular, algorithmic, and state-compound toponyms.

### `[TASK-004]` Finnish Administrative & Historical Regions Support
- **Priority**: P1 | **Affected Components**: `src/place/`, `tests/fixtures/`, `tests/place.test.ts`
- **Problem**: Finnish regions (*maakunnat*, e.g. *Uusimaa* $\to$ *Uudellamaalla*, *Varsinais-Suomi* $\to$ *Varsinais-Suomessa*, *Pirkanmaa* $\to$ *Pirkanmaalla*) lack dedicated spatial/case coverage and benchmark fixtures.
- **Desired Behavior**: Provide 100% spatial (`local`, `localFrom`, `localTo`) and grammatical case accuracy across all 19 Finnish regions, with standalone fixture commitment before production changes.

### `[MAINT-007]` Decouple `build-municipalities-fixture.ts` from `src/` Imports
- **Priority**: P2 | **Affected Components**: `scripts/build-municipalities-fixture.ts`, `tests/fixtures/municipalities.json`
- **Problem**: `scripts/build-municipalities-fixture.ts` imports `src/` inflection code to generate `tests/fixtures/municipalities.json` (circular verification), uses `harmonize('ssä', clean)` at L238, and logs an absolute output path.
- **Desired Behavior**: Break the circular `src/` dependency (freeze the verified static fixture or generate independently), fix L238, add header TSDoc, and log relative paths only.

### `[SEC-003]` Security Regression Coverage for Algorithmic Place Resolvers & Demo Audit
- **Priority**: P2 | **Affected Components**: `tests/security.test.ts`, `demo/index.html`
- **Problem**: New algorithmic place resolvers in `v0.4.0` need adversarial trust verification, and `demo/index.html` DOM rendering has not been audited against XSS/HTML injection sinks.
- **Desired Behavior**: Add regression tests in `tests/security.test.ts` covering `[REFACTOR-001]`/`[OPT-001]`/`[TASK-004]` (`Object.hasOwn`, $O(N)$ scaling) and audit `demo/index.html` for safe text insertion.

### `[OPT-005]` Morphology & Subpath Footprint Compaction
- **Priority**: P2 | **Affected Components**: `src/morphology/nature-nouns.ts`, `src/morphology/assembler.ts`, `src/morphology/colon.ts`, `src/morphology/gradation.ts`, `src/morphology/compounds.ts`
- **Problem**: `taivuta/person` (`11.92 / 12.0 kB`, 82 B headroom) and `taivuta/preferences` (`9.44 / 10.0 kB`, 573 B headroom) sit close to their subpath limits and are not relieved by `[OPT-001]`.
- **Desired Behavior**: Compact default fields in `RAW_NATURE_NOUN_RULES` (preserving the exported `NATURE_NOUN_RULES` array shape), share `STANDARD_SUFFIXES` across `assembler.ts` and `colon.ts`, compact repeated stop-gradation regexes in `gradation.ts`, and replace static `INFLECTING_PREFIXES` maps in `compounds.ts` with `StemParadigm` + `assembleCase()` assembly to reclaim ~1.5–1.9 kB minified with zero API or linguistic regressions.

---

## 3. Icebox (P3: Future Explorations)

*No unscheduled icebox items currently.*
