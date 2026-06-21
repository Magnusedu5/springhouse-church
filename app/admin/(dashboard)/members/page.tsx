'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Search, Download, UserCheck, ChevronDown, ChevronUp, X } from 'lucide-react';
import { fetchAllPages } from '@/lib/adminApi';
import adminApi from '@/lib/adminApi';
import type { Member } from '@/lib/types';

type Tab = 'new' | 'existing' | 'official';

const TAB_LABELS: Record<Tab, string> = {
  new: 'New Members',
  existing: 'Existing Members',
  official: 'Official Members',
};

function fmt(val: string | null | undefined) {
  return val || '—';
}

function fmtDate(val: string | null | undefined) {
  if (!val) return '—';
  try { return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return val; }
}

function toCsv(rows: Member[]): string {
  const cols = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth', 'Gender',
    'Marital Status', 'Address', 'City', 'State', 'Occupation', 'Employer',
    'Baptism Status', 'Ministry Interests', 'Emergency Contact', 'Emergency Phone',
    'Emergency Relationship', 'How Heard', 'Notes', 'Registered',
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [
    r.first_name, r.last_name, r.email, r.phone, r.date_of_birth ?? '',
    r.gender, r.marital_status, r.address, r.city, r.state,
    r.occupation, r.employer, r.baptism_status, r.ministry_interests,
    r.emergency_contact_name, r.emergency_contact_phone, r.emergency_contact_relationship,
    r.how_heard, r.notes, r.registered_at,
  ].map((v) => escape(String(v ?? ''))).join(','));
  return [cols.join(','), ...lines].join('\n');
}

function MemberDetailModal({ member, onClose, onPromote }: {
  member: Member;
  onClose: () => void;
  onPromote: (id: number) => void;
}) {
  const name = `${member.first_name} ${member.last_name}`.trim() || 'Anonymous';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display text-lg font-semibold text-brand-blue">{name}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Photo */}
          {member.photo && (
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold/30">
                <Image src={member.photo} alt={name} fill className="object-cover" />
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              member.member_type === 'official'
                ? 'bg-green-100 text-green-700'
                : member.member_type === 'existing'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {TAB_LABELS[member.member_type]}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ['Email', fmt(member.email)],
              ['Phone', fmt(member.phone)],
              ['Date of Birth', fmtDate(member.date_of_birth)],
              ['Gender', fmt(member.gender)],
              ['Marital Status', fmt(member.marital_status)],
              ['Address', fmt(member.address)],
              ['City', fmt(member.city)],
              ['State', fmt(member.state)],
              ['Occupation', fmt(member.occupation)],
              ['Employer', fmt(member.employer)],
              ['Baptism Status', fmt(member.baptism_status)],
              ['How Heard', fmt(member.how_heard)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-gray-400 text-xs uppercase tracking-wide">{label}</dt>
                <dd className="text-gray-800 mt-0.5">{value}</dd>
              </div>
            ))}
            {member.ministry_interests && (
              <div className="col-span-2">
                <dt className="text-gray-400 text-xs uppercase tracking-wide">Ministry Interests</dt>
                <dd className="text-gray-800 mt-0.5">{member.ministry_interests}</dd>
              </div>
            )}
            {(member.emergency_contact_name || member.emergency_contact_phone) && (
              <div className="col-span-2">
                <dt className="text-gray-400 text-xs uppercase tracking-wide">Emergency Contact</dt>
                <dd className="text-gray-800 mt-0.5">
                  {member.emergency_contact_name}
                  {member.emergency_contact_relationship ? ` (${member.emergency_contact_relationship})` : ''}
                  {member.emergency_contact_phone ? ` · ${member.emergency_contact_phone}` : ''}
                </dd>
              </div>
            )}
            {member.notes && (
              <div className="col-span-2">
                <dt className="text-gray-400 text-xs uppercase tracking-wide">Notes</dt>
                <dd className="text-gray-800 mt-0.5">{member.notes}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className="text-gray-400 text-xs uppercase tracking-wide">Registered</dt>
              <dd className="text-gray-800 mt-0.5">{fmtDate(member.registered_at)}</dd>
            </div>
          </dl>

          {member.member_type !== 'official' && (
            <button
              type="button"
              onClick={() => { onPromote(member.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Promote to Official Member
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MembersAdminPage() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('new');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);
  const [promoting, setPromoting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAllMembers(await fetchAllPages<Member>('/members/'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = allMembers.filter((m) => {
    if (m.member_type !== tab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.city.toLowerCase().includes(q)
    );
  });

  const counts: Record<Tab, number> = {
    new: allMembers.filter((m) => m.member_type === 'new').length,
    existing: allMembers.filter((m) => m.member_type === 'existing').length,
    official: allMembers.filter((m) => m.member_type === 'official').length,
  };

  async function promote(id: number) {
    setPromoting(id);
    try {
      await adminApi.patch(`/members/${id}/`, { member_type: 'official' });
      setAllMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, member_type: 'official' } : m))
      );
    } finally {
      setPromoting(null);
    }
  }

  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Members</h1>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setSearch(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t ? 'bg-white shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {TAB_LABELS[t]}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
              tab === t ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'
            }`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone, city…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading members…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No {TAB_LABELS[tab].toLowerCase()} found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">City</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Registered</th>
                  {tab !== 'official' && (
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => {
                  const name = `${m.first_name} ${m.last_name}`.trim() || 'Anonymous';
                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelected(m)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {m.photo ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image src={m.photo} alt={name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-blue">
                              {(m.first_name?.[0] ?? '?').toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{fmt(m.email)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(m.phone)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(m.city)}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(m.registered_at)}</td>
                      {tab !== 'official' && (
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => promote(m.id)}
                            disabled={promoting === m.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {promoting === m.id ? 'Promoting…' : 'Make Official'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <MemberDetailModal
          member={selected}
          onClose={() => setSelected(null)}
          onPromote={(id) => promote(id)}
        />
      )}
    </div>
  );
}
