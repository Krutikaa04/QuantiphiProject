/**
 * Date Intersect Calculator.
 *
 * Evaluates a subscription's next renewal date against a reference "current
 * date" to determine how many days remain, and whether it is renewing soon.
 *
 * The current date is injected (defaulting to now) so results are deterministic
 * and easily testable, per the "fixed current date" requirement.
 */

import { RENEWAL_ALERT_WINDOW_DAYS } from '../config/constants.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Strip the time component so day-difference math is not skewed by hours.
 * @param {Date} date
 * @returns {Date} a date at local midnight
 */
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Number of whole days from currentDate until the renewal date.
 * Negative when the renewal date is already in the past.
 *
 * @param {string} renewalDateStr - calendar date string
 * @param {Date} [currentDate=new Date()]
 * @returns {number|null} whole days remaining, or null if the date is invalid
 */
export function daysUntil(renewalDateStr, currentDate = new Date()) {
  const renewalTime = Date.parse(renewalDateStr);
  if (Number.isNaN(renewalTime)) return null;

  const renewal = startOfDay(new Date(renewalTime));
  const today = startOfDay(currentDate);

  return Math.round((renewal.getTime() - today.getTime()) / MS_PER_DAY);
}

/**
 * True when a renewal falls within the urgent alert window
 * (from today up to and including RENEWAL_ALERT_WINDOW_DAYS days out).
 * Past-due dates are not flagged as "renewing soon".
 *
 * @param {string} renewalDateStr
 * @param {Date} [currentDate=new Date()]
 * @returns {boolean}
 */
export function isRenewingSoon(renewalDateStr, currentDate = new Date()) {
  const days = daysUntil(renewalDateStr, currentDate);
  if (days === null) return false;
  return days >= 0 && days <= RENEWAL_ALERT_WINDOW_DAYS;
}
