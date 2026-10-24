/**
 * Generates a CSV inflection matrix for all top DVV names across all grammatical cases.
 *
 * Allows human reviewers (native Finnish speakers) to audit inflections in spreadsheet
 * software (Excel, LibreOffice Calc) or text format.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflectPerson, type GrammaticalCase } from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CASES: readonly GrammaticalCase[] = [
  'nominative',
  'genitive',
  'partitive',
  'inessive',
  'elative',
  'illative',
  'adessive',
  'ablative',
  'allative',
  'essive',
  'translative'
];

interface DvvData {
  readonly top500GivenNames: string[];
  readonly top100Surnames: string[];
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function parseArgs(): { outputPath: string } {
  const args = process.argv.slice(2);
  let outputPath = path.join(projectRoot, 'data', 'names-matrix.csv');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      outputPath = path.resolve(args[i + 1] ?? outputPath);
      i++;
    }
  }

  return { outputPath };
}

function main(): void {
  const { outputPath } = parseArgs();
  const fixturePath = path.join(projectRoot, 'tests', 'fixtures', 'dvv-top-names.json');

  if (!fs.existsSync(fixturePath)) {
    console.error(`Benchmark fixture not found at ${fixturePath}. Run "npm run extract:names" first.`);
    return;
  }

  const dvv = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as DvvData;

  const headers = ['Name', 'Category', ...CASES];
  const rows: string[] = [headers.map(escapeCsv).join(',')];

  // Process top 500 given names
  for (const name of dvv.top500GivenNames) {
    const row = [
      escapeCsv(name),
      'givenName',
      ...CASES.map((c) => escapeCsv(inflectPerson(name, c, { role: 'givenName' })))
    ];
    rows.push(row.join(','));
  }

  // Process top 100 surnames
  for (const surname of dvv.top100Surnames) {
    const row = [
      escapeCsv(surname),
      'surname',
      ...CASES.map((c) => escapeCsv(inflectPerson(surname, c, { role: 'surname' })))
    ];
    rows.push(row.join(','));
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rows.join('\n') + '\n', 'utf8');

  console.log(`\nSuccessfully generated inflection matrix (${rows.length - 1} entries) across ${CASES.length} cases.`);
  console.log(`Matrix output saved to: ${path.relative(projectRoot, outputPath)}`);
}

main();
