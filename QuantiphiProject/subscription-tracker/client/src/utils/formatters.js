/**
 * Presentation helpers. Pure functions, no React.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Format a number as USD currency, e.g. 25.9 -> "$25.90".
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const value = Number(amount);
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

/**
 * Format a date string into a friendly label, e.g. "Aug 28, 2026".
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  const time = Date.parse(dateStr);
  if (Number.isNaN(time)) return '—';
  return new Date(time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Human-friendly "days remaining" label from a signed day count.
 * @param {number|null} days
 * @returns {string}
 */
export function formatDaysRemaining(days) {
  if (days === null || days === undefined) return '—';
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
}

/**
 * Today's date as a yyyy-mm-dd string, for use as a date-input default/min.
 * @returns {string}
 */
export function todayISO() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}
