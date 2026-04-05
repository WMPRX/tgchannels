'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Platform } from '@prisma/client';

interface GroupFilters {
  platform?: Platform;
  categoryId?: number;
  sort?: 'newest' | 'popular' | 'least_viewed';
}

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

interface GroupsResponse {
  groups: GroupItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export function useGroups(filters: GroupFilters) {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const buildUrl = useCallback(
    (p: number) => {
      const params = new URLSearchParams();
      if (filters.platform) params.set('platform', filters.platform);
      if (filters.categoryId) params.set('category', String(filters.categoryId));
      if (filters.sort) params.set('sort', filters.sort);
      params.set('page', String(p));
      params.set('limit', '20');
      return `/api/groups?${params.toString()}`;
    },
    [filters]
  );

  const fetchGroups = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const res = await fetch(buildUrl(currentPage));
        const data: GroupsResponse = await res.json();

        if (reset) {
          setGroups(data.groups);
        } else {
          setGroups((prev) => [...prev, ...data.groups]);
        }

        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(currentPage + 1);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [buildUrl, isLoading, page]
  );

  useEffect(() => {
    setPage(1);
    setGroups([]);
    setHasMore(true);
    fetchGroups(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { groups, hasMore, isLoading, total, loadMore: fetchGroups };
}
