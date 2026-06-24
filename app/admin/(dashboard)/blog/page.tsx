'use client';
import { useEffect, useState, FormEvent } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import AdminToggle from '@/components/admin/AdminToggle';
import SlideOver from '@/components/admin/SlideOver';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { BlogPost } from '@/lib/types';

const CATEGORIES: BlogPost['category'][] = ['devotional', 'teaching', 'testimony', 'missions', 'general'];

type BlogDraft = Omit<BlogPost, 'id' | 'slug' | 'published_date'>;

const EMPTY_DRAFT: BlogDraft = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  author_image: '',
  category: 'general',
  tags: '',
  featured_image: '',
  read_time: '',
  is_published: false,
};

export default function BlogManagerPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [draft, setDraft] = useState<BlogDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setPosts(await fetchAllPages<BlogPost>('/blog/'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setPanelOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setDraft({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      author_image: post.author_image,
      category: post.category,
      tags: post.tags,
      featured_image: post.featured_image,
      read_time: post.read_time,
      is_published: post.is_published,
    });
    setErrors({});
    setPanelOpen(true);
  }

  async function togglePublished(post: BlogPost) {
    const updated = { ...post, is_published: !post.is_published };
    setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    await adminApi.patch(`/blog/${post.slug}/`, { is_published: updated.is_published });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.author.trim()) next.author = 'Author is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await adminApi.patch(`/blog/${editing.slug}/`, draft);
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: [`/blog/${editing.slug}`, '/blog'] }),
        });
      } else {
        await adminApi.post('/blog/', draft);
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/blog'] }),
        });
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
      await adminApi.delete(`/blog/${deleteTarget.slug}/`);
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

  const columns: AdminTableColumn<BlogPost>[] = [
    { key: 'title', header: 'Title', render: (p) => <span className="font-medium text-gray-800">{p.title}</span> },
    { key: 'author', header: 'Author', render: (p) => p.author },
    { key: 'category', header: 'Category', render: (p) => <span className="capitalize">{p.category}</span> },
    {
      key: 'published_date',
      header: 'Published',
      render: (p) => (p.published_date ? new Date(p.published_date).toLocaleDateString() : <span className="text-gray-400">Draft</span>),
    },
    {
      key: 'published',
      header: 'Published',
      render: (p) => (
        <AdminToggle checked={p.is_published} onChange={() => togglePublished(p)} label={`Toggle published for ${p.title}`} />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openEdit(p)} aria-label={`Edit ${p.title}`} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setDeleteTarget(p)} aria-label={`Delete ${p.title}`} className="p-1.5 text-gray-400 hover:text-brand-red rounded-md">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Blog</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-[#a82126] transition-colors"
        >
          Add New Post
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(p) => p.id}
        loading={loading}
        emptyMessage="No posts yet — add your first one."
      />

      <SlideOver open={panelOpen} title={editing ? 'Edit Post' : 'Add New Post'} onClose={() => setPanelOpen(false)} wide>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              rows={2}
              className={fieldClass('excerpt')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                className={fieldClass('author')}
              />
              {errors.author && <p className="text-xs text-brand-red mt-1">{errors.author}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as BlogPost['category'] })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
            <input
              type="text"
              value={draft.read_time}
              onChange={(e) => setDraft({ ...draft, read_time: e.target.value })}
              placeholder="5 min read"
              className={fieldClass('read_time')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={draft.tags}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              placeholder="faith, prayer, family"
              className={fieldClass('tags')}
            />
          </div>

          <ImageUpload value={draft.featured_image} onChange={(url) => setDraft({ ...draft, featured_image: url })} label="Featured Image" />
          <ImageUpload value={draft.author_image} onChange={(url) => setDraft({ ...draft, author_image: url })} label="Author Image" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <RichTextEditor
              key={editing?.id ?? 'new'}
              defaultValue={draft.content}
              onChange={(html) => setDraft((prev) => ({ ...prev, content: html }))}
              error={!!errors.content}
            />
            {errors.content && <p className="text-xs text-brand-red mt-1">{errors.content}</p>}
          </div>

          <div>
            <label className="flex items-center justify-between text-sm text-gray-700 py-1">
              Publish
              <AdminToggle
                checked={draft.is_published}
                onChange={(checked) => setDraft({ ...draft, is_published: checked })}
                label="Publish post"
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">
              The publish date is set automatically the moment this is switched on.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-brand-red text-white font-medium rounded-lg hover:bg-[#a82126] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Post'}
          </button>
        </form>
      </SlideOver>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete post?"
        message={`This will permanently delete "${deleteTarget?.title}". This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
