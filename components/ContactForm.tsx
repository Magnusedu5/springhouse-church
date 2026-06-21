'use client';
import { useState, type FormEvent } from 'react';

const SUBJECTS = [
  'General Inquiry',
  'New Member',
  'Ministry',
  'Prayer Request',
  'Give',
] as const;

type Subject = (typeof SUBJECTS)[number];

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  prayerRequest?: string;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [message, setMessage] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isPrayer = subject === 'Prayer Request';

  function validate(): boolean {
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Please enter your full name.';
    if (!email.trim()) errs.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.';
    if (!subject) errs.subject = 'Please choose a subject.';
    if (!message.trim()) errs.message = 'Please enter your message.';
    if (isPrayer && !prayerRequest.trim())
      errs.prayerRequest = 'Please describe your prayer request.';
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
      const res = await fetch(`${base}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject,
          message: message.trim(),
          prayer_request: isPrayer ? prayerRequest.trim() : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage(''); setPrayerRequest('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10" role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-display text-2xl italic text-brand-gold mb-2">Message received!</p>
        <p className="text-gray-500 text-sm">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  const fieldClass = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm ${
      err ? 'border-brand-red' : 'border-gray-200'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-brand-blue mb-1.5">
            Full Name <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clear('name'); }}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            placeholder="Your full name"
            className={fieldClass(errors.name)}
          />
          {errors.name && <p id="cf-name-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-brand-blue mb-1.5">
            Email Address <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clear('email'); }}
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            placeholder="your@email.com"
            className={fieldClass(errors.email)}
          />
          {errors.email && <p id="cf-email-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.email}</p>}
        </div>
      </div>

      {/* Phone + Subject row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-brand-blue mb-1.5">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            className={fieldClass()}
          />
        </div>
        <div>
          <label htmlFor="cf-subject" className="block text-sm font-medium text-brand-blue mb-1.5">
            Subject <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <select
            id="cf-subject"
            value={subject}
            onChange={(e) => { setSubject(e.target.value as Subject | ''); clear('subject'); }}
            aria-required="true"
            aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
            className={`${fieldClass(errors.subject)} cursor-pointer`}
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.subject && <p id="cf-subject-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.subject}</p>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-brand-blue mb-1.5">
          Message <span className="text-brand-red" aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={5}
          value={message}
          onChange={(e) => { setMessage(e.target.value); clear('message'); }}
          aria-required="true"
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          placeholder="How can we help you?"
          className={`${fieldClass(errors.message)} resize-none`}
        />
        {errors.message && <p id="cf-message-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.message}</p>}
      </div>

      {/* Conditional prayer request field */}
      {isPrayer && (
        <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-xl p-4">
          <label htmlFor="cf-prayer" className="block text-sm font-medium text-brand-blue mb-1.5">
            Your Prayer Request <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cf-prayer"
            rows={4}
            value={prayerRequest}
            onChange={(e) => { setPrayerRequest(e.target.value); clear('prayerRequest'); }}
            aria-required="true"
            aria-describedby={errors.prayerRequest ? 'cf-prayer-err' : undefined}
            placeholder="Share your prayer request — our team will pray over every submission."
            className={`${fieldClass(errors.prayerRequest)} resize-none`}
          />
          {errors.prayerRequest && (
            <p id="cf-prayer-err" role="alert" className="mt-1 text-xs text-brand-red">{errors.prayerRequest}</p>
          )}
        </div>
      )}

      {status === 'error' && (
        <p role="alert" className="text-sm text-brand-red text-center">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-brand-red text-white font-display font-semibold uppercase tracking-widest text-sm rounded-full hover:bg-[#a82126] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
