import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redisGet, redisSet } from '@/lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') ?? 'tr';

  const cacheKey = `categories:${locale}`;
  const cached = await redisGet(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: { locale },
      },
    },
    orderBy: { id: 'asc' },
  });

  const result = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.translations[0]?.name ?? c.slug,
  }));

  await redisSet(cacheKey, JSON.stringify(result), 3600);
  return NextResponse.json(result);
}
