export const site = {
  name: 'SafePay Guardian',
  shortName: 'SafePay',
  description: 'Check suspicious messages, links, emails and marketplace deals before you trust, click or pay.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

export const toolPages = [
  { href: '/scam-checker', label: 'Scam checker', keyword: 'online scam checker' },
  { href: '/link-checker', label: 'Link checker', keyword: 'phishing link checker' },
  { href: '/text-message-scam-checker', label: 'Text checker', keyword: 'text message scam checker' },
  { href: '/email-scam-checker', label: 'Email checker', keyword: 'email scam checker' },
  { href: '/website-scam-checker', label: 'Website checker', keyword: 'website scam checker' },
  { href: '/marketplace-scam-checker', label: 'Marketplace checker', keyword: 'marketplace scam checker' },
  { href: '/payment-scam-checker', label: 'Payment checker', keyword: 'payment scam checker' },
  { href: '/screenshot-scam-checker', label: 'Screenshot checker', keyword: 'screenshot scam checker' },
  { href: '/qr-code-scam-checker', label: 'QR checker', keyword: 'QR code scam checker' },
];
