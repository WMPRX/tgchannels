'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { validateInviteLink } from '@/lib/utils';
import type { Platform } from '@prisma/client';

interface Category {
  id: number;
  slug: string;
  name: string;
}

const platforms = [
  { value: 'whatsapp_group', label: 'WhatsApp Grubu', color: '#25D366' },
  { value: 'whatsapp_channel', label: 'WhatsApp Kanalı', color: '#128C7E' },
  { value: 'telegram_group', label: 'Telegram Grubu', color: '#0088cc' },
  { value: 'telegram_channel', label: 'Telegram Kanalı', color: '#229ED9' },
  { value: 'discord_server', label: 'Discord Sunucusu', color: '#5865F2' },
];

const linkPlaceholders: Record<string, string> = {
  whatsapp_group: 'https://chat.whatsapp.com/...',
  whatsapp_channel: 'https://chat.whatsapp.com/...',
  telegram_group: 'https://t.me/...',
  telegram_channel: 'https://t.me/...',
  discord_server: 'https://discord.gg/...',
};

export default function AddGroupForm({ locale = 'tr' }: { locale?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    platform: 'whatsapp_group' as Platform,
    title: '',
    inviteLink: '',
    categoryId: '',
    description: '',
    language: 'tr',
  });

  useEffect(() => {
    fetch(`/api/categories?locale=${locale}`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [locale]);

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Grup adı zorunludur';
    if (!form.inviteLink.trim()) e.inviteLink = 'Davet linki zorunludur';
    else if (!validateInviteLink(form.inviteLink, form.platform)) e.inviteLink = 'Geçersiz davet linki formatı';
    if (!form.categoryId) e.categoryId = 'Kategori seçimi zorunludur';
    if (!form.description.trim()) e.description = 'Açıklama zorunludur';
    else if (form.description.length < 50) e.description = 'Açıklama en az 50 karakter olmalıdır';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categoryId: Number(form.categoryId) }),
      });
      if (res.status === 401) { router.push(`/${locale}/giris`); return; }
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setErrors({ form: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Grubunuz Gönderildi!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Admin onayından sonra yayınlanacaktır.</p>
        <Button onClick={() => { setSuccess(false); setForm({ platform: 'whatsapp_group', title: '', inviteLink: '', categoryId: '', description: '', language: 'tr' }); }}>
          Başka Grup Ekle
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Platform */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {platforms.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => set('platform', p.value)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.platform === p.value ? 'border-[#ff6b35] bg-[#ff6b35]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
            >
              <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grup / Kanal Adı</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Grup adını girin"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Invite Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Davet Linki</label>
        <input
          value={form.inviteLink}
          onChange={(e) => set('inviteLink', e.target.value)}
          placeholder={linkPlaceholders[form.platform]}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        />
        {errors.inviteLink && <p className="text-xs text-red-500 mt-1">{errors.inviteLink}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
        <select
          value={form.categoryId}
          onChange={(e) => set('categoryId', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        >
          <option value="">Kategori seçin</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Açıklama <span className="text-gray-400">({form.description.length}/500)</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Grubunuzu tanıtın (en az 50 karakter)"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dil</label>
        <select
          value={form.language}
          onChange={(e) => set('language', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
        >
          <option value="tr">🇹🇷 Türkçe</option>
          <option value="en">🇬🇧 English</option>
          <option value="az">🇦🇿 Azərbaycan</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="ar">🇸🇦 العربية</option>
        </select>
      </div>

      {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Gönder
      </Button>
    </form>
  );
}
