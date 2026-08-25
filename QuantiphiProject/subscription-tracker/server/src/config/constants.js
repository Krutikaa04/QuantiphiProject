/**
 * Central configuration and enums.
 * Keeping these here means no magic numbers/strings leak into business logic.
 */

// Server
export const PORT = process.env.PORT || 4000;

// Renewal alerting: a subscription renewing within this many days is "urgent".
export const RENEWAL_ALERT_WINDOW_DAYS = 7;

// Number of months used to normalize a yearly cost into a monthly rate.
export const MONTHS_PER_YEAR = 12;

// Allowed billing cycles.
export const BILLING_CYCLES = Object.freeze({
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
});

// Allowed subscription states. Pausing excludes a sub from the burn rate
// WITHOUT deleting it (the "savings simulation" behaviour).
export const SUBSCRIPTION_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
});

// Convenience arrays for validation.
export const BILLING_CYCLE_VALUES = Object.values(BILLING_CYCLES);
export const SUBSCRIPTION_STATUS_VALUES = Object.values(SUBSCRIPTION_STATUS);
