import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TGChannels - Toplulukları Keşfedin',
  description: 'WhatsApp grupları, Telegram grupları ve kanalları, Discord sunucularını keşfedin ve paylaşın.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
