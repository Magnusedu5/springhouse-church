'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

type Tab = 'transfer' | 'deposit' | 'sunday';

// ── Bank card ─────────────────────────────────────────────────────────────────

function BankCard() {
  const [copied, setCopied] = useState(false);
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function copyAccountNumber() {
    navigator.clipboard.writeText('0392039524').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div>
      {/* Styled bank card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
        className="relative bg-gradient-to-br from-brand-blue via-[#1e3f6e] to-[#0d2247] rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden max-w-sm mx-auto mb-6"
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold rounded-t-2xl" aria-hidden="true" />

        <div className="relative z-10 space-y-5 pt-2">
          {/* Bank name */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold mb-0.5">
              Bank
            </p>
            <p className="font-medium text-base">Ecobank Nigeria Plc</p>
          </div>

          {/* Account number */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold mb-1">
              Account Number
            </p>
            <p className="font-mono text-2xl sm:text-3xl tracking-[0.18em] font-semibold">
              0392039524
            </p>
          </div>

          {/* Account name */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold mb-0.5">
              Account Name
            </p>
            <p className="font-medium text-base">THE SPRING HOUSE CHURCH</p>
          </div>
        </div>
      </motion.div>

      {/* Copy account number button */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={copyAccountNumber}
          aria-label={copied ? 'Account number copied to clipboard' : 'Copy account number to clipboard'}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${
            copied
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-brand-blue text-white hover:bg-brand-blue/80'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                className="inline-flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="inline-flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Account Number
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* WhatsApp acknowledgement note */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-4 text-sm text-gray-600 leading-relaxed text-center">
        After transferring, please send your name and amount to our WhatsApp:{' '}
        {/* TODO: Add WhatsApp number */}
        <span className="font-semibold text-brand-blue italic">number coming soon</span>{' '}
        — so we can acknowledge your gift. 🙏
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GiveTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('transfer');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'transfer', label: 'Online Transfer' },
    { key: 'deposit', label: 'Bank Deposit' },
    { key: 'sunday', label: 'Give on Sunday' },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div
        className="flex gap-1 bg-gray-100 rounded-full p-1 w-fit mx-auto mb-10 overflow-x-auto"
        role="tablist"
        aria-label="How to give"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`give-panel-${key}`}
            id={`give-tab-${key}`}
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue whitespace-nowrap ${
              activeTab === key
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-gray-500 hover:text-brand-blue'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Online Transfer ── */}
      <div
        id="give-panel-transfer"
        role="tabpanel"
        aria-labelledby="give-tab-transfer"
        hidden={activeTab !== 'transfer'}
      >
        <div className="max-w-md mx-auto">
          <BankCard />
        </div>
      </div>

      {/* ── Tab: Bank Deposit ── */}
      <div
        id="give-panel-deposit"
        role="tabpanel"
        aria-labelledby="give-tab-deposit"
        hidden={activeTab !== 'deposit'}
      >
        <div className="max-w-md mx-auto">
          <BankCard />
          <div className="mt-7 bg-white rounded-2xl p-6 border border-gray-100">
            <h4 className="font-display text-lg font-semibold text-brand-blue mb-4">
              In-Person Deposit Instructions
            </h4>
            <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-5">
              <li>Visit any branch of the bank listed on the card above.</li>
              <li>Request a deposit slip and fill in the account name and number shown.</li>
              <li>
                In the narration / reference field, write{' '}
                <strong className="text-brand-blue">"Tithe"</strong>,{' '}
                <strong className="text-brand-blue">"Offering"</strong>, or your specific giving purpose.
              </li>
              <li>Keep your teller / deposit receipt for your records.</li>
              <li>
                Send a photo of your receipt to our WhatsApp{' '}
                {/* TODO: Add WhatsApp number */}
                <span className="italic text-gray-400">(number coming soon)</span>{' '}
                so we can acknowledge your generosity.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* ── Tab: Give on Sunday ── */}
      <div
        id="give-panel-sunday"
        role="tabpanel"
        aria-labelledby="give-tab-sunday"
        hidden={activeTab !== 'sunday'}
      >
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-2xl font-semibold text-brand-blue mb-3">
              Give During Service
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Offerings and tithes are received during our Sunday service at{' '}
              <strong className="text-brand-blue">9:00 AM</strong> and our Midweek service every{' '}
              <strong className="text-brand-blue">Wednesday at 5:00 PM</strong>.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-500 leading-relaxed">
            You can also drop your giving envelope at the welcome desk at any time during the service.
            Envelopes are available at the entrance.
          </div>
          <p className="text-xs text-gray-400">
            137 Ndidem Usang Iso (Parliamentary Extension), Calabar, Nigeria
          </p>
        </div>
      </div>
    </div>
  );
}
