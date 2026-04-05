import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const id = Number(params.id);
  const { status } = await request.json();
  const report = await prisma.report.update({
    where: { id },
    data: { status: status as 'reviewed' | 'dismissed' },
  });

  return NextResponse.json(report);
}
