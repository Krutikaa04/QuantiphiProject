/**
 * Subscription model + factory.
 *
 * Defines the canonical record shape and the single place records are created,
 * guaranteeing every stored subscription is normalized and consistent.
 */

import { randomUUID } from 'node:crypto';
import { SUBSCRIPTION_STATUS } from '../config/constants.js';

/**
 * @typedef {Object} Subscription
 * @property {string} id                 - unique identifier
 * @property {string} name               - service name (e.g. "Netflix")
 * @property {number} cost               - raw cost as entered, in the sub's billing cycle
 * @property {string} billingCycle       - one of BILLING_CYCLES
 * @property {string} nextRenewalDate    - ISO/calendar date string (e.g. "2026-09-01")
 * @property {string} status             - one of SUBSCRIPTION_STATUS
 * @property {string} createdAt          - ISO timestamp of creation
 */

/**
 * Build a normalized Subscription record from raw (already-validated) input.
 *
 * @param {Object} input
 * @param {string} input.name
 * @param {number|string} input.cost
 * @param {string} input.billingCycle
 * @param {string} input.nextRenewalDate
 * @returns {Subscription}
 */
export function createSubscription({ name, cost, billingCycle, nextRenewalDate }) {
  return {
    id: randomUUID(),
    name: name.trim(),
    cost: Number(cost),
    billingCycle,
    nextRenewalDate,
    status: SUBSCRIPTION_STATUS.ACTIVE, // every new subscription starts active
    createdAt: new Date().toISOString(),
  };
}
