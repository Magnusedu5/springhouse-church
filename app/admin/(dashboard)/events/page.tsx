'use client';
import { useEffect, useState, FormEvent } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import AdminToggle from '@/components/admin/AdminToggle';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';
import LinkedPhotosManager from '@/components/admin/LinkedPhotosManager';
import type { ChurchEvent } from '@/lib/types';

const CATEGORIES: ChurchEvent['category'][] = ['service', 'prayer', 'outreach', 'conference', 'youth', 'special'];

type EventDraft = Omit<ChurchEvent, 'id' | 'slug'>;

const EMPTY_DRAFT: EventDraft = {
  title: '',
  date: '',
  end_date: null,
  time: '',
  location: '',
  is_virtual: false,
  virtual_link: '',
  description: '',
  image: '',
  category: 'service',
  is_featured: false,
};

export default function EventsManagerPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<ChurchEvent | null>(null);
  const [draft, setDraft] = useState<EventDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ChurchEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setEvents(await fetchAllPages<ChurchEvent>('/events/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setPanelOpen(true);
  }

  function openEdit(event: ChurchEvent) {
    setEditing(event);
    setDraft({
      title: event.title,
      date: event.date,
      end_date: event.end_date,
      time: event.time,
      location: event.location,
      is_virtual: event.is_virtual,
      virtual_link: event.virtual_link,
      description: event.description,
      image: event.image,
      category: event.category,
      is_featured: event.is_featured,
    });
    setErrors({});
    setPanelOpen(true);
  }

  async function toggleFeatured(event: ChurchEvent) {
    const updated = { ...event, is_featured: !event.is_featured };
    setEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
    await adminApi.patch(`/events/${event.slug}/`, { is_featured: updated.is_featured });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.date) next.date = 'Date is required.';
    if (!draft.location.trim() && !draft.is_virtual) next.location = 'Location is required for in-person events.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await adminApi.patch(`/events/${editing.slug}/`, draft);
      } else {
        await adminApi.post('/events/', draft);
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
      await adminApi.delete(`/events/${deleteTarget.slug}/`);
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

  const columns: AdminTableColumn<ChurchEvent>[] = [
    { key: 'title', header: 'Title', render: (e) => <span className="font-medium text-gray-800">{e.title}</span> },
    { key: 'date', header: 'Date', render: (e) => new Date(e.date).toLocaleDateString() },
    { key: 'category', header: 'Category', render: (e) => <span className="capitalize">{e.category}</span> },
    {
      key: 'virtual',
      header: 'Virtual',
      render: (e) =>
        e.is_virtual ? (
          <span className="text-xs font-medium text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">Virtual</span>
        ) : (
          <span className="text-xs text-gray-400">In-person</span>
        ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (e) => (
        <AdminToggle checked={e.is_featured} onChange={() => toggleFeatured(e)} label={`Toggle featured for ${e.title}`} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (e) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEdit(e)} aria-label={`Edit ${e.title}`} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setDeleteTarget(e)} aria-label={`Delete ${e.title}`} className="p-1.5 text-gray-400 hover:text-brand-red rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Events</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-[#a82126] transition-colors"
        >
          Add New Event
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(e) => e.id}
        loading={loading}
        emptyMessage="No events yet — add your first one."
      />

      <SlideOver open={panelOpen} title={editing ? 'Edit Event' : 'Add New Event'} onClose={() => setPanelOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className={fieldClass('title')}
            />
            {errors.title && <p className="text-xs text-brand-red mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="datetime-local"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className={fieldClass('date')}
              />
              {errors.date && <p className="text-xs text-brand-red mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="datetime-local"
                value={draft.end_date ?? ''}
                onChange={(e) => setDraft({ ...draft, end_date: e.target.value || null })}
                className={fieldClass('end_date')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                placeholder="e.g. 10:30 AM"
                className={fieldClass('time')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as ChurchEvent['category'] })}
                className={fieldClass('category')}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center justify-between text-sm text-gray-700 py-1">
            Is Virtual
            <AdminToggle
              checked={draft.is_virtual}
              onChange={(checked) => setDraft({ ...draft, is_virtual: checked })}
              label="Is virtual"
            />
          </label>

          {draft.is_virtual ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Link</label>
              <input
                type="url"
                value={draft.virtual_link}
                onChange={(e) => setDraft({ ...draft, virtual_link: e.target.value })}
                placeholder="https://zoom.us/..."
                className={fieldClass('virtual_link')}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                className={fieldClass('location')}
              />
              {errors.location && <p className="text-xs text-brand-red mt-1">{errors.location}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={4}
              className={fieldClass('description')}
            />
          </div>

          <ImageUpload value={draft.image} onChange={(url) => setDraft({ ...draft, image: url })} label="Event Cover Image" />

          {editing && <LinkedPhotosManager recordType="event" recordId={editing.id} label="Event Photo Gallery" />}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={draft.is_featured}
              onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
              className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
            />
            Featured
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-brand-red text-white font-medium rounded-lg hover:bg-[#a82126] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Event'}
          </button>
        </form>
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete event?"
        message={`This will permanently delete "${deleteTarget?.title}". This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
