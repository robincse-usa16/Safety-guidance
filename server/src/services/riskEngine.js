import { riskRules, shorteners, suspiciousTlds } from '../data/riskRules.js';

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;

function normalizeUrl(value) {
  const clean = value.replace(/[),.;!?]+$/, '');
  return clean.startsWith('http') ? clean : `https://${clean}`;
}

function inspectUrl(rawUrl) {
  try {
    const parsed = new URL(normalizeUrl(rawUrl));
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const tld = host.split('.').at(-1);
    const findings = [];

    if (shorteners.has(host)) findings.push({ category: 'Hidden destination', weight: 16, evidence: `Shortened link hides its final destination (${host}).` });
    if (suspiciousTlds.has(tld)) findings.push({ category: 'Unusual domain', weight: 13, evidence: `The .${tld} domain needs extra verification.` });
    if (parsed.protocol !== 'https:') findings.push({ category: 'Insecure connection', weight: 10, evidence: 'The link does not use HTTPS.' });
    if (/\d{1,3}(?:\.\d{1,3}){3}/.test(host)) findings.push({ category: 'Raw IP address', weight: 22, evidence: 'The link uses an IP address instead of a recognizable domain.' });
    if (host.includes('xn--')) findings.push({ category: 'Look-alike domain', weight: 22, evidence: 'The domain uses encoded characters and may imitate another brand.' });
    if ((host.match(/-/g) || []).length >= 3) findings.push({ category: 'Unusual domain pattern', weight: 10, evidence: 'The domain contains an unusual number of hyphens.' });
    if (/(login|verify|secure|wallet|account|update).*(paypal|amazon|apple|google|bank)/i.test(host)) findings.push({ category: 'Possible brand impersonation', weight: 24, evidence: 'The domain combines security terms with a brand name.' });

    return { url: parsed.toString(), host, findings };
  } catch {
    return { url: rawUrl, host: null, findings: [{ category: 'Invalid link', weight: 12, evidence: 'The link format is malformed or difficult to verify.' }] };
  }
}

function uniqueFindings(findings) {
  return findings.filter((item, index, all) => all.findIndex((candidate) => candidate.category === item.category && candidate.evidence === item.evidence) === index);
}

export function analyzeRisk(content, type) {
  const ruleFindings = riskRules
    .filter((rule) => rule.pattern.test(content))
    .map(({ category, weight, evidence }) => ({ category, weight, evidence }));

  const extractedUrls = type === 'url' ? [content] : content.match(URL_PATTERN) || [];
  const urlReports = [...new Set(extractedUrls)].slice(0, 8).map(inspectUrl);
  const findings = uniqueFindings([...ruleFindings, ...urlReports.flatMap((item) => item.findings)]);
  const rawScore = findings.reduce((total, finding) => total + finding.weight, 0);
  const combinationBoost = findings.length >= 4 ? 9 : findings.length >= 2 ? 4 : 0;
  const score = Math.min(98, rawScore + combinationBoost);

  let level = 'low';
  let verdict = 'No known threat detected';
  let summary = 'No strong scam signals were found, but always verify the person and payment method.';
  if (score >= 70) {
    level = 'critical';
    verdict = 'High risk — do not pay';
    summary = 'Multiple high-risk scam signals were detected. Stop contact and do not send money or sensitive information.';
  } else if (score >= 40) {
    level = 'high';
    verdict = 'Suspicious — verify first';
    summary = 'Important warning signs were found. Verify independently before continuing.';
  } else if (score >= 18) {
    level = 'medium';
    verdict = 'Caution recommended';
    summary = 'Some warning signs need checking before you trust this request.';
  }

  const actions = level === 'critical'
    ? ['Do not pay or share any code', 'Block the sender', 'Report the account on the original platform', 'Contact your bank immediately if you already paid']
    : level === 'high'
      ? ['Pause the transaction', 'Verify through an official website or phone number', 'Use platform-protected payment only', 'Ask a trusted person to review']
      : ['Keep communication inside the marketplace', 'Inspect seller history and item photos', 'Use buyer-protected payment', 'Never share OTP, password or card security code'];

  return {
    score,
    level,
    verdict,
    summary,
    findings,
    actions,
    checkedUrls: urlReports.map(({ url, host }) => ({ url, host })),
    disclaimer: 'SafePay provides risk guidance, not a guarantee or legal determination.',
  };
}
