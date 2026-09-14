'use client';
import { useEffect, useState } from 'react';
import { LoaderCircle, SearchX, Trash2 } from 'lucide-react';
import { scanApi } from '@/lib/api';
import RiskBadge from './RiskBadge';

export default function HistoryClient({ limit }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { scanApi.list().then((data) => setItems(data.items)).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  async function remove(id) { try { await scanApi.remove(id); setItems((value) => value.filter((item) => item.id !== id)); } catch (err) { setError(err.message); } }
  if (loading) return <div className="status-box"><LoaderCircle className="spin" />Loading history...</div>;
  if (error) return <div className="status-box error">{error}<small>Make sure the API is running on port 4000.</small></div>;
  const visible = limit ? items.slice(0, limit) : items;
  if (!visible.length) return <div className="empty-state"><SearchX /><h2>No checks yet</h2><p>Run a risk check and the result will appear here.</p></div>;
  return <div className="history-list">{visible.map((item) => <article key={item.id}><div className={`history-score ${item.result.level}`}><strong>{item.result.score}</strong><small>/100</small></div><div className="history-copy"><div><RiskBadge level={item.result.level} compact /><span>{new Date(item.createdAt).toLocaleString()}</span></div><h3>{item.result.verdict}</h3><p>{item.preview}</p></div><button className="icon-button" onClick={() => remove(item.id)} aria-label="Delete scan"><Trash2 size={17} /></button></article>)}</div>;
}
