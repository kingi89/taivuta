/**
 * Automated bundle size, modular subpath isolation, and release version parity verification script.
 *
 * Verifies that:
 * 1. `package.json`, `package-lock.json` (root and `packages['']`), and `src/index.ts` (`VERSION`) share the same version.
 * 2. Each compiled subpath in `dist/` remains strictly within its size footprint budget.
 * 3. Each subpath contains zero upward or unintended dataset dependency leaks.
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { VERSION } from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface BundleSpec {
  readonly name: string;
  readonly file: string;
  readonly maxMinifiedKb: number;
  readonly forbiddenStrings?: readonly string[];
}

interface PackageJson {
  readonly version?: unknown;
}

interface PackageLockJson {
  readonly version?: unknown;
  readonly packages?: Readonly<Record<string, PackageJson | undefined>>;
}

/**
 * Named version source compared against the canonical package manifest version.
 */
export interface VersionSource {
  readonly label: string;
  readonly version: unknown;
}

const BUNDLE_SPECS: readonly BundleSpec[] = [
  {
    name: 'taivuta (root)',
    file: 'dist/index.mjs',
    maxMinifiedKb: 32.0
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
    maxMinifiedKb: 10.0,
    forbiddenStrings: [
      'EXTERNAL_CASE_MUNICIPALITIES',
      'Pedersören kunta',
      'inflectPerson',
      'matchNatureNoun',
      'analyzeStem'
    ]
  }
];

function readJsonFile<T>(relativePath: string): T | null {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing manifest file: ${relativePath}`);
    return null;
  }

  return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
}

/**
 * Compares candidate version sources against the canonical package version.
 *
 * @param expectedVersion - Canonical semantic version string from `package.json`.
 * @param sources - List of manifest and module version values to inspect.
 * @returns Human-readable mismatch descriptions (empty when all sources match).
 */
export function findVersionMismatches(
  expectedVersion: string,
  sources: readonly VersionSource[]
): string[] {
  const mismatches: string[] = [];

  for (const source of sources) {
    if (source.version !== expectedVersion) {
      const actual = typeof source.version === 'string' && source.version.length > 0
        ? `"${source.version}"`
        : String(source.version);
      mismatches.push(`${source.label} (${actual} !== "${expectedVersion}")`);
    }
  }

  return mismatches;
}

function verifyVersionParity(): boolean {
  const pkg = readJsonFile<PackageJson>('package.json');
  const lock = readJsonFile<PackageLockJson>('package-lock.json');
  if (!pkg || !lock) {
    return false;
  }

  if (typeof pkg.version !== 'string' || pkg.version.trim().length === 0) {
    console.error('❌ Invalid or missing "version" field in package.json.');
    return false;
  }

  const rootLockEntry = lock.packages?.[''];
  const mismatches = findVersionMismatches(pkg.version, [
    { label: 'package-lock.json version', version: lock.version },
    { label: 'package-lock.json packages[""].version', version: rootLockEntry?.version },
    { label: 'src/index.ts VERSION', version: VERSION }
  ]);

  if (mismatches.length > 0) {
    for (const mismatch of mismatches) {
      console.error(`❌ Version mismatch in ${mismatch}`);
    }
    return false;
  }

  console.log(`\n✅ Version parity verified: ${pkg.version} (package.json, package-lock.json, src/index.ts)`);
  return true;
}

function findForbiddenSymbols(
  content: string,
  forbiddenStrings?: readonly string[]
): string[] {
  if (!forbiddenStrings) {
    return [];
  }
  return forbiddenStrings.filter((forbidden) => content.includes(forbidden));
}

function verifySingleBundle(spec: BundleSpec): boolean {
  const fullPath = path.join(projectRoot, spec.file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing bundle file: ${spec.file}. Did you run "npm run build"?`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const leaks = findForbiddenSymbols(content, spec.forbiddenStrings);
  for (const forbidden of leaks) {
    console.error(`❌ Dependency leak detected in ${spec.name}: found forbidden symbol "${forbidden}"`);
  }

  const rawKb = content.length / 1024;
  const minified = esbuild.transformSync(content, { minify: true }).code;
  const minifiedKb = minified.length / 1024;
  const gzipKb = zlib.gzipSync(minified).length / 1024;

  const overBudget = minifiedKb > spec.maxMinifiedKb;
  if (overBudget) {
    console.error(`❌ Size budget exceeded for ${spec.name}: ${minifiedKb.toFixed(2)} kB > ${spec.maxMinifiedKb} kB`);
  }

  const passed = leaks.length === 0 && !overBudget;
  const status = passed ? 'PASS' : 'FAILED';
  console.log(
    spec.name.padEnd(22) +
    `${rawKb.toFixed(2)} kB`.padStart(10) +
    `${minifiedKb.toFixed(2)} kB`.padStart(12) +
    `${gzipKb.toFixed(2)} kB`.padStart(10) +
    `< ${spec.maxMinifiedKb} kB`.padStart(10) +
    status.padStart(10)
  );

  return passed;
}

function verifyBundles(): boolean {
  let allPassed = true;

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
    if (!verifySingleBundle(spec)) {
      allPassed = false;
    }
  }

  console.log('-'.repeat(74));
  return allPassed;
}

function main(): void {
  const versionOk = verifyVersionParity();
  const bundlesOk = verifyBundles();

  if (!versionOk || !bundlesOk) {
    console.error('\n❌ Verification failed.\n');
    process.exit(1);
  }

  console.log('\n✅ All bundles and version manifests strictly satisfied verification.\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
