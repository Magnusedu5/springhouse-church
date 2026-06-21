'use client';
import { useEffect, useState, FormEvent } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Ministry } from '@/lib/types';

type MinistryDraft = Omit<Ministry, 'id' | 'slug'>;

const EMPTY_DRAFT: MinistryDraft = {
  name: '',
  tagline: '',
  description: '',
  leader_name: '',
  leader_title: '',
  image: '',
  color_accent: '',
  meeting_schedule: '',
  order: 0,
};

export default function MinistriesManagerPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [draft, setDraft] = useState<MinistryDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Ministry | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setMinistries(await fetchAllPages<Ministry>('/ministries/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = ministries.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setPanelOpen(true);
  }

  function openEdit(ministry: Ministry) {
    setEditing(ministry);
    setDraft({
      name: ministry.name,
      tagline: ministry.tagline,
      description: ministry.description,
      leader_name: ministry.leader_name,
      leader_title: ministry.leader_title,
      image: ministry.image,
      color_accent: ministry.color_accent,
      meeting_schedule: ministry.meeting_schedule,
      order: ministry.order,
    });
    setErrors({});
    setPanelOpen(true);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = 'Name is required.';
    if (!draft.description.trim()) next.description = 'Description is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await adminApi.patch(`/ministries/${editing.slug}/`, draft);
      } else {
        await adminApi.post('/ministries/', draft);
      }
      setPanelOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/ministries/${deleteTarget.slug}/`);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  }

  const fieldClass = (key: string) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue ${
      errors[key] ? 'border-brand-red' : 'border-gray-300'
    }`;

  const columns: AdminTableColumn<Ministry>[] = [
    { key: 'name', header: 'Name', render: (m) => <span className="font-medium text-gray-800">{m.name}</span> },
    { key: 'leader_name', header: 'Leader', render: (m) => m.leader_name },
    { key: 'meeting_schedule', header: 'Schedule', render: (m) => m.meeting_schedule },
    { key: 'order', header: 'Order', render: (m) => m.order },
    {
      key: 'actions',
      header: '',
      render: (m) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEdit(m)} aria-label={`Edit ${m.name}`} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setDeleteTarget(m)} aria-label={`Delete ${m.name}`} className="p-1.5 text-gray-400 hover:text-brand-red rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Ministries</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-[#a82126] transition-colors"
        >
          Add New Ministry
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ministries…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(m) => m.id}
        loading={loading}
        emptyMessage="No ministries yet — add your first one."
      />

      <SlideOver open={panelOpen} title={editing ? 'Edit Ministry' : 'Add New Ministry'} onClose={() => setPanelOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={fieldClass('name')}
            />
            {errors.name && <p className="text-xs text-brand-red mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              className={fieldClass('tagline')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={4}
              className={fieldClass('description')}
            />
            {errors.description && <p className="text-xs text-brand-red mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leader Name</label>
              <input
                type="text"
                value={draft.leader_name}
                onChange={(e) => setDraft({ ...draft, leader_name: e.target.value })}
                className={fieldClass('leader_name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leader Title</label>
              <input
                type="text"
                value={draft.leader_title}
                onChange={(e) => setDraft({ ...draft, leader_title: e.target.value })}
                className={fieldClass('leader_title')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Schedule</label>
            <input
              type="text"
              value={draft.meeting_schedule}
              onChange={(e) => setDraft({ ...draft, meeting_schedule: e.target.value })}
              placeholder="e.g. Saturdays, 4:00 PM"
              className={fieldClass('meeting_schedule')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent Colour</label>
              <input
                type="text"
                value={draft.color_accent}
                onChange={(e) => setDraft({ ...draft, color_accent: e.target.value })}
                placeholder="#1A3A6B"
                className={fieldClass('color_accent')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                className={fieldClass('order')}
              />
            </div>
          </div>

          <ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} label="Image" />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-brand-red text-white font-medium rounded-lg hover:bg-[#a82126] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Ministry'}
          </button>
        </form>
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete ministry?"
        message={`This will permanently delete "${deleteTarget?.name}". This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
