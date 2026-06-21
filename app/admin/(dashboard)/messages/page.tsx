'use client';
import { useEffect, useMemo, useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast from '@/components/admin/Toast';
import type { ContactMessage } from '@/lib/types';

type FilterTab = 'all' | 'unread' | 'read';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setMessages(await fetchAllPages<ContactMessage>('/contact/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'unread') return messages.filter((m) => !m.is_read);
    if (filter === 'read') return messages.filter((m) => m.is_read);
    return messages;
  }, [messages, filter]);

  async function openMessage(message: ContactMessage) {
    setSelected(message);
    if (!message.is_read) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)));
      await adminApi.patch(`/contact/${message.id}/`, { is_read: true });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/contact/${deleteTarget.id}/`);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
      setToast('Message deleted');
    } finally {
      setDeleting(false);
    }
  }

  const columns: AdminTableColumn<ContactMessage>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (m) => (
        <span className={`font-medium ${m.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{m.name}</span>
      ),
    },
    { key: 'email', header: 'Email', render: (m) => m.email },
    { key: 'subject', header: 'Subject', render: (m) => m.subject || '—' },
    { key: 'submitted_at', header: 'Date', render: (m) => new Date(m.submitted_at).toLocaleDateString() },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            m.is_read ? 'bg-gray-100 text-gray-500' : 'bg-brand-red/10 text-brand-red'
          }`}
        >
          {m.is_read ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (m) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(m);
          }}
          aria-label={`Delete message from ${m.name}`}
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
        <Mail className="w-6 h-6 text-brand-blue" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Messages</h1>
      </div>

      <div className="flex gap-2" role="tablist">
        {(['all', 'unread', 'read'] as FilterTab[]).map((tab) => (
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
        rowKey={(m) => m.id}
        loading={loading}
        emptyMessage="No messages in this view."
        onRowClick={openMessage}
      />

      <SlideOver open={!!selected} title={selected?.subject || 'Message'} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">{selected.name}</p>
              <p className="text-gray-500">{selected.email}</p>
              {selected.phone && <p className="text-gray-500">{selected.phone}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(selected.submitted_at).toLocaleString()}
              </p>
            </div>

            <div className="bg-brand-cream rounded-lg p-4 border border-gray-100">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>

            {selected.prayer_request && (
              <div className="bg-brand-gold/5 rounded-lg p-4 border border-brand-gold/20">
                <p className="text-xs font-medium text-brand-gold mb-1">Prayer Request</p>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.prayer_request}</p>
              </div>
            )}

            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your message to The SpringHouse Church'}`)}`}
              className="inline-block px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors"
            >
              Reply
            </a>
          </div>
        )}
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete message?"
        message={`Delete this message from ${deleteTarget?.name}? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
