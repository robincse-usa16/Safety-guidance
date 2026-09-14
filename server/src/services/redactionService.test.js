import test from 'node:test';
import assert from 'node:assert/strict';
import { redactSensitiveText } from './redactionService.js';

test('redacts email, phone and explicit verification codes', () => {
  const result = redactSensitiveText('Email me at person@example.com or +1 202 555 0199. OTP: 883921');
  assert.equal(result.includes('person@example.com'), false);
  assert.equal(result.includes('883921'), false);
  assert.match(result, /REDACTED_EMAIL/);
  assert.match(result, /REDACTED_CODE/);
});

test('does not mistake an IPv4 URL for a phone number', () => {
  assert.equal(redactSensitiveText('http://192.168.4.2/verify'), 'http://192.168.4.2/verify');
});
