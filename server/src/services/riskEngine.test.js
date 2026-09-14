import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRisk } from './riskEngine.js';

test('detects critical credential and payment scam signals', () => {
  const result = analyzeRisk('Urgent! Send the OTP and pay first using gift card right now.', 'message');
  assert.equal(result.level, 'critical');
  assert.ok(result.score >= 70);
  assert.ok(result.findings.length >= 3);
});

test('keeps an ordinary marketplace message low risk', () => {
  const result = analyzeRisk('Hello, is this chair still available for pickup tomorrow?', 'message');
  assert.equal(result.level, 'low');
  assert.equal(result.score, 0);
});

test('detects risky URL characteristics', () => {
  const result = analyzeRisk('http://192.168.4.2/verify-account', 'url');
  assert.ok(result.score >= 30);
  assert.ok(result.checkedUrls.length === 1);
});
