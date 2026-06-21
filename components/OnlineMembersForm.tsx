'use client';
import { useState, type FormEvent } from 'react';

const HOW_FOUND_OPTIONS = [
  'YouTube / Livestream',
  'Facebook',
  'Instagram',
  'WhatsApp',
  'Friend or Family',
  'Google Search',
  'Other',
];

interface Errors {
  name?: string;
  email?: string;
  country?: string;
  city?: string;
}

export default function OnlineMembersForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [howFound, setHowFound] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function validate(): boolean {
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!email.trim()) errs.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.';
    if (!country.trim()) errs.country = 'Please enter your country.';
    if (!city.trim()) errs.city = 'Please enter your city.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function clear(field: keyof Errors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
      const res = await fetch(`${base}/online-members/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          country: country.trim(),
          city: city.trim(),
          how_found_us: howFound || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10" role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-display text-2xl italic text-brand-gold mb-2">
          Welcome to the family!
        </p>
        <p className="text-gray-500 text-sm">
          We&apos;re so glad you connected with us. Watch your inbox — we&apos;ll reach out soon.
        </p>
      </div>
    );
  }

  const fieldClass = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm ${
      err ? 'border-brand-red' : 'border-gray-200'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="om-name" className="block text-sm font-medium text-brand-blue mb-1.5">
            Full Name <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="om-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clear('name'); }}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'om-name-err' : undefined}
            placeholder="Your full name"
            className={fieldClass(errors.name)}
          />
          {errors.name && <p id="om-name-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="om-email" className="block text-sm font-medium text-brand-blue mb-1.5">
            Email Address <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="om-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clear('email'); }}
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? 'om-email-err' : undefined}
            placeholder="your@email.com"
            className={fieldClass(errors.email)}
          />
          {errors.email && <p id="om-email-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.email}</p>}
        </div>
      </div>

      {/* Country + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="om-country" className="block text-sm font-medium text-brand-blue mb-1.5">
            Country <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="om-country"
            type="text"
            value={country}
            onChange={(e) => { setCountry(e.target.value); clear('country'); }}
            autoComplete="country-name"
            aria-required="true"
            aria-describedby={errors.country ? 'om-country-err' : undefined}
            placeholder="e.g. Nigeria, UK, USA"
            className={fieldClass(errors.country)}
          />
          {errors.country && <p id="om-country-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.country}</p>}
        </div>
        <div>
          <label htmlFor="om-city" className="block text-sm font-medium text-brand-blue mb-1.5">
            City <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="om-city"
            type="text"
            value={city}
            onChange={(e) => { setCity(e.target.value); clear('city'); }}
            autoComplete="address-level2"
            aria-required="true"
            aria-describedby={errors.city ? 'om-city-err' : undefined}
            placeholder="Your city"
            className={fieldClass(errors.city)}
          />
          {errors.city && <p id="om-city-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.city}</p>}
        </div>
      </div>

      {/* How did you find us */}
      <div>
        <label htmlFor="om-how" className="block text-sm font-medium text-brand-blue mb-1.5">
          How did you find us? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <select
          id="om-how"
          value={howFound}
          onChange={(e) => setHowFound(e.target.value)}
          className={`${fieldClass()} cursor-pointer`}
        >
          <option value="">Select an option…</option>
          {HOW_FOUND_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-brand-red text-center">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-brand-blue text-white font-display font-semibold uppercase tracking-widest text-sm rounded-full hover:bg-brand-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60"
      >
        {status === 'loading' ? 'Connecting…' : 'Connect With Us'}
      </button>
    </form>
  );
}
