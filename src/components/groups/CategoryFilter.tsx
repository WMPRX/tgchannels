'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId?: number;
}

export default function CategoryFilter({ categories, activeCategoryId }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategory = (id?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('category', String(id));
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => handleCategory()}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
          !activeCategoryId
            ? 'bg-[#ff6b35] text-white'
            : 'bg-white dark:bg-[#16213e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#ff6b35] hover:text-[#ff6b35]'
        )}
      >
        Tüm Kategoriler
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategory(cat.id)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
            activeCategoryId === cat.id
              ? 'bg-[#ff6b35] text-white'
              : 'bg-white dark:bg-[#16213e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#ff6b35] hover:text-[#ff6b35]'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
