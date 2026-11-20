# Security Policy

**`taivuta`** is a zero-dependency Finnish proper noun inflection library designed to remain safe, predictable, and resource-bounded when processing untrusted user input.

---

## Consumer Trust Guarantees

1. **"Just works" unless truly unreasonable**: Handles everyday and unusual proper nouns predictably, and explicitly documents all unreasonable boundaries (see [Input Boundaries & Resource Limits](#input-boundaries--resource-limits)).
2. **Never exploits or exposes consumer vulnerabilities**: While `taivuta` does not sanitize or fix vulnerabilities in the calling application, it never exploits or amplifies them. For example, inflecting `"<a>"` never escapes HTML (`<a>:ssa`), and inflecting `"&lt;a&gt;"` never unescapes it (`&lt;a&gt;:ssa`). Special care is taken whenever introducing, altering, or removing syntactically sensitive punctuation, template interpolation is strictly single-pass, and `Object.prototype` or internal metadata keys are never leaked.
3. **Proportional, bounded resource usage**: Runs in linear $O(N)$ time with memory proportional to input length—no catastrophic backtracking (ReDoS), no unbounded recursion on repeated prefixes or trailing punctuation, and no infinite suffix loops (e.g. inflecting `":ssa"` returns `":ssassa"` rather than looping indefinitely).
4. **Graceful error handling — never crashes the calling app**: Every public API validates runtime inputs and options and returns safe fallbacks (the input unchanged, `''`, or a documented default) without throwing unhandled exceptions (e.g. invalid options or `null` inputs do not throw).
5. **Boring, containing no surprises**: Pure, non-mutating, zero-runtime-dependency functions (`dependencies: {}`) with consistent whitespace trimming and well-documented edge-case behavior.
6. **Trustworthy releases**: Releases are never knowingly published in breach of these guarantees. Every release passes type checking, zero-warning linting, dual ESM/CJS builds, unit and adversarial regression tests (`tests/security.test.ts`), high-watermark coverage thresholds, subpath bundle isolation, compiled ESM/CJS runtime checks across supported Node versions, version parity verification, `npm audit` review, and `npm pack --dry-run` inspection.
7. **Easy, transparent, proportionate vulnerability handling**: Externally discovered trust or security issues can be reported privately with minimal friction, are communicated transparently, and are remediated proportionately.

---

## Security Boundary & Shared Responsibility

### What `taivuta` Is Responsible For (In Scope)
- **Raw character integrity**: Preserves caller characters verbatim without implicit HTML/SQL escaping (`inflect('<a>', 'inessive')` $\to$ `'<a>:ssa'`) or unescaping (`inflect('&lt;a&gt;', 'inessive')` $\to$ `'&lt;a&gt;:ssa'`).
- **Single-pass template evaluation**: `format()` and `t` substitute variables in a single pass and never re-evaluate `{$...}` tokens inside substituted values.
- **Careful punctuation synthesis**: Only appends Finnish letters, Kotus typographic apostrophes (**`’`**, `U+2019`) rather than ASCII `'` (`U+0027`), and ASCII colons (**`:`**, `U+003A`) for acronyms, abbreviations, digits/symbols, vowel-less tokens, and `{ colon: true }`.
- **Safe runtime behavior**: Prevents `Object.prototype` and internal metadata lookups, avoids mutating inputs or global objects, returns non-throwing fallbacks, and maintains $O(N)$ time up to `1,000,000` characters.

### What the Consumer Is Responsible For (Out of Scope)
- **Encode-After-Inflect**: `taivuta` outputs plain Unicode text—never HTML, SQL, shell commands, or validated URLs. Calling applications **must** apply context-appropriate escaping (`textContent`, template auto-escaping), SQL parameterization, or URL validation **after** calling `taivuta`, never before.
- Vulnerabilities caused by unescaped downstream sinks, pre-inflection-only filtering, inputs exceeding `1,000,000` characters (returned unchanged by design), or `devDependencies`-only advisories not shipped in the published zero-dependency package are out of scope as `taivuta` vulnerabilities.

### Concrete Boundary Examples

- **Raw HTML Sink / XSS (Consumer Responsibility)**:
  ```js
  const unsafe = '<img src=x onerror=alert(1)>';
  const label = inflect(unsafe, 'elative'); // "<img src=x onerror=alert(1)>:sta" (verbatim by design)

  // UNSAFE (consumer bug): raw HTML sink without post-inflection encoding
  el.innerHTML = `<p>${label}</p>`;

  // SAFE: use DOM text APIs or HTML-escape after inflection
  el.textContent = label;
  ```
- **Unvalidated URL Sink & Synthesized Colon `:` (Consumer Responsibility)**:
  ```js
  inflect('https', 'genitive');                       // "https:n" (vowel-less token auto-colon)
  inflect('ftp', 'genitive');                         // "ftp:n"
  inflect('javascript', 'genitive', { colon: true }); // "javascript:n" (contains vowels; no auto-colon by default)
  ```
  `':'` (`U+003A`) is inert in HTML text, attributes such as `title`, SQL strings, and JS string literals, but can create a `scheme:` prefix if interpolated into an unvalidated `href` or `src` attribute. Do not inflect URLs directly; validate against an explicit scheme allowlist (`https:`, `mailto:`) or construct them via `new URL(...)` **after** inflection.
- **Typographic Apostrophe `’` (`U+2019`) vs. ASCII `'` (`U+0027`) (Defense-in-Depth, Not Sink Encoding)**:
  Silent-final foreign names (*Kaj*, *Bordeaux*, *Dumas*) intentionally synthesize **`’` (`U+2019`)** (`Kaj’n`, `Bordeaux’ssa`, `Dumas’n`) per Finnish orthography (Kotus *Heittomerkki*), avoiding introducing an ASCII single quote into clean letter-only inputs (e.g. `<button title='Kaj’n'>`). However, concatenating untrusted text into `<button title='...'>` without post-inflection escaping remains a consumer bug because attackers can still pass `'` directly in the input.

---

## Input Boundaries & Resource Limits

- **Proper-Noun Length Ceiling (`1,000,000` characters)**: Proper nouns exceeding `1,000,000` UTF-16 code units are treated as unreasonable and returned unchanged (detection helpers return safe defaults: `'in'`, `'person'`, `null`, or `false`). Template strings passed to `format()` remain unbounded in length, while each substituted value still enforces the `1,000,000`-character proper-noun ceiling.
- **Primitive `string` Contract**: Inflection and detection entry points accept primitive `string` values only and do not coerce objects via `.toString()` (including boxed `new String(...)`). `format()` and `t` intentionally accept finite numbers alongside primitive strings.
- **Consistent Whitespace Trimming**: Proper-noun entry points consistently trim leading and trailing whitespace (`'  Helsinki  '` $\to$ `'Helsingissä'`), whereas `format()` and `t` preserve outer template whitespace.

---

## Supported Versions

**Only the latest published release receives security fixes; earlier releases do not receive backports.**

| Version | Supported |
| :--- | :--- |
| Latest release | ✅ Yes — receives security fixes (no backports) |
| All earlier releases | ❌ No — upgrade to the latest release |

- **Consumer Runtime Floor**: Node.js `>=18.0.0` (verified in CI on `18.x`, `22.x`, and `24.x`) and ES2022 browsers.
- **Contributor / Test Environment**: Node.js `>=22.0.0` is required locally to run `--experimental-strip-types` and the native coverage suite.

---

## Reporting a Vulnerability

- **Primary Channel**: Submit a private report via [GitHub Private Vulnerability Reporting](https://github.com/kingi89/taivuta/security/advisories/new).
- **Fallback Email**: [`taivuta.maintainers@kingi89.fi`](mailto:taivuta.maintainers@kingi89.fi).

When reporting an issue, please include the `taivuta` version, a minimal reproduction snippet or input, expected vs. actual behavior, and an assessment of potential consumer impact.

### Response & Severity / Remediation Policy

`taivuta` is volunteer-maintained; reports are triaged on a best-effort basis with **no fixed acknowledgment or patch SLA**.

| Tier | Trigger (Maintainer-Assessed, CVSS v3.1 Reference) | Remediation Action |
| :--- | :--- | :--- |
| **Hardening / Low** | Defense-in-depth improvements or low-impact edge cases (**CVSS < 4.0**) | Patch release + `### Security` entry in [`CHANGELOG.md`](CHANGELOG.md) and GitHub Release notes |
| **Moderate+** | Confirmed in-scope library vulnerabilities (**CVSS ≥ 4.0**), e.g. reproducible DoS (ReDoS, unbounded recursion, memory exhaustion) within the `1,000,000`-char ceiling, `Object.prototype` leakage, unhandled runtime crashes on malformed inputs, template re-evaluation, or unexpected synthesis of HTML/SQL/JS syntax delimiters (`'`, `"`, `<`, `>`, `&`, `\`) | Patch release + **GitHub Security Advisory (GHSA)** + `### Security` in [`CHANGELOG.md`](CHANGELOG.md) |
| **High / Critical** | Severe in-scope vulnerabilities (**CVSS ≥ 7.0**) or supply-chain compromise, e.g. easily triggered DoS on small/typical untrusted inputs, prototype pollution (mutating global prototypes), code execution, or compromised release artifacts | Patch release + **GHSA** + **`npm deprecate`** on affected versions |

- Final severity classification rests with the maintainers based on realistic library threat models; `devDependencies`-only advisories not shipped in the published package are out of scope for GHSAs.
