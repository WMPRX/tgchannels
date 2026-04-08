import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: { group: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json(reports.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
}
