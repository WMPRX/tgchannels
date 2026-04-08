import type { Platform, GroupStatus, ReportReason, ReportStatus, PaymentStatus, UserRole } from '@prisma/client';

export type { Platform, GroupStatus, ReportReason, ReportStatus, PaymentStatus, UserRole };

export interface CategoryWithTranslation {
  id: number;
  slug: string;
  name: string;
}

export interface GroupWithDetails {
  id: number;
  title: string;
  description: string;
  platform: Platform;
  inviteLink: string;
  language: string;
  countryCode: string | null;
  viewCount: number;
  isHighlighted: boolean;
  highlightExpiresAt: Date | null;
  status: GroupStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  category: {
    id: number;
    slug: string;
    translations: Array<{ locale: string; name: string }>;
  };
}

export interface GroupListParams {
  platform?: Platform;
  categoryId?: number;
  sort?: 'newest' | 'popular' | 'least_viewed';
  page?: number;
  limit?: number;
  locale?: string;
}

export interface PaginatedGroups {
  groups: GroupWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SponsorLink {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ReportFormData {
  reason: ReportReason;
  note?: string;
}

export interface AddGroupFormData {
  platform: Platform;
  title: string;
  description: string;
  inviteLink: string;
  categoryId: number;
  language: string;
  countryCode?: string;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
}

export interface AdminStats {
  totalGroups: number;
  pendingGroups: number;
  approvedGroups: number;
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
}

export const PLATFORM_LABELS: Record<Platform, { tr: string; en: string }> = {
  whatsapp_group: { tr: 'WhatsApp Grubu', en: 'WhatsApp Group' },
  whatsapp_channel: { tr: 'WhatsApp Kanalı', en: 'WhatsApp Channel' },
  telegram_group: { tr: 'Telegram Grubu', en: 'Telegram Group' },
  telegram_channel: { tr: 'Telegram Kanalı', en: 'Telegram Channel' },
  discord_server: { tr: 'Discord Sunucusu', en: 'Discord Server' },
};

export const PLATFORM_COLORS: Record<Platform, { primary: string; secondary: string; gradient: string }> = {
  whatsapp_group: { primary: '#25D366', secondary: '#128C7E', gradient: 'linear-gradient(135deg, #25D366, #128C7E)' },
  whatsapp_channel: { primary: '#25D366', secondary: '#128C7E', gradient: 'linear-gradient(135deg, #25D366, #128C7E)' },
  telegram_group: { primary: '#0088cc', secondary: '#229ED9', gradient: 'linear-gradient(135deg, #229ED9, #0088cc)' },
  telegram_channel: { primary: '#0088cc', secondary: '#229ED9', gradient: 'linear-gradient(135deg, #229ED9, #0088cc)' },
  discord_server: { primary: '#5865F2', secondary: '#7289da', gradient: 'linear-gradient(135deg, #5865F2, #7289da)' },
};

export const LOCALES = ['tr', 'en', 'az', 'de', 'ru', 'hi', 'ar'] as const;
export type Locale = typeof LOCALES[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  az: 'Azərbaycan',
  de: 'Deutsch',
  ru: 'Русский',
  hi: 'हिन्दी',
  ar: 'العربية',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  az: '🇦🇿',
  de: '🇩🇪',
  ru: '🇷🇺',
  hi: '🇮🇳',
  ar: '🇸🇦',
};
