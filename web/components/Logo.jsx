import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Logo() {
  return <Link href="/" className="logo" aria-label="SafePay Guardian home"><span className="logo-mark"><ShieldCheck size={22} /></span><span>SafePay<strong>Guardian</strong></span></Link>;
}
