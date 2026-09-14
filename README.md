# SafePay Guardian V2.1

SafePay Guardian V2 is a runnable full-stack scam-risk checking MVP with a server-rendered, SEO-ready Next.js frontend and Node.js/Express API.

## Run in Visual Studio Code

Requirements: Node.js 20.19+ (Node.js 22 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open:

- Website: http://localhost:3000
- API health: http://localhost:4000/api/health

Both frontend and backend must remain running in the same terminal. `API` and `WEB` logs will appear with different colors.

The scanner now shows `API connected` before it can submit. If it shows `API offline`, make sure you opened the project root (the folder containing this README) before running the command. Do not run only the `web` workspace.

In a second terminal you can diagnose the connection:

```bash
npm run doctor
```

## Verify

```bash
npm run check
```

This runs the risk-engine tests and a full Next.js production build.

## Included

- Premium responsive and accessible interface
- Next.js server-rendered SEO pages
- Scam, link, SMS, email, website, marketplace and payment checker pages
- Browser-side screenshot OCR and QR-code decoding
- Optional live Google Web Risk and VirusTotal URL lookups with automatic local fallback
- Sensitive-data redaction for stored previews
- Real Supabase login/register/reset forms when keys are configured
- Explainable 0–100 risk score, evidence and actions
- Local scan history and dashboard
- Pricing, safety and recovery pages
- Metadata, canonical URLs, robots.txt, sitemap.xml and JSON-LD
- Express security middleware, validation and rate limiting
- Supabase production schema and RLS migration
- Full architecture blueprint in `docs/ARCHITECTURE.md`

## Honest production status

This is a verified runnable product MVP, not a finished commercial security service. It works without external keys by using a local explainable rules engine, but that local mode is pattern analysis—not a live reputation lookup.

Supabase auth, Google Web Risk and opt-in VirusTotal URL-report adapters are implemented but activate only after you add your own keys. Family alerts, payment billing, seller-identity verification and human moderation remain roadmap items. Before taking payments, implement and independently security-test those services.

## Optional live configuration

The app works without keys. For Supabase authentication, copy `web/.env.local.example` to `web/.env.local` and add your project URL and publishable/anon key. For live URL reputation, copy the root `.env.example` to `.env` and add `GOOGLE_WEB_RISK_API_KEY`. VirusTotal is privacy-sensitive because a public URL lookup sends the URL to that provider; add `VIRUSTOTAL_API_KEY` and set `ENABLE_VIRUSTOTAL_LOOKUP=true` only after disclosing this in your privacy policy. Restart `npm run dev` after changing environment files.

Never put provider secret keys in `web/.env.local` or any variable beginning with `NEXT_PUBLIC_`. Keep them only in the root `.env`, which is read by the Node.js API.

See `REAL_DATA_SETUP_BN.md` for the Bangla connection, API-key and real-data guide.

## Important privacy rule

Do not store raw private conversations by default. Store a redacted preview, hash, score and evidence. SafePay offers guidance and must never claim that a person is definitively a scammer based only on automated analysis. A threat-list miss means “no known match was returned,” not “safe.”
