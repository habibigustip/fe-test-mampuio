import { useFetch, fetchJson } from '@/app/_hooks/use-fetch';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const TODOS_QUERY_KEY = queryKeys.todos;
const TODOS_URL = apiUrl('/todos');

export const todosQueryOptions = queryOptions({
  queryKey: TODOS_QUERY_KEY,
  queryFn: () => fetchJson<Todo[]>(TODOS_URL, { next: { revalidate: 60 } }),
  staleTime: DEFAULT_STALE_TIME,
});

export function prefetchTodos(queryClient: QueryClient) {
  return queryClient.prefetchQuery(todosQueryOptions);
}

export function useTodos() {
  return useFetch<Todo[]>(TODOS_QUERY_KEY, TODOS_URL, {
    staleTime: DEFAULT_STALE_TIME,
  });
}
