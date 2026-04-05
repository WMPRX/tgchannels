'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Platform } from '@prisma/client';

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteLink: string;
  platform: Platform;
  groupId: number;
}

const platformNames: Record<Platform, string> = {
  whatsapp_group: 'WhatsApp',
  whatsapp_channel: 'WhatsApp',
  telegram_group: 'Telegram',
  telegram_channel: 'Telegram',
  discord_server: 'Discord',
};

const platformVariants: Record<Platform, 'whatsapp' | 'telegram' | 'discord'> = {
  whatsapp_group: 'whatsapp',
  whatsapp_channel: 'whatsapp',
  telegram_group: 'telegram',
  telegram_channel: 'telegram',
  discord_server: 'discord',
};

export default function RedirectModal({ isOpen, onClose, inviteLink, platform, groupId }: RedirectModalProps) {
  const platformName = platformNames[platform];

  const handleConfirm = async () => {
    // Count view
    try {
      await fetch(`/api/groups/${groupId}/view`, { method: 'PATCH' });
    } catch {}
    window.open(inviteLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yönlendirme Onayı">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔗</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>{platformName}</strong> uygulamasına yönlendirileceksiniz.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          TGChannels, yönlendirilen topluluğun içeriğinden sorumlu değildir.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Hayır, İptal
          </Button>
          <Button variant={platformVariants[platform]} className="flex-1" onClick={handleConfirm}>
            Evet, Devam Et
          </Button>
        </div>
      </div>
    </Modal>
  );
}
