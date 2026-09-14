import { Router } from 'express';
import { config } from '../config.js';

const router = Router();
router.get('/', (_req, res) => res.json({
  status: 'ok',
  service: 'SafePay Guardian API',
  version: '2.1.0',
  providers: {
    googleWebRisk: config.googleWebRiskApiKey ? 'configured' : 'not_configured',
    virusTotal: config.virusTotalApiKey && config.enableVirusTotalLookup ? 'configured' : 'not_configured',
  },
}));
export default router;
