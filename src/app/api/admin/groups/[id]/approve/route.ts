import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const id = Number(params.id);
  const group = await prisma.group.update({
    where: { id },
    data: { status: 'approved' },
  });

  return NextResponse.json(group);
}
