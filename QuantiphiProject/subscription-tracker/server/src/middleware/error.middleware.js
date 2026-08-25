/**
 * Centralized error handling.
 *
 * notFoundHandler catches unknown routes; errorHandler is the last middleware
 * and formats any thrown/forwarded error into the standard response envelope.
 */

import { failure } from '../utils/apiResponse.js';

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req, res) {
  return failure(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Express error-handling middleware (must keep the 4-arg signature).
 * Uses err.status when present, otherwise 500.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error.' : err.message;

  // Log full detail server-side; return a safe message to the client.
  console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  return failure(res, message, status);
}
