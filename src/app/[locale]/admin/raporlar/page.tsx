export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReportsManager from '@/components/admin/ReportsManager';

export default async function ReportsPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') redirect(`/${locale}`);

  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: { group: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const serialized = reports.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Raporlar ({reports.length})</h1>
      <ReportsManager initialReports={serialized} />
    </div>
  );
}
