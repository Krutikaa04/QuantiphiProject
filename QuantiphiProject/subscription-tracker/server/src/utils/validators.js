/**
 * Reusable, framework-agnostic validation predicates.
 * These hold no HTTP knowledge so they can be used by middleware, models,
 * or tests interchangeably.
 */

import { BILLING_CYCLE_VALUES, SUBSCRIPTION_STATUS_VALUES } from '../config/constants.js';

/**
 * @param {*} value
 * @returns {boolean} true if value is a non-empty (after trim) string.
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Accepts numbers or numeric strings; must be finite and > 0.
 * @param {*} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  const num = typeof value === 'string' ? Number(value) : value;
  return typeof num === 'number' && Number.isFinite(num) && num > 0;
}

/**
 * @param {*} value
 * @returns {boolean} true if value is a recognised billing cycle.
 */
export function isValidBillingCycle(value) {
  return BILLING_CYCLE_VALUES.includes(value);
}

/**
 * @param {*} value
 * @returns {boolean} true if value is a recognised subscription status.
 */
export function isValidStatus(value) {
  return SUBSCRIPTION_STATUS_VALUES.includes(value);
}

/**
 * Validates a calendar date string (e.g. "2026-09-01") that parses to a real date.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidDateString(value) {
  if (!isNonEmptyString(value)) return false;
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
}
