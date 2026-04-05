import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const sponsors = await prisma.sponsorLink.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(sponsors);
}

export async function POST(request: Request) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const body = await request.json();
  const sponsor = await prisma.sponsorLink.create({ data: body });
  return NextResponse.json(sponsor, { status: 201 });
}
