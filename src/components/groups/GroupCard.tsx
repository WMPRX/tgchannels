'use client';

import { useState } from 'react';
import { Eye, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import RedirectModal from './RedirectModal';
import ShareModal from './ShareModal';
import ReportModal from './ReportModal';
import { getPlatformColor, maskUsername, timeAgo } from '@/lib/utils';
import type { Platform } from '@prisma/client';

interface GroupCardProps {
  group: {
    id: number;
    title: string;
    description: string;
    platform: Platform;
    inviteLink: string;
    language: string;
    viewCount: number;
    isHighlighted: boolean;
    createdAt: string;
    user: { username: string };
    category: { id: number; slug: string; name: string };
  };
  locale?: string;
}

const platformLabel: Record<Platform, string> = {
  whatsapp_group: 'WhatsApp Grup',
  whatsapp_channel: 'WhatsApp Kanal',
  telegram_group: 'Telegram Grup',
  telegram_channel: 'Telegram Kanal',
  discord_server: 'Discord Sunucu',
};

const joinLabel: Record<Platform, string> = {
  whatsapp_group: 'Katıl',
  whatsapp_channel: 'Takip Et',
  telegram_group: 'Katıl',
  telegram_channel: 'Takip Et',
  discord_server: 'Katıl',
};

export default function GroupCard({ group, locale = 'tr' }: GroupCardProps) {
  const [redirectOpen, setRedirectOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const borderColor = getPlatformColor(group.platform);

  return (
    <>
      <div
        className={`relative bg-white dark:bg-[#16213e] rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 overflow-hidden ${group.isHighlighted ? 'ring-2 ring-[#ff6b35]' : ''}`}
        style={{ borderLeft: `4px solid ${borderColor}` }}
      >
        {group.isHighlighted && (
          <div className="absolute top-2 right-2">
            <Badge variant="highlighted">
              <Star size={10} className="fill-current" /> Öne Çıkan
            </Badge>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="platform" platform={group.platform}>
                  {platformLabel[group.platform]}
                </Badge>
                <Badge>{group.category.name}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight line-clamp-1">
                {group.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {group.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={12} /> {group.viewCount.toLocaleString('tr-TR')}
              </span>
              <span>{timeAgo(group.createdAt, locale)}</span>
              <span>{maskUsername(group.user.username)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareOpen(true)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors px-2 py-1"
              >
                Paylaş
              </button>
              <button
                onClick={() => setReportOpen(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
              >
                Rapor
              </button>
              <button
                onClick={() => setRedirectOpen(true)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: borderColor }}
              >
                {joinLabel[group.platform]}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RedirectModal isOpen={redirectOpen} onClose={() => setRedirectOpen(false)} inviteLink={group.inviteLink} platform={group.platform} groupId={group.id} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} groupId={group.id} title={group.title} />
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} groupId={group.id} />
    </>
  );
}
