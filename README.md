# taivuta

> Finnish proper noun inflection and local case detection library for Node.js and browsers.

[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Zero Runtime Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

## Overview

When localizing applications into Finnish, inserting proper nouns into templates frequently results in awkward or unidiomatic phrasing to avoid grammatical inflection (e.g. *"Käyttäjällä Erkki on tänään syntymäpäivä"* or *"Matkusta kohteeseen Tampere"*). 

**`taivuta`** allows generating native-sounding Finnish messages (*"Tänään on Erkin syntymäpäivä"*, *"Matkusta Tampereelle"* or *"Turkuun"*) by automatically handling Finnish nominal morphology, consonant gradation (*astevaihtelu*), and local case detection (*sisä-* vs *ulkopaikallissijat*).

### Key Features (In Development)

- **Zero Runtime Dependencies**: Published package contains zero external dependencies and maintains a small bundle footprint (<25 kB).
- **Place Name Inflection & Local Case Detection**: Automatically determines whether a place uses internal local cases (*Turussa*) or external local cases (*Tampereella*) with 100% accuracy on all 309 Finnish municipalities.
- **Person Name Inflection**: Handles consonant gradation (*k/p/t*), vowel harmony, and suffix classes for Finnish and foreign given names and surnames.
- **Template Engine**: Formats strings using expressive syntax (e.g. `{$name|genitive|person}`) or tagged template literals.
- **Dual Module Output**: First-class ESM (`.mjs`) and CommonJS (`.cjs`) builds with complete TypeScript declarations.

---

## Getting Started

### Installation

```bash
npm install taivuta
```

*(Note: Currently in early development — Milestone 1)*

### Quick Example

```typescript
import { getStatus, VERSION } from 'taivuta';

console.log(VERSION); // "0.1.0"
console.log(getStatus()); // { name: "taivuta", version: "0.1.0", ready: true }
```

---

## Development

```bash
# Build dual ESM/CJS bundles and declaration maps
npm run build

# Run unit tests
npm test

# Run test coverage with V8
npm run test:coverage

# Run TypeScript typecheck
npm run typecheck

# Run linter
npm run lint
```

---

## License

BSD-3-Clause. Data derived from Kotus and Maanmittauslaitos open datasets are used in accordance with CC-BY 4.0.
