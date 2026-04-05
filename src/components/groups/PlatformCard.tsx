import Link from 'next/link';
import { ArrowRight, MessageCircle, Send, Hash } from 'lucide-react';

interface PlatformCardProps {
  platform: 'whatsapp_group' | 'whatsapp_channel' | 'telegram_group' | 'telegram_channel' | 'discord_server';
  locale: string;
  count?: number;
}

const platformConfig = {
  whatsapp_group: {
    name: 'WhatsApp Grupları',
    nameEn: 'WhatsApp Groups',
    gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
    textColor: 'text-white',
    icon: MessageCircle,
    href: { tr: 'whatsapp-gruplari', en: 'whatsapp-groups' },
    description: 'WhatsApp gruplarını keşfet',
  },
  whatsapp_channel: {
    name: 'WhatsApp Kanalları',
    nameEn: 'WhatsApp Channels',
    gradient: 'linear-gradient(135deg, #128C7E, #075E54)',
    textColor: 'text-white',
    icon: MessageCircle,
    href: { tr: 'whatsapp-kanallari', en: 'whatsapp-channels' },
    description: 'WhatsApp kanallarını keşfet',
  },
  telegram_group: {
    name: 'Telegram Grupları',
    nameEn: 'Telegram Groups',
    gradient: 'linear-gradient(135deg, #229ED9, #0088cc)',
    textColor: 'text-white',
    icon: Send,
    href: { tr: 'telegram-gruplari', en: 'telegram-groups' },
    description: 'Telegram gruplarını keşfet',
  },
  telegram_channel: {
    name: 'Telegram Kanalları',
    nameEn: 'Telegram Channels',
    gradient: 'linear-gradient(135deg, #0088cc, #006699)',
    textColor: 'text-white',
    icon: Send,
    href: { tr: 'telegram-kanallari', en: 'telegram-channels' },
    description: 'Telegram kanallarını keşfet',
  },
  discord_server: {
    name: 'Discord Sunucuları',
    nameEn: 'Discord Servers',
    gradient: 'linear-gradient(135deg, #5865F2, #7289da)',
    textColor: 'text-white',
    icon: Hash,
    href: { tr: 'discord-sunuculari', en: 'discord-servers' },
    description: 'Discord sunucularını keşfet',
  },
};

export default function PlatformCard({ platform, locale, count }: PlatformCardProps) {
  const cfg = platformConfig[platform];
  const slug = locale === 'en' ? cfg.href.en : cfg.href.tr;
  const Icon = cfg.icon;

  return (
    <Link
      href={`/${locale}/${slug}`}
      className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
      style={{ background: cfg.gradient }}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg leading-tight mb-1">{cfg.name}</h3>
          <p className="text-white/80 text-sm mb-3">{cfg.description}</p>
          {count !== undefined && (
            <p className="text-white/70 text-xs">{count.toLocaleString('tr-TR')}+ topluluk</p>
          )}
          <div className="flex items-center gap-1 text-white font-medium text-sm mt-3 group-hover:gap-2 transition-all">
            <span>Gruplara Git</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Icon size={72} className="text-white/20" />
        </div>
      </div>
    </Link>
  );
}
