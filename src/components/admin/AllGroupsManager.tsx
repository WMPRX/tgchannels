'use client';

import { useState } from 'react';

type Group = {
  id: number;
  title: string;
  status: string;
  platform: string;
  viewCount: number;
  createdAt: string;
  user: { username: string | null; email: string | null } | null;
};

export default function AllGroupsManager({ initialGroups }: { initialGroups: Group[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState<number | null>(null);

  const filtered = groups.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (id: number, action: 'approve' | 'reject' | 'delete') => {
    setLoading(id);
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/admin/groups/${id}`, { method: 'DELETE' });
        if (res.ok) setGroups((prev) => prev.filter((g) => g.id !== id));
      } else {
        const res = await fetch(`/api/admin/groups/${id}/${action}`, { method: 'PATCH' });
        if (res.ok) {
          const newStatus = action === 'approve' ? 'approved' : 'rejected';
          setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g)));
        }
      }
    } finally {
      setLoading(null);
    }
  };

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Grup ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        >
          <option value="all">Tümü</option>
          <option value="pending">Bekleyen</option>
          <option value="approved">Onaylı</option>
          <option value="rejected">Reddedilen</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Sonuç bulunamadı.</p>
        )}
        {filtered.map((group) => (
          <div key={group.id} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[group.status] ?? ''}`}>
                    {group.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{group.platform}</span>
                  <span className="text-xs text-gray-400">#{group.id}</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{group.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {group.user?.username ?? group.user?.email ?? 'Bilinmiyor'} · {group.viewCount} görüntüleme
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {group.status !== 'approved' && (
                  <button
                    onClick={() => handleAction(group.id, 'approve')}
                    disabled={loading === group.id}
                    className="text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Onayla
                  </button>
                )}
                {group.status !== 'rejected' && (
                  <button
                    onClick={() => handleAction(group.id, 'reject')}
                    disabled={loading === group.id}
                    className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Reddet
                  </button>
                )}
                <button
                  onClick={() => handleAction(group.id, 'delete')}
                  disabled={loading === group.id}
                  className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg disabled:opacity-50 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
