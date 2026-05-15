'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/app/_components/data-table';
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
    return (
      <p className="text-sm text-gray-500 flex  justify-center items-center gap-2">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        Loading user
      </p>
    );
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
      pageSize={5}
      searchPlaceholder="Search by name or email..."
      emptyMessage="No users found"
      columns={[
        { key: 'name', header: 'Name', sortable: true, searchable: true },
        {
          key: 'email',
          header: 'Email',
          searchable: true,
        },
        {
          key: 'website',
          header: 'Website',
          cell: (u) => (
            <a
              href={`https://${u.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {u.website}
            </a>
          ),
        },
        {
          key: 'posts',
          header: 'Posts',
          sortable: true,
          cell: (u) => activity.get(u.id)?.posts ?? '—',
          sortValue: (u) => activity.get(u.id)?.posts ?? Infinity,
        },
        {
          key: 'completedTodos',
          header: 'Completed Todos',
          sortable: true,
          cell: (u) => activity.get(u.id)?.completed ?? '—',
          sortValue: (u) => activity.get(u.id)?.completed ?? Infinity,
        },
        {
          key: 'pendingTodos',
          header: 'Pending Todos',
          sortable: true,
          cell: (u) => activity.get(u.id)?.pending ?? '—',
          sortValue: (u) => activity.get(u.id)?.pending ?? Infinity,
        },
      ]}
      onRowClicked={handleNavigateUserDetail}
    />
  );
}
