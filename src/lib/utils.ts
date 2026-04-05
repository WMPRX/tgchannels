import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS, az, de, ru, hi, ar, type Locale } from 'date-fns/locale';
import type { Platform } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskUsername(username: string): string {
  if (!username || username.length < 2) return '***';
  return username.slice(0, 2) + '***';
}

const dateLocaleMap: Record<string, Locale> = {
  tr,
  en: enUS,
  az,
  de,
  ru,
  hi,
  ar,
};

export function timeAgo(date: Date | string, locale = 'tr'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: dateLocaleMap[locale] || tr,
  });
}

export function validateInviteLink(link: string, platform: Platform): boolean {
  try {
    const url = new URL(link);
    switch (platform) {
      case 'whatsapp_group':
      case 'whatsapp_channel':
        return url.href.startsWith('https://chat.whatsapp.com/');
      case 'telegram_group':
      case 'telegram_channel':
        return url.href.startsWith('https://t.me/');
      case 'discord_server':
        return url.href.startsWith('https://discord.gg/');
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'whatsapp_group':
    case 'whatsapp_channel':
      return '#25D366';
    case 'telegram_group':
    case 'telegram_channel':
      return '#0088cc';
    case 'discord_server':
      return '#5865F2';
    default:
      return '#666666';
  }
}

export function getPlatformGradient(platform: Platform): string {
  switch (platform) {
    case 'whatsapp_group':
    case 'whatsapp_channel':
      return 'linear-gradient(135deg, #25D366, #128C7E)';
    case 'telegram_group':
    case 'telegram_channel':
      return 'linear-gradient(135deg, #229ED9, #0088cc)';
    case 'discord_server':
      return 'linear-gradient(135deg, #5865F2, #7289da)';
    default:
      return 'linear-gradient(135deg, #666, #444)';
  }
}

export function getPlatformSlug(platform: Platform, locale = 'tr'): string {
  const slugs: Record<string, Record<Platform, string>> = {
    tr: {
      whatsapp_group: 'whatsapp-gruplari',
      whatsapp_channel: 'whatsapp-kanallari',
      telegram_group: 'telegram-gruplari',
      telegram_channel: 'telegram-kanallari',
      discord_server: 'discord-sunuculari',
    },
    en: {
      whatsapp_group: 'whatsapp-groups',
      whatsapp_channel: 'whatsapp-channels',
      telegram_group: 'telegram-groups',
      telegram_channel: 'telegram-channels',
      discord_server: 'discord-servers',
    },
  };
  return (slugs[locale] || slugs['tr'])[platform];
}

export function getPlatformFromSlug(slug: string): Platform | null {
  const map: Record<string, Platform> = {
    'whatsapp-gruplari': 'whatsapp_group',
    'whatsapp-kanallari': 'whatsapp_channel',
    'telegram-gruplari': 'telegram_group',
    'telegram-kanallari': 'telegram_channel',
    'discord-sunuculari': 'discord_server',
    'whatsapp-groups': 'whatsapp_group',
    'whatsapp-channels': 'whatsapp_channel',
    'telegram-groups': 'telegram_group',
    'telegram-channels': 'telegram_channel',
    'discord-servers': 'discord_server',
  };
  return map[slug] ?? null;
}

export function getPlatformLabel(platform: Platform, locale = 'tr'): string {
  const labels: Record<string, Record<Platform, string>> = {
    tr: {
      whatsapp_group: 'WhatsApp Grubu',
      whatsapp_channel: 'WhatsApp Kanalı',
      telegram_group: 'Telegram Grubu',
      telegram_channel: 'Telegram Kanalı',
      discord_server: 'Discord Sunucusu',
    },
    en: {
      whatsapp_group: 'WhatsApp Group',
      whatsapp_channel: 'WhatsApp Channel',
      telegram_group: 'Telegram Group',
      telegram_channel: 'Telegram Channel',
      discord_server: 'Discord Server',
    },
  };
  return (labels[locale] || labels['tr'])[platform];
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function getLanguageFlag(lang: string): string {
  const flags: Record<string, string> = {
    tr: '🇹🇷',
    en: '🇬🇧',
    az: '🇦🇿',
    de: '🇩🇪',
    ru: '🇷🇺',
    hi: '🇮🇳',
    ar: '🇸🇦',
  };
  return flags[lang] || '🌐';
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}
