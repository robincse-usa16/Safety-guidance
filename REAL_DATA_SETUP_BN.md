# SafePay real-data ও connection setup

## ১. `Failed to fetch` কেন হয়েছিল

Frontend `http://127.0.0.1:3000` থেকে চললেও API শুধু `http://localhost:3000` origin অনুমোদন করছিল। Browser origin দুটিকে আলাদা হিসেবে দেখে request block করেছিল। V2.1-এ API এখন local development-এ দুটিই অনুমোদন করে এবং frontend যে hostname-এ খোলে, স্বয়ংক্রিয়ভাবে সেই hostname-এর port `4000` ব্যবহার করে।

## ২. সঠিকভাবে চালানোর নিয়ম

VS Code-এ অবশ্যই `safepay-guardian-v2` root folder খুলুন। এই folder-এ `web`, `server` এবং root `package.json` একসঙ্গে দেখা যাবে। তারপর terminal-এ:

```bash
npm install
npm run dev
```

Terminal বন্ধ করবেন না। Browser-এ খুলুন:

- Website: `http://127.0.0.1:3000`
- API check: `http://127.0.0.1:4000/api/health`

Scanner-এর ওপরে `API connected` দেখা গেলে connection ঠিক। অন্য terminal-এ `npm run doctor` দিয়েও পরীক্ষা করা যায়।

## ৩. API key ছাড়া কী কাজ করবে

- Screenshot OCR browser-এর ভেতরে চলবে।
- QR image decode browser-এর ভেতরে চলবে।
- Message, email, link ও deal-এর explainable local risk rules চলবে।
- Warning signs, score, evidence এবং recommended action দেখা যাবে।

এগুলো real code ও working analysis, কিন্তু external threat database নয়। তাই result-এ `Local protection mode` লেখা থাকবে। এটি কাউকে নিশ্চিতভাবে scammer বা safe প্রমাণ করতে পারে না।

## ৪. live URL data চালু করা

Root-এর `.env.example` copy করে `.env` বানান। Secret key কখনো chat, GitHub বা frontend code-এ দেবেন না।

```env
PORT=4000
CLIENT_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
GOOGLE_WEB_RISK_API_KEY=your_server_secret_key
VIRUSTOTAL_API_KEY=your_server_secret_key
ENABLE_VIRUSTOTAL_LOOKUP=false
```

Google Web Risk key দিলে URL Google-এর live unsafe-resource list-এ query হবে। VirusTotal ব্যবহার করতে চাইলে key দেওয়ার পাশাপাশি `ENABLE_VIRUSTOTAL_LOOKUP=true` করুন। VirusTotal lookup URL-টি third party-র কাছে পাঠায়, তাই production privacy policy ও user disclosure ছাড়া এটি চালু করবেন না। `.env` বদলানোর পর server restart করুন।

Result-এ provider status দেখা যাবে:

- `checked`: live source query সফল হয়েছে।
- `no record`: provider-এর কাছে ঐ URL-এর report নেই।
- `not configured`: key/opt-in চালু নেই; local result ব্যবহার হয়েছে।
- `provider error` বা `unavailable`: provider সাময়িকভাবে response দেয়নি।

## ৫. “real seller নাকি fake seller” বিষয়ে সত্য কথা

শুধু screenshot, নাম, phone number বা profile link দিয়ে automated system ১০০% নির্ভুলভাবে মানুষের পরিচয় নির্ধারণ করতে পারে না। SafePay-কে চার ধরনের verdict দিতে হবে: `High risk`, `Suspicious`, `Unable to verify`, এবং `No known threat detected`। শেষ verdict-টিও guarantee নয়।

পরবর্তী production phase-এ marketplace OAuth/official API, verified business registry, domain age/RDAP, payment-method protection check, user reports with moderation এবং manual review যোগ করা দরকার। কোনো provider result না থাকলে UI-তে কখনো `Verified safe` লেখা যাবে না।

## ৬. deploy করার সময়

Frontend production domain `CLIENT_ORIGINS`-এ দিন, যেমন `https://yourdomain.com`। `NEXT_PUBLIC_API_URL`-এ deployed backend URL দিতে হবে। HTTPS ব্যবহার করুন, rate-limit shared store-এ নিন, database যোগ করুন এবং raw private message সংরক্ষণ বন্ধ রাখুন। Public launch-এর আগে security review, false-positive testing, privacy policy ও abuse-report workflow দরকার।
