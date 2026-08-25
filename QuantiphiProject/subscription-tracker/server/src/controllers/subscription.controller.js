/**
 * Subscription controllers.
 *
 * Thin orchestration only: parse request -> call store/services -> respond.
 * No business math lives here; that belongs to the service layer.
 */

import * as store from '../data/store.js';
import { createSubscription } from '../models/subscription.model.js';
import { buildDashboardMetrics } from '../services/metrics.service.js';
import { toMonthlyCost } from '../services/normalization.service.js';
import { daysUntil, isRenewingSoon } from '../services/dateIntersect.service.js';
import { success, failure } from '../utils/apiResponse.js';

/**
 * Decorate a stored subscription with derived, read-only display fields.
 * @param {import('../models/subscription.model.js').Subscription} sub
 * @param {Date} currentDate
 */
function decorate(sub, currentDate) {
  return {
    ...sub,
    monthlyCost: Math.round(toMonthlyCost(sub.cost, sub.billingCycle) * 100) / 100,
    daysUntilRenewal: daysUntil(sub.nextRenewalDate, currentDate),
    isRenewingSoon: isRenewingSoon(sub.nextRenewalDate, currentDate),
  };
}

/**
 * GET /api/subscriptions
 * Returns all subscriptions with derived fields.
 */
export function listSubscriptions(req, res, next) {
  try {
    const now = new Date();
    const data = store.getAll().map((sub) => decorate(sub, now));
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/subscriptions
 * Creates a subscription (payload already validated by middleware).
 */
export function createSubscriptionHandler(req, res, next) {
  try {
    const record = createSubscription(req.body);
    store.insert(record);
    return success(res, decorate(record, new Date()), 201);
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/subscriptions/:id/status
 * Toggles ACTIVE/PAUSED. Does NOT delete — this powers the savings simulation.
 */
export function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = store.update(id, { status });
    if (!updated) {
      return failure(res, `Subscription not found: ${id}`, 404);
    }
    return success(res, decorate(updated, new Date()));
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/metrics
 * Returns the dashboard metrics (burn rate + upcoming renewals count).
 */
export function getMetrics(req, res, next) {
  try {
    const metrics = buildDashboardMetrics(store.getAll(), new Date());
    return success(res, metrics);
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/subscriptions/:id
 * Explicit hard delete (distinct from pausing).
 */
export function deleteSubscription(req, res, next) {
  try {
    const { id } = req.params;
    const removed = store.remove(id);
    if (!removed) {
      return failure(res, `Subscription not found: ${id}`, 404);
    }
    return success(res, { id });
  } catch (err) {
    return next(err);
  }
}
