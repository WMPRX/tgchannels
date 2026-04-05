'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, MessageCircle, Send, Hash, Plus, Star, Info, Mail, HelpCircle, Shield, Megaphone } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function Sidebar({ isOpen, onClose, locale }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const navLinks = [
    { href: `/${locale}`, icon: Home, label: 'Ana Sayfa' },
    { href: `/${locale}/whatsapp-gruplari`, icon: MessageCircle, label: 'WhatsApp Grupları', color: 'text-green-500' },
    { href: `/${locale}/whatsapp-kanallari`, icon: MessageCircle, label: 'WhatsApp Kanalları', color: 'text-green-500' },
    { href: `/${locale}/telegram-gruplari`, icon: Send, label: 'Telegram Grupları', color: 'text-blue-500' },
    { href: `/${locale}/telegram-kanallari`, icon: Send, label: 'Telegram Kanalları', color: 'text-blue-500' },
    { href: `/${locale}/discord-sunuculari`, icon: Hash, label: 'Discord Sunucuları', color: 'text-indigo-500' },
    { href: `/${locale}/ekle`, icon: Plus, label: 'Grup/Kanal Ekle', color: 'text-[#ff6b35]' },
  ];

  const staticLinks = [
    { href: `/${locale}/hakkimizda`, icon: Info, label: 'Hakkımızda' },
    { href: `/${locale}/iletisim`, icon: Mail, label: 'İletişim' },
    { href: `/${locale}/sss`, icon: HelpCircle, label: 'SSS' },
    { href: `/${locale}/gizlilik-politikasi`, icon: Shield, label: 'Gizlilik' },
    { href: `/${locale}/reklam`, icon: Megaphone, label: 'Reklam' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#16213e] z-50 shadow-2xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-[#ff6b35]">TGChannels</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-73px)] pb-8">
          <nav className="p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1',
                  pathname === link.href
                    ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                )}
              >
                <link.icon size={18} className={link.color} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 pb-3">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">En Popüler</p>
            {[
              { href: `/${locale}/listeler`, icon: Star, label: 'Tüm Popüler Listeler' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors mb-1">
                <link.icon size={18} className="text-[#ff6b35]" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="px-3">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Diğer</p>
            {staticLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors mb-1">
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
