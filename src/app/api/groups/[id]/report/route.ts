import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getClientIP } from '@/lib/utils';
import { redis } from '@/lib/redis';

const schema = z.object({
  reason: z.enum(['invalid_link', 'illegal_content', 'misleading', 'other']),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ message: 'Geçersiz ID' }, { status: 400 });

  const ip = getClientIP(request);
  const rateLimitKey = `report:${id}:${ip.replace(/\./g, '_')}`;

  if (redis) {
    const count = await redis.get(rateLimitKey);
    if (count && parseInt(count) >= 3) {
      return NextResponse.json({ message: 'Çok fazla rapor gönderildi' }, { status: 429 });
    }
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) return NextResponse.json({ message: 'Grup bulunamadı' }, { status: 404 });

    await prisma.report.create({
      data: { groupId: id, reporterIp: ip, reason: data.reason, note: data.note },
    });

    if (redis) {
      const cur = await redis.incr(rateLimitKey);
      if (cur === 1) await redis.expire(rateLimitKey, 86400);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Geçersiz veriler' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
