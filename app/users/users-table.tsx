'use client';

import { DataTable } from '@/app/_components/data-table';
import { useUsers, type User } from '../_hooks/use-users';
import { useRouter } from 'next/navigation';


export function UsersTable() {
  const router = useRouter()
  const { data: users, isLoading, isError, error } = useUsers();
  console.log("users:", users)

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
    console.log('lalalalala')
    router.push(`users/${row.id}`)
  }

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
      ]}
      onRowClicked={handleNavigateUserDetail}
    />
  );
}
