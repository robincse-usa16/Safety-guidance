import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDirectory, '../../.env'), quiet: true });

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigins: (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  nodeEnv: process.env.NODE_ENV || 'development',
  googleWebRiskApiKey: process.env.GOOGLE_WEB_RISK_API_KEY || '',
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY || '',
  enableVirusTotalLookup: process.env.ENABLE_VIRUSTOTAL_LOOKUP === 'true',
};
