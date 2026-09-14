const replacements = [
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]'],
  [/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED_CARD]'],
  [/\b(?:otp|pin|verification code)\s*[:=-]?\s*\d{4,8}\b/gi, '[REDACTED_CODE]'],
];

export function redactSensitiveText(value) {
  const base = replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value || ''));
  return base.replace(/\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, (candidate) => {
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(candidate)) return candidate;
    return '[REDACTED_PHONE]';
  });
}
