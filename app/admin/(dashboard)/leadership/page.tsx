'use client';
import { useEffect, useState, useRef, useCallback, type ChangeEvent } from 'react';
import { Save, Upload, X } from 'lucide-react';
import Toast from '@/components/admin/Toast';

const ROLES = [
  'Resident Pastor',
  'Church Administrator',
  'Worship Pastor',
  'Youth and Teens Pastor',
  'Celebration Church Pastor',
  "Women's Leader",
  "Men's Leader",
] as const;

type Role = (typeof ROLES)[number];

const STORAGE_KEY = 'church_leadership';

interface LeaderEntry {
  role: string;
  name: string;
  photo: string;
}

interface RoleState {
  name: string;
  photo: string;
  dirty: boolean;
}

function getInitials(role: string): string {
  return role
    .split(' ')
    .filter((w) => /^[A-Z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function loadFromStorage(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function LeadershipAdminPage() {
  const [state, setState] = useState<Record<Role, RoleState>>(() =>
    Object.fromEntries(ROLES.map((r) => [r, { name: '', photo: '', dirty: false }])) as Record<Role, RoleState>
  );
  const [toast, setToast] = useState<string | null>(null);
  const fileRefs = useRef<Partial<Record<Role, HTMLInputElement | null>>>({});

  useEffect(() => {
    const saved = loadFromStorage();
    setState(
      Object.fromEntries(
        ROLES.map((role) => {
          const found = saved.find((l) => l.role === role);
          return [role, { name: found?.name ?? '', photo: found?.photo ?? '', dirty: false }];
        })
      ) as Record<Role, RoleState>
    );
  }, []);

  function handleNameChange(role: Role, name: string) {
    setState((prev) => ({ ...prev, [role]: { ...prev[role], name, dirty: true } }));
  }

  function handlePhotoChange(role: Role, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const photo = ev.target?.result as string;
      setState((prev) => ({ ...prev, [role]: { ...prev[role], photo, dirty: true } }));
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto(role: Role) {
    setState((prev) => ({ ...prev, [role]: { ...prev[role], photo: '', dirty: true } }));
    const ref = fileRefs.current[role];
    if (ref) ref.value = '';
  }

  const handleDismiss = useCallback(() => setToast(null), []);

  function saveAll() {
    const entries: LeaderEntry[] = ROLES.map((role) => ({
      role,
      name: state[role]?.name ?? '',
      photo: state[role]?.photo ?? '',
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    setState((prev) =>
      Object.fromEntries(
        ROLES.map((role) => [role, { ...prev[role], dirty: false }])
      ) as Record<Role, RoleState>
    );
    setToast('Leadership data saved. Changes are live on the About page.');
  }

  const anyDirty = ROLES.some((role) => state[role]?.dirty);

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
        {ROLES.map((role) => {
          const entry = state[role];
          const initials = getInitials(role);

          return (
            <div
              key={role}
              className={`bg-white rounded-xl border shadow-sm p-5 space-y-4 transition-colors ${
                entry.dirty ? 'border-brand-gold/60' : 'border-gray-100'
              }`}
            >
              {/* Role label */}
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{role}</p>

              {/* Photo upload + preview */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {entry.photo ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-brand-gold/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.photo}
                        alt={entry.name || role}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center ring-2 ring-brand-gold/20">
                      <span className="font-display text-xl font-semibold text-brand-blue/30 select-none">
                        {initials}
                      </span>
                    </div>
                  )}
                  {entry.photo && (
                    <button
                      type="button"
                      onClick={() => clearPhoto(role)}
                      aria-label="Remove photo"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-[#a82126] transition-colors"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <input
                  ref={(el) => { fileRefs.current[role] = el; }}
                  type="file"
                  accept="image/*"
                  id={`photo-${role}`}
                  className="sr-only"
                  onChange={(e) => handlePhotoChange(role, e)}
                />
                <label
                  htmlFor={`photo-${role}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-blue border border-brand-blue/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-brand-blue/5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  {entry.photo ? 'Change Photo' : 'Upload Photo'}
                </label>
              </div>

              {/* Name input */}
              <div>
                <label
                  htmlFor={`name-${role}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id={`name-${role}`}
                  type="text"
                  value={entry.name}
                  onChange={(e) => handleNameChange(role, e.target.value)}
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
                      {role}
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
