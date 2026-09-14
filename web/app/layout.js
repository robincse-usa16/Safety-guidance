import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'SafePay Guardian — Check Before You Pay', template: '%s | SafePay Guardian' },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: { title: site.name, description: site.description, type: 'website', siteName: site.name },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const data = { '@context': 'https://schema.org', '@type': 'WebApplication', name: site.name, url: site.url, applicationCategory: 'SecurityApplication', operatingSystem: 'Any', description: site.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /><JsonLd data={data} /></body></html>;
}
