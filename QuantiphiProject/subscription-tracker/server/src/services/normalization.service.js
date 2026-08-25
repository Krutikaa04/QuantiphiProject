/**
 * Cost Uniformity Engine.
 *
 * Subscriptions bill on different cycles (monthly vs yearly). To compare them
 * and compute a single burn-rate metric, every cost is normalized to a common
 * unit. These are pure functions with no I/O.
 */

import { BILLING_CYCLES, MONTHS_PER_YEAR } from '../config/constants.js';

/**
 * Normalize a subscription cost to its monthly-equivalent rate.
 * A yearly cost is divided across 12 months; a monthly cost passes through.
 *
 * @param {number} cost
 * @param {string} billingCycle - one of BILLING_CYCLES
 * @returns {number} monthly-equivalent cost
 */
export function toMonthlyCost(cost, billingCycle) {
  const amount = Number(cost);
  if (!Number.isFinite(amount)) return 0;

  if (billingCycle === BILLING_CYCLES.YEARLY) {
    return amount / MONTHS_PER_YEAR;
  }
  // Default / MONTHLY: already a monthly figure.
  return amount;
}

/**
 * Normalize a subscription cost to its annual-equivalent rate.
 * Provided for completeness / future reporting.
 *
 * @param {number} cost
 * @param {string} billingCycle - one of BILLING_CYCLES
 * @returns {number} annual-equivalent cost
 */
export function toAnnualCost(cost, billingCycle) {
  const amount = Number(cost);
  if (!Number.isFinite(amount)) return 0;

  if (billingCycle === BILLING_CYCLES.YEARLY) {
    return amount;
  }
  return amount * MONTHS_PER_YEAR;
}
