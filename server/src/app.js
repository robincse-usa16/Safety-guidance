import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import scanRoutes from './routes/scanRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.clientOrigins.includes(origin)) return callback(null, true);
    if (config.nodeEnv !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
    return callback(Object.assign(new Error('This website origin is not allowed by the SafePay API.'), { status: 403 }));
  },
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json({ limit: '250kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-8' }));

app.use('/api/health', healthRoutes);
app.use('/api/scans', scanRoutes);

app.use(notFound);
app.use(errorHandler);
