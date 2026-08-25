/**
 * A single subscription table row.
 * - Shows the "Renewing Soon" badge when the backend flags it (active only).
 * - Greys out visually when paused.
 * - Toggle flips ACTIVE/PAUSED; delete removes permanently.
 */
import { useSubscriptionContext } from '../context/SubscriptionContext.jsx';
import { formatCurrency, formatDate, formatDaysRemaining } from '../utils/formatters.js';
import ToggleSwitch from './ToggleSwitch.jsx';
import RenewingSoonBadge from './RenewingSoonBadge.jsx';

const CYCLE_LABEL = { MONTHLY: 'Monthly', YEARLY: 'Yearly' };

export default function SubscriptionRow({ subscription }) {
  const { toggleStatus, removeSubscription } = useSubscriptionContext();
  const isActive = subscription.status === 'ACTIVE';
  const showBadge = isActive && subscription.isRenewingSoon;

  return (
    <tr className={isActive ? '' : 'row--paused'}>
      <td className="cell--name">
        <span className="cell--name__text">{subscription.name}</span>
        {showBadge && <RenewingSoonBadge />}
      </td>

      <td>
        {formatCurrency(subscription.cost)}
        <span className="cell--sub">{CYCLE_LABEL[subscription.billingCycle]}</span>
      </td>

      <td>{formatCurrency(subscription.monthlyCost)}<span className="cell--sub">/mo</span></td>

      <td>
        {formatDate(subscription.nextRenewalDate)}
        <span className={`cell--sub ${showBadge ? 'cell--sub--warning' : ''}`}>
          {formatDaysRemaining(subscription.daysUntilRenewal)}
        </span>
      </td>

      <td>
        <ToggleSwitch
          checked={isActive}
          onChange={() => toggleStatus(subscription.id)}
          label={`Toggle ${subscription.name} active or paused`}
        />
      </td>

      <td className="cell--actions">
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={() => removeSubscription(subscription.id)}
          aria-label={`Delete ${subscription.name}`}
          title="Delete"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
