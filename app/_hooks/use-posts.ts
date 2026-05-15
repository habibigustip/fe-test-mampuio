import { useFetch, fetchJson } from '@/app/_hooks/use-fetch';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

const POSTS_QUERY_KEY = queryKeys.posts;
const POSTS_URL = apiUrl('/posts');

export const postsQueryOptions = queryOptions({
  queryKey: POSTS_QUERY_KEY,
  queryFn: () => fetchJson<Post[]>(POSTS_URL, { next: { revalidate: 60 } }),
  staleTime: DEFAULT_STALE_TIME,
});

export function prefetchPosts(queryClient: QueryClient) {
  return queryClient.prefetchQuery(postsQueryOptions);
}

export function usePosts() {
  return useFetch<Post[]>(POSTS_QUERY_KEY, POSTS_URL, {
    staleTime: DEFAULT_STALE_TIME,
  });
}
