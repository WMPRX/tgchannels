import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') {
    return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });
  }

  const [totalGroups, pendingGroups, approvedGroups, totalUsers, totalReports, pendingReports] =
    await Promise.all([
      prisma.group.count(),
      prisma.group.count({ where: { status: 'pending' } }),
      prisma.group.count({ where: { status: 'approved' } }),
      prisma.user.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'pending' } }),
    ]);

  return NextResponse.json({ totalGroups, pendingGroups, approvedGroups, totalUsers, totalReports, pendingReports });
}
