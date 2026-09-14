'use client';
import { useEffect, useState } from 'react';
import { AtSign, FileImage, Link2, LoaderCircle, MessageSquareText, QrCode, ShieldCheck, ShoppingBag } from 'lucide-react';
import { scanApi } from '@/lib/api';
import ResultPanel from './ResultPanel';
import UploadAnalyzer from './UploadAnalyzer';

const tabs = [
  { id: 'message', label: 'Message', icon: MessageSquareText },
  { id: 'url', label: 'Link', icon: Link2 },
  { id: 'transaction', label: 'Deal', icon: ShoppingBag },
  { id: 'email', label: 'Email', icon: AtSign, apiType: 'message' },
  { id: 'screenshot', label: 'Screenshot', icon: FileImage, apiType: 'message' },
  { id: 'qr', label: 'QR code', icon: QrCode },
];
const examples = {
  message: 'URGENT: Your bank account will be suspended. Send your OTP now and pay the verification fee with a gift card.',
  url: 'http://192.168.4.2/secure-verify-account',
  transaction: 'Seller wants full advance payment by crypto, asks me to continue on Telegram, and the price is 90% off.',
  email: 'Official bank support: Your account will be blocked. Click http://192.168.4.2/login and share the verification code immediately.',
  screenshot: '',
  qr: '',
};

export default function Scanner({ initialType = 'message', compact = false }) {
  const [type, setType] = useState(initialType);
  const [content, setContent] = useState('');
  const [scan, setScan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [providerStatus, setProviderStatus] = useState(null);
  const active = tabs.find((item) => item.id === type) || tabs[0];
  useEffect(() => {
    scanApi.health()
      .then((health) => { setApiStatus('online'); setProviderStatus(health.providers); })
      .catch(() => setApiStatus('offline'));
  }, []);
  async function submit(event) { event.preventDefault(); setLoading(true); setError(''); const apiType = type === 'qr' ? (/^https?:\/\//i.test(content) ? 'url' : 'message') : (active.apiType || type); try { setScan(await scanApi.analyze({ type: apiType, content })); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } }
  if (scan) return <ResultPanel scan={scan} onReset={() => { setScan(null); setContent(''); }} />;
  const uploadMode = type === 'screenshot' || type === 'qr';
  return <div className={`scanner-card ${compact ? 'compact' : ''}`}><div className={`api-state ${apiStatus}`} role="status"><span />{apiStatus === 'online' ? `API connected · Live URL data ${Object.values(providerStatus || {}).includes('configured') ? 'enabled' : 'not configured'}` : apiStatus === 'offline' ? 'API offline · run npm run dev from the project root' : 'Connecting to SafePay API…'}</div><div className="scan-tabs" role="tablist">{tabs.map(({ id, label, icon: Icon }) => <button role="tab" aria-selected={type === id} className={type === id ? 'active' : ''} key={id} onClick={() => { setType(id); setContent(''); setError(''); }}><Icon size={17} />{label}</button>)}</div><form onSubmit={submit}>{uploadMode && <UploadAnalyzer mode={type === 'qr' ? 'qr' : 'screenshot'} onExtract={setContent} />}<label htmlFor="scan-content">{uploadMode ? 'Extracted content — review before analyzing' : type === 'url' ? 'Paste a suspicious link without opening it' : type === 'transaction' ? 'Describe the seller, item and payment request' : `Paste the suspicious ${type}`}</label><textarea id="scan-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={12000} placeholder={uploadMode ? 'Extracted text or QR content will appear here...' : 'Remove passwords, OTPs and full card numbers before pasting...'} /><div className="input-meta">{!uploadMode ? <button type="button" onClick={() => setContent(examples[type])}>Use a risky example</button> : <span>Processed locally in your browser</span>}<span>{content.length.toLocaleString()} / 12,000</span></div>{error && <div className="form-error" role="alert">{error}</div>}<button className="scan-button" disabled={loading || apiStatus === 'offline' || content.trim().length < 5}>{loading ? <><LoaderCircle className="spin" />Analyzing...</> : <><ShieldCheck />Analyze risk</>}</button><p className="privacy-copy">Private by design. Never paste an OTP, password or complete card number.</p></form></div>;
}
