'use client';
import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { fetchAllPages } from '@/lib/adminApi';
import AdminTable, { AdminTableColumn } from '@/components/admin/AdminTable';
import type { OnlineMember } from '@/lib/types';

function toCsv(rows: OnlineMember[]): string {
  const header = ['Name', 'Email', 'Country', 'City', 'How Found Us', 'Registered'];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.name, r.email, r.country, r.city, r.how_found_us, r.registered_at]
      .map((v) => escape(String(v ?? '')))
      .join(',')
  );
  return [header.join(','), ...lines].join('\n');
}

export default function OnlineMembersPage() {
  const [members, setMembers] = useState<OnlineMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setMembers(await fetchAllPages<OnlineMember>('/online-members/'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `online-members-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const columns: AdminTableColumn<OnlineMember>[] = [
    { key: 'name', header: 'Name', render: (m) => <span className="font-medium text-gray-800">{m.name}</span> },
    { key: 'email', header: 'Email', render: (m) => m.email },
    { key: 'country', header: 'Country', render: (m) => m.country },
    { key: 'city', header: 'City', render: (m) => m.city },
    { key: 'how_found_us', header: 'How Found Us', render: (m) => m.how_found_us || '—' },
    { key: 'registered_at', header: 'Registered', render: (m) => new Date(m.registered_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-brand-blue">Online Members</h1>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-[#142d54] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        rowKey={(m) => m.id}
        loading={loading}
        emptyMessage="No online members registered yet."
      />
    </div>
  );
}
