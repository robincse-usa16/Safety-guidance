import { Router } from 'express';
import { createScan, deleteScan, getScan, listScans } from '../controllers/scanController.js';

const router = Router();
router.get('/', listScans);
router.get('/:id', getScan);
router.post('/', createScan);
router.delete('/:id', deleteScan);
export default router;
