/**
 * The subscription grid: a structured table of all subscriptions.
 * Handles loading, error, and empty states so the layout never looks broken.
 */
import { useSubscriptionContext } from '../context/SubscriptionContext.jsx';
import SubscriptionRow from './SubscriptionRow.jsx';

export default function SubscriptionGrid() {
  const { subscriptions, loading, error } = useSubscriptionContext();

  return (
    <section className="card grid-card" aria-label="Subscriptions">
      <h2 className="card__title">Your subscriptions</h2>

      {loading ? (
        <p className="state-msg">Loading subscriptions…</p>
      ) : error ? (
        <p className="state-msg state-msg--error">{error}</p>
      ) : subscriptions.length === 0 ? (
        <p className="state-msg">No subscriptions yet. Add your first one to get started.</p>
      ) : (
        <div className="table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Cost</th>
                <th>Monthly</th>
                <th>Next renewal</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <SubscriptionRow key={sub.id} subscription={sub} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
