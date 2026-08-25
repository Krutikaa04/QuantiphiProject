/**
 * SubscriptionContext — provides one shared instance of the subscriptions
 * state to the whole tree, so the form, metrics row, and grid stay in sync.
 */

import { createContext, useContext } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions.js';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const value = useSubscriptions();
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/** Consumer hook with a helpful guard against misuse. */
export function useSubscriptionContext() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return ctx;
}
