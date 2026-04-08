'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'popular' | 'least_viewed';

interface SortTabsProps {
  activeSort: SortOption;
}

const tabs: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'En Yeniler' },
  { value: 'popular', label: 'Popüler' },
  { value: 'least_viewed', label: 'Az Görüntülenen' },
];

export default function SortTabs({ activeSort }: SortTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleSort(tab.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeSort === tab.value
              ? 'bg-white dark:bg-[#16213e] text-[#ff6b35] shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
