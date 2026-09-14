import { checkGoogleWebRisk } from '../providers/googleWebRiskProvider.js';
import { checkVirusTotal } from '../providers/virusTotalProvider.js';

export async function addThreatIntelligence(localResult) {
  const urls = localResult.checkedUrls.slice(0, 5);
  if (!urls.length) return { ...localResult, intelligence: { mode: 'local', checkedAt: new Date().toISOString(), providers: [], note: 'No URL was supplied, so only explainable local pattern checks were used.' } };
  const reports = (await Promise.all(urls.flatMap((item) => [
    checkGoogleWebRisk(item.url).then((report) => ({ url: item.url, ...report })),
    checkVirusTotal(item.url).then((report) => ({ url: item.url, ...report })),
  ])));
  const threats = reports.flatMap((report) => report.threats.map((threat) => ({ threat, url: report.url })));
  if (!threats.length) {
    const live = reports.some((report) => ['checked', 'no_record'].includes(report.status));
    return { ...localResult, intelligence: { mode: live ? 'live' : 'local', checkedAt: new Date().toISOString(), providers: reports, note: live ? 'Configured live sources returned no known threat match. This is not proof that the person or link is safe.' : 'Live providers are not configured; explainable local checks were used.' } };
  }
  const evidence = threats.map(({ threat, url }) => ({ category: 'Known threat intelligence match', weight: 45, evidence: `A configured live security source reported ${threat.toLowerCase().replaceAll('_', ' ')} for ${new URL(url).hostname}.` }));
  return { ...localResult, score: Math.max(localResult.score, 95), level: 'critical', verdict: 'Known threat detected — do not open or pay', summary: 'A configured live threat-intelligence source reported this URL as unsafe. Stop and verify through an official channel.', findings: [...evidence, ...localResult.findings], intelligence: { mode: 'live', checkedAt: new Date().toISOString(), providers: reports, note: 'At least one configured live source returned a threat match.' } };
}
