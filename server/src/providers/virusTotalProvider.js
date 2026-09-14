import { config } from '../config.js';

function urlId(url) {
  return Buffer.from(url).toString('base64url');
}

export async function checkVirusTotal(url) {
  if (!config.virusTotalApiKey || !config.enableVirusTotalLookup) {
    return { provider: 'virustotal', status: 'not_configured', threats: [], stats: null };
  }

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId(url)}`, {
      headers: { 'x-apikey': config.virusTotalApiKey },
      signal: AbortSignal.timeout(6000),
    });
    if (response.status === 404) return { provider: 'virustotal', status: 'no_record', threats: [], stats: null };
    if (!response.ok) return { provider: 'virustotal', status: 'provider_error', threats: [], stats: null, httpStatus: response.status };

    const payload = await response.json();
    const stats = payload.data?.attributes?.last_analysis_stats || {};
    const malicious = Number(stats.malicious || 0);
    const suspicious = Number(stats.suspicious || 0);
    return {
      provider: 'virustotal',
      status: 'checked',
      threats: malicious || suspicious ? ['SECURITY_VENDOR_DETECTIONS'] : [],
      stats: { malicious, suspicious, harmless: Number(stats.harmless || 0), undetected: Number(stats.undetected || 0) },
    };
  } catch (error) {
    return { provider: 'virustotal', status: 'unavailable', threats: [], stats: null, message: error.name === 'TimeoutError' ? 'Provider timeout' : 'Provider unavailable' };
  }
}
