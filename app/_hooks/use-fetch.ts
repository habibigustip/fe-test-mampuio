import { useQuery, type QueryKey } from '@tanstack/react-query';

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type UseFetchOptions = {
  staleTime?: number;
  enabled?: boolean;
  fetch?: RequestInit;
};

export function useFetch<T>(
  queryKey: QueryKey,
  url: string,
  options?: UseFetchOptions,
) {
  return useQuery({
    queryKey,
    queryFn: () => fetchJson<T>(url, options?.fetch),
    staleTime: options?.staleTime,
    enabled: options?.enabled,
  });
}
