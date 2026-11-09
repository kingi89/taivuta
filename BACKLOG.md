# taivuta Development Backlog

This backlog maintains prioritized technical, linguistic, and architectural tasks for the `taivuta` project.

---

## Prioritization Model (P0–P3)

- **P0: Critical Hotfix**: Security vulnerability, broken build/CI, bundle budget breach, or benchmark regression. Handled immediately.
- **P1: Milestone Essential**: Committed deliverable for the active milestone in [`ROADMAP.md`](ROADMAP.md). Blocks milestone release.
- **P2: Strategic Enhancement**: High-value feature or linguistic edge case scheduled for the upcoming milestone.
- **P3: Icebox**: Exploratory thoughts, experimental features, or non-urgent optimizations.

---

## 1. Active Queue (Milestone v0.3.0)

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[BUG-002]` | Given Name Disambiguation False Positives on Liquid-k Stems (*Marko*) | Linguistic | P1 | 1 increment |

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
- **Priority**: P2
- **Category**: Linguistic Accuracy / Preferences
- **Target Milestone**: v0.3.0
- **Affected Components**: `src/preferences/detect.ts`
- **Kotus Guideline**: Modern Finnish given names ending in liquid + *k* clusters (*Marko*, *Mirko*, *Arko*) resist consonant gradation ($rk \to r$) and are unambiguously unweakened (*Markon, Markolle*). While common nouns (*arka* $\to$ *aran*, *pelko* $\to$ *pelon*) undergo qualitative gradation, personal given names with *-rko/-lko* do not alternate.
- **Current Behavior**: `inflectPerson('Marko', 'genitive')` defaults correctly to `'Markon'`. However, `QUALITATIVE_GRADATION_REGEX` in `src/preferences/detect.ts` matches `[rl]k` stems, and because `Marko` does not end in *-ka/-kä*, `defaultChoiceId` evaluates to `'gradation'`. Consequently, `detectNameDisambiguation('Marko')` falsely marks the name as ambiguous and suggests `'Maron'` and `'Marolle'` as the default choices.
- **Target Behavior**: Detect *Marko* (and similar non-alternating liquid-*k* given names) as unambiguous (`isAmbiguous: false`), or ensure default choice is `'no-gradation'` (*Markon, Markolle*).
- **Acceptance Criteria**:
  - `isAmbiguousName('Marko') === false`
  - `detectNameDisambiguation('Marko').isAmbiguous === false`

---

## 3. Icebox (P3: Future Explorations)

- **[ICE-001] Bulk Execution Performance Suite**: Author benchmark testing execution speed and allocation pressure over 100,000 name iterations.
- **[ICE-002] Foreign Given Names and Surnames Ending in -tti**:
  - **Category**: Linguistic Accuracy
  - **Context**: Decoupled from `[TASK-002]` to safeguard native Finnish names ending in *-tti* (*Matti*, *Antti*, *Pentti*, *Martti*, *Nuutti*, *Taavetti*, *Aaretti*, *Tytti*), which strictly undergo quantitative gradation ($tt \to t$: *Matin*, *Antin*, *Taavetin*).
  - **Kotus Guideline**: Foreign surnames ending in *-i* generally resist consonant gradation (*Donizetti : Donizettin, Pavarotti : Pavarottin*), while rare foreign-derived given names (*Anetti*, *Lotti*, *Betti*) may alternate between assimilated Finnish gradation and foreign spelling preservation.
  - **Goal**: Research and design safe heuristics or curated registries to support foreign *-tti* names without introducing false-positive ambiguity detection for core native Finnish names.
