/**
 * In-memory data collection.
 *
 * Deliberately isolated behind a small interface so it can be swapped for a
 * real database later without touching services or controllers.
 *
 * NOTE: state lives in module scope, so it resets on server restart. That is
 * acceptable for this dashboard; persistence can be added by reimplementing
 * these same functions against a DB driver.
 */

/** @type {import('../models/subscription.model.js').Subscription[]} */
const subscriptions = [];

/**
 * @returns {import('../models/subscription.model.js').Subscription[]} a shallow copy of all records.
 */
export function getAll() {
  return [...subscriptions];
}

/**
 * @param {string} id
 * @returns {import('../models/subscription.model.js').Subscription | undefined}
 */
export function getById(id) {
  return subscriptions.find((sub) => sub.id === id);
}

/**
 * Insert a new record.
 * @param {import('../models/subscription.model.js').Subscription} subscription
 * @returns {import('../models/subscription.model.js').Subscription} the inserted record.
 */
export function insert(subscription) {
  subscriptions.push(subscription);
  return subscription;
}

/**
 * Merge a partial patch into an existing record.
 * @param {string} id
 * @param {Partial<import('../models/subscription.model.js').Subscription>} patch
 * @returns {import('../models/subscription.model.js').Subscription | null} updated record, or null if not found.
 */
export function update(id, patch) {
  const index = subscriptions.findIndex((sub) => sub.id === id);
  if (index === -1) return null;

  subscriptions[index] = { ...subscriptions[index], ...patch, id };
  return subscriptions[index];
}

/**
 * Permanently remove a record. Used only by the explicit DELETE endpoint,
 * never by the pause/resume toggle.
 * @param {string} id
 * @returns {boolean} true if a record was removed.
 */
export function remove(id) {
  const index = subscriptions.findIndex((sub) => sub.id === id);
  if (index === -1) return false;

  subscriptions.splice(index, 1);
  return true;
}
