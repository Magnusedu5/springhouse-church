'use client';
import { useState, type FormEvent } from 'react';

interface Props {
  ministrySlug: string;
  ministryName: string;
}

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export default function MinistryInterestForm({ ministrySlug, ministryName }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!phone.trim()) errs.phone = 'Please enter your phone number.';
    if (!email.trim()) errs.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
      const res = await fetch(`${base}/ministry-interests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          ministry: ministrySlug,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setName(''); setPhone(''); setEmail(''); setMessage('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <p className="font-display text-xl italic text-brand-gold">
          Thank you! We&apos;ll be in touch soon about joining the {ministryName}.
        </p>
      </div>
    );
  }

  const fieldClass = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue ${err ? 'border-brand-red' : 'border-gray-200'}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="mi-name" className="block text-sm font-medium text-brand-blue mb-1.5">
          Full Name <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <input
          id="mi-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
          autoComplete="name"
          aria-required="true"
          aria-describedby={errors.name ? 'mi-name-err' : undefined}
          placeholder="Your full name"
          className={fieldClass(errors.name)}
        />
        {errors.name && <p id="mi-name-err" role="alert" className="mt-1 text-sm text-brand-red">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="mi-phone" className="block text-sm font-medium text-brand-blue mb-1.5">
          Phone Number <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <input
          id="mi-phone"
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((p) => ({ ...p, phone: undefined })); }}
          autoComplete="tel"
          aria-required="true"
          aria-describedby={errors.phone ? 'mi-phone-err' : undefined}
          placeholder="+234 800 000 0000"
          className={fieldClass(errors.phone)}
        />
        {errors.phone && <p id="mi-phone-err" role="alert" className="mt-1 text-sm text-brand-red">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="mi-email" className="block text-sm font-medium text-brand-blue mb-1.5">
          Email Address <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <input
          id="mi-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
          autoComplete="email"
          aria-required="true"
          aria-describedby={errors.email ? 'mi-email-err' : undefined}
          placeholder="your@email.com"
          className={fieldClass(errors.email)}
        />
        {errors.email && <p id="mi-email-err" role="alert" className="mt-1 text-sm text-brand-red">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="mi-message" className="block text-sm font-medium text-brand-blue mb-1.5">
          Message <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          id="mi-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Tell us why you're interested in the ${ministryName}, any questions you have, or how you'd like to serve…`}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-brand-red text-center">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-brand-red text-white font-display font-semibold uppercase tracking-widest rounded-full hover:bg-[#a82126] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Get Involved'}
      </button>
    </form>
  );
}
