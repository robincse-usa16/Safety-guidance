const validTypes = new Set(['message', 'url', 'transaction']);

export function validateScanInput(body) {
  const type = String(body?.type || 'message').trim();
  const content = String(body?.content || '').trim();

  if (!validTypes.has(type)) return 'Invalid scan type.';
  if (content.length < 5) return 'Please enter at least 5 characters.';
  if (content.length > 12_000) return 'Content is too long. Maximum 12,000 characters.';
  return null;
}
