export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SponsorsManager from '@/components/admin/SponsorsManager';

export default async function AdminSponsorsPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') redirect(`/${locale}`);

  const sponsors = await prisma.sponsorLink.findMany({ orderBy: { sortOrder: 'asc' } });

  const serialized = sponsors.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Sponsor Bağlantılar</h1>
      <SponsorsManager initialSponsors={serialized} />
    </div>
  );
}
