'use client';
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import DoveIcon from './DoveIcon';

interface FormErrors {
  name?: string;
  request?: string;
}

function floatStyle(floated: boolean): React.CSSProperties {
  return {
    transformOrigin: 'left center',
    transform: floated ? 'translateY(-50%) translateY(-20px) scale(0.85)' : 'translateY(-50%)',
  };
}

export default function PrayerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [requestFocused, setRequestFocused] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!request.trim()) errs.request = 'Please share your prayer request.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
      const res = await fetch(`${base}/prayers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          ...(email.trim() && { email: email.trim() }),
          request_text: request.trim(),
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setName('');
      setEmail('');
      setRequest('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10" role="status" aria-live="polite">
        <div className="flex justify-center mb-2">
          <DoveIcon className="w-10 h-7 text-brand-gold animate-prayer-dove" />
        </div>
        <motion.p
          className="font-display text-xl italic text-brand-gold leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Your request has been received.<br />We&apos;re praying for you.
        </motion.p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto space-y-5 text-left">
      {/* Full Name */}
      <div>
        <div className="relative">
          <input
            id="prayer-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'prayer-name-err' : undefined}
            className={`w-full px-4 pt-5 pb-2.5 rounded-xl border bg-white/90 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-gold ${
              errors.name ? 'border-brand-red' : 'border-amber-200'
            }`}
          />
          <label
            htmlFor="prayer-name"
            className="absolute left-4 top-1/2 text-gray-400 transition-all duration-200 pointer-events-none"
            style={floatStyle(nameFocused || !!name)}
          >
            Full Name <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
        </div>
        {errors.name && (
          <p id="prayer-name-err" role="alert" className="mt-1 text-sm text-brand-red">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email (optional) */}
      <div>
        <div className="relative">
          <input
            id="prayer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoComplete="email"
            className="w-full px-4 pt-5 pb-2.5 rounded-xl border border-amber-200 bg-white/90 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <label
            htmlFor="prayer-email"
            className="absolute left-4 top-1/2 text-gray-400 transition-all duration-200 pointer-events-none"
            style={floatStyle(emailFocused || !!email)}
          >
            Email <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
        </div>
      </div>

      {/* Prayer Request */}
      <div>
        <div className="relative">
          <textarea
            id="prayer-request"
            rows={5}
            value={request}
            onChange={(e) => { setRequest(e.target.value); if (errors.request) setErrors((p) => ({ ...p, request: undefined })); }}
            onFocus={() => setRequestFocused(true)}
            onBlur={() => setRequestFocused(false)}
            aria-required="true"
            aria-describedby={errors.request ? 'prayer-request-err' : undefined}
            className={`w-full px-4 pt-6 pb-2.5 rounded-xl border bg-white/90 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none ${
              errors.request ? 'border-brand-red' : 'border-amber-200'
            }`}
          />
          <label
            htmlFor="prayer-request"
            className="absolute left-4 top-6 text-gray-400 transition-all duration-200 pointer-events-none"
            style={{
              transformOrigin: 'left center',
              transform: requestFocused || !!request ? 'translateY(-20px) scale(0.85)' : 'translateY(0)',
            }}
          >
            Prayer Request <span className="text-brand-red" aria-hidden="true">*</span>
          </label>
        </div>
        {errors.request && (
          <p id="prayer-request-err" role="alert" className="mt-1 text-sm text-brand-red">
            {errors.request}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-brand-red text-center">
          Something went wrong. Please try again or reach us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-shimmer-sweep w-full py-3.5 bg-gradient-to-br from-brand-gold to-[#a06820] text-white font-display font-semibold uppercase tracking-widest rounded-full hover:from-[#d49830] hover:to-[#854f10] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Submit Request'}
      </button>
    </form>
  );
}
