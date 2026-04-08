import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getSponsors() {
  try {
    return await prisma.sponsorLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    return [];
  }
}

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const sponsors = await getSponsors();

  return (
    <footer className="bg-white dark:bg-[#16213e] border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sponsored Links */}
        {sponsors.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sponsorlu Bağlantılar</p>
            <div className="flex flex-wrap gap-3">
              {sponsors.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-sm text-[#ff6b35] hover:underline"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-[#ff6b35] text-xl mb-3">TGChannels</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toplulukları keşfedin ve paylaşın.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Platformlar</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${locale}/whatsapp-gruplari`} className="hover:text-green-500 transition-colors">WhatsApp Grupları</Link></li>
              <li><Link href={`/${locale}/whatsapp-kanallari`} className="hover:text-green-500 transition-colors">WhatsApp Kanalları</Link></li>
              <li><Link href={`/${locale}/telegram-gruplari`} className="hover:text-blue-500 transition-colors">Telegram Grupları</Link></li>
              <li><Link href={`/${locale}/telegram-kanallari`} className="hover:text-blue-500 transition-colors">Telegram Kanalları</Link></li>
              <li><Link href={`/${locale}/discord-sunuculari`} className="hover:text-indigo-500 transition-colors">Discord Sunucuları</Link></li>
            </ul>
          </div>

          {/* Quicklinks */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${locale}/ekle`} className="hover:text-[#ff6b35] transition-colors">Grup Ekle</Link></li>
              <li><Link href={`/${locale}/listeler`} className="hover:text-[#ff6b35] transition-colors">En Popüler Listeler</Link></li>
              <li><Link href={`/${locale}/reklam`} className="hover:text-[#ff6b35] transition-colors">Reklam Ver</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-[#ff6b35] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Yasal</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href={`/${locale}/hakkimizda`} className="hover:text-[#ff6b35] transition-colors">Hakkımızda</Link></li>
              <li><Link href={`/${locale}/iletisim`} className="hover:text-[#ff6b35] transition-colors">İletişim</Link></li>
              <li><Link href={`/${locale}/sss`} className="hover:text-[#ff6b35] transition-colors">SSS</Link></li>
              <li><Link href={`/${locale}/gizlilik-politikasi`} className="hover:text-[#ff6b35] transition-colors">Gizlilik</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-400">
          © 2024 TGChannels. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
