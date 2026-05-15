import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { fetchJson, useFetch } from '@/app/_hooks/use-fetch';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';
import type { Post } from '@/app/_hooks/use-posts';

export type { Post };

const userPostsUrl = (id: string | number) => apiUrl(`/posts?userId=${id}`);

export function userPostsQueryOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.userPosts(id),
    queryFn: () =>
      fetchJson<Post[]>(userPostsUrl(id), { next: { revalidate: 60 } }),
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function prefetchUserPosts(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery(userPostsQueryOptions(id));
}

export function useUserPosts(id: string) {
  return useFetch<Post[]>(queryKeys.userPosts(id), userPostsUrl(id), {
    staleTime: DEFAULT_STALE_TIME,
  });
}
