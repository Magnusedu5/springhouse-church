'use client';
import { useEffect, useMemo, useState } from 'react';
import { HandCoins, Trash2 } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';
import type { GivingEvidence } from '@/lib/types';

type FilterTab = 'all' | 'unreviewed' | 'reviewed';

const METHOD_LABELS: Record<string, string> = {
  transfer: 'Online Transfer',
  deposit: 'Bank Deposit',
  other: 'Other',
};

export default function GivingEvidencePage() {
  const [entries, setEntries] = useState<GivingEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selected, setSelected] = useState<GivingEvidence | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GivingEvidence | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setEntries(await fetchAllPages<GivingEvidence>('/giving-evidence/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'unreviewed') return entries.filter((e) => !e.is_reviewed);
    if (filter === 'reviewed') return entries.filter((e) => e.is_reviewed);
    return entries;
  }, [entries, filter]);

  async function openEntry(entry: GivingEvidence) {
    setSelected(entry);
  }

  async function markReviewed(entry: GivingEvidence) {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, is_reviewed: true } : e)));
    setSelected((prev) => (prev && prev.id === entry.id ? { ...prev, is_reviewed: true } : prev));
    await adminApi.patch(`/giving-evidence/${entry.id}/`, { is_reviewed: true });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/giving-evidence/${deleteTarget.id}/`);
      setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
      setToast('Entry deleted');
    } finally {
      setDeleting(false);
    }
  }

  const columns: AdminTableColumn<GivingEvidence>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (e) => (
        <span className={`font-medium ${e.is_reviewed ? 'text-gray-600' : 'text-gray-900'}`}>
          {e.name || 'Anonymous'}
        </span>
      ),
    },
    { key: 'amount', header: 'Amount', render: (e) => (e.amount ? `₦${e.amount}` : '—') },
    { key: 'method', header: 'Method', render: (e) => METHOD_LABELS[e.method] || '—' },
    { key: 'submitted_at', header: 'Date', render: (e) => new Date(e.submitted_at).toLocaleDateString() },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            e.is_reviewed ? 'bg-gray-100 text-gray-500' : 'bg-brand-gold/10 text-brand-gold'
          }`}
        >
          {e.is_reviewed ? 'Reviewed' : 'Unreviewed'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (e) => (
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            setDeleteTarget(e);
          }}
          aria-label={`Delete giving evidence from ${e.name || 'anonymous giver'}`}
          className="p-1.5 text-gray-400 hover:text-brand-red rounded-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HandCoins className="w-6 h-6 text-brand-blue" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Giving Evidence</h1>
      </div>

      <div className="flex gap-2" role="tablist">
        {(['all', 'unreviewed', 'reviewed'] as FilterTab[]).map((tab) => (
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

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(e) => e.id}
        loading={loading}
        emptyMessage="No optional payment evidence submitted yet."
        onRowClick={openEntry}
      />

      <SlideOver open={!!selected} title="Giving Evidence" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">{selected.name || 'Anonymous'}</p>
              {selected.phone && <p className="text-gray-500">{selected.phone}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(selected.submitted_at).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-cream rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Amount</p>
                <p className="text-gray-800 font-medium">{selected.amount ? `₦${selected.amount}` : '—'}</p>
              </div>
              <div className="bg-brand-cream rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Method</p>
                <p className="text-gray-800 font-medium">{METHOD_LABELS[selected.method] || '—'}</p>
              </div>
            </div>

            {selected.receipt_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.receipt_image}
                alt="Uploaded receipt"
                className="w-full rounded-lg border border-gray-100"
              />
            )}

            {!selected.is_reviewed && (
              <button
                type="button"
                onClick={() => markReviewed(selected)}
                className="w-full py-2.5 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors"
              >
                Mark as Reviewed
              </button>
            )}
          </div>
        )}
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete entry?"
        message={`Delete this giving evidence from ${deleteTarget?.name || 'this anonymous giver'}? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
