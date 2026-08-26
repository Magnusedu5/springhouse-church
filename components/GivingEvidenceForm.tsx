'use client';
import { useRef, useState, type FormEvent } from 'react';

interface Props {
  method: 'transfer' | 'deposit';
}

type Status = 'collapsed' | 'open' | 'uploading' | 'submitting' | 'success' | 'error';

export default function GivingEvidenceForm({ method }: Props) {
  const [status, setStatus] = useState<Status>('collapsed');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please choose a receipt image to upload.');
      return;
    }
    setStatus('uploading');
    setErrorMessage('');
    try {
      const uploadData = new FormData();
      uploadData.append('receipt', file);
      const uploadRes = await fetch(`${base}/giving-evidence/receipt/`, {
        method: 'POST',
        body: uploadData,
      });
      if (!uploadRes.ok) throw new Error('upload failed');
      const { url } = await uploadRes.json();

      setStatus('submitting');
      const res = await fetch(`${base}/giving-evidence/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          amount: amount.trim() || null,
          method,
          receipt_image: url,
        }),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
    } catch {
      setErrorMessage('Something went wrong uploading your proof of payment. Please try again.');
      setStatus('open');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
        Thank you! We&apos;ve received your proof of payment and will acknowledge your gift soon. 🙏
      </div>
    );
  }

  if (status === 'collapsed') {
    return (
      <button
        type="button"
        onClick={() => setStatus('open')}
        className="w-full text-sm text-brand-blue underline decoration-brand-gold/50 underline-offset-4 hover:text-brand-red transition-colors"
      >
        Optional: Upload proof of payment
      </button>
    );
  }

  const busy = status === 'uploading' || status === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 text-left">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-blue">Upload Proof of Payment</p>
        <button
          type="button"
          onClick={() => setStatus('collapsed')}
          aria-label="Close"
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Completely optional — every field below is optional except the receipt image itself.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-blue file:text-white file:text-xs file:font-medium hover:file:bg-brand-blue/80"
      />

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (optional)"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-xs text-brand-red">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full py-2.5 bg-brand-blue text-white text-sm font-medium rounded-full hover:bg-[#142d54] transition-colors disabled:opacity-60"
      >
        {status === 'uploading' ? 'Uploading receipt…' : status === 'submitting' ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
