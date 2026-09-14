import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <div>
        <Logo />
        <p>Ask before you trust. Check before you pay.</p>
      </div>
      <div className="footer-links">
        <Link href="/safety">Safety</Link>
        <Link href="/recovery">Recovery</Link>
        <Link href="/pricing">Pricing</Link>
      </div>
      <div className="footer-note">
        <ShieldCheck size={16} />
        Risk guidance—not a guarantee.
      </div>
    </footer>
  );
}
