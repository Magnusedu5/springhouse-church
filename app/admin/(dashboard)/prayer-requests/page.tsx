'use client';
import { useEffect, useMemo, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import ConfirmModal from '@/components/admin/ConfirmModal';
import type { PrayerRequest } from '@/lib/types';

type FilterTab = 'all' | 'unprayed' | 'prayed';

export default function PrayerRequestsPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PrayerRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmPrayedOver, setConfirmPrayedOver] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllPages<PrayerRequest>('/prayers/');
      setPrayers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'unprayed') return prayers.filter((p) => !p.is_prayed_over);
    if (filter === 'prayed') return prayers.filter((p) => p.is_prayed_over);
    return prayers;
  }, [prayers, filter]);

  async function markAsPrayed(id?: number) {
    if (!id) return;
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, is_prayed_over: true } : p)));
    await adminApi.patch(`/prayers/${id}/`, { is_prayed_over: true });
  }

  async function markAllAsPrayed() {
    const unprayed = prayers.filter((p) => !p.is_prayed_over);
    if (unprayed.length === 0) return;
    setBulkSaving(true);
    try {
      await Promise.all(unprayed.map((p) => adminApi.patch(`/prayers/${p.id}/`, { is_prayed_over: true })));
      setPrayers((prev) => prev.map((p) => ({ ...p, is_prayed_over: true })));
    } finally {
      setBulkSaving(false);
    }
  }

  const unprayedCount = prayers.filter((p) => !p.is_prayed_over).length;

  function openDeleteModal(p: PrayerRequest) {
    setConfirmPrayedOver(false);
    setDeleteTarget(p);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/prayers/${deleteTarget.id}/`, { data: { confirm: true } });
      setPrayers((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-brand-red" aria-hidden="true" />
          <h1 className="font-display text-2xl font-semibold text-brand-blue">Prayer Requests</h1>
        </div>
        {unprayedCount > 0 && (
          <button
            type="button"
            onClick={markAllAsPrayed}
            disabled={bulkSaving}
            className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors disabled:opacity-60"
          >
            {bulkSaving ? 'Updating…' : `Mark all as Prayed (${unprayedCount})`}
          </button>
        )}
      </div>

      <div className="flex gap-2" role="tablist">
        {(['all', 'unprayed', 'prayed'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={filter === tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === tab ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-gray-400">No prayer requests in this view.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-50">
            {filtered.map((p) => {
              const isExpanded = expandedId === p.id;
              return (
                <li key={p.id} className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : p.id ?? null)}
                    aria-expanded={isExpanded}
                    className="flex-1 min-w-0 flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800">{p.name}</p>
                        {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                        {!isExpanded && (
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {p.request_text.slice(0, 80)}
                            {p.request_text.length > 80 ? '…' : ''}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : ''}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            p.is_prayed_over ? 'bg-green-100 text-green-700' : 'bg-brand-gold/10 text-brand-gold'
                          }`}
                        >
                          {p.is_prayed_over ? 'Prayed' : 'Unprayed'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 -mt-1">
                        <div className="bg-brand-cream rounded-lg p-4 border border-brand-gold/20">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{p.request_text}</p>
                        </div>
                        {!p.is_prayed_over && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsPrayed(p.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                markAsPrayed(p.id);
                              }
                            }}
                            className="inline-block mt-3 text-sm font-medium text-white bg-brand-blue px-4 py-2 rounded-lg hover:bg-[#142d54] transition-colors cursor-pointer"
                          >
                            Mark as Prayed ✓
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(p)}
                    aria-label={`Remove prayer request from ${p.name}`}
                    className="flex-shrink-0 self-start mt-4 mr-4 p-1.5 text-gray-300 hover:text-gray-500 rounded-md"
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
        title="Remove this prayer request?"
        message="Are you sure you want to remove this prayer request? Please ensure it has been prayed over before deleting."
        confirmLabel="Remove"
        loading={deleting}
        confirmDisabled={!confirmPrayedOver}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={confirmPrayedOver}
            onChange={(e) => setConfirmPrayedOver(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          I confirm this request has been prayed over
        </label>
      </ConfirmModal>
    </div>
  );
}
