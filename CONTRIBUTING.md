# Contributing to taivuta

Thank you for your interest in contributing to `taivuta`! This document outlines our development workflow, quality gates, and code governance policies.

---

## 1. Development Prerequisites & Setup

- **Node.js**: `v22.0.0` or later for development and testing (native `--experimental-strip-types` and `node:test` coverage are required; the published package targets ES2022 / Node.js `>=18.0.0`, verified via `npm run verify:runtime`).
- **Package Manager**: `npm`.
- **Zero Runtime Dependencies**: The package must maintain `dependencies: {}`. All functionality must be implemented using pure TypeScript/JavaScript and Node.js standard built-ins.

```bash
# Clone the repository
git clone https://github.com/kingi89/taivuta.git
cd taivuta

# Install developer dependencies
npm install

# Run the full quality suite
npm run check

# Preview the interactive browser demo locally at http://127.0.0.1:3000 (optional PORT override)
npm run build && npm run demo
```

---

## 2. Quality Gates (Non-Negotiable)

Every contribution must pass all 7 automated quality gates before being merged:

```bash
npm run check
```

The check script executes:
1. `npm run typecheck`: Strict TypeScript check (`tsc --noEmit`) with 0 errors.
2. `npm run lint`: ESLint with `--max-warnings 0`. Rules enforced:
   - Cyclomatic Complexity: `complexity <= 10` per function.
   - Nesting Depth: `max-depth <= 3`.
   - Function Length: `max-lines-per-function <= 50` (excluding comments and blanks).
   - File Length: `max-lines <= 250` (excluding datasets and test fixtures).
   - Parameters: `max-params <= 3`.
3. `npm run build`: Clean dual ESM (`.mjs`), CommonJS (`.cjs`), and declaration map (`.d.ts`) bundles.
4. `npm test`: Native test runner (`node:test`) with 100% passing tests.
5. `npm run test:coverage`: High-watermark code coverage thresholds:
   - Line Coverage: $\ge 95\%$
   - Branch Coverage: $\ge 90\%$
   - Function Coverage: $\ge 95\%$
6. `npm run verify:bundle`: Automated assertion of subpath bundle size limits and zero dataset leaks.
7. `npm run verify:runtime`: Compiled ESM & CJS subpath smoke verification (Node `>=18.0.0` compatible).

---

## 3. API Evolution & Deprecation Policy

When evolving the library's public API, contributors must follow this strict deprecation protocol to preserve stability for downstream users:

### A. TSDoc `@deprecated` Annotation
Every deprecated function, type, or option must be documented with `@deprecated` explaining the reason and explicit replacement:
```typescript
/**
 * @deprecated Since v0.2.0. Use `getPersonParadigm()` instead. Will be removed in v1.0.0.
 */
export function legacyFunction(): void { ... }
```

### B. Non-Production Runtime Warnings
If a runtime warning is warranted, it must **never** degrade performance or pollute logs in production environments. Wrap warnings with an environment check and emit each warning at most once:
```typescript
let hasWarned = false;

export function deprecatedHelper(): void {
  if (process.env.NODE_ENV !== 'production' && !hasWarned) {
    console.warn('[taivuta] deprecatedHelper() is deprecated and will be removed in the next major version. Use newHelper() instead.');
    hasWarned = true;
  }
  return newHelper();
}
```

### C. Grace Period
- **In `0.x` Releases**: A deprecated API must remain fully functional for at least **one minor version** (e.g. deprecated in `0.2.0`, removable at the earliest in `0.3.0`).
- **In `1.x` and Later**: A deprecated API must remain fully functional until the **next major release** (e.g. deprecated in `1.2.0`, removable only in `2.0.0`).

### D. Changelog Documentation
All deprecations must be recorded under the `### Deprecated` section of `CHANGELOG.md` upon introduction, and under `### Removed` when subsequently retired.

---

## 4. Git Conventions & Pull Requests

- **Branching**: Branch off `main` using descriptive names (e.g. `feat/new-nature-noun`, `fix/gradation-edge-case`).
- **Conventional Commits**: Commit messages must adhere to the Conventional Commits specification:
  - `feat(scope): ...` for new features
  - `fix(scope): ...` for bug fixes
  - `refactor(scope): ...` for internal structural improvements
  - `test(scope): ...` for test additions
  - `docs: ...` for documentation updates
- **PR Submission**: Ensure `npm run check` passes locally before submitting your Pull Request.

---

## 5. Prioritization Matrix & Milestone Governance

Work on `taivuta` is triaged against our five core project pillars (linguistic accuracy, zero-runtime-dependency footprint, developer ergonomics, maintainability, and supply-chain security):

### A. Priority Matrix (P0–P3)
- **P0 (Critical Hotfix)**: Security vulnerabilities, CI or build breakages, and benchmark regressions. Addressed immediately.
- **P1 (Milestone Essential)**: Core features committed to the active milestone in [`ROADMAP.md`](ROADMAP.md) and consumer bugs affecting common names.
- **P2 (Strategic Enhancement)**: High-value linguistic edge cases, tree-shaking optimizations, and benchmark extensions.
- **P3 (Icebox)**: Exploratory tasks, speculative features, or low return-on-effort ideas.

### B. Milestone Assessment Protocol
Roadmap milestones are assessed at every **Minor release boundary** (e.g. v0.1 $\to$ v0.2) via a 3-step review:
1. **Deliverable Audit**: Confirm all checklist deliverables in `ROADMAP.md` and bundle budgets held green.
2. **Backlog Harvest**: Promote candidate P2 tasks in `BACKLOG.md` to P1 for the upcoming release.
3. **Horizon Adjustment**: Set scope boundaries for the next milestone horizon (typically 2–4 targeted increments).

---

## 6. Secure & Defensive Engineering Standards

All code changes and releases must uphold the consumer trust guarantees in [`SECURITY.md`](SECURITY.md):

- **Safe Dynamic Lookups**: Never index plain objects with untrusted or dynamic keys without `Object.hasOwn()`; prefer `Map`, `Set`, or `Object.create(null)`.
- **Bounded Resources & Linear Time**: Avoid ReDoS-prone regexes and unbounded recursion on caller-controlled delimiters; maintain $O(N)$ scaling up to the `1,000,000`-character proper-noun ceiling (keeping `format()` templates unbounded).
- **Non-Throwing Boundaries & Trimming**: Guard all public entry points against malformed JavaScript inputs (`null`, `undefined`, non-strings, invalid cases/options) and return safe fallbacks without mutating caller inputs; keep proper-noun whitespace trimming consistent.
- **Character Integrity & Special Characters**: Never implicitly escape or unescape caller strings; keep template interpolation single-pass; treat synthesized punctuation carefully (emit typographic `’` `U+2019` instead of ASCII `'`, and document synthesized `:` behavior).
- **Adversarial Test Coupling**: Any change to public entry points, parsers, templates, lookup tables, or regexes must include regression tests in `tests/security.test.ts`.
- **Release Trust Checklist**: Before publishing, verify green `npm run check` (including `tests/security.test.ts`, bundle isolation, runtime verification, and version parity), review `npm audit`, inspect `npm pack --dry-run`, verify `SECURITY.md` supported versions, and record security fixes under `### Security` in `CHANGELOG.md`.
