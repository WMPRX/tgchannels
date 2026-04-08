'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

const reasons = [
  { value: 'invalid_link', label: 'Davet linki geçersiz' },
  { value: 'illegal_content', label: 'Yasadışı/uygunsuz/cinsel içerik' },
  { value: 'misleading', label: 'Yanıltıcı/dolandırıcılık' },
  { value: 'other', label: 'Diğer' },
];

export default function ReportModal({ isOpen, onClose, groupId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/groups/${groupId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, note }),
      });
      if (res.status === 429) {
        setError('Çok fazla rapor gönderdiniz. Lütfen daha sonra tekrar deneyin.');
        return;
      }
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError('Rapor gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setNote('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Rapor Et">
      {submitted ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Raporunuz alındı</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">İnceleme sonucunda gerekli işlem yapılacaktır.</p>
          <Button variant="secondary" onClick={handleClose}>Kapat</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {reasons.map((r) => (
              <label key={r.value} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-[#ff6b35] transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-[#ff6b35]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{r.label}</span>
              </label>
            ))}
          </div>

          {reason === 'other' && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ek açıklama (opsiyonel)..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleClose}>İptal</Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!reason}
              loading={loading}
            >
              Rapor Et
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
