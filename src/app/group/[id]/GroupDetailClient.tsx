'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Tag, Globe, Clock, User, MessageCircle, Send, Hash, Star, Share2, Flag } from 'lucide-react';
import GroupCard from '@/components/groups/GroupCard';
import RedirectModal from '@/components/groups/RedirectModal';
import ShareModal from '@/components/groups/ShareModal';
import ReportModal from '@/components/groups/ReportModal';
import Badge from '@/components/ui/Badge';
import { getPlatformColor, getPlatformLabel, maskUsername, timeAgo, getLanguageFlag } from '@/lib/utils';
import type { Platform } from '@prisma/client';

interface GroupDetailProps {
  group: {
    id: number;
    title: string;
    description: string;
    platform: Platform;
    inviteLink: string;
    language: string;
    countryCode: string | null;
    viewCount: number;
    isHighlighted: boolean;
    createdAt: string;
    user: { username: string };
    category: { id: number; slug: string; name: string };
  };
  similar: Array<{
    id: number; title: string; description: string; platform: Platform;
    inviteLink: string; language: string; viewCount: number; isHighlighted: boolean;
    createdAt: string; user: { username: string }; category: { id: number; slug: string; name: string };
  }>;
}

const platformIcon = {
  whatsapp_group: MessageCircle,
  whatsapp_channel: MessageCircle,
  telegram_group: Send,
  telegram_channel: Send,
  discord_server: Hash,
};

const joinLabel: Record<Platform, string> = {
  whatsapp_group: 'Gruba Katıl',
  whatsapp_channel: 'Kanala Katıl',
  telegram_group: 'Gruba Katıl',
  telegram_channel: 'Kanala Katıl',
  discord_server: 'Sunucuya Katıl',
};

export default function GroupDetailClient({ group, similar }: GroupDetailProps) {
  const [redirectOpen, setRedirectOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const platformColor = getPlatformColor(group.platform);
  const Icon = platformIcon[group.platform];

  // Track view on mount
  useEffect(() => {
    fetch(`/api/groups/${group.id}/view`, { method: 'PATCH' }).catch(() => {});
  }, [group.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6 mb-6">
        {group.isHighlighted && (
          <div className="flex items-center gap-1.5 text-[#ff6b35] text-sm font-medium mb-3">
            <Star size={14} className="fill-current" /> Öne Çıkan
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${platformColor}20` }}>
            <Icon size={24} style={{ color: platformColor }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {group.title}
            </h1>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm mb-5">
          <Badge variant="platform" platform={group.platform}>{getPlatformLabel(group.platform)}</Badge>
          <Link href={`/tr/category/${group.platform}/${group.category.id}/${group.category.slug}`}>
            <Badge className="cursor-pointer hover:border-[#ff6b35]">
              <Tag size={12} /> {group.category.name}
            </Badge>
          </Link>
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Eye size={13} /> {group.viewCount.toLocaleString('tr-TR')} görüntülenme
          </span>
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock size={13} /> {timeAgo(group.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <User size={13} /> {maskUsername(group.user.username)}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Globe size={13} /> {getLanguageFlag(group.language)} {group.language.toUpperCase()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setRedirectOpen(true)}
            className="flex-1 min-w-[140px] py-3 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: platformColor }}
          >
            {joinLabel[group.platform]}
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors flex items-center gap-2"
          >
            <Share2 size={18} /> Paylaş
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <Flag size={18} /> Rapor
          </button>
        </div>

        {/* Description */}
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Açıklama</h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{group.description}</p>
        </div>
      </div>

      {/* Similar Groups */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Benzer Gruplar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similar.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        </div>
      )}

      <RedirectModal isOpen={redirectOpen} onClose={() => setRedirectOpen(false)} inviteLink={group.inviteLink} platform={group.platform} groupId={group.id} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} groupId={group.id} title={group.title} />
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} groupId={group.id} />
    </div>
  );
}
