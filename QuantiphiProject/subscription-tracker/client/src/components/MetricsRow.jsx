/**
 * The metrics row: two prominent cards driven by derived dashboard metrics.
 */
import { useSubscriptionContext } from '../context/SubscriptionContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import MetricCard from './MetricCard.jsx';

export default function MetricsRow() {
  const { metrics, subscriptions } = useSubscriptionContext();

  const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const pausedCount = subscriptions.length - activeCount;

  const alertVariant = metrics.upcomingRenewalsCount > 0 ? 'warning' : 'default';

  return (
    <section className="metrics-row" aria-label="Dashboard metrics">
      <MetricCard
        label="Total Monthly Burn Rate"
        value={formatCurrency(metrics.monthlyBurnRate)}
        hint={
          pausedCount > 0
            ? `${activeCount} active · ${pausedCount} paused (excluded)`
            : `${activeCount} active subscription${activeCount === 1 ? '' : 's'}`
        }
        variant="accent"
      />
      <MetricCard
        label="Upcoming Renewals"
        value={metrics.upcomingRenewalsCount}
        hint="Due within the next 7 days"
        variant={alertVariant}
      />
    </section>
  );
}
