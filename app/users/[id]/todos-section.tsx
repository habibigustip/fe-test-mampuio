'use client';

import { useState } from 'react';
import { useUserTodos } from '@/app/_hooks/use-user-todos';
import { Check, Circle } from 'lucide-react';
import { Skeleton } from '@/app/_components/skeleton';

type Props = { id: string };

type Filter = 'all' | 'pending' | 'completed';

const FILTERS = ['all', 'pending', 'completed'] as const satisfies ReadonlyArray<Filter>;

export function TodosSection({ id }: Props) {
  const { data: todos, isLoading, isError, error } = useUserTodos(id);
  const [filter, setFilter] = useState<Filter>('all');

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError) {
    return (
      <SectionFallback tone="error">
        Failed to load todos:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </SectionFallback>
    );
  }
  if (!todos || todos.length === 0) {
    return <SectionFallback>No todos yet.</SectionFallback>;
  }

  const done = todos.filter((t) => t.completed).length;
  const pending = todos.length - done;
  const total = todos.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const filtered = todos.filter(
    (t) =>
      filter === 'all' ||
      (filter === 'completed' && t.completed) ||
      (filter === 'pending' && !t.completed),
  );

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Todos ({done} done / {pending} pending)
      </h3>

      <div className="flex gap-2 mb-3" role="group" aria-label="Filter todos">
        {FILTERS.map((value) => {
          const isActive = filter === value;
          const label = value[0].toUpperCase() + value.slice(1);
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={isActive}
              className={`px-3 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex-1 h-1 bg-gray-100 rounded"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completed todos progress"
        >
          <div
            className="h-1 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 tabular-nums">
          {done} / {total} ({percent}%)
        </p>
      </div>

      <ul className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <li className="py-3 text-sm text-gray-500">No {filter} todos.</li>
        ) : (
          filtered.map((todo) => (
            <li key={todo.id} className="py-2 flex items-start gap-3">
              {todo.completed ? (
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 text-green-600" />
              ) : (
                <Circle aria-hidden="true" className="mt-0.5 h-4 w-4 text-gray-400" />
              )}
              <p
                className={`text-sm ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                <span className="sr-only">
                  {todo.completed ? 'Completed: ' : 'Pending: '}
                </span>
                {todo.title}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function SectionFallback({
  children,
  tone = 'muted',
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'error';
}) {
  const toneClass = tone === 'error' ? 'text-red-600' : 'text-gray-500';
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className={`text-sm ${toneClass}`}>{children}</p>
    </section>
  );
}
