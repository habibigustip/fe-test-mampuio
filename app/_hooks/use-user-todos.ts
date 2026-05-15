import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { fetchJson, useFetch } from '@/app/_hooks/use-fetch';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';
import type { Todo } from '@/app/_hooks/use-todos';

export type { Todo };

const userTodosUrl = (id: string | number) => apiUrl(`/todos?userId=${id}`);

export function userTodosQueryOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.userTodos(id),
    queryFn: () =>
      fetchJson<Todo[]>(userTodosUrl(id), { next: { revalidate: 60 } }),
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function prefetchUserTodos(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery(userTodosQueryOptions(id));
}

export function useUserTodos(id: string) {
  return useFetch<Todo[]>(queryKeys.userTodos(id), userTodosUrl(id), {
    staleTime: DEFAULT_STALE_TIME,
  });
}
