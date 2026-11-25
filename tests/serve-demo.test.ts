/**
 * Unit tests for the local demo preview server script (`scripts/serve-demo.ts`).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import {
  createDemoRequestHandler,
  getMimeType,
  parsePort,
  resolveDemoFilePath
} from '../scripts/serve-demo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface CapturedResponse {
  readonly statusCode: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
}

function createMockResponse(): {
  res: ServerResponse;
  done: Promise<CapturedResponse>;
} {
  let statusCode = 200;
  let headersSent = false;
  const headers: Record<string, string> = {};
  const chunks: Buffer[] = [];

  const stream = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      callback();
    }
  });

  const mock = Object.assign(stream, {
    get statusCode(): number {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
    get headersSent(): boolean {
      return headersSent;
    },
    writeHead(code: number, responseHeaders?: Record<string, string | number | readonly string[]>): Writable {
      statusCode = code;
      headersSent = true;
      if (responseHeaders) {
        for (const [key, value] of Object.entries(responseHeaders)) {
          headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : String(value);
        }
      }
      return stream;
    }
  });

  const done = once(stream, 'finish').then(() => ({
    statusCode,
    headers,
    body: Buffer.concat(chunks).toString('utf8')
  }));

  return { res: mock as unknown as ServerResponse, done };
}

async function dispatchRequest(method: string, url: string): Promise<CapturedResponse> {
  const handler = createDemoRequestHandler(projectRoot);
  const { res, done } = createMockResponse();
  handler({ method, url } as IncomingMessage, res);
  return done;
}

describe('Demo Server Script (scripts/serve-demo.ts)', () => {
  it('resolves MIME types safely with prototype isolation and octet-stream fallback', () => {
    assert.equal(getMimeType('demo/index.html'), 'text/html; charset=utf-8');
    assert.equal(getMimeType('DEMO/INDEX.HTML'), 'text/html; charset=utf-8');
    assert.equal(getMimeType('dist/index.global.js'), 'text/javascript; charset=utf-8');
    assert.equal(getMimeType('dist/index.mjs'), 'text/javascript; charset=utf-8');
    assert.equal(getMimeType('dist/index.cjs'), 'text/javascript; charset=utf-8');
    assert.equal(getMimeType('styles.css'), 'text/css; charset=utf-8');
    assert.equal(getMimeType('data.json'), 'application/json; charset=utf-8');
    assert.equal(getMimeType('dist/index.global.js.map'), 'application/json; charset=utf-8');
    assert.equal(getMimeType('logo.svg'), 'image/svg+xml');
    assert.equal(getMimeType('icon.png'), 'image/png');
    assert.equal(getMimeType('favicon.ico'), 'image/x-icon');
    assert.equal(getMimeType('notes.txt'), 'text/plain; charset=utf-8');
    assert.equal(getMimeType('module.wasm'), 'application/octet-stream');
    assert.equal(getMimeType('no-extension'), 'application/octet-stream');
    assert.equal(getMimeType('file.toString'), 'application/octet-stream');
    assert.equal(getMimeType('file.constructor'), 'application/octet-stream');
    assert.equal(getMimeType('file.__proto__'), 'application/octet-stream');
  });

  it('parses valid PORT overrides and rejects out-of-range or malformed values', () => {
    assert.equal(parsePort(undefined), 3000);
    assert.equal(parsePort(''), 3000);
    assert.equal(parsePort('   '), 3000);
    assert.equal(parsePort('0'), 0);
    assert.equal(parsePort('8080'), 8080);
    assert.equal(parsePort('65535'), 65535);
    assert.equal(parsePort('-1'), null);
    assert.equal(parsePort('65536'), null);
    assert.equal(parsePort('abc'), null);
    assert.equal(parsePort('3000.5'), null);
    assert.equal(parsePort('3000px'), null);
  });

  it('resolves allowlisted demo and dist targets while stripping query strings and fragments', () => {
    const demoTargets = ['/', '/index.html', '/demo', '/demo/', '/demo/index.html', '/?tab=prefs', '/demo/index.html#tab'];
    for (const url of demoTargets) {
      const resolved = resolveDemoFilePath(url, projectRoot);
      assert.equal(resolved.ok, true, `Expected ${url} to resolve`);
      if (resolved.ok) {
        assert.ok(resolved.filePath.endsWith(path.join('demo', 'index.html')));
        assert.equal(resolved.contentType, 'text/html; charset=utf-8');
        assert.ok(resolved.size > 0);
      }
    }

    if (fs.existsSync(path.join(projectRoot, 'dist', 'index.global.js'))) {
      const bundle = resolveDemoFilePath('/dist/index.global.js?v=1', projectRoot);
      assert.equal(bundle.ok, true);
      if (bundle.ok) {
        assert.equal(bundle.contentType, 'text/javascript; charset=utf-8');
      }
    }

    if (fs.existsSync(path.join(projectRoot, 'dist', 'preferences', 'index.global.js'))) {
      const prefBundle = resolveDemoFilePath('/dist/preferences/index.global.js', projectRoot);
      assert.equal(prefBundle.ok, true);
      if (prefBundle.ok) {
        assert.equal(prefBundle.contentType, 'text/javascript; charset=utf-8');
      }
    }
  });

  it('blocks path traversal, non-allowlisted files, malformed URLs, and directories', () => {
    const forbidden = [
      '/../package.json',
      '/%2e%2e/package.json',
      '/demo/../../etc/passwd',
      '/package.json',
      '/.git/config',
      '/src/index.ts',
      '/dist-evil/foo.js'
    ];
    for (const url of forbidden) {
      const res = resolveDemoFilePath(url, projectRoot);
      assert.deepEqual(res, { ok: false, status: 403, message: 'Forbidden' }, `Expected 403 for ${url}`);
    }

    const badRequests = ['/%E0%A4%A', '/demo/index.html%00.js', '/demo\\index.html', '//evil.com/demo/index.html', 'http://evil.com/demo/index.html'];
    for (const url of badRequests) {
      const res = resolveDemoFilePath(url, projectRoot);
      assert.deepEqual(res, { ok: false, status: 400, message: 'Bad Request' }, `Expected 400 for ${url}`);
    }

    const notFound = ['/favicon.ico', '/demo/missing.html', '/dist/missing.js', '/dist', '/dist/preferences'];
    for (const url of notFound) {
      const res = resolveDemoFilePath(url, projectRoot);
      assert.deepEqual(res, { ok: false, status: 404, message: 'Not Found' }, `Expected 404 for ${url}`);
    }
  });

  it('handles GET, HEAD, unsupported methods, and error responses via HTTP handler', async () => {
    const getHome = await dispatchRequest('GET', '/');
    assert.equal(getHome.statusCode, 200);
    assert.equal(getHome.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(getHome.headers['cache-control'], 'no-cache');
    assert.equal(getHome.headers['x-content-type-options'], 'nosniff');
    assert.equal(getHome.headers['content-length'], String(Buffer.byteLength(getHome.body)));
    assert.ok(getHome.body.includes('<!DOCTYPE html>'));

    const headHome = await dispatchRequest('HEAD', '/');
    assert.equal(headHome.statusCode, 200);
    assert.equal(headHome.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(headHome.headers['content-length'], getHome.headers['content-length']);
    assert.equal(headHome.body, '');

    const postRes = await dispatchRequest('POST', '/');
    assert.equal(postRes.statusCode, 405);
    assert.equal(postRes.headers['allow'], 'GET, HEAD');

    const forbiddenRes = await dispatchRequest('GET', '/package.json');
    assert.equal(forbiddenRes.statusCode, 403);
    assert.equal(forbiddenRes.headers['x-content-type-options'], 'nosniff');

    const badRes = await dispatchRequest('GET', '/%E0%A4%A');
    assert.equal(badRes.statusCode, 400);

    const missingRes = await dispatchRequest('GET', '/demo/missing.html');
    assert.equal(missingRes.statusCode, 404);

    const faviconRes = await dispatchRequest('GET', '/favicon.ico');
    assert.equal(faviconRes.statusCode, 404);
  });
});
