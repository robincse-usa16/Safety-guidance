import HistoryClient from '@/components/HistoryClient';
export const metadata = { title: 'Scan History', robots: { index: false, follow: false } };
export default function Page() { return <section className="inside-page page-width"><div className="page-heading"><span>YOUR ACTIVITY</span><h1>Recent safety checks</h1><p>The demo API stores up to 100 results locally. Production accounts will use private user-owned database records.</p></div><HistoryClient /></section>; }
