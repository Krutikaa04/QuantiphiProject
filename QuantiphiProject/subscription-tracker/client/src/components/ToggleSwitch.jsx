/**
 * Accessible Active/Paused toggle switch.
 * Renders as a real checkbox for keyboard + screen-reader support.
 */
export default function ToggleSwitch({ checked, onChange, disabled = false, label }) {
  return (
    <label className="toggle" title={checked ? 'Active — click to pause' : 'Paused — click to resume'}>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className="toggle__text">{checked ? 'Active' : 'Paused'}</span>
    </label>
  );
}
