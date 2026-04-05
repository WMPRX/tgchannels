'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Platform } from '@prisma/client';

interface PendingGroup {
  id: number;
  title: string;
  description: string;
  platform: Platform;
  inviteLink: string;
  createdAt: string;
  user: { username: string; email: string };
  category: { translations: { locale: string; name: string }[] };
}

const platformLabel: Record<Platform, string> = {
  whatsapp_group: 'WA Grup', whatsapp_channel: 'WA Kanal',
  telegram_group: 'TG Grup', telegram_channel: 'TG Kanal',
  discord_server: 'Discord',
};

export default function PendingGroups({ initialGroups }: { initialGroups: PendingGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [loading, setLoading] = useState<number | null>(null);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setLoading(id);
    try {
      await fetch(`/api/admin/groups/${id}/${action}`, { method: 'PATCH' });
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } finally {
      setLoading(null);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
        <p>Onay bekleyen grup yok.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.id} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="platform" platform={g.platform}>{platformLabel[g.platform]}</Badge>
                <span className="text-xs text-gray-400">{g.user.email}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{g.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{g.description}</p>
              <a href={g.inviteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1">
                Linki Görüntüle <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => handleAction(g.id, 'approve')}
                disabled={loading === g.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle size={14} /> Onayla
              </button>
              <button
                onClick={() => handleAction(g.id, 'reject')}
                disabled={loading === g.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <XCircle size={14} /> Reddet
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
