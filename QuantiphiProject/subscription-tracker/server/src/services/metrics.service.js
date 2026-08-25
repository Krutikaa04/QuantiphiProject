/**
 * Metrics service.
 *
 * Aggregates the top-of-dashboard numbers from the subscription collection.
 * The "savings simulation" lives here: PAUSED subscriptions are excluded from
 * the monthly burn rate, so pausing instantly lowers the metric.
 */

import { SUBSCRIPTION_STATUS } from '../config/constants.js';
import { toMonthlyCost } from './normalization.service.js';
import { isRenewingSoon } from './dateIntersect.service.js';

/**
 * @param {import('../models/subscription.model.js').Subscription} sub
 * @returns {boolean}
 */
function isActive(sub) {
  return sub.status === SUBSCRIPTION_STATUS.ACTIVE;
}

/**
 * Total monthly burn rate across ACTIVE subscriptions only.
 * Rounded to 2 decimals to avoid floating-point noise in the UI.
 *
 * @param {import('../models/subscription.model.js').Subscription[]} subscriptions
 * @returns {number}
 */
export function calculateMonthlyBurnRate(subscriptions) {
  const total = subscriptions
    .filter(isActive)
    .reduce((sum, sub) => sum + toMonthlyCost(sub.cost, sub.billingCycle), 0);

  return Math.round(total * 100) / 100;
}

/**
 * Count of ACTIVE subscriptions renewing within the alert window.
 * Paused subscriptions never contribute to the alert count.
 *
 * @param {import('../models/subscription.model.js').Subscription[]} subscriptions
 * @param {Date} [currentDate=new Date()]
 * @returns {number}
 */
export function calculateUpcomingRenewalsCount(subscriptions, currentDate = new Date()) {
  return subscriptions.filter(
    (sub) => isActive(sub) && isRenewingSoon(sub.nextRenewalDate, currentDate),
  ).length;
}

/**
 * Build the full dashboard metrics payload.
 *
 * @param {import('../models/subscription.model.js').Subscription[]} subscriptions
 * @param {Date} [currentDate=new Date()]
 * @returns {{ monthlyBurnRate: number, upcomingRenewalsCount: number }}
 */
export function buildDashboardMetrics(subscriptions, currentDate = new Date()) {
  return {
    monthlyBurnRate: calculateMonthlyBurnRate(subscriptions),
    upcomingRenewalsCount: calculateUpcomingRenewalsCount(subscriptions, currentDate),
  };
}
