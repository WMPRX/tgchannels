export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { getPlatformLabel, timeAgo } from '@/lib/utils';

export const metadata: Metadata = { title: 'Panelim - TGChannels' };

const statusConfig = {
  pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  approved: { label: 'Onaylandı', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  removed: { label: 'Kaldırıldı', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: XCircle },
};

export default async function PanelPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/giris`);

  const groups = await prisma.group.findMany({
    where: { userId: session.user.id },
    include: {
      category: { include: { translations: { where: { locale } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Panelim</h1>
        <Link
          href={`/${locale}/ekle`}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#ff6b35] hover:bg-[#e55d2b] text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Yeni Ekle
        </Link>
      </div>

      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Gruplarım ({groups.length})</h2>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-medium mb-2">Henüz grup eklemediniz.</p>
            <Link href={`/${locale}/ekle`} className="text-[#ff6b35] hover:underline text-sm">İlk grubunu ekle →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {groups.map((g) => {
              const status = statusConfig[g.status];
              return (
                <div key={g.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="platform" platform={g.platform}>{getPlatformLabel(g.platform)}</Badge>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{g.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <Eye size={11} /> {g.viewCount}
                      <span>• {timeAgo(g.createdAt.toISOString())}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {g.status === 'approved' && (
                      <Link href={`/group/${g.id}`} className="text-xs text-blue-500 hover:underline">Görüntüle</Link>
                    )}
                    <Link href={`/${locale}/ekle?edit=${g.id}`} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">Düzenle</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
