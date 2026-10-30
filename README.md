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
- **Template Engine**: Formats strings using expressive syntax (`{$name:case[:role]}`) or tagged template literals (`t`).
- **Dual Module Output**: First-class ESM (`.mjs`) and CommonJS (`.cjs`) builds with complete TypeScript declarations.

---

## Getting Started

### Installation

```bash
npm install taivuta
```

*(Note: Currently in early development — Milestone 3: Person Name Inflection)*

### Quick Example

```typescript
import { inflect, inflectPlace, inflectPerson, format, t } from 'taivuta';

// 1. Unified Inflection API
inflect('Erkki', 'genitive');                  // "Erkin"
inflect('Virtanen', 'partitive');              // "Virtasta"
inflect('Tampere', 'local');                   // "Tampereella"
inflect('Helsinki', 'localTo');                // "Helsinkiin"

// 2. String Template Formatting
format('Tänään on {$user:genitive} syntymäpäivä!', { user: 'Erkki' });
// "Tänään on Erkin syntymäpäivä!"

format('Tervetuloa {$city:localTo}!', { city: 'Tampere' });
// "Tervetuloa Tampereelle!"

format('Tervetuloa {$city:localTo}!', { city: 'Helsinki' });
// "Tervetuloa Helsinkiin!"

// 3. Tagged Template Literals
const user = 'Liisa';
const city = 'Rovaniemi';
t`Onnea ${[user, 'genitive']} päivänä! Terveisiä ${[city, 'localFrom']}!`;
// "Onnea Liisan päivänä! Terveisiä Rovaniemeltä!"

// 4. Place Names & 100% Municipality Accuracy
inflectPlace('Turku', 'local');                // "Turussa"
inflectPlace('Tampere', 'local');              // "Tampereella"
inflectPlace('Tampere', 'localTo');            // "Tampereelle"
inflectPlace('Kauniainen', 'genitive');        // "Kauniaisten"

// 5. Person Names & Morphological Roles
inflectPerson('Matti', 'genitive');            // "Matin"
inflectPerson('Tuomas', 'illative');           // "Tuomakseen"
inflectPerson('John', 'allative');             // "Johnille"
inflectPerson('Bordeaux', 'inessive');         // "Bordeaux'ssa"
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
