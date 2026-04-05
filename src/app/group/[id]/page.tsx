import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GroupDetailClient from './GroupDetailClient';

export const revalidate = 300;

async function getGroup(id: number) {
  return prisma.group.findUnique({
    where: { id, status: 'approved' },
    include: {
      user: { select: { username: true } },
      category: { include: { translations: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const group = await getGroup(Number(params.id));
  if (!group) return { title: 'Grup Bulunamadı' };
  return {
    title: `${group.title} - TGChannels`,
    description: group.description.slice(0, 160),
    openGraph: {
      title: group.title,
      description: group.description.slice(0, 160),
      type: 'website',
    },
  };
}

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = await getGroup(Number(params.id));
  if (!group) notFound();

  const similar = await prisma.group.findMany({
    where: { id: { not: group.id }, categoryId: group.categoryId, platform: group.platform, status: 'approved' },
    select: {
      id: true, title: true, description: true, platform: true,
      inviteLink: true, language: true, viewCount: true, isHighlighted: true, createdAt: true,
      user: { select: { username: true } },
      category: { select: { id: true, slug: true, translations: { select: { locale: true, name: true } } } },
    },
    orderBy: { viewCount: 'desc' },
    take: 4,
  });

  const formattedGroup = {
    ...group,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
    category: {
      id: group.category.id,
      slug: group.category.slug,
      name: group.category.translations.find((t) => t.locale === 'tr')?.name ?? group.category.slug,
    },
  };

  const formattedSimilar = similar.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    category: {
      id: g.category.id,
      slug: g.category.slug,
      name: g.category.translations.find((t) => t.locale === 'tr')?.name ?? g.category.slug,
    },
  }));

  return <GroupDetailClient group={formattedGroup} similar={formattedSimilar} />;
}
