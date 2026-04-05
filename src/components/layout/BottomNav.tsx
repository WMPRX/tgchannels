'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, Hash, Plus, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/tr', icon: Home, label: 'Ana Sayfa' },
  { href: '/tr/whatsapp-gruplari', icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
  { href: '/tr/telegram-gruplari', icon: Send, label: 'Telegram', color: 'text-blue-500' },
  { href: '/tr/discord-sunuculari', icon: Hash, label: 'Discord', color: 'text-indigo-500' },
  { href: '/tr/ekle', icon: Plus, label: 'Ekle', color: 'text-[#ff6b35]', special: true },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#16213e] border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors',
                tab.special
                  ? 'bg-[#ff6b35] text-white mx-1'
                  : isActive
                  ? 'text-[#ff6b35]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              <tab.icon size={20} className={!tab.special && !isActive ? (tab.color ?? '') : ''} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
