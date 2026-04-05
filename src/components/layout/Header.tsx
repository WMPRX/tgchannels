'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Plus, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import Sidebar from './Sidebar';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#16213e]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl">
            <span className="text-[#ff6b35]">TG</span>
            <span className="text-gray-800 dark:text-gray-100">Channels</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href={`/${locale}/whatsapp-gruplari`} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              WhatsApp
            </Link>
            <Link href={`/${locale}/telegram-gruplari`} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Telegram
            </Link>
            <Link href={`/${locale}/discord-sunuculari`} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              Discord
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/ekle`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#ff6b35] hover:bg-[#e55d2b] text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              <span>Ekle</span>
            </Link>

            <ThemeToggle className="hidden sm:flex" />
            <LanguageSwitcher currentLocale={locale} />

            {session ? (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/panel`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <User size={20} className="text-gray-600 dark:text-gray-300" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/giris`}
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Giriş
              </Link>
            )}

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} locale={locale} />
    </>
  );
}
