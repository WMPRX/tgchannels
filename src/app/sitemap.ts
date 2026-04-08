import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tgchannels.com';
const locales = ['tr', 'en', 'az', 'de', 'ru', 'hi', 'ar'];

const platformSlugs = ['whatsapp-gruplari', 'whatsapp-kanallari', 'telegram-gruplari', 'telegram-kanallari', 'discord-sunuculari'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    staticPages.push({ url: `${BASE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 });
    for (const slug of platformSlugs) {
      staticPages.push({ url: `${BASE_URL}/${locale}/${slug}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 });
    }
  }

  let groupPages: MetadataRoute.Sitemap = [];
  try {
    const groups = await prisma.group.findMany({
      where: { status: 'approved' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });
    groupPages = groups.map((g) => ({
      url: `${BASE_URL}/group/${g.id}`,
      lastModified: g.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticPages, ...groupPages];
}
