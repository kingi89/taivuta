/**
 * Zero-dependency Node.js extraction script for DVV names datasets.
 *
 * Reads DVV Excel spreadsheets (.xlsx) as ZIP archives using native node:zlib
 * and extracts the top 500 given names and top 100 surnames into tests/fixtures/dvv-top-names.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Extracts a specific XML file from an .xlsx (ZIP) archive into a string.
 */
function readZipEntry(zipPath: string, targetFilename: string): string | null {
  const buf = fs.readFileSync(zipPath);
  let offset = 0;

  while (offset < buf.length - 4) {
    if (buf.readUInt32LE(offset) === 0x04034b50) {
      const method = buf.readUInt16LE(offset + 8);
      const compSize = buf.readUInt32LE(offset + 18);
      const nameLen = buf.readUInt16LE(offset + 26);
      const extraLen = buf.readUInt16LE(offset + 28);
      const name = buf.toString('utf8', offset + 30, offset + 30 + nameLen);
      const dataStart = offset + 30 + nameLen + extraLen;

      if (name === targetFilename) {
        const raw = buf.subarray(dataStart, dataStart + compSize);
        return method === 8 ? zlib.inflateRawSync(raw).toString('utf8') : raw.toString('utf8');
      }

      offset = dataStart + compSize;
    } else {
      offset++;
    }
  }

  return null;
}

/**
 * Parses shared strings table from xl/sharedStrings.xml.
 */
function parseSharedStrings(xml: string): string[] {
  const strings: string[] = [];
  const siRegex = /<si>(.*?)<\/si>/gs;
  let match: RegExpExecArray | null;

  while ((match = siRegex.exec(xml)) !== null) {
    const textParts: string[] = [];
    const tRegex = /<t[^>]*>(.*?)<\/t>/gs;
    let tMatch: RegExpExecArray | null;
    while ((tMatch = tRegex.exec(match[1] ?? '')) !== null) {
      textParts.push(tMatch[1] ?? '');
    }
    strings.push(textParts.join(''));
  }

  return strings;
}

/**
 * Extracts row data from a worksheet XML file.
 */
function parseWorksheetRows(xml: string, sharedStrings: string[]): string[][] {
  const rows: string[][] = [];
  const rowRegex = /<row[^>]*>(.*?)<\/row>/gs;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(xml)) !== null) {
    const cells: string[] = [];
    const cellRegex = /<c\s*([^>]*)>(?:<v>([^<]*)<\/v>)?<\/c>/gs;
    let cellMatch: RegExpExecArray | null;

    while ((cellMatch = cellRegex.exec(rowMatch[1] ?? '')) !== null) {
      const isString = cellMatch[1]?.includes('t="s"') ?? false;
      const val = cellMatch[2] ?? '';
      cells.push(isString && val !== '' ? sharedStrings[parseInt(val, 10)] ?? '' : val);
    }

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
}

/**
 * Finds a worksheet filename inside a workbook matching a sheet pattern.
 */
function findSheetFilename(zipPath: string, sheetPattern: RegExp): string {
  const wbXml = readZipEntry(zipPath, 'xl/workbook.xml');
  const relsXml = readZipEntry(zipPath, 'xl/_rels/workbook.xml.rels');

  if (!wbXml || !relsXml) {
    throw new Error(`Failed to read workbook structures from ${zipPath}`);
  }

  const sheetRegex = /<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/gi;
  let rId: string | null = null;
  let match: RegExpExecArray | null;

  while ((match = sheetRegex.exec(wbXml)) !== null) {
    if (sheetPattern.test(match[1] ?? '')) {
      rId = match[2] ?? null;
      break;
    }
  }

  if (!rId) {
    throw new Error(`No sheet matching pattern ${sheetPattern} found in ${zipPath}`);
  }

  const relRegex = new RegExp(`<Relationship[^>]*Id="${rId}"[^>]*Target="([^"]+)"`, 'i');
  const relMatch = relRegex.exec(relsXml);
  if (!relMatch) {
    throw new Error(`Relationship "${rId}" not found in workbook rels`);
  }

  const target = relMatch[1] ?? '';
  return target.startsWith('xl/') ? target : `xl/${target}`;
}

