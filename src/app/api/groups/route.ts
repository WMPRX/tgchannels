import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redisGet, redisSet, redisExists, redisSet as rateLimitSet } from '@/lib/redis';
import { getClientIP, validateInviteLink } from '@/lib/utils';
import type { Platform, Prisma } from '@prisma/client';

const groupSelect = {
  id: true,
  title: true,
  description: true,
  platform: true,
  inviteLink: true,
  language: true,
  viewCount: true,
  isHighlighted: true,
  highlightExpiresAt: true,
  createdAt: true,
  user: { select: { username: true } },
  category: {
    select: {
      id: true,
      slug: true,
      translations: { select: { locale: true, name: true } },
    },
  },
} satisfies Prisma.GroupSelect;

function formatGroup(g: Awaited<ReturnType<typeof prisma.group.findFirst>>, locale = 'tr') {
  if (!g) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = g as any as {
    id: number; title: string; description: string; platform: string;
    inviteLink: string; language: string; viewCount: number; isHighlighted: boolean;
    createdAt: Date; user: { username: string };
    category: { id: number; slug: string; translations: { locale: string; name: string }[] };
  };
  return {
    ...raw,
    createdAt: raw.createdAt.toISOString(),
    category: {
      id: raw.category.id,
      slug: raw.category.slug,
      name: raw.category.translations.find((t) => t.locale === locale)?.name
        ?? raw.category.translations.find((t) => t.locale === 'tr')?.name
        ?? raw.category.slug,
    },
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as Platform | null;
  const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'popular' | 'least_viewed';
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const locale = searchParams.get('locale') ?? 'tr';
  const skip = (page - 1) * limit;

  const where: Prisma.GroupWhereInput = {
    status: 'approved',
    ...(platform && { platform }),
    ...(categoryId && { categoryId }),
    // Exclude expired highlights from normal sort
  };

  const now = new Date();
  const orderBy: Prisma.GroupOrderByWithRelationInput[] = [
    // Highlighted groups always first
    { isHighlighted: 'desc' },
    sort === 'newest'
      ? { createdAt: 'desc' }
      : sort === 'popular'
      ? { viewCount: 'desc' }
      : { viewCount: 'asc' },
  ];

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where: {
        ...where,
        OR: [
          { isHighlighted: false },
          { isHighlighted: true, highlightExpiresAt: { gt: now } },
        ],
      },
      select: groupSelect,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.group.count({ where }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatted = groups.map((g) => formatGroup(g as any, locale));

  return NextResponse.json({
    groups: formatted,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  });
}

const createSchema = z.object({
  platform: z.enum(['whatsapp_group', 'whatsapp_channel', 'telegram_group', 'telegram_channel', 'discord_server']),
  title: z.string().min(2).max(255),
  inviteLink: z.string().url(),
  categoryId: z.number().int().positive(),
  description: z.string().min(50).max(500),
  language: z.string().default('tr'),
  countryCode: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Giriş yapmanız gerekiyor' }, { status: 401 });
  }

  const ip = getClientIP(request);
  const rateLimitKey = `rate:create:${ip}`;
  const exists = await redisExists(rateLimitKey);
  if (exists) {
    // Allow up to 3 per hour - simple approach
    const count = await (async () => {
      const { redis } = await import('@/lib/redis');
      if (!redis) return 0;
      const v = await redis.get(rateLimitKey);
      return v ? parseInt(v) : 0;
    })();
    if (count >= 3) {
      return NextResponse.json({ message: 'Çok fazla istek. Lütfen bekleyin.' }, { status: 429 });
    }
  }

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    if (!validateInviteLink(data.inviteLink, data.platform)) {
      return NextResponse.json({ message: 'Geçersiz davet linki formatı' }, { status: 400 });
    }

    const group = await prisma.group.create({
      data: {
        userId: session.user.id,
        title: data.title,
        description: data.description,
        platform: data.platform,
        categoryId: data.categoryId,
        inviteLink: data.inviteLink,
        language: data.language,
        countryCode: data.countryCode,
        status: 'pending',
      },
    });

    // Rate limit tracking
    const { redis } = await import('@/lib/redis');
    if (redis) {
      const cur = await redis.incr(rateLimitKey);
      if (cur === 1) await redis.expire(rateLimitKey, 3600);
    }

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Geçersiz veriler', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
