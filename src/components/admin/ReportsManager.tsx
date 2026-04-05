'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: number;
  reason: string;
  note: string | null;
  reporterIp: string;
  createdAt: string;
  status: string;
  group: { id: number; title: string };
}

const reasonLabel: Record<string, string> = {
  invalid_link: 'Geçersiz link',
  illegal_content: 'Yasadışı içerik',
  misleading: 'Yanıltıcı',
  other: 'Diğer',
};

export default function ReportsManager({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState<number | null>(null);

  const handleAction = async (id: number, status: 'reviewed' | 'dismissed') => {
    setLoading(id);
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoading(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
        <p>Bekleyen rapor yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{r.group.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{reasonLabel[r.reason] || r.reason}</span>
                <span className="text-xs text-gray-400">{r.reporterIp.slice(0, 8)}***</span>
              </div>
              {r.note && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.note}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleAction(r.id, 'reviewed')}
                disabled={loading === r.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle size={12} /> İncele
              </button>
              <button
                onClick={() => handleAction(r.id, 'dismissed')}
                disabled={loading === r.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
              >
                <XCircle size={12} /> Kapat
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