/**
 * Extracts top names from a sheet.
 */
function extractTopNames(zipPath: string, sheetPattern: RegExp, count: number): string[] {
  const sstXml = readZipEntry(zipPath, 'xl/sharedStrings.xml');
  const sst = sstXml ? parseSharedStrings(sstXml) : [];
  const sheetFile = findSheetFilename(zipPath, sheetPattern);
  const sheetXml = readZipEntry(zipPath, sheetFile);

  if (!sheetXml) {
    throw new Error(`Failed to read ${sheetFile}`);
  }

  const rows = parseWorksheetRows(sheetXml, sst);
  return rows.slice(1, count + 1).map((r) => r[0] ?? '').filter((name) => name.length > 0);
}

/**
 * Dynamically finds an .xlsx file in a directory matching a pattern.
 */
function findFile(dir: string, pattern: RegExp): string | null {
  if (!fs.existsSync(dir)) {
    return null;
  }
  const files = fs.readdirSync(dir).filter((f) => pattern.test(f) && f.endsWith('.xlsx'));
  if (files.length === 0) {
    return null;
  }
  // Sort descending by name/mtime to get the latest snapshot
  files.sort().reverse();
  const latest = files[0];
  return latest ? path.join(dir, latest) : null;
}

/**
 * Parses CLI arguments for custom file paths.
 */
function parseArgs(): { firstNamesPath?: string; surnamesPath?: string } {
  const args = process.argv.slice(2);
  const result: { firstNamesPath?: string; surnamesPath?: string } = {};

  for (let i = 0; i < args.length; i++) {
    const current = args[i];
    const next = args[i + 1];
    if (current === '--first-names' && next) {
      result.firstNamesPath = path.resolve(next);
      i++;
    } else if (current === '--surnames' && next) {
      result.surnamesPath = path.resolve(next);
      i++;
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
[!] DVV spreadsheets not found in data/names/.

To extract and update the benchmark dataset:
  1. Download the latest Excel files from DVV (https://dvv.fi/etunimitilasto or avoindata.fi).
  2. Place the .xlsx files into data/names/ (e.g. data/names/etunimitilasto.xlsx).
  3. Re-run: npm run extract:names

Or specify custom file paths:
  npm run extract:names -- --first-names /path/to/etunimet.xlsx --surnames /path/to/sukunimet.xlsx

For more details, see data/README.md.
`);
}

function main(): void {
  const cliArgs = parseArgs();
  const namesDir = path.join(projectRoot, 'data', 'names');

  const firstNamesXlsx =
    cliArgs.firstNamesPath ?? findFile(namesDir, /etunimi/i);
  const surnamesXlsx =
    cliArgs.surnamesPath ?? findFile(namesDir, /sukunimi/i);

  if (!firstNamesXlsx || !surnamesXlsx || !fs.existsSync(firstNamesXlsx) || !fs.existsSync(surnamesXlsx)) {
    printHelp();
    return;
  }

  console.log(`Reading first names from: ${path.relative(projectRoot, firstNamesXlsx)}`);
  console.log(`Reading surnames from:    ${path.relative(projectRoot, surnamesXlsx)}`);

  const maleNames = extractTopNames(firstNamesXlsx, /miehet.*ens/i, 250);
  const femaleNames = extractTopNames(firstNamesXlsx, /naiset.*ens/i, 250);
  const surnames = extractTopNames(surnamesXlsx, /(?:nimet|sukunim)/i, 100);

  const payload = {
    source: 'Digi- ja väestötietovirasto (DVV) open data, CC-BY 4.0',
    description: 'Top-500 Finnish given names and Top-100 Finnish surnames',
    extractedAt: new Date().toISOString(),
    maleFirstNames: maleNames,
    femaleFirstNames: femaleNames,
    top500GivenNames: [...maleNames, ...femaleNames],
    top100Surnames: surnames
  };

  const outputPath = path.join(projectRoot, 'tests', 'fixtures', 'dvv-top-names.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`\nSuccessfully extracted ${payload.top500GivenNames.length} given names and ${payload.top100Surnames.length} surnames.`);
  console.log(`Saved to ${path.relative(projectRoot, outputPath)}`);
}

main();
