import PlatformListingPage from '@/components/groups/PlatformListingPage';
import type { Metadata } from 'next';

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'telegram_group Grupları - TGChannels',
    description: 'En iyi telegram_group topluluklarını keşfedin. TGChannels\'da binlerce grup sizi bekliyor.',
  };
}

export default function Page({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { sort?: string; category?: string };
}) {
  return (
    <PlatformListingPage
      platform="telegram_group"
      locale={locale}
      sort={searchParams.sort ?? 'newest'}
      categoryId={searchParams.category ? Number(searchParams.category) : undefined}
    />
  );
}
