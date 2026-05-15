'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/app/_components/data-table';
import { Skeleton } from '@/app/_components/skeleton';
import { useUsers, type User } from '../_hooks/use-users';
import { usePosts } from '@/app/_hooks/use-posts';
import { useTodos } from '@/app/_hooks/use-todos';

type Activity = { posts: number; completed: number; pending: number };

export function UsersTable() {
  const router = useRouter();
  const { data: users, isLoading, isError, error } = useUsers();
  const posts = usePosts();
  const todos = useTodos();

  const activity = useMemo(() => {
    const map = new Map<number, Activity>();
    const ensure = (userId: number): Activity => {
      let a = map.get(userId);
      if (!a) {
        a = { posts: 0, completed: 0, pending: 0 };
        map.set(userId, a);
      }
      return a;
    };
    posts.data?.forEach((p) => {
      ensure(p.userId).posts++;
    });
    todos.data?.forEach((t) => {
      const a = ensure(t.userId);
      if (t.completed) a.completed++;
      else a.pending++;
    });
    return map;
  }, [posts.data, todos.data]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    );
  }

  const handleNavigateUserDetail = (row: User) => {
    router.push(`users/${row.id}`);
  };

  return (
    <DataTable<User>
      items={users ?? []}
      getRowId={(u) => u.id}
      searchPlaceholder="Search by name or email..."
      emptyMessage="No users found"
      columns={[
        { key: 'name', header: 'Name', sortable: true, searchable: true },
        {
          key: 'email',
          header: 'Email',
          searchable: true,
          cell: (u) => (
            <a
              href={`mailto:${u.email}`}
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {u.email}
            </a>
          ),
        },
        {
          key: 'website',
          header: 'Website',
          cell: (u) => (
            <a
              href={`https://${u.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {u.website}
            </a>
          ),
        },
        {
          key: 'posts',
          header: 'Posts',
          sortable: (u) => activity.get(u.id)?.posts ?? Infinity,
          cell: (u) => activity.get(u.id)?.posts ?? '—',
        },
        {
          key: 'completedTodos',
          header: 'Completed Todos',
          sortable: (u) => activity.get(u.id)?.completed ?? Infinity,
          cell: (u) => activity.get(u.id)?.completed ?? '—',
        },
        {
          key: 'pendingTodos',
          header: 'Pending Todos',
          sortable: (u) => activity.get(u.id)?.pending ?? Infinity,
          cell: (u) => activity.get(u.id)?.pending ?? '—',
        },
      ]}
      onRowClicked={handleNavigateUserDetail}
    />
  );
}
