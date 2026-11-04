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
- **Place Name Inflection & Local Case Detection**: Automatically determines whether a place uses internal local cases (*Turussa*) or external local cases (*Tampereella*) with 100% verified accuracy across all official Finnish municipalities.
- **Person Name Inflection**: Handles consonant gradation (*k/p/t*), vowel harmony, *s*-stems, *-nen* surnames, nature noun surnames, and foreign names with $\ge 95\%$ accuracy on official DVV benchmarks.
- **Template Engine**: Formats strings using expressive syntax (`{$name:case[:role]}`) or tagged template literals (`` t`...` ``), with an isolated factory (`createTemplateEngine`) for zero-dataset custom builds.
- **Dual Module Output**: First-class ESM (`.mjs`) and CommonJS (`.cjs`) builds with TypeScript declaration maps (`.d.ts`).

---

## Installation

```bash
npm install taivuta
```

---

## Modular Subpaths & Configuration Guide

To avoid bundle bloat, `taivuta` provides dedicated subpath exports. Choose the configuration that best matches your application:

| Configuration / Subpath | Primary Use Case | What It Includes | What It Excludes | Trade-offs |
| :--- | :--- | :--- | :--- | :--- |
| **Full `taivuta`** | General web apps, blogs, full e-commerce | Auto role detection, 308 municipalities, countries, full templates | None | Largest bundle; easiest setup with automatic name/place detection. |
| **`taivuta/person`** | CRMs, user profiles, auth, notifications | First/last names, foreign names, hyphenated names, nature surnames | Municipalities, places, countries | Omits place names; local cases on places will not inflect with municipal accuracy. |
| **`taivuta/place`** | Delivery, logistics, real estate, travel, maps | 308 municipalities (100% accuracy), countries, toponyms | Personal name heuristics, templates | Excludes person-specific rules (e.g. given name gradation resistance). |
| **`taivuta/template` + `person`** | Chatbots, user email templates, profile UI | Tagged templates `t`, `format()`, person inflection | Municipality dataset, country lists | Featherweight templating for user-facing text without geospatial data. |
| **`taivuta/morphology`** | Custom NLP tools, search stems, grammar aids | Phonology, gradation, stem analysis, paradigms, colon suffixation | High-level person/place registries | Low-level primitives; requires manual paradigm assembly. |

---

## Usage Examples

### 1. Full Library (Unified API)

For general applications that need automatic detection between person and place names, full template interpolation, and all 308 Finnish municipalities:

```typescript
import { inflect, format, t } from 'taivuta';

// Automatic role detection
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

### 2. Person Names Only (`taivuta/person`)

For user profiles, authentication, greetings, and CRM applications that only deal with human names. Excludes the municipality dataset:

```typescript
import { inflectPerson, getPersonParadigm } from 'taivuta/person';

// Given names and surnames
inflectPerson('Matti', 'genitive');            // "Matin"
inflectPerson('Virtanen', 'partitive');        // "Virtasta"
inflectPerson('Tuomas', 'illative');           // "Tuomakseen"
inflectPerson('Marja-Liisa', 'allative');      // "Marja-Liisalle"

// Foreign names and orthography
inflectPerson('John', 'allative');             // "Johnille"
inflectPerson('Bordeaux', 'inessive');         // "Bordeaux'ssa"

// Direct morphological paradigm inspection
const paradigm = getPersonParadigm('Kerttu');
// { strongVocalicStem: "Kerttu", weakVocalicStem: "Kertu", partitive: "Kerttua", illative: "Kerttuun", ... }
```

### 3. Place Names & Toponyms Only (`taivuta/place`)

For logistics, delivery, real estate, weather, and travel applications requiring 100% linguistic accuracy for Finnish local cases (*sisä-* vs *ulkopaikallissijat*):

```typescript
import { inflectPlace, detectLocalCase } from 'taivuta/place';

// 100% verified municipality accuracy
detectLocalCase('Helsinki');                   // "in"  (Helsingissä)
detectLocalCase('Tampere');                    // "on"  (Tampereella)
detectLocalCase('Rovaniemi');                  // "on"  (Rovaniemellä)

// Contextual local cases: 'local' (missä), 'localFrom' (mistä), 'localTo' (mihin)
inflectPlace('Turku', 'local');                // "Turussa"
inflectPlace('Tampere', 'local');              // "Tampereella"
inflectPlace('Tampere', 'localTo');            // "Tampereelle"
inflectPlace('Helsinki', 'localTo');           // "Helsinkiin"
inflectPlace('Kauniainen', 'genitive');        // "Kauniaisten"
```

### 4. Lightweight Templating (`taivuta/template` + `taivuta/person`)

For localized email notifications, chatbots, or UI text that only needs person name inflection without bundling the municipality dataset:

```typescript
import { inflectPerson } from 'taivuta/person';
import { createTemplateEngine } from 'taivuta/template';

// Create a featherweight template engine bound only to the person inflector
const { format, t } = createTemplateEngine(inflectPerson);

format('Onnea {$name:allative}!', { name: 'Matti' });
// "Onnea Matille!"

const user = 'Pekka';
t`Terveisiä ${[user, 'ablative']}!`;
// "Terveisiä Pekalta!"
```

### 5. Morphology & Linguistic Primitives (`taivuta/morphology`)

For NLP pipelines, search indexing, and linguistic tools needing low-level phonology and stem analysis:

```typescript
import {
  getVowelHarmony,
  harmonize,
  weakenConsonants,
  analyzeStem,
  createStemParadigm,
  assembleCase
} from 'taivuta/morphology';

// Phonology and consonant gradation
getVowelHarmony('Väinö');                      // "front"
harmonize('ssa', 'Väinö');                     // "ssä"
weakenConsonants('Kerttu');                    // "Kertu"

// Canonical paradigm assembly
const paradigm = createStemParadigm('Matti', {
  strong: 'Matti',
  weak: 'Mati',
  partitive: 'Mattia',
  illative: 'Mattiin'
});
assembleCase(paradigm, 'genitive');            // "Matin"
assembleCase(paradigm, 'adessive');            // "Matilla"
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
