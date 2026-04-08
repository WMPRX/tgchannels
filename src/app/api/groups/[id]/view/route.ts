import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientIP } from '@/lib/utils';
import { redis } from '@/lib/redis';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ counted: false });

  const ip = getClientIP(request);
  const key = `view:${id}:${ip.replace(/\./g, '_')}`;

  if (redis) {
    const exists = await redis.get(key);
    if (exists) return NextResponse.json({ counted: false });
    await redis.setex(key, 3600, '1');
  }

  await prisma.group.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ counted: true });
}
