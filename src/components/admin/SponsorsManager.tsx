'use client';

import { useState } from 'react';

type Sponsor = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

const emptyForm = { title: '', url: '', isActive: true, sortOrder: 0 };

export default function SponsorsManager({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId !== null) {
        const res = await fetch(`/api/sponsors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated = await res.json();
          setSponsors((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        const res = await fetch('/api/sponsors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const created = await res.json();
          setSponsors((prev) => [...prev, created]);
          setForm(emptyForm);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Sponsor) => {
    setEditingId(s.id);
    setForm({ title: s.title, url: s.url, isActive: s.isActive, sortOrder: s.sortOrder });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sponsor bağlantısını silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/sponsors/${id}`, { method: 'DELETE' });
    if (res.ok) setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#16213e] rounded-2xl p-5 shadow-card space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {editingId !== null ? 'Sponsor Düzenle' : 'Yeni Sponsor Ekle'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Sıra</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 accent-[#ff6b35]"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#ff6b35] hover:bg-[#e55a25] text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Kaydediliyor...' : editingId !== null ? 'Güncelle' : 'Ekle'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(emptyForm); }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              İptal
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {sponsors.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Henüz sponsor bağlantısı yok.</p>
        )}
        {sponsors.map((s) => (
          <div key={s.id} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 shadow-card flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{s.title}</p>
                {!s.isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    Pasif
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.url}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(s)}
                className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
