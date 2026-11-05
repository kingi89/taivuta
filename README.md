# taivuta

> Finnish proper noun inflection and local case detection library for Node.js and browsers.

[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Zero Runtime Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

## Overview

When localizing applications into Finnish, inserting proper nouns into templates frequently results in awkward or unidiomatic phrasing to avoid grammatical inflection (e.g. *"Käyttäjällä Erkki on tänään syntymäpäivä"* or *"Matkusta kohteeseen Tampere"*). 

**`taivuta`** generates native-sounding Finnish messages (*"Tänään on Erkin syntymäpäivä"*, *"Matkusta Tampereelle"* or *"Turkuun"*) by automatically handling Finnish nominal morphology, consonant gradation (*astevaihtelu*), and local case detection (*sisä-* vs *ulkopaikallissijat*).

### Key Features

- **Zero Runtime Dependencies**: Published package contains zero external dependencies (`dependencies: {}`).
- **Modular Subpath Architecture**: Import only what you need (`taivuta/person`, `taivuta/place`, `taivuta/template`, `taivuta/morphology`) to keep bundle footprints minimal.
- **Place Name Inflection & Local Case Detection**: Automatically determines whether a place uses internal local cases (*Turussa*) or external local cases (*Tampereella*), covering all official Finnish municipalities and geographic toponyms.
- **Person Name Inflection**: Handles consonant gradation (*k/p/t*), vowel harmony, *s*-stems, *-nen* surnames, nature noun surnames, and foreign names.
- **Template Engine**: Formats strings using expressive syntax (`{$name:case[:role]}`) or tagged template literals (`` t`...` ``), with an isolated factory (`createTemplateEngine`) for zero-dataset custom builds.
- **Dual Module Output**: First-class ESM (`.mjs`) and CommonJS (`.cjs`) builds with TypeScript declaration maps (`.d.ts`).

---

## Installation

```bash
npm install taivuta
```

---

## Quickstart

### 1. Unified Inflection & Templates

```typescript
import { inflect, format, t } from 'taivuta';

// Automatic role detection (person vs. place)
inflect('Erkki', 'genitive');                  // "Erkin"
inflect('Virtanen', 'partitive');              // "Virtasta"
inflect('Tampere', 'local');                   // "Tampereella"
inflect('Helsinki', 'localTo');                // "Helsinkiin"

// Template string formatting
format('Tänään on {$user:genitive} syntymäpäivä!', { user: 'Erkki' });
// "Tänään on Erkin syntymäpäivä!"

format('Tervetuloa {$city:localTo}!', { city: 'Tampere' });
// "Tervetuloa Tampereelle!"

// Tagged template literals
const user = 'Liisa';
const city = 'Rovaniemi';
t`Onnea ${[user, 'genitive']} päivänä! Terveisiä ${[city, 'localFrom']}!`;
// "Onnea Liisan päivänä! Terveisiä Rovaniemeltä!"
```

### 2. Modular Subpaths

For bundle-constrained applications, import dedicated subpaths directly:

```typescript
// Person names only (omits municipality dataset, < 12 kB budget)
import { inflectPerson } from 'taivuta/person';
inflectPerson('Matti', 'genitive');            // "Matin"
inflectPerson('Tuomas', 'illative');           // "Tuomakseen"

// Place names and local cases (< 25 kB budget)
import { inflectPlace, detectLocalCase } from 'taivuta/place';
detectLocalCase('Tampere');                    // "on"  (Tampereella)
inflectPlace('Turku', 'local');                // "Turussa"

// Featherweight template engine bound to a custom inflector (< 2 kB budget)
import { createTemplateEngine } from 'taivuta/template';
const { format: formatPerson } = createTemplateEngine(inflectPerson);
formatPerson('Hei {$name:allative}!', { name: 'Satu' }); // "Hei Sadulle!"
```

For advanced morphology primitives (`weakenConsonants`, `StemParadigm`, `assembleCase`), see [Architecture & Design Principles](ARCHITECTURE.md).

---

## Modular Subpaths Overview

| Subpath | Primary Use Case | Bundle Budget |
| :--- | :--- | :--- |
| `taivuta` | Full library with auto role detection & templates | < 30 kB |
| `taivuta/person` | Given names, surnames, foreign names | < 12 kB |
| `taivuta/place` | Municipalities, countries, toponyms & local cases | < 25 kB |
| `taivuta/template` | Featherweight tagged template & string formatter | < 2 kB |
| `taivuta/morphology` | Low-level phonology, gradation & stem paradigms | < 12 kB |

See [ARCHITECTURE.md](ARCHITECTURE.md) for full module boundaries and trade-offs.

---

## Documentation & Guides

- [Architecture & Design Principles](ARCHITECTURE.md): Deep dive into the `StemParadigm` morphological engine, consonant gradation anchoring, and modular bundle boundaries.
- [Contributing Guide](CONTRIBUTING.md): Development environment setup, quality gates, and pull request conventions.
- [Changelog](CHANGELOG.md): Detailed release history adhering to Keep a Changelog.
- [Attribution & Sources](ATTRIBUTION.md): Citations and licenses for linguistic open data sources.
- [Authors](AUTHORS): Maintainers and contributors.

---

## Versioning & Stability

`taivuta` strictly adheres to [Semantic Versioning 2.0.0](https://semver.org/).

### Deprecation Policy
- Deprecated APIs will remain functional for at least one minor release cycle during `0.y.z` development, and until the next major version after `1.0.0`.
- Deprecated methods emit runtime warnings strictly in non-production environments (`process.env.NODE_ENV !== 'production'`) to keep production builds lean and silent.
- For complete details, see our [API Evolution & Deprecation Policy](CONTRIBUTING.md#api-evolution--deprecation-policy).

---

## Development

```bash
# Run all quality gates and bundle verifications
npm run check
```

---

## License

BSD-3-Clause. Certain linguistic datasets and benchmarks are derived from open data sources licensed under CC-BY 4.0; see [ATTRIBUTION.md](ATTRIBUTION.md) for source details and attributions.
