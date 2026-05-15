import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { prefetchUsers } from '../_hooks/use-users';
import { UsersTable } from './users-table';

export default async function UserPage() {
  const queryClient = new QueryClient();
  await prefetchUsers(queryClient);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users List</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersTable />
      </HydrationBoundary>
    </main>
  );
}
