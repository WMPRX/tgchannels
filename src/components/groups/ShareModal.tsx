'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Copy, CheckCheck, MessageCircle, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  title: string;
}

export default function ShareModal({ isOpen, onClose, groupId, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/group/${groupId}` : `/group/${groupId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`, '_blank');
  };

  const telegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paylaş">
      <div className="space-y-3">
        {/* Copy Link */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 truncate outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#e55d2b] transition-colors"
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
        </div>

        <Button variant="whatsapp" className="w-full gap-2" onClick={whatsappShare}>
          <MessageCircle size={18} />
          WhatsApp ile Paylaş
        </Button>

        <Button variant="telegram" className="w-full gap-2" onClick={telegramShare}>
          <Send size={18} />
          Telegram ile Paylaş
        </Button>
      </div>
    </Modal>
  );
}
