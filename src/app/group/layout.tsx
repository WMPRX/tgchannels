import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
  const locale = 'tr';
  let messages = {};
  try {
    messages = (await import(`@/i18n/${locale}.json`)).default;
  } catch {}

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f5f5f5] dark:bg-[#1a1a2e] text-[#333333] dark:text-[#e0e0e0]">
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <Header locale={locale} />
              <main className="min-h-screen pb-20 md:pb-0">{children}</main>
              <Footer locale={locale} />
              <BottomNav />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
