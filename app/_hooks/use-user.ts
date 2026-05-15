import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { fetchJson, useFetch } from '@/app/_hooks/use-fetch';
import { apiUrl, DEFAULT_STALE_TIME, queryKeys } from '@/app/_lib/api';

export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: { lat: string; lng: string };
};

export type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type UserDetail = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
};

const userUrl = (id: string | number) => apiUrl(`/users/${id}`);

export function userQueryOptions(id: string | number) {
  return queryOptions({
    queryKey: queryKeys.user(id),
    queryFn: () =>
      fetchJson<UserDetail>(userUrl(id), { next: { revalidate: 60 } }),
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function prefetchUser(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery(userQueryOptions(id));
}

export function useUser(id: string) {
  return useFetch<UserDetail>(queryKeys.user(id), userUrl(id), {
    staleTime: DEFAULT_STALE_TIME,
  });
}
