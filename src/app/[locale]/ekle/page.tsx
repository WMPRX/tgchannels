export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddGroupForm from '@/components/forms/AddGroupForm';

export const metadata: Metadata = {
  title: 'Grup Ekle - TGChannels',
  description: 'WhatsApp, Telegram veya Discord grubunuzu TGChannels\'a ekleyin.',
};

export default async function AddPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session) redirect(`/${locale}/giris`);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grup / Kanal Ekle</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Topluluğunuzu binlerce kullanıcıyla paylaşın. Admin onayından sonra yayınlanacaktır.
        </p>
      </div>
      <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6">
        <AddGroupForm locale={locale} />
      </div>
    </div>
  );
}
