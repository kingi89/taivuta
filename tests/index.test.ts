import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VERSION, getStatus } from '../src/index.ts';

describe('taivuta baseline exports', () => {
  it('exports semantic version string', () => {
    assert.equal(VERSION, '0.1.1');
  });

  it('returns valid library status object', () => {
    const status = getStatus();
    assert.deepEqual(status, {
      name: 'taivuta',
      version: '0.1.1',
      ready: true
    });
  });
});
