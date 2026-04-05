import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Send, Hash, TrendingUp, Plus } from 'lucide-react';
import PlatformCard from '@/components/groups/PlatformCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'TGChannels - Toplulukları Keşfedin',
    description: 'WhatsApp grupları, Telegram grupları ve kanalları, Discord sunucularını keşfedin. 10.000+ topluluk TGChannels\'da.',
  };
}

async function getPlatformCounts() {
  try {
    const counts = await prisma.group.groupBy({
      by: ['platform'],
      where: { status: 'approved' },
      _count: { id: true },
    });
    return Object.fromEntries(counts.map((c) => [c.platform, c._count.id]));
  } catch {
    return {};
  }
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const counts = await getPlatformCounts();

  const popularLinks = [
    { href: `/${locale}/whatsapp-gruplari`, label: 'En Popüler WhatsApp Grupları', icon: MessageCircle, color: 'text-green-500' },
    { href: `/${locale}/telegram-gruplari`, label: 'En Popüler Telegram Grupları', icon: Send, color: 'text-blue-500' },
    { href: `/${locale}/discord-sunuculari`, label: 'En Popüler Discord Sunucuları', icon: Hash, color: 'text-indigo-500' },
    { href: `/${locale}/telegram-kanallari`, label: 'En Popüler Telegram Kanalları', icon: Send, color: 'text-blue-400' },
    { href: `/${locale}/whatsapp-gruplari?category=8`, label: 'Sohbet/Arkadaşlık Grupları', icon: MessageCircle, color: 'text-green-400' },
    { href: `/${locale}/whatsapp-gruplari?category=5`, label: 'İş İlanı Grupları', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#ff6b35]/10 via-white to-blue-50 dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-[#ff6b35]">TG</span>Channels
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Toplulukları Keşfedin
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            WhatsApp, Telegram ve Discord topluluklarını keşfedin veya kendi grubunuzu paylaşın.
          </p>
          <Link
            href={`/${locale}/ekle`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff6b35] hover:bg-[#e55d2b] text-white rounded-2xl font-semibold text-lg transition-colors shadow-lg"
          >
            <Plus size={20} /> Grubunu Ekle
          </Link>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Platformları Keşfet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PlatformCard platform="whatsapp_group" locale={locale} count={counts['whatsapp_group']} />
          <PlatformCard platform="whatsapp_channel" locale={locale} count={counts['whatsapp_channel']} />
          <PlatformCard platform="telegram_group" locale={locale} count={counts['telegram_group']} />
          <PlatformCard platform="telegram_channel" locale={locale} count={counts['telegram_channel']} />
          <PlatformCard platform="discord_server" locale={locale} count={counts['discord_server']} />
        </div>
      </section>

      {/* Popular Links */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">En Popüler</h2>
        <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-card overflow-hidden">
          {popularLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${i !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
            >
              <div className="flex items-center gap-3">
                <link.icon size={18} className={link.color} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{link.label}</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#ff6b35] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Grubunu, kanalını veya sunucunu sen de ekle
          </h2>
          <p className="text-white/80 mb-6">
            Topluluğunu binlerce kullanıcıya duyur. Ücretsiz ekle, anında görünür ol.
          </p>
          <Link
            href={`/${locale}/ekle`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#ff6b35] rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            <Plus size={20} /> Hemen Ekle
          </Link>
        </div>
      </section>

      {/* SEO Text */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>WhatsApp Grupları Nedir?</h2>
          <p>WhatsApp grupları, ortak ilgi alanları veya amaçlar etrafında bir araya gelen insanların mesajlaşma ve içerik paylaşımı yapabildiği topluluk platformlarıdır. TGChannels üzerinde farklı kategorilerdeki WhatsApp gruplarını keşfedebilir, kendi grubunuzu ekleyebilirsiniz.</p>
          <h2>Telegram Kanalları ve Grupları</h2>
          <p>Telegram, geniş topluluk özellikleriyle öne çıkan mesajlaşma platformudur. Telegram kanalları tek yönlü yayın yaparken, Telegram grupları çift yönlü iletişim imkânı sunar. Her iki türde de topluluklara TGChannels üzerinden ulaşabilirsiniz.</p>
          <h2>Discord Sunucuları</h2>
          <p>Discord, özellikle oyun topluluklarında yaygın olarak kullanılan, ses ve metin kanallarıyla zengin bir deneyim sunan platformdur. Türkçe Discord sunucularını TGChannels üzerinden keşfedebilirsiniz.</p>
        </div>
      </section>
    </div>
  );
}
