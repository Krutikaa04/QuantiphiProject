/**
 * Client-side form validation. Mirrors the backend rules so users get instant,
 * field-level feedback before a request is ever sent.
 */

export const BILLING_CYCLES = ['MONTHLY', 'YEARLY'];

/**
 * Validate the entry-form values.
 * @param {{ name: string, cost: string|number, billingCycle: string, nextRenewalDate: string }} values
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateSubscriptionForm(values) {
  const errors = {};

  if (!values.name || values.name.trim().length === 0) {
    errors.name = 'Service name is required.';
  }

  const cost = Number(values.cost);
  if (!Number.isFinite(cost) || cost <= 0) {
    errors.cost = 'Cost must be greater than 0.';
  }

  if (!BILLING_CYCLES.includes(values.billingCycle)) {
    errors.billingCycle = 'Choose a billing cycle.';
  }

  if (!values.nextRenewalDate || Number.isNaN(Date.parse(values.nextRenewalDate))) {
    errors.nextRenewalDate = 'Pick a valid renewal date.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
