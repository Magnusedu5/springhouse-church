'use client';
import { useEffect, useMemo, useRef, useState, DragEvent } from 'react';
import {
  Images, Upload, Trash2, Pencil, Check, X,
  Home, Info, Video, Calendar, FileText, Mail, Gift, Users,
  Image as ImageIcon, HeartHandshake, BookOpen, User,
  Baby, Sparkles, Globe, Music, CalendarDays, Mic,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import AdminToggle from '@/components/admin/AdminToggle';
import ConfirmModal from '@/components/admin/ConfirmModal';
import type { ChurchPhoto, GalleryDestination, ChurchEvent, Sermon } from '@/lib/types';

// ── Destination metadata ──────────────────────────────────────────────────────

type DestinationGroup = 'hero' | 'background' | 'feature' | 'ministry' | 'congregation' | 'linked';

interface DestinationMeta {
  key: GalleryDestination;
  label: string;
  description: string;
  icon: typeof Home;
  group: DestinationGroup;
}

const DESTINATIONS: DestinationMeta[] = [
  // Group 1 — Page Heroes
  { key: 'hero_home', label: 'Home Hero', description: 'Full-screen hero background on the Home page.', icon: Home, group: 'hero' },
  { key: 'hero_about', label: 'About Hero', description: 'Hero background on the About page.', icon: Info, group: 'hero' },
  { key: 'hero_sermons', label: 'Sermons Hero', description: 'Hero background on the Sermons page.', icon: Video, group: 'hero' },
  { key: 'hero_events', label: 'Events Hero', description: 'Hero background on the Events page.', icon: Calendar, group: 'hero' },
  { key: 'hero_blog', label: 'Blog Hero', description: 'Hero background on the Blog page.', icon: FileText, group: 'hero' },
  { key: 'hero_contact', label: 'Contact Hero', description: 'Hero background on the Contact page.', icon: Mail, group: 'hero' },
  { key: 'hero_give', label: 'Give Hero', description: 'Hero background on the Give page.', icon: Gift, group: 'hero' },
  { key: 'hero_ministries', label: 'Ministries Hero', description: 'Hero background on the Ministries page.', icon: Users, group: 'hero' },

  // Group 2 — Section Backgrounds
  { key: 'bg_who_we_are', label: 'Home: Who We Are', description: 'Faded background behind "Who We Are" on the Home page.', icon: ImageIcon, group: 'background' },
  { key: 'bg_give', label: 'Home: Give Section', description: 'Faded background behind the Give section on the Home page.', icon: HeartHandshake, group: 'background' },
  { key: 'bg_our_story', label: 'About: Our Story', description: 'Faded background behind "Our Story" on the About page.', icon: BookOpen, group: 'background' },
  { key: 'bg_pastor', label: 'About: Pastor Section', description: 'Faded background behind "Meet the Pastor" on the About page.', icon: User, group: 'background' },
  { key: 'bg_article', label: 'Blog: Article Body', description: 'Faded background behind every blog article body.', icon: FileText, group: 'background' },
  { key: 'our_story_image', label: 'About: Our Story Image', description: 'Main feature photo in the "Our Story" section on the About page.', icon: BookOpen, group: 'background' },
  { key: 'who_we_are_image', label: 'Home: Who We Are Image', description: 'Main feature photo in the "Who We Are" section on the Home page.', icon: ImageIcon, group: 'background' },

  // Group — Site-wide feature photos
  { key: 'logo', label: 'Site Logo', description: 'Your church logo. Appears in the navigation bar and footer across every page.', icon: ImageIcon, group: 'feature' },
  { key: 'pastor_photo', label: 'Pastor Photo', description: 'Photo of the Senior Pastor. Appears in the "Meet the Pastor" section on the About page.', icon: User, group: 'feature' },
  { key: 'leadership_1_photo', label: 'Leadership Photo 1', description: 'Photo for the first leadership team member on the About page.', icon: User, group: 'feature' },
  { key: 'leadership_2_photo', label: 'Leadership Photo 2', description: 'Photo for the second leadership team member on the About page.', icon: User, group: 'feature' },
  { key: 'leadership_3_photo', label: 'Leadership Photo 3', description: 'Photo for the third leadership team member on the About page.', icon: User, group: 'feature' },

  // Group 3 — Ministries
  { key: 'ministry_children', label: 'Children', description: "Appears on the Children's Ministry page hero and gallery.", icon: Baby, group: 'ministry' },
  { key: 'ministry_youth', label: 'Youth', description: 'Appears on the Youth Ministry page hero and gallery.', icon: Sparkles, group: 'ministry' },
  { key: 'ministry_men', label: "Men's Fellowship", description: "Appears on the Men's Fellowship page hero and gallery.", icon: Users, group: 'ministry' },
  { key: 'ministry_women', label: "Women's Fellowship", description: "Appears on the Women's Fellowship page hero and gallery.", icon: Users, group: 'ministry' },
  { key: 'ministry_missions', label: 'Missions & Outreach', description: 'Appears on the Missions & Outreach page hero and gallery.', icon: Globe, group: 'ministry' },
  { key: 'ministry_worship', label: 'Worship Team', description: 'Appears on the Worship Team page hero and gallery.', icon: Music, group: 'ministry' },

  // Congregation gallery (About page)
  { key: 'congregation', label: 'Congregation Gallery', description: 'Appears in the community photo grid on the About page.', icon: Users, group: 'congregation' },

  // Group 4 — Link to a specific record
  { key: 'event', label: 'For a Specific Event', description: 'Photos shown on one event\'s detail page.', icon: CalendarDays, group: 'linked' },
  { key: 'sermon', label: 'For a Specific Sermon', description: 'Photos shown on one sermon\'s detail page.', icon: Mic, group: 'linked' },
];

const DEST_BY_KEY = new Map(DESTINATIONS.map((d) => [d.key, d]));

const GROUP_LABELS: Record<DestinationGroup, string> = {
  hero: 'Page Heroes',
  background: 'Section Backgrounds',
  feature: 'Feature Photos',
  ministry: 'Ministries',
  congregation: 'Congregation',
  linked: 'Link to a Specific Record',
};

// Filter tabs for the manage grid
const FILTER_TABS: { key: string; label: string; match: (d: GalleryDestination) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'hero', label: 'Page Heroes', match: (d) => d.startsWith('hero_') },
  { key: 'background', label: 'Backgrounds', match: (d) => d.startsWith('bg_') },
  { key: 'ministry', label: 'Ministries', match: (d) => d.startsWith('ministry_') },
  { key: 'event', label: 'Events', match: (d) => d === 'event' },
  { key: 'sermon', label: 'Sermons', match: (d) => d === 'sermon' },
  { key: 'congregation', label: 'Congregation', match: (d) => d === 'congregation' },
];

