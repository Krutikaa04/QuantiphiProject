/**
 * Request validation middleware.
 *
 * Rejects malformed payloads before they reach controllers, returning clear
 * 400 responses. Keeps business/service code free of defensive checks.
 */

import { failure } from '../utils/apiResponse.js';
import {
  isNonEmptyString,
  isPositiveNumber,
  isValidBillingCycle,
  isValidDateString,
  isValidStatus,
} from '../utils/validators.js';

/**
 * Validate the payload for creating a subscription.
 * Expects: { name, cost, billingCycle, nextRenewalDate }
 */
export function validateNewSubscription(req, res, next) {
  const { name, cost, billingCycle, nextRenewalDate } = req.body ?? {};
  const errors = [];

  if (!isNonEmptyString(name)) errors.push('name is required.');
  if (!isPositiveNumber(cost)) errors.push('cost must be a number greater than 0.');
  if (!isValidBillingCycle(billingCycle)) errors.push('billingCycle must be MONTHLY or YEARLY.');
  if (!isValidDateString(nextRenewalDate)) errors.push('nextRenewalDate must be a valid date.');

  if (errors.length > 0) {
    return failure(res, errors.join(' '), 400);
  }
  return next();
}

/**
 * Validate the payload for a status toggle.
 * Expects: { status }
 */
export function validateStatusUpdate(req, res, next) {
  const { status } = req.body ?? {};

  if (!isValidStatus(status)) {
    return failure(res, 'status must be ACTIVE or PAUSED.', 400);
  }
  return next();
}
