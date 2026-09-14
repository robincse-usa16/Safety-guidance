'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, Menu, ScanSearch, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const links = [
  { href: '/scam-checker', label: 'Check a risk', icon: ScanSearch },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/safety', label: 'Safety guide', icon: BookOpen },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Sign in' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="topbar"><Logo /><nav className={open ? 'nav open' : 'nav'}>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href ? 'active' : ''}>{Icon && <Icon size={17} />}{label}</Link>)}<Link className="nav-cta" href="/scam-checker" onClick={() => setOpen(false)}>Scan free</Link></nav><button type="button" className="menu-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></header>;
}
