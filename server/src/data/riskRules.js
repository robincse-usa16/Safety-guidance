export const riskRules = [
  {
    id: 'urgency',
    category: 'Pressure tactics',
    weight: 14,
    pattern: /\b(urgent|immediately|right now|last chance|within \d+ (minute|hour)|account (will be )?(closed|blocked|suspended))\b/i,
    evidence: 'The message creates urgency so you act before verifying.',
  },
  {
    id: 'advance-payment',
    category: 'Unsafe payment request',
    weight: 24,
    pattern: /\b(advance payment|pay first|send (the )?money|deposit first|full payment|booking fee)\b/i,
    evidence: 'Payment is requested before the item or identity is safely verified.',
  },
  {
    id: 'off-platform',
    category: 'Off-platform request',
    weight: 18,
    pattern: /\b(whatsapp|telegram|signal|contact me directly|outside (the )?(app|platform)|avoid marketplace)\b/i,
    evidence: 'The conversation is being moved away from platform protection.',
  },
  {
    id: 'credential-theft',
    category: 'Sensitive information',
    weight: 32,
    pattern: /\b(otp|one[- ]time password|verification code|pin number|password|cvv|card number|seed phrase)\b/i,
    evidence: 'The sender asks for confidential information that should never be shared.',
  },
  {
    id: 'unusual-payment',
    category: 'Irreversible payment',
    weight: 26,
    pattern: /\b(gift card|crypto(currency)?|bitcoin|wire transfer|western union|friends and family|cashapp only)\b/i,
    evidence: 'An unusual or difficult-to-reverse payment method is requested.',
  },
  {
    id: 'too-good',
    category: 'Unrealistic offer',
    weight: 12,
    pattern: /\b(guaranteed profit|double your money|free iphone|won a prize|selected winner|90% off|too good to miss)\b/i,
    evidence: 'The offer uses unrealistic rewards or extreme discounts.',
  },
  {
    id: 'impersonation',
    category: 'Possible impersonation',
    weight: 18,
    pattern: /\b(bank support|police department|tax authority|government agent|microsoft support|official support team)\b/i,
    evidence: 'The sender claims authority or support status that must be verified independently.',
  },
  {
    id: 'remote-access',
    category: 'Device takeover risk',
    weight: 35,
    pattern: /\b(anydesk|teamviewer|remote access|screen share|install this app)\b/i,
    evidence: 'Remote-access software could let another person control the device.',
  },
];

export const suspiciousTlds = new Set(['zip', 'mov', 'click', 'top', 'xyz', 'loan', 'gq', 'tk']);
export const shorteners = new Set(['bit.ly', 'tinyurl.com', 't.co', 'rb.gy', 'cutt.ly', 'is.gd']);
