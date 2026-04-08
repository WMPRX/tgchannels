export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Giriş Yap - TGChannels',
};

export default async function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (session) redirect(`/${locale}/panel`);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">TGChannels'a Hoş Geldiniz</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Giriş yapın veya yeni hesap oluşturun</p>
        </div>
        <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card p-6">
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
