/**
 * App shell — composes the provider and the three dashboard regions:
 * metrics row, entry form, and subscription grid.
 */
import { SubscriptionProvider } from './context/SubscriptionContext.jsx';
import MetricsRow from './components/MetricsRow.jsx';
import EntryForm from './components/EntryForm.jsx';
import SubscriptionGrid from './components/SubscriptionGrid.jsx';

export default function App() {
  return (
    <SubscriptionProvider>
      <div className="app">
        <header className="app__header">
          <h1 className="app__title">Subscription Tracker</h1>
          <p className="app__subtitle">
            Track renewals and monitor your monthly cash-flow burn.
          </p>
        </header>

        <main className="app__main">
          <MetricsRow />
          <div className="app__layout">
            <EntryForm />
            <SubscriptionGrid />
          </div>
        </main>
      </div>
    </SubscriptionProvider>
  );
}
