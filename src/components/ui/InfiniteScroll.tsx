'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScroll({ onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {isLoading && <Loader2 className="animate-spin text-[#ff6b35]" size={24} />}
      {!hasMore && !isLoading && (
        <p className="text-gray-400 text-sm">Tüm sonuçlar yüklendi</p>
      )}
    </div>
  );
}
