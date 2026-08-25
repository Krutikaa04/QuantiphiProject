/**
 * The onboarding entry form.
 * Controlled inputs with inline, field-level validation and a disabled submit
 * while a request is in flight. Resets cleanly on success.
 */
import { useState } from 'react';
import { useSubscriptionContext } from '../context/SubscriptionContext.jsx';
import { validateSubscriptionForm } from '../utils/clientValidation.js';
import { todayISO } from '../utils/formatters.js';

const EMPTY = {
  name: '',
  cost: '',
  billingCycle: 'MONTHLY',
  nextRenewalDate: todayISO(),
};

export default function EntryForm() {
  const { addSubscription } = useSubscriptionContext();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { isValid, errors: validationErrors } = validateSubscriptionForm(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const ok = await addSubscription({
      name: values.name.trim(),
      cost: Number(values.cost),
      billingCycle: values.billingCycle,
      nextRenewalDate: values.nextRenewalDate,
    });
    setSubmitting(false);

    if (ok) {
      setValues(EMPTY);
      setErrors({});
    }
  };

  return (
    <section className="card form-card" aria-label="Add subscription">
      <h2 className="card__title">Add a subscription</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label htmlFor="name">Service name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Netflix"
            value={values.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </div>

        <div className="form__field">
          <label htmlFor="cost">Cost</label>
          <div className="input-prefix">
            <span className="input-prefix__symbol">$</span>
            <input
              id="cost"
              name="cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={values.cost}
              onChange={handleChange}
              aria-invalid={Boolean(errors.cost)}
            />
          </div>
          {errors.cost && <span className="form__error">{errors.cost}</span>}
        </div>

        <div className="form__field">
          <label htmlFor="billingCycle">Billing cycle</label>
          <select
            id="billingCycle"
            name="billingCycle"
            value={values.billingCycle}
            onChange={handleChange}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div className="form__field">
          <label htmlFor="nextRenewalDate">Next renewal date</label>
          <input
            id="nextRenewalDate"
            name="nextRenewalDate"
            type="date"
            value={values.nextRenewalDate}
            onChange={handleChange}
            aria-invalid={Boolean(errors.nextRenewalDate)}
          />
          {errors.nextRenewalDate && (
            <span className="form__error">{errors.nextRenewalDate}</span>
          )}
        </div>

        <button type="submit" className="btn btn--primary form__submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add subscription'}
        </button>
      </form>
    </section>
  );
}
