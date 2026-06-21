'use client';
import { useEffect, useMemo, useState, FormEvent } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import AdminToggle from '@/components/admin/AdminToggle';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';
import LinkedPhotosManager from '@/components/admin/LinkedPhotosManager';
import type { Sermon } from '@/lib/types';

type SermonDraft = Omit<Sermon, 'id' | 'slug' | 'created_at'>;

const EMPTY_DRAFT: SermonDraft = {
  title: '',
  series: '',
  speaker: 'Dr Austin Mboso',
  date: '',
  duration: '',
  thumbnail: '',
  audio_url: '',
  video_url: '',
  description: '',
  scripture_ref: '',
  is_featured: false,
};

export default function SermonsManagerPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [draft, setDraft] = useState<SermonDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Sermon | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllPages<Sermon>('/sermons/');
      setSermons(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const seriesOptions = useMemo(
    () => Array.from(new Set(sermons.map((s) => s.series).filter(Boolean))),
    [sermons]
  );

  const filtered = sermons.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchesSeries = !seriesFilter || s.series === seriesFilter;
    return matchesSearch && matchesSeries;
  });

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setPanelOpen(true);
  }

  function openEdit(sermon: Sermon) {
    setEditing(sermon);
    setDraft({
      title: sermon.title,
      series: sermon.series,
      speaker: sermon.speaker,
      date: sermon.date,
      duration: sermon.duration,
      thumbnail: sermon.thumbnail,
      audio_url: sermon.audio_url,
      video_url: sermon.video_url,
      description: sermon.description,
      scripture_ref: sermon.scripture_ref,
      is_featured: sermon.is_featured,
    });
    setErrors({});
    setPanelOpen(true);
  }

  async function toggleFeatured(sermon: Sermon) {
    const updated = { ...sermon, is_featured: !sermon.is_featured };
    setSermons((prev) => prev.map((s) => (s.id === sermon.id ? updated : s)));
    await adminApi.patch(`/sermons/${sermon.slug}/`, { is_featured: updated.is_featured });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.series.trim()) next.series = 'Series is required.';
    if (!draft.speaker.trim()) next.speaker = 'Speaker is required.';
    if (!draft.date) next.date = 'Date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await adminApi.patch(`/sermons/${editing.slug}/`, draft);
      } else {
        await adminApi.post('/sermons/', draft);
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
      await adminApi.delete(`/sermons/${deleteTarget.slug}/`);
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

  const columns: AdminTableColumn<Sermon>[] = [
    {
      key: 'thumbnail',
      header: '',
      render: (s) =>
        s.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.thumbnail} alt="" className="w-12 h-12 rounded-md object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100" />
        ),
    },
    { key: 'title', header: 'Title', render: (s) => <span className="font-medium text-gray-800">{s.title}</span> },
    { key: 'series', header: 'Series', render: (s) => s.series },
    { key: 'speaker', header: 'Speaker', render: (s) => s.speaker },
    { key: 'date', header: 'Date', render: (s) => new Date(s.date).toLocaleDateString() },
    { key: 'duration', header: 'Duration', render: (s) => s.duration },
    {
      key: 'featured',
      header: 'Featured',
      render: (s) => (
        <AdminToggle checked={s.is_featured} onChange={() => toggleFeatured(s)} label={`Toggle featured for ${s.title}`} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (s) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEdit(s)} aria-label={`Edit ${s.title}`} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setDeleteTarget(s)} aria-label={`Delete ${s.title}`} className="p-1.5 text-gray-400 hover:text-brand-red rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Sermons</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-[#a82126] transition-colors"
        >
          Add New Sermon
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sermons…"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
        <select
          value={seriesFilter}
          onChange={(e) => setSeriesFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <option value="">All series</option>
          {seriesOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(s) => s.id}
        loading={loading}
        emptyMessage="No sermons yet — add your first one."
      />

      <SlideOver open={panelOpen} title={editing ? 'Edit Sermon' : 'Add New Sermon'} onClose={() => setPanelOpen(false)}>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
            <input
              type="text"
              value={draft.series}
              onChange={(e) => setDraft({ ...draft, series: e.target.value })}
              className={fieldClass('series')}
            />
            {errors.series && <p className="text-xs text-brand-red mt-1">{errors.series}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
            <input
              type="text"
              value={draft.speaker}
              onChange={(e) => setDraft({ ...draft, speaker: e.target.value })}
              className={fieldClass('speaker')}
            />
            {errors.speaker && <p className="text-xs text-brand-red mt-1">{errors.speaker}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className={fieldClass('date')}
              />
              {errors.date && <p className="text-xs text-brand-red mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={draft.duration}
                onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                placeholder="42 min"
                className={fieldClass('duration')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scripture Reference</label>
            <input
              type="text"
              value={draft.scripture_ref}
              onChange={(e) => setDraft({ ...draft, scripture_ref: e.target.value })}
              className={fieldClass('scripture_ref')}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              type="url"
              value={draft.video_url}
              onChange={(e) => setDraft({ ...draft, video_url: e.target.value })}
              placeholder="https://youtube.com/..."
              className={fieldClass('video_url')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
            <input
              type="url"
              value={draft.audio_url}
              onChange={(e) => setDraft({ ...draft, audio_url: e.target.value })}
              className={fieldClass('audio_url')}
            />
          </div>

          <ImageUpload value={draft.thumbnail} onChange={(url) => setDraft({ ...draft, thumbnail: url })} label="Sermon Thumbnail" />

          {editing && <LinkedPhotosManager recordType="sermon" recordId={editing.id} />}

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
            {saving ? 'Saving…' : 'Save Sermon'}
          </button>
        </form>
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete sermon?"
        message={`This will permanently delete "${deleteTarget?.title}". This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
