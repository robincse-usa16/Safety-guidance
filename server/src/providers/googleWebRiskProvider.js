import { config } from '../config.js';

const threatTypes = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];

export async function checkGoogleWebRisk(url) {
  if (!config.googleWebRiskApiKey) return { provider: 'google-web-risk', status: 'not_configured', threats: [] };
  const query = new URLSearchParams({ uri: url, key: config.googleWebRiskApiKey });
  threatTypes.forEach((type) => query.append('threatTypes', type));
  try {
    const response = await fetch(`https://webrisk.googleapis.com/v1/uris:search?${query}`, { signal: AbortSignal.timeout(4500) });
    if (!response.ok) return { provider: 'google-web-risk', status: 'provider_error', threats: [], httpStatus: response.status };
    const data = await response.json();
    return { provider: 'google-web-risk', status: 'checked', threats: data.threat?.threatTypes || [] };
  } catch (error) {
    return { provider: 'google-web-risk', status: 'unavailable', threats: [], message: error.name === 'TimeoutError' ? 'Provider timeout' : 'Provider unavailable' };
  }
}
