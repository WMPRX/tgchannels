import PlatformListingPage from '@/components/groups/PlatformListingPage';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Platform } from '@prisma/client';

export const revalidate = 60;

export default async function CategoryPage({
  params: { locale, platform, id, slug },
  searchParams,
}: {
  params: { locale: string; platform: string; id: string; slug: string };
  searchParams: { sort?: string };
}) {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { translations: true },
  });

  const catName = category?.translations.find((t) => t.locale === locale)?.name
    ?? category?.translations.find((t) => t.locale === 'tr')?.name
    ?? slug;

  const platformLabel: Record<string, string> = {
    whatsapp_group: 'WhatsApp Grupları',
    whatsapp_channel: 'WhatsApp Kanalları',
    telegram_group: 'Telegram Grupları',
    telegram_channel: 'Telegram Kanalları',
    discord_server: 'Discord Sunucuları',
  };

  const platformSlug: Record<string, string> = {
    whatsapp_group: 'whatsapp-gruplari',
    whatsapp_channel: 'whatsapp-kanallari',
    telegram_group: 'telegram-gruplari',
    telegram_channel: 'telegram-kanallari',
    discord_server: 'discord-sunuculari',
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Link href={`/${locale}`} className="hover:text-[#ff6b35] transition-colors">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/${platformSlug[platform] ?? platform}`} className="hover:text-[#ff6b35] transition-colors">
            {platformLabel[platform] ?? platform}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{catName}</span>
        </nav>
      </div>
      <PlatformListingPage
        platform={platform as Platform}
        locale={locale}
        sort={searchParams.sort ?? 'newest'}
        categoryId={Number(id)}
      />
    </div>
  );
}
