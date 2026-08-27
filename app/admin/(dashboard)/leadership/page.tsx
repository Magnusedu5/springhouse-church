'use client';
import { useEffect, useState, useRef, useCallback, type ChangeEvent } from 'react';
import { Save, Upload, X } from 'lucide-react';
import adminApi, { fetchAllPages } from '@/lib/adminApi';
import Toast from '@/components/admin/Toast';
import type { LeadershipMember } from '@/lib/types';

function getInitials(role: string): string {
  return role
    .split(' ')
    .filter((w) => /^[A-Z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

interface RoleState {
  id: number;
  name: string;
  photo: string;
  dirty: boolean;
  uploading: boolean;
}

export default function LeadershipAdminPage() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [state, setState] = useState<Record<number, RoleState>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const fileRefs = useRef<Partial<Record<number, HTMLInputElement | null>>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAllPages<LeadershipMember>('/leadership/');
        setMembers(data);
        setState(
          Object.fromEntries(
            data.map((m) => [m.id, { id: m.id, name: m.name, photo: m.photo, dirty: false, uploading: false }])
          )
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleNameChange(id: number, name: string) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], name, dirty: true } }));
  }

  async function handlePhotoChange(id: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState((prev) => ({ ...prev, [id]: { ...prev[id], uploading: true } }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminApi.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setState((prev) => ({ ...prev, [id]: { ...prev[id], photo: res.data.url, dirty: true, uploading: false } }));
    } catch {
      setState((prev) => ({ ...prev, [id]: { ...prev[id], uploading: false } }));
      setToast('Photo upload failed. Please try again.');
    }
  }

  function clearPhoto(id: number) {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], photo: '', dirty: true } }));
    const ref = fileRefs.current[id];
    if (ref) ref.value = '';
  }

  const handleDismiss = useCallback(() => setToast(null), []);

  async function saveAll() {
    const dirtyIds = members.map((m) => m.id).filter((id) => state[id]?.dirty);
    await Promise.all(
      dirtyIds.map((id) =>
        adminApi.patch(`/leadership/${id}/`, { name: state[id].name, photo: state[id].photo })
      )
    );
    setState((prev) => {
      const next = { ...prev };
      for (const id of dirtyIds) next[id] = { ...next[id], dirty: false };
      return next;
    });
    setToast('Leadership data saved. Changes are live on the About page.');
  }

  const anyDirty = members.some((m) => state[m.id]?.dirty);

  if (loading) {
    return <div className="py-16 text-center text-gray-400 text-sm">Loading leadership team…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-blue">Church Leadership</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update names and photos for each role. Changes appear live on the About page.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={!anyDirty}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-lg hover:bg-[#a82126] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {members.map((member) => {
          const entry = state[member.id];
          if (!entry) return null;
          const initials = getInitials(member.role);

          return (
            <div
              key={member.id}
              className={`bg-white rounded-xl border shadow-sm p-5 space-y-4 transition-colors ${
                entry.dirty ? 'border-brand-gold/60' : 'border-gray-100'
              }`}
            >
              {/* Role label */}
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{member.role}</p>

              {/* Photo upload + preview */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {entry.photo ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-brand-gold/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.photo}
                        alt={entry.name || member.role}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center ring-2 ring-brand-gold/20">
                      <span className="font-display text-xl font-semibold text-brand-blue/30 select-none">
                        {entry.uploading ? '…' : initials}
                      </span>
                    </div>
                  )}
                  {entry.photo && (
                    <button
                      type="button"
                      onClick={() => clearPhoto(member.id)}
                      aria-label="Remove photo"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-[#a82126] transition-colors"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <input
                  ref={(el) => { fileRefs.current[member.id] = el; }}
                  type="file"
                  accept="image/*"
                  id={`photo-${member.id}`}
                  className="sr-only"
                  onChange={(e) => handlePhotoChange(member.id, e)}
                  disabled={entry.uploading}
                />
                <label
                  htmlFor={`photo-${member.id}`}
                  className={`flex items-center gap-1.5 text-xs font-medium text-brand-blue border border-brand-blue/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand-blue/5 transition-colors ${
                    entry.uploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  {entry.uploading ? 'Uploading…' : entry.photo ? 'Change Photo' : 'Upload Photo'}
                </label>
              </div>

              {/* Name input */}
              <div>
                <label
                  htmlFor={`name-${member.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id={`name-${member.id}`}
                  type="text"
                  value={entry.name}
                  onChange={(e) => handleNameChange(member.id, e.target.value)}
                  placeholder="TBA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Live preview */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Preview</p>
                <div className="flex items-center gap-3">
                  {entry.photo ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-brand-gold/30 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center ring-1 ring-brand-gold/20 flex-shrink-0">
                      <span className="font-display text-xs font-semibold text-brand-blue/30 select-none">
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold leading-tight truncate">
                      {member.role}
                    </p>
                    <p className="font-display text-sm font-semibold text-brand-blue truncate">
                      {entry.name || 'TBA'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Toast message={toast} onDismiss={handleDismiss} />
    </div>
  );
}
