export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Dashboard from '@/components/admin/Dashboard';

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'admin') redirect(`/${locale}`);

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/admin/stats`, {
    cache: 'no-store',
    headers: { Cookie: '' },
  });
  const stats = res.ok ? await res.json() : { totalGroups: 0, pendingGroups: 0, approvedGroups: 0, totalUsers: 0, totalReports: 0, pendingReports: 0 };

  const adminLinks = [
    { href: `/${locale}/admin/bekleyenler`, label: 'Bekleyen Gruplar', badge: stats.pendingGroups },
    { href: `/${locale}/admin/gruplar`, label: 'Tüm Gruplar', badge: stats.totalGroups },
    { href: `/${locale}/admin/raporlar`, label: 'Raporlar', badge: stats.pendingReports },
    { href: `/${locale}/admin/sponsorlar`, label: 'Sponsor Bağlantılar', badge: null },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Admin Paneli</h1>
      <Dashboard stats={stats} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href} className="bg-white dark:bg-[#16213e] rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 block">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{link.label}</p>
            {link.badge !== null && <p className="text-2xl font-bold text-[#ff6b35]">{link.badge}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
