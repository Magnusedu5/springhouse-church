'use client';
import { useEffect, useState } from 'react';
import { HandHeart, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';
import type { MinistryInterest } from '@/lib/types';

function formatMinistryName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MinistryInterestsPage() {
  const [entries, setEntries] = useState<MinistryInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MinistryInterest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setEntries(await fetchAllPages<MinistryInterest>('/ministry-interests/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/ministry-interests/${deleteTarget.id}/`);
      setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
      setToast('Entry deleted');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HandHeart className="w-6 h-6 text-brand-red" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Ministry Interests</h1>
        {entries.length > 0 && (
          <span className="ml-1 text-xs font-semibold bg-brand-red text-white rounded-full px-2 py-0.5">
            {entries.length}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="p-10 text-center text-gray-400">No ministry interest submissions yet.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-50">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              return (
                <li key={entry.id} className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    aria-expanded={isExpanded}
                    className="flex-1 min-w-0 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800">{entry.name}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <p className="text-xs text-gray-400">{entry.email}</p>
                          {entry.phone && <p className="text-xs text-gray-400">{entry.phone}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="hidden sm:block text-xs font-medium bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-full capitalize">
                          {formatMinistryName(entry.ministry)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.submitted_at).toLocaleDateString()}
                        </span>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="bg-brand-cream rounded-lg px-4 py-3">
                            <p className="text-xs font-medium text-gray-400 mb-0.5">Ministry</p>
                            <p className="text-brand-blue font-medium">{formatMinistryName(entry.ministry)}</p>
                          </div>
                          <div className="bg-brand-cream rounded-lg px-4 py-3">
                            <p className="text-xs font-medium text-gray-400 mb-0.5">Phone</p>
                            <p className="text-gray-700">{entry.phone}</p>
                          </div>
                          <div className="bg-brand-cream rounded-lg px-4 py-3">
                            <p className="text-xs font-medium text-gray-400 mb-0.5">Email</p>
                            <p className="text-gray-700 break-all">{entry.email}</p>
                          </div>
                        </div>

                        {entry.message && (
                          <div className="bg-brand-cream rounded-lg px-4 py-3 border border-brand-gold/20">
                            <p className="text-xs font-medium text-brand-gold mb-1">Message</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {entry.message}
                            </p>
                          </div>
                        )}

                        <a
                          href={`mailto:${entry.email}?subject=${encodeURIComponent(`Re: Your interest in the ${formatMinistryName(entry.ministry)}`)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors"
                        >
                          Reply by Email
                        </a>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(entry)}
                    aria-label={`Delete entry from ${entry.name}`}
                    className="flex-shrink-0 self-start mt-4 mr-4 p-1.5 text-gray-300 hover:text-brand-red rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this entry?"
        message={`Remove ${deleteTarget?.name}'s interest in ${deleteTarget ? formatMinistryName(deleteTarget.ministry) : ''}? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
