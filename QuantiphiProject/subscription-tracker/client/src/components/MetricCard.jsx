/**
 * A single prominent "digital card" for the metrics row.
 */
export default function MetricCard({ label, value, hint, variant = 'default' }) {
  return (
    <div className={`metric-card metric-card--${variant}`}>
      <span className="metric-card__label">{label}</span>
      <span className="metric-card__value">{value}</span>
      {hint && <span className="metric-card__hint">{hint}</span>}
    </div>
  );
}
