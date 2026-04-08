import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json([]);

  const group = await prisma.group.findUnique({ where: { id }, select: { categoryId: true, platform: true } });
  if (!group) return NextResponse.json([]);

  const similar = await prisma.group.findMany({
    where: {
      id: { not: id },
      categoryId: group.categoryId,
      platform: group.platform,
      status: 'approved',
    },
    select: {
      id: true, title: true, description: true, platform: true,
      viewCount: true, isHighlighted: true, createdAt: true,
      user: { select: { username: true } },
      category: { select: { id: true, slug: true, translations: { select: { locale: true, name: true } } } },
    },
    orderBy: { viewCount: 'desc' },
    take: 4,
  });

  return NextResponse.json(similar.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    inviteLink: '',
    language: 'tr',
    category: {
      id: g.category.id,
      slug: g.category.slug,
      name: g.category.translations.find((t) => t.locale === 'tr')?.name ?? g.category.slug,
    },
  })));
}
