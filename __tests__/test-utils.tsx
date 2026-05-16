import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryKeys } from '@/app/_lib/api';
import { usersFixture, postsFixture, todosFixture } from './fixtures';

export function jsonResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
  } as unknown as Response;
}

export function createQueryWrapper(): (props: { children: ReactNode }) => ReactElement {
  const client = createTestQueryClient();
  function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return QueryWrapper;
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
    },
  });
}

export function seedAllFixtures(client: QueryClient): void {
  client.setQueryData(queryKeys.users, usersFixture);
  client.setQueryData(queryKeys.posts, postsFixture);
  client.setQueryData(queryKeys.todos, todosFixture);
}

export type RenderWithClientResult = RenderResult & { client: QueryClient };

export function renderWithClient(
  ui: ReactElement,
  options: { client?: QueryClient } & Omit<RenderOptions, 'wrapper'> = {},
): RenderWithClientResult {
  const client = options.client ?? createTestQueryClient();
  function ClientWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  const result = render(ui, { ...options, wrapper: ClientWrapper });
  return { ...result, client };
}
