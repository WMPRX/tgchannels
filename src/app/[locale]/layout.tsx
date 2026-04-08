export const dynamic = 'force-dynamic';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | TGChannels',
    default: 'TGChannels - Toplulukları Keşfedin',
  },
  description: 'WhatsApp grupları, Telegram grupları ve kanalları, Discord sunucularını keşfedin ve paylaşın.',
  openGraph: {
    siteName: 'TGChannels',
    type: 'website',
  },
};

export function generateStaticParams() {
  return ['tr', 'en', 'az', 'de', 'ru', 'hi', 'ar'].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f5f5f5] dark:bg-[#1a1a2e] text-[#333333] dark:text-[#e0e0e0] font-body antialiased">
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
              <Header locale={locale} />
              <main className="min-h-screen pb-20 md:pb-0">
                {children}
              </main>
              <Footer locale={locale} />
              <BottomNav />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
