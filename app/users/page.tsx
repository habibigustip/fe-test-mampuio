import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { prefetchUsers } from '../_hooks/use-users';
import { prefetchPosts } from '../_hooks/use-posts';
import { prefetchTodos } from '../_hooks/use-todos';
import { UsersTable } from './users-table';
import { SummaryCards } from './summary-cards';

export default async function UserPage() {
  const queryClient = new QueryClient();
  await Promise.all([
    prefetchUsers(queryClient),
    prefetchPosts(queryClient),
    prefetchTodos(queryClient),
  ]);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users List</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SummaryCards />
        <UsersTable />
      </HydrationBoundary>
    </main>
  );
}
