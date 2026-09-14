import { ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
export default function RiskBadge({ level, compact = false }) { const Icon = level === 'low' ? ShieldCheck : level === 'medium' ? TriangleAlert : ShieldAlert; return <span className={`risk-badge ${level} ${compact ? 'compact' : ''}`}><Icon size={compact ? 14 : 17} />{level} risk</span>; }
