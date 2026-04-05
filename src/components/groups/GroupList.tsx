'use client';

import { useState, useCallback } from 'react';
import GroupCard from './GroupCard';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import type { Platform } from '@prisma/client';

interface GroupItem {
  id: number;
  title: string;
  description: string;
  platform: Platform;
  inviteLink: string;
  language: string;
  viewCount: number;
  isHighlighted: boolean;
  createdAt: string;
  user: { username: string };
  category: { id: number; slug: string; name: string };
}

interface GroupListProps {
  initialGroups: GroupItem[];
  hasMore: boolean;
  platform?: Platform;
  categoryId?: number;
  sort?: string;
  locale?: string;
}

export default function GroupList({ initialGroups, hasMore: initialHasMore, platform, categoryId, sort = 'newest', locale = 'tr' }: GroupListProps) {
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ sort, page: String(page), limit: '20' });
      if (platform) params.set('platform', platform);
      if (categoryId) params.set('category', String(categoryId));
      const res = await fetch(`/api/groups?${params.toString()}`);
      const data = await res.json();
      setGroups((prev) => [...prev, ...data.groups]);
      setHasMore(data.hasMore);
      setPage((p) => p + 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page, platform, categoryId, sort]);

  if (groups.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium">Henüz grup bulunamadı.</p>
        <p className="text-sm mt-2">İlk grubu sen ekle!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} locale={locale} />
        ))}
      </div>
      <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} isLoading={isLoading} />
    </div>
  );
}
