/**
 * Automated bundle size and modular subpath isolation verification script.
 *
 * Verifies that each compiled subpath in dist/:
 * 1. Remains strictly within its designated size footprint budget.
 * 2. Contains zero upward or unintended dataset dependency leaks.
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface BundleSpec {
  readonly name: string;
  readonly file: string;
  readonly maxMinifiedKb: number;
  readonly forbiddenStrings?: readonly string[];
}

const BUNDLE_SPECS: readonly BundleSpec[] = [
  {
    name: 'taivuta (root)',
    file: 'dist/index.mjs',
    maxMinifiedKb: 30.0
  },
  {
    name: 'taivuta/person',
    file: 'dist/person/index.mjs',
    maxMinifiedKb: 12.0,
    forbiddenStrings: ['EXTERNAL_CASE_MUNICIPALITIES', 'Pedersören kunta']
  },
  {
    name: 'taivuta/place',
    file: 'dist/place/index.mjs',
    maxMinifiedKb: 25.0
  },
  {
    name: 'taivuta/morphology',
    file: 'dist/morphology/index.mjs',
    maxMinifiedKb: 12.0,
    forbiddenStrings: ['EXTERNAL_CASE_MUNICIPALITIES', 'Pedersören kunta']
  },
  {
    name: 'taivuta/template',
    file: 'dist/template/index.mjs',
    maxMinifiedKb: 2.0,
    forbiddenStrings: [
      'EXTERNAL_CASE_MUNICIPALITIES',
      'Pedersören kunta',
      'inflectPerson',
      'inflectPlace'
    ]
  },
  {
    name: 'taivuta/preferences',
    file: 'dist/preferences/index.mjs',
    maxMinifiedKb: 15.0,
    forbiddenStrings: ['EXTERNAL_CASE_MUNICIPALITIES', 'Pedersören kunta']
  }
];

function verifyBundles(): void {
  let hasErrors = false;

  console.log('\n📦 Verifying compiled bundle footprints and isolation budgets:\n');
  console.log(
    'Subpath'.padEnd(22) +
    'Raw'.padStart(10) +
    'Minified'.padStart(12) +
    'Gzip'.padStart(10) +
    'Budget'.padStart(10) +
    'Status'.padStart(10)
  );
  console.log('-'.repeat(74));

  for (const spec of BUNDLE_SPECS) {
    const fullPath = path.join(projectRoot, spec.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing bundle file: ${spec.file}. Did you run "npm run build"?`);
      hasErrors = true;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Check forbidden string leaks
    if (spec.forbiddenStrings) {
      for (const forbidden of spec.forbiddenStrings) {
        if (content.includes(forbidden)) {
          console.error(`❌ Dependency leak detected in ${spec.name}: found forbidden symbol "${forbidden}"`);
          hasErrors = true;
        }
      }
    }

    // 2. Measure sizes
    const rawKb = content.length / 1024;
    const minified = esbuild.transformSync(content, { minify: true }).code;
    const minifiedKb = minified.length / 1024;
    const gzipped = zlib.gzipSync(minified);
    const gzipKb = gzipped.length / 1024;

    const overBudget = minifiedKb > spec.maxMinifiedKb;
    if (overBudget) {
      console.error(`❌ Size budget exceeded for ${spec.name}: ${minifiedKb.toFixed(2)} kB > ${spec.maxMinifiedKb} kB`);
      hasErrors = true;
    }

    const status = overBudget ? 'FAILED' : 'PASS';
    console.log(
      spec.name.padEnd(22) +
      `${rawKb.toFixed(2)} kB`.padStart(10) +
      `${minifiedKb.toFixed(2)} kB`.padStart(12) +
      `${gzipKb.toFixed(2)} kB`.padStart(10) +
      `< ${spec.maxMinifiedKb} kB`.padStart(10) +
      status.padStart(10)
    );
  }

  console.log('-'.repeat(74));

  if (hasErrors) {
    console.error('\n❌ Bundle verification failed.\n');
    process.exit(1);
  }

  console.log('\n✅ All bundles strictly satisfied their footprint and isolation budgets.\n');
}

verifyBundles();
