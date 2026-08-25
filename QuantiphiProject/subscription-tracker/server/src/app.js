/**
 * Express app assembly.
 *
 * Kept separate from server.js (which calls listen) so the app can be imported
 * directly in tests without opening a port.
 */

import express from 'express';
import cors from 'cors';

import subscriptionRoutes from './routes/subscription.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

/**
 * Create and configure the Express application.
 * @returns {import('express').Express}
 */
export function createApp() {
  const app = express();

  // Core middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

  // API routes
  app.use('/api', subscriptionRoutes);

  // 404 + error handling (must be registered last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
