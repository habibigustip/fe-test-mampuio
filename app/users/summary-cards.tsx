'use client';

import { Card } from '@/app/_components/card';
import { usePosts } from '@/app/_hooks/use-posts';
import { useTodos } from '@/app/_hooks/use-todos';
import type { UseQueryResult } from '@tanstack/react-query';

function CountBody({ query }: { query: UseQueryResult<unknown[]> }) {
  const { data, isLoading, isError, error } = query;

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        Loading
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        {error instanceof Error ? error.message : 'Failed to load'}
      </p>
    );
  }

  return (
    <p className="text-3xl font-semibold text-gray-900">{data?.length ?? 0}</p>
  );
}

export function SummaryCards() {
  const posts = usePosts();
  const todos = useTodos();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card title="Posts">
        <CountBody query={posts} />
      </Card>
      <Card title="Todos">
        <CountBody query={todos} />
      </Card>
    </div>
  );
}
