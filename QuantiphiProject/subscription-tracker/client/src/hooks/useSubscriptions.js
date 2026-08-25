/**
 * useSubscriptions — encapsulates all data fetching and mutations for the
 * dashboard, plus derived metrics.
 *
 * Design choices for a snappy UX:
 *  - Toggling status is OPTIMISTIC: local state updates immediately (row greys
 *    out / burn rate drops at once), then the server call reconciles. On error
 *    we roll back and surface a message.
 *  - Metrics are DERIVED on the client from the decorated subscription list
 *    (each row already carries `monthlyCost` and `isRenewingSoon` computed by
 *    the backend). This keeps the two headline numbers perfectly in sync with
 *    the table without an extra round-trip — the backend remains the source of
 *    the underlying math.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from '../api/subscriptionApi.js';

const STATUS = { ACTIVE: 'ACTIVE', PAUSED: 'PAUSED' };

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Load (or reload) the full list from the server. */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Add a subscription; returns true on success so the form can reset. */
  const addSubscription = useCallback(async (payload) => {
    setError(null);
    try {
      const created = await api.addSubscription(payload);
      setSubscriptions((prev) => [...prev, created]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  /** Optimistically flip ACTIVE <-> PAUSED, then reconcile with the server. */
  const toggleStatus = useCallback(
    async (id) => {
      setError(null);

      let nextStatus = STATUS.ACTIVE;
      let previous = null;

      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.id !== id) return sub;
          previous = sub.status;
          nextStatus = sub.status === STATUS.ACTIVE ? STATUS.PAUSED : STATUS.ACTIVE;
          return { ...sub, status: nextStatus };
        }),
      );

      try {
        const updated = await api.updateStatus(id, nextStatus);
        // Reconcile with the server's canonical record (keeps derived fields fresh).
        setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? updated : sub)));
      } catch (err) {
        // Roll back the optimistic change.
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: previous } : sub)),
        );
        setError(err.message);
      }
    },
    [],
  );

  /** Permanently remove a subscription (optimistic with rollback). */
  const removeSubscription = useCallback(
    async (id) => {
      setError(null);
      const snapshot = subscriptions;
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      try {
        await api.deleteSubscription(id);
      } catch (err) {
        setSubscriptions(snapshot); // roll back
        setError(err.message);
      }
    },
    [subscriptions],
  );

  /** Derived headline metrics — active-only burn rate + upcoming alert count. */
  const metrics = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === STATUS.ACTIVE);
    const monthlyBurnRate = active.reduce((sum, s) => sum + (s.monthlyCost || 0), 0);
    const upcomingRenewalsCount = active.filter((s) => s.isRenewingSoon).length;
    return {
      monthlyBurnRate: Math.round(monthlyBurnRate * 100) / 100,
      upcomingRenewalsCount,
    };
  }, [subscriptions]);

  return {
    subscriptions,
    metrics,
    loading,
    error,
    addSubscription,
    toggleStatus,
    removeSubscription,
    refresh,
  };
}
