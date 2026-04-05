import { cn } from '@/lib/utils';
import type { Platform } from '@prisma/client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'platform' | 'status' | 'highlighted';
  platform?: Platform;
  className?: string;
}

const platformColors: Record<Platform, string> = {
  whatsapp_group: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  whatsapp_channel: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  telegram_group: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  telegram_channel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  discord_server: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export default function Badge({ children, variant = 'default', platform, className }: BadgeProps) {
  const base = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium';

  if (variant === 'platform' && platform) {
    return (
      <span className={cn(base, platformColors[platform], className)}>
        {children}
      </span>
    );
  }

  if (variant === 'highlighted') {
    return (
      <span className={cn(base, 'bg-[#ff6b35]/10 text-[#ff6b35]', className)}>
        {children}
      </span>
    );
  }

  return (
    <span className={cn(base, 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300', className)}>
      {children}
    </span>
  );
}