function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

// ── Simple searchable combobox (no external library) ────────────────────────

function SearchCombobox<T extends { id: number; title: string }>({
  items,
  selectedId,
  onSelect,
  placeholder,
}: {
  items: T[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const selected = items.find((i) => i.id === selectedId);
  const filtered = items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? query : (selected?.title ?? '')}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setOpen(true); setQuery(''); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { onSelect(item.id); setOpen(false); setQuery(''); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-brand-blue/5 truncate"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Destination picker card ──────────────────────────────────────────────────

function DestinationCard({
  meta,
  selected,
  onSelect,
}: {
  meta: DestinationMeta;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative text-left p-4 rounded-xl border-2 transition-colors ${
        selected ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-brand-blue/40 bg-white'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      <Icon className={`w-6 h-6 mb-2 ${selected ? 'text-brand-blue' : 'text-gray-400'}`} aria-hidden="true" />
      <p className="text-sm font-semibold text-gray-800">{meta.label}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{meta.description}</p>
    </button>
  );
}

// ── Pending upload (uploaded to Cloudinary, not yet saved to gallery) ───────

interface PendingPhoto {
  id: string;
  file: File;
  status: 'uploading' | 'ready' | 'saving' | 'error';
  url?: string;
  mediaType?: 'image' | 'video';
  title: string;
  error?: string;
  progress?: number;
}

// ── Sortable photo card (manage grid) ────────────────────────────────────────

function PhotoCard({
  photo,
  order,
  onToggleActive,
  onSaveTitle,
  onDelete,
}: {
  photo: ChurchPhoto;
  order: number;
  onToggleActive: (p: ChurchPhoto) => void;
  onSaveTitle: (p: ChurchPhoto, title: string) => void;
  onDelete: (p: ChurchPhoto) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(photo.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = DEST_BY_KEY.get(photo.destination);
  const linkedTitle = photo.event?.title ?? photo.sermon?.title;

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing">
        {photo.image && photo.media_type === 'video' ? (
          <video src={photo.image} className="w-full h-40 object-cover block" muted playsInline />
        ) : photo.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.image} alt={photo.title} className="w-full h-40 object-cover block" />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300">
            <Images className="w-8 h-8" />
          </div>
        )}
        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs font-semibold flex items-center justify-center">
          {order}
        </span>
        <span className="absolute top-2 right-2 bg-brand-gold text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
          {meta?.label ?? photo.destination}
        </span>
      </div>
      <div className="p-3 space-y-2">
        {linkedTitle && <p className="text-xs text-gray-400 truncate">→ {linkedTitle}</p>}

        {editing ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => { setEditing(false); onSaveTitle(photo, titleDraft); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { setEditing(false); onSaveTitle(photo, titleDraft); }
            }}
            className="w-full px-2 py-1 text-sm border border-brand-blue rounded-md focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => { setTitleDraft(photo.title); setEditing(true); }}
            className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-blue w-full"
          >
            <Pencil className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{photo.title || 'Untitled'}</span>
          </button>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>Active</span>
          <AdminToggle checked={photo.is_active} onChange={() => onToggleActive(photo)} label={`Toggle active for ${photo.title}`} />
        </div>

        <button
          type="button"
          onClick={() => onDelete(photo)}
          aria-label={`Delete ${photo.title || 'photo'}`}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400 hover:text-brand-red py-1.5 rounded-md hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function GalleryManagerPage() {
  const [photos, setPhotos] = useState<ChurchPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Destination picker state
  const [selectedDest, setSelectedDest] = useState<GalleryDestination | null>(null);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedSermonId, setSelectedSermonId] = useState<number | null>(null);

  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChurchPhoto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllPages<ChurchPhoto>('/gallery/');
      setPhotos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Lazily fetch events/sermons lists when their card is selected
  useEffect(() => {
    if (selectedDest === 'event' && events.length === 0) {
      fetchAllPages<ChurchEvent>('/events/').then(setEvents).catch(() => {});
    }
    if (selectedDest === 'sermon' && sermons.length === 0) {
      fetchAllPages<Sermon>('/sermons/').then(setSermons).catch(() => {});
    }
  }, [selectedDest, events.length, sermons.length]);

  function selectDestination(key: GalleryDestination) {
    setSelectedDest(key);
    setSelectedEventId(null);
    setSelectedSermonId(null);
  }

  const requiresLinkedRecord = selectedDest === 'event' || selectedDest === 'sermon';
  const linkedRecordChosen =
    selectedDest === 'event' ? selectedEventId !== null
    : selectedDest === 'sermon' ? selectedSermonId !== null
    : true;
  const uploadUnlocked = selectedDest !== null && linkedRecordChosen;

  // ── Upload handling ───────────────────────────────────────────────────────

  async function uploadFiles(files: FileList | File[]) {
    if (!uploadUnlocked) return;
    const list = Array.from(files).filter((f) => /\.(jpe?g|png|webp|mp4|mov|webm|gif|svg)$/i.test(f.name));
    if (list.length === 0) return;

    // Try to get a Cloudinary signature for direct (fast) upload
    let sigData: { signature: string; timestamp: number; api_key: string; cloud_name: string } | null = null;
    try {
      const sigRes = await adminApi.get<{ signature: string; timestamp: number; api_key: string; cloud_name: string }>('/upload/signature/');
      sigData = sigRes.data;
    } catch {
      // Signature fetch failed — will fall back to proxy for each file
    }

    for (const file of list) {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      setPending((prev) => [...prev, { id, file, status: 'uploading', title: stripExtension(file.name), progress: 0 }]);

      try {
        let url: string;
        let mediaType: 'image' | 'video';

        if (sigData) {
          // ── Direct browser → Cloudinary (fast, with progress bar) ──────────
          const { signature, timestamp, api_key, cloud_name } = sigData;
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', api_key);
          formData.append('timestamp', String(timestamp));
          formData.append('signature', signature);

          const result = await new Promise<{ url: string; mediaType: 'image' | 'video' }>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: pct } : p)));
              }
            };
            xhr.onload = () => {
              if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText) as { secure_url: string; resource_type: string };
                resolve({ url: data.secure_url, mediaType: data.resource_type === 'video' ? 'video' : 'image' });
              } else {
                // Capture the real Cloudinary error and fall through to proxy
                let errDetail = `HTTP ${xhr.status}`;
                try { errDetail = (JSON.parse(xhr.responseText) as { error?: { message?: string } }).error?.message ?? errDetail; } catch { /* ignore */ }
                reject(new Error(errDetail));
              }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`);
            xhr.send(formData);
          }).catch(async (directErr: Error) => {
            // ── Fallback: proxy through Django server ───────────────────────
            setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: undefined } : p)));
            const fallbackForm = new FormData();
            fallbackForm.append('file', file);
            const res = await adminApi.post<{ url: string; media_type: string }>('/upload/', fallbackForm, {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (e) => {
                if (e.total) {
                  const pct = Math.round((e.loaded / e.total) * 100);
                  setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: pct } : p)));
                }
              },
            });
            console.warn('Direct upload failed, used proxy fallback. Reason:', directErr.message);
            const mt: 'image' | 'video' = res.data.media_type === 'video' ? 'video' : 'image';
            return { url: res.data.url, mediaType: mt };
          });

          url = result.url;
          mediaType = result.mediaType;
        } else {
          // ── No signature — go straight to proxy ────────────────────────────
          const fallbackForm = new FormData();
          fallbackForm.append('file', file);
          const res = await adminApi.post<{ url: string; media_type: string }>('/upload/', fallbackForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
              if (e.total) {
                const pct = Math.round((e.loaded / e.total) * 100);
                setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: pct } : p)));
              }
            },
          });
          url = res.data.url;
          mediaType = res.data.media_type === 'video' ? 'video' : 'image';
        }

        setPending((prev) => prev.map((p) =>
          p.id === id ? { ...p, status: 'ready', url, mediaType, progress: 100 } : p
        ));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setPending((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'error', error: msg } : p)));
      }
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (!uploadUnlocked) return;
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  async function saveToGallery(pendingPhoto: PendingPhoto) {
    if (!pendingPhoto.url || !selectedDest) return;
    setPending((prev) => prev.map((p) => (p.id === pendingPhoto.id ? { ...p, status: 'saving' } : p)));
    try {
      await adminApi.post('/gallery/', {
        title: pendingPhoto.title,
        image: pendingPhoto.url,
        media_type: pendingPhoto.mediaType ?? 'image',
        destination: selectedDest,
        event_id: selectedDest === 'event' ? selectedEventId : undefined,
        sermon_id: selectedDest === 'sermon' ? selectedSermonId : undefined,
      });
      setPending((prev) => prev.filter((p) => p.id !== pendingPhoto.id));
      await load();
    } catch {
      setPending((prev) => prev.map((p) => (p.id === pendingPhoto.id ? { ...p, status: 'error', error: 'Save failed' } : p)));
    }
  }

  function removePending(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Manage grid actions ──────────────────────────────────────────────────

  async function toggleActive(photo: ChurchPhoto) {
    const updated = { ...photo, is_active: !photo.is_active };
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
    await adminApi.patch(`/gallery/${photo.id}/`, { is_active: updated.is_active });
  }

  async function saveTitle(photo: ChurchPhoto, title: string) {
    if (title === photo.title) return;
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, title } : p)));
    await adminApi.patch(`/gallery/${photo.id}/`, { title });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/gallery/${deleteTarget.id}/`);
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  // Group filtered photos by destination — drag reordering only happens within a group
  const activeFilter = FILTER_TABS.find((t) => t.key === filter) ?? FILTER_TABS[0];
  const visiblePhotos = photos.filter((p) => activeFilter.match(p.destination));

  const groupedByDestination = useMemo(() => {
    const map = new Map<GalleryDestination, ChurchPhoto[]>();
    visiblePhotos.forEach((p) => {
      const bucket = map.get(p.destination) ?? [];
      bucket.push(p);
      map.set(p.destination, bucket);
    });
    map.forEach((list) => list.sort((a, b) => a.order - b.order));
    return map;
  }, [visiblePhotos]);

  async function handleDragEnd(destination: GalleryDestination, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const group = groupedByDestination.get(destination) ?? [];
    const oldIndex = group.findIndex((p) => p.id === active.id);
    const newIndex = group.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(group, oldIndex, newIndex).map((p, i) => ({ ...p, order: i }));
    const reorderedIds = new Set(reordered.map((p) => p.id));

    setPhotos((prev) => [...prev.filter((p) => !reorderedIds.has(p.id)), ...reordered]);

    await Promise.all(
      reordered.map((p, i) => {
        const original = group[oldIndex] && group.find((g) => g.id === p.id);
        if (original && original.order === i) return Promise.resolve();
        return adminApi.patch(`/gallery/${p.id}/`, { order: i });
      })
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Images className="w-6 h-6 text-brand-blue" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Gallery</h1>
      </div>

      {/* ══ STEP 1: Upload Panel ══════════════════════════════════════════ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
        <h2 className="font-display text-base font-semibold text-brand-blue">
          1. Choose where this photo will appear
        </h2>

        {(['hero', 'background', 'feature', 'ministry', 'congregation', 'linked'] as DestinationGroup[]).map((group) => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {GROUP_LABELS[group]}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {DESTINATIONS.filter((d) => d.group === group).map((meta) => (
                <DestinationCard
                  key={meta.key}
                  meta={meta}
                  selected={selectedDest === meta.key}
                  onSelect={() => selectDestination(meta.key)}
                />
              ))}
            </div>

            {/* Linked-record dropdowns appear directly under the relevant card */}
            {group === 'linked' && selectedDest === 'event' && (
              <div className="mt-3 max-w-sm">
                <SearchCombobox
                  items={events.map((e) => ({ id: e.id, title: e.title }))}
                  selectedId={selectedEventId}
                  onSelect={setSelectedEventId}
                  placeholder="Search for an event…"
                />
              </div>
            )}
            {group === 'linked' && selectedDest === 'sermon' && (
              <div className="mt-3 max-w-sm">
                <SearchCombobox
                  items={sermons.map((s) => ({ id: s.id, title: s.title }))}
                  selectedId={selectedSermonId}
                  onSelect={setSelectedSermonId}
                  placeholder="Search for a sermon…"
                />
              </div>
            )}
          </div>
        ))}

        {/* Confirmation label */}
        {selectedDest && (
          <p className="text-sm font-medium text-brand-blue">
            📍 Uploading to: {DEST_BY_KEY.get(selectedDest)?.label}
            {selectedDest === 'event' && selectedEventId && ` — ${events.find((e) => e.id === selectedEventId)?.title}`}
            {selectedDest === 'sermon' && selectedSermonId && ` — ${sermons.find((s) => s.id === selectedSermonId)?.title}`}
          </p>
        )}
        {requiresLinkedRecord && !linkedRecordChosen && (
          <p className="text-sm text-brand-red">
            Select {selectedDest === 'event' ? 'an event' : 'a sermon'} above to unlock uploads.
          </p>
        )}

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); if (uploadUnlocked) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => uploadUnlocked && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed rounded-xl transition-colors ${
            !uploadUnlocked
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : dragOver
              ? 'border-brand-blue bg-brand-blue/5 cursor-pointer'
              : 'border-gray-300 hover:border-brand-blue/50 cursor-pointer'
          }`}
        >
          <Upload className={`w-6 h-6 ${uploadUnlocked ? 'text-gray-400' : 'text-gray-300'}`} />
          <p className={`text-sm ${uploadUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
            {uploadUnlocked ? 'Drag & drop photos here, or click to browse' : 'Select a destination above to unlock uploads'}
          </p>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP, MP4, MOV, or WEBM</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            multiple
            disabled={!uploadUnlocked}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* Pending preview strip */}
        {pending.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pending.map((p) => (
              <div key={p.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  {p.url && p.mediaType === 'video' ? (
                    <video src={p.url} className="w-full h-full object-cover" muted playsInline controls={false} />
                  ) : p.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-3">
                      {p.status === 'uploading' && typeof p.progress === 'number' ? (
                        <>
                          <p className="text-xs text-gray-500">Uploading… {p.progress}%</p>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: `${p.progress}%` }} />
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400">Pending</p>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePending(p.id)}
                    aria-label="Remove from preview"
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2.5 space-y-2">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                    {selectedDest ? DEST_BY_KEY.get(selectedDest)?.label : ''}
                  </span>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => setPending((prev) => prev.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))}
                    placeholder="Optional title"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                  {p.status === 'error' && <p className="text-xs text-brand-red">{p.error}</p>}
                  <button
                    type="button"
                    onClick={() => saveToGallery(p)}
                    disabled={p.status !== 'ready'}
                    className="w-full py-1.5 text-xs font-medium bg-brand-blue text-white rounded-md hover:bg-brand-blue/80 disabled:opacity-50 transition-colors"
                  >
                    {p.status === 'saving' ? 'Saving…' : 'Save to Gallery'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ STEP 2: Manage Existing Photos ══════════════════════════════════ */}
      <div className="space-y-4">
        <h2 className="font-display text-base font-semibold text-brand-blue">2. Manage Existing Photos</h2>

        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === key ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : groupedByDestination.size === 0 ? (
          <p className="text-center text-gray-400 py-16">No photos here yet.</p>
        ) : (
          <div className="space-y-8">
            {Array.from(groupedByDestination.entries()).map(([destination, group]) => (
              <div key={destination}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  {DEST_BY_KEY.get(destination)?.label ?? destination} ({group.length})
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(destination, e)}
                >
                  <SortableContext items={group.map((p) => p.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {group.map((photo, i) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          order={i + 1}
                          onToggleActive={toggleActive}
                          onSaveTitle={saveTitle}
                          onDelete={setDeleteTarget}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete photo?"
        message={`This will permanently delete "${deleteTarget?.title || 'this photo'}". This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
