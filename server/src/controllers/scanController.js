import crypto from 'node:crypto';
import { analyzeRisk } from '../services/riskEngine.js';
import { findScan, findScans, removeScan, saveScan } from '../services/scanStore.js';
import { validateScanInput } from '../utils/validation.js';
import { redactSensitiveText } from '../services/redactionService.js';
import { addThreatIntelligence } from '../services/threatIntelligenceService.js';

export async function listScans(_req, res, next) {
  try {
    res.json({ items: await findScans() });
  } catch (error) { next(error); }
}

export async function getScan(req, res, next) {
  try {
    const scan = await findScan(req.params.id);
    if (!scan) return res.status(404).json({ error: 'Scan not found.' });
    res.json(scan);
  } catch (error) { next(error); }
}

export async function createScan(req, res, next) {
  try {
    const validationError = validateScanInput(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const type = String(req.body.type || 'message').trim();
    const content = String(req.body.content).trim();
    const scan = {
      id: crypto.randomUUID(),
      type,
      preview: redactSensitiveText(content).slice(0, 160),
      createdAt: new Date().toISOString(),
      result: await addThreatIntelligence(analyzeRisk(content, type)),
    };
    await saveScan(scan);
    res.status(201).json(scan);
  } catch (error) { next(error); }
}

export async function deleteScan(req, res, next) {
  try {
    const removed = await removeScan(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Scan not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
}
