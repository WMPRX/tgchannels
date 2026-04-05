import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if ((session.user as { role?: string }).role !== 'admin') return null;
  return session;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? 'pending';

  const groups = await prisma.group.findMany({
    where: { status: status as 'pending' | 'approved' | 'rejected' | 'removed' },
    include: {
      user: { select: { username: true, email: true } },
      category: { include: { translations: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(groups.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  })));
}
