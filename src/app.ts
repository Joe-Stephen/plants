import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import router from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rateLimiter';
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(compression());
// Apply rate limiting to API routes
app.use('/api', apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Internal API Routes
app.use('/api', router);
// Serve static files if they exist (Monolithic deployment)
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  // Catch-all route to serve the SPA
  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send(
      'API is running successfully. <br> For frontend, please visit <a href="http://localhost:5173">http://localhost:5173</a>',
    );
  });
}
app.use(errorHandler);
export default app;
