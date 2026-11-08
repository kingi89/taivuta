# taivuta Development Backlog

This backlog maintains prioritized technical, linguistic, and architectural tasks for the `taivuta` project.

---

## Prioritization Model (P0–P3)

- **P0: Critical Hotfix**: Security vulnerability, broken build/CI, bundle budget breach, or benchmark regression. Handled immediately.
- **P1: Milestone Essential**: Committed deliverable for the active milestone in [`ROADMAP.md`](ROADMAP.md). Blocks milestone release.
- **P2: Strategic Enhancement**: High-value feature or linguistic edge case scheduled for the upcoming milestone.
- **P3: Icebox**: Exploratory thoughts, experimental features, or non-urgent optimizations.

---

## 1. Active Queue (Milestone v0.2.0)

| ID | Title | Category | Priority | Est. Scope |
| :--- | :--- | :--- | :--- | :--- |
| `[TASK-001]` | Kotus Type 9 Intervocalic Single-k Loss (*Taika*) | Linguistic | P2 | ✅ Completed |
| `[TASK-003]` | Single-Letter Proper Noun & Acronym Inflection | Linguistic | P1 | 1 increment |
| `[TASK-002]` | Foreign Feminine -tte Quantitative Gradation (*Janette*) | Linguistic | P2 | 1 increment |
| `[BUG-001]` | GitHub Pages Demo First Two Tabs Malfunctioning | Web Demo | P2 | ✅ Completed |

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

### [TASK-002] Foreign Feminine -tte Quantitative Gradation
- **Priority**: P2
- **Category**: Linguistic Accuracy
- **Target Milestone**: v0.2.0
- **Affected Components**: `src/morphology/gradation.ts`, `src/preferences/detect.ts`
- **Kotus Guideline**: Foreign feminine names ending in *-tte/-tti* (*Janette, Bernadette, Juliette*) alternate between standard Finnish quantitative gradation ($tt \to t$: *Janetelle, Janeten*) and foreign spelling/sound preservation ($tt \to tt$: *Janettelle, Janetten*).
- **Current Behavior**: Geminate stop shortening ($tt \to t$) is applied universally; names are marked unambiguous.
- **Target Behavior**: Detect *-tte/-tti* foreign names as ambiguous; provide options for standard Finnish gradation vs. foreign spelling preservation.
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

---

## 3. Icebox (P3: Future Explorations)

- **[ICE-001] Bulk Execution Performance Suite**: Author benchmark testing execution speed and allocation pressure over 100,000 name iterations.
