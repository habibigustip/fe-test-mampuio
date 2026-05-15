import { useFetch } from '@/app/_hooks/use-fetch';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/app/_hooks/use-fetch';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';

export type User = {
  id: number;
  name: string;
  email: string;
  website: string;
};

const USERS_QUERY_KEY = queryKeys.users;
const USERS_URL = apiUrl('/users');

export const usersQueryOptions = queryOptions({
  queryKey: USERS_QUERY_KEY,
  queryFn: () => fetchJson<User[]>(USERS_URL, { next: { revalidate: 60 } }),
  staleTime: DEFAULT_STALE_TIME,
});

export function prefetchUsers(queryClient: QueryClient) {
  return queryClient.prefetchQuery(usersQueryOptions);
}

export function useUsers() {
  return useFetch<User[]>(USERS_QUERY_KEY, USERS_URL, {
    staleTime: DEFAULT_STALE_TIME,
  });
}
