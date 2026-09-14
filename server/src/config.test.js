import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from './config.js';

test('allows both common local frontend origins by default', () => {
  assert.ok(config.clientOrigins.includes('http://localhost:3000'));
  assert.ok(config.clientOrigins.includes('http://127.0.0.1:3000'));
});
