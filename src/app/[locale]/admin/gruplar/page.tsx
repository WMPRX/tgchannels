export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AllGroupsManager from '@/components/admin/AllGroupsManager';

export default async function AdminGroupsPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') redirect(`/${locale}`);

  const groups = await prisma.group.findMany({
    include: {
      user: { select: { username: true, email: true } },
      category: { include: { translations: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const serialized = groups.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    highlightExpiresAt: g.highlightExpiresAt?.toISOString() ?? null,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Tüm Gruplar ({groups.length})
      </h1>
      <AllGroupsManager initialGroups={serialized} />
    </div>
  );
}
