/**
 * Local static HTTP server for previewing the interactive browser demo.
 *
 * Serves files strictly from `demo/` and `dist/` on loopback `127.0.0.1`
 * with proper MIME types and safe path containment.
 *
 * @packageDocumentation
 */

import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import http, { type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const DEFAULT_MIME_TYPE = 'application/octet-stream';
const REQUIRED_DEMO_BUNDLES: readonly string[] = [
  'dist/index.global.js',
  'dist/preferences/index.global.js'
];

const MIME_TYPES: ReadonlyMap<string, string> = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.cjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.ico', 'image/x-icon'],
  ['.txt', 'text/plain; charset=utf-8']
]);

/**
 * Result of resolving a demo HTTP request URL against the repository allowlist.
 *
 * @example
 * ```ts
 * const res: DemoFileResolution = resolveDemoFilePath('/');
 * ```
 */
export type DemoFileResolution =
  | {
      readonly ok: true;
      readonly filePath: string;
      readonly contentType: string;
      readonly size: number;
    }
  | {
      readonly ok: false;
      readonly status: 400 | 403 | 404;
      readonly message: string;
    };

interface TextResponseOptions {
  readonly status: number;
  readonly body: string;
  readonly isHead: boolean;
  readonly allow?: string;
}

/**
 * Resolves the HTTP `Content-Type` header value for a file path by extension.
 *
 * @param filePath - File path or filename to inspect (extension match is case-insensitive).
 * @returns MIME type string, defaulting to `'application/octet-stream'` for unknown extensions.
 *
 * @example
 * ```ts
 * getMimeType('demo/index.html'); // "text/html; charset=utf-8"
 * getMimeType('dist/index.global.js'); // "text/javascript; charset=utf-8"
 * ```
 */
export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES.get(ext) ?? DEFAULT_MIME_TYPE;
}

/**
 * Parses and validates an optional TCP port string for the demo server.
 *
 * @param rawPort - Raw port string (typically `process.env.PORT`); defaults to `3000` when blank or omitted.
 * @returns Valid integer port in `0..65535`, or `null` when invalid.
 *
 * @example
 * ```ts
 * parsePort(undefined); // 3000
 * parsePort('8080'); // 8080
 * parsePort('invalid'); // null
 * ```
 */
export function parsePort(rawPort: string | undefined): number | null {
  if (rawPort === undefined || rawPort.trim() === '') {
    return DEFAULT_PORT;
  }

  const trimmed = rawPort.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const port = Number.parseInt(trimmed, 10);
  return port >= 0 && port <= 65535 ? port : null;
}

function isWithinDirectory(candidatePath: string, allowedDir: string): boolean {
  const rel = path.relative(allowedDir, candidatePath);
  return rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel);
}

function decodeRequestPathname(rawUrl: string): string | null {
  if (rawUrl.length === 0) {
    return '/';
  }
  if (!rawUrl.startsWith('/') || rawUrl.startsWith('//')) {
    return null;
  }

  const rawPath = rawUrl.split(/[?#]/, 1)[0] ?? '/';
  try {
    const decoded = decodeURIComponent(rawPath);
    if (decoded.includes('\0') || decoded.includes('\\')) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function mapPathnameToRelativeTarget(decodedPathname: string): string {
  if (
    decodedPathname === '/' ||
    decodedPathname === '/index.html' ||
    decodedPathname === '/demo' ||
    decodedPathname === '/demo/'
  ) {
    return 'demo/index.html';
  }
  // No demo/favicon.ico is intentionally included; routing /favicon.ico into demo/ yields 404 instead of 403 while allowing one if added later.
  if (decodedPathname === '/favicon.ico') {
    return 'demo/favicon.ico';
  }
  return decodedPathname.replace(/^\/+/, '');
}

function resolveExistingRegularFile(
  candidatePath: string,
  allowedDirs: readonly string[]
): DemoFileResolution {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(candidatePath);
  } catch {
    return { ok: false, status: 404, message: 'Not Found' };
  }
  if (!stat.isFile()) {
    return { ok: false, status: 404, message: 'Not Found' };
  }

  let realTarget: string;
  try {
    realTarget = fs.realpathSync(candidatePath);
  } catch {
    return { ok: false, status: 404, message: 'Not Found' };
  }

  const realAllowed = allowedDirs.map((dir) => (fs.existsSync(dir) ? fs.realpathSync(dir) : dir));
  if (!realAllowed.some((dir) => isWithinDirectory(realTarget, dir))) {
    return { ok: false, status: 403, message: 'Forbidden' };
  }

  return {
    ok: true,
    filePath: realTarget,
    contentType: getMimeType(realTarget),
    size: stat.size
  };
}

/**
 * Safely resolves an HTTP request URL to an allowlisted regular file under `demo/` or `dist/`.
 *
 * @param rawUrl - Raw request URL path (including optional query string or fragment).
 * @param rootDir - Repository root directory containing `demo/` and `dist/` (defaults to repo root).
 * @returns Resolution object describing the target file or an HTTP error status (`400`, `403`, or `404`).
 *
 * @example
 * ```ts
 * const resolved = resolveDemoFilePath('/?tab=1');
 * // resolved.ok === true, resolved.contentType === "text/html; charset=utf-8"
 * ```
 */
export function resolveDemoFilePath(
  rawUrl: string,
  rootDir: string = projectRoot
): DemoFileResolution {
  const decodedPathname = decodeRequestPathname(rawUrl);
  if (decodedPathname === null) {
    return { ok: false, status: 400, message: 'Bad Request' };
  }

  const relativeTarget = mapPathnameToRelativeTarget(decodedPathname);
  const resolvedRoot = path.resolve(rootDir);
  const demoDir = path.resolve(resolvedRoot, 'demo');
  const distDir = path.resolve(resolvedRoot, 'dist');
  const candidatePath = path.resolve(resolvedRoot, relativeTarget);

  if (!isWithinDirectory(candidatePath, demoDir) && !isWithinDirectory(candidatePath, distDir)) {
    return { ok: false, status: 403, message: 'Forbidden' };
  }

  return resolveExistingRegularFile(candidatePath, [demoDir, distDir]);
}

function sendTextResponse(res: ServerResponse, options: TextResponseOptions): void {
  const headers: Record<string, string> = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': String(Buffer.byteLength(options.body)),
    'X-Content-Type-Options': 'nosniff'
  };
  if (options.allow) {
    headers['Allow'] = options.allow;
  }

  res.writeHead(options.status, headers);
  if (options.isHead) {
    res.end();
    return;
  }
  res.end(options.body);
}

function serveResolvedFile(
  res: ServerResponse,
  resolution: Extract<DemoFileResolution, { readonly ok: true }>,
  isHead: boolean
): void {
  res.writeHead(200, {
    'Content-Type': resolution.contentType,
    'Content-Length': String(resolution.size),
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });

  if (isHead) {
    res.end();
    return;
  }

  const stream = fs.createReadStream(resolution.filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      sendTextResponse(res, { status: 500, body: 'Internal Server Error', isHead: false });
      return;
    }
    res.destroy();
  });
  stream.pipe(res);
}

