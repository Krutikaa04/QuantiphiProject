/**
 * Route definitions: maps HTTP verbs/paths to controllers, guarded by
 * validation middleware where needed.
 */

import { Router } from 'express';
import {
  listSubscriptions,
  createSubscriptionHandler,
  updateStatus,
  getMetrics,
  deleteSubscription,
} from '../controllers/subscription.controller.js';
import {
  validateNewSubscription,
  validateStatusUpdate,
} from '../middleware/validate.middleware.js';

const router = Router();

// Dashboard metrics
router.get('/metrics', getMetrics);

// Subscriptions collection
router.get('/subscriptions', listSubscriptions);
router.post('/subscriptions', validateNewSubscription, createSubscriptionHandler);

// Single subscription
router.patch('/subscriptions/:id/status', validateStatusUpdate, updateStatus);
router.delete('/subscriptions/:id', deleteSubscription);

export default router;
