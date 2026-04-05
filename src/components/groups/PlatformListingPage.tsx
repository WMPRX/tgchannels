import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import GroupList from './GroupList';
import SortTabs from './SortTabs';
import CategoryFilter from './CategoryFilter';
import { getPlatformLabel, getPlatformColor, getPlatformSlug } from '@/lib/utils';
import type { Platform, Prisma } from '@prisma/client';
import Link from 'next/link';

export const revalidate = 30;

interface Props {
  platform: Platform;
  locale: string;
  sort: string;
  categoryId?: number;
}

async function getCategories(locale: string) {
  const cats = await prisma.category.findMany({
    include: { translations: { where: { locale } } },
    orderBy: { id: 'asc' },
  });
  return cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
  }));
}

async function getGroups(platform: Platform, sort: string, categoryId: number | undefined, locale: string) {
  const orderBy: Prisma.GroupOrderByWithRelationInput[] = [
    { isHighlighted: 'desc' },
    sort === 'popular' ? { viewCount: 'desc' } : sort === 'least_viewed' ? { viewCount: 'asc' } : { createdAt: 'desc' },
  ];

  const where: Prisma.GroupWhereInput = {
    platform,
    status: 'approved',
    ...(categoryId && { categoryId }),
  };

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where,
      select: {
        id: true, title: true, description: true, platform: true,
        inviteLink: true, language: true, viewCount: true,
        isHighlighted: true, createdAt: true,
        user: { select: { username: true } },
        category: { select: { id: true, slug: true, translations: { select: { locale: true, name: true } } } },
      },
      orderBy,
      take: 20,
    }),
    prisma.group.count({ where }),
  ]);

  return {
    groups: groups.map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      category: {
        id: g.category.id,
        slug: g.category.slug,
        name: g.category.translations.find((t) => t.locale === locale)?.name
          ?? g.category.translations.find((t) => t.locale === 'tr')?.name
          ?? g.category.slug,
      },
    })),
    total,
    hasMore: total > 20,
  };
}

export default async function PlatformListingPage({ platform, locale, sort, categoryId }: Props) {
  const [{ groups, total, hasMore }, categories] = await Promise.all([
    getGroups(platform, sort, categoryId, locale),
    getCategories(locale),
  ]);

  const platformName = getPlatformLabel(platform, locale);
  const platformColor = getPlatformColor(platform);
  const promotionSlug = getPlatformSlug(platform, locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {platformName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {total.toLocaleString('tr-TR')}+ sürekli eklenen {platformName.toLowerCase()}
        </p>
      </div>

      {/* Promo Banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${platformColor}20, ${platformColor}10)`, border: `1px solid ${platformColor}30` }}
      >
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">Grubunu Öne Çıkar! ⭐</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">7 günlük öne çıkarma ile listenin en üstünde görün • 7 gün = 243,60 ₺</p>
        </div>
        <Link
          href={`/${locale}/panel`}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: platformColor }}
        >
          Öne Çıkar
        </Link>
      </div>

      {/* Sort + Filter */}
      <div className="flex flex-col gap-4 mb-6">
        <Suspense>
          <SortTabs activeSort={(sort as 'newest' | 'popular' | 'least_viewed') || 'newest'} />
        </Suspense>
        <Suspense>
          <CategoryFilter categories={categories} activeCategoryId={categoryId} />
        </Suspense>
      </div>

      {/* Group List */}
      <GroupList
        initialGroups={groups}
        hasMore={hasMore}
        platform={platform}
        categoryId={categoryId}
        sort={sort}
        locale={locale}
      />

      {/* SEO Text */}
      <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
        <h2>{platformName} Hakkında</h2>
        <p>
          TGChannels üzerinde onlarca kategoride {platformName.toLowerCase()} bulabilirsiniz.
          Spor, teknoloji, eğitim, eğlence ve daha fazlası için doğru topluluğu keşfedin.
          Kendi grubunuzu ekleyerek binlerce kullanıcıya ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