/**
 * Creates the HTTP request listener serving demo HTML and compiled global bundles.
 *
 * @param rootDir - Repository root directory containing `demo/` and `dist/` (defaults to repo root).
 * @returns Node.js HTTP request handler accepting `GET` and `HEAD` requests.
 *
 * @example
 * ```ts
 * const handler = createDemoRequestHandler();
 * ```
 */
export function createDemoRequestHandler(
  rootDir: string = projectRoot
): (req: IncomingMessage, res: ServerResponse) => void {
  return (req: IncomingMessage, res: ServerResponse): void => {
    const method = req.method ?? 'GET';
    if (method !== 'GET' && method !== 'HEAD') {
      sendTextResponse(res, {
        status: 405,
        body: 'Method Not Allowed',
        isHead: false,
        allow: 'GET, HEAD'
      });
      return;
    }

    const isHead = method === 'HEAD';
    const resolution = resolveDemoFilePath(req.url ?? '/', rootDir);
    if (!resolution.ok) {
      sendTextResponse(res, {
        status: resolution.status,
        body: resolution.message,
        isHead
      });
      return;
    }

    serveResolvedFile(res, resolution, isHead);
  };
}

/**
 * Creates a configured Node.js HTTP server instance for the local demo preview.
 *
 * @param rootDir - Repository root directory containing `demo/` and `dist/` (defaults to repo root).
 * @returns Unbound HTTP `Server` instance.
 *
 * @example
 * ```ts
 * const server = createDemoServer();
 * ```
 */
export function createDemoServer(rootDir: string = projectRoot): Server {
  return http.createServer(createDemoRequestHandler(rootDir));
}

function warnIfBundlesMissing(rootDir: string): void {
  const resolvedRoot = path.resolve(rootDir);
  const missing = REQUIRED_DEMO_BUNDLES.filter(
    (relPath) => !fs.existsSync(path.join(resolvedRoot, relPath))
  );
  if (missing.length > 0) {
    console.warn(
      `Warning: Missing built demo bundle(s): ${missing.join(', ')}. Run "npm run build" before opening the demo.`
    );
  }
}

function main(): void {
  const port = parsePort(process.env.PORT);
  if (port === null) {
    console.error(
      `Error: Invalid PORT value "${process.env.PORT ?? ''}". Expected an integer between 0 and 65535.`
    );
    process.exit(1);
  }

  warnIfBundlesMissing(projectRoot);
  const server = createDemoServer(projectRoot);

  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error(`Failed to start demo server: ${err.message}`);
    process.exit(1);
  });

  const shutdown = (): void => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.listen(port, DEFAULT_HOST, () => {
    const addr = server.address();
    const activePort = typeof addr === 'object' && addr ? addr.port : port;
    console.log(`Demo running at http://${DEFAULT_HOST}:${activePort}`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
