import type { Metadata } from 'next';
import Link from 'next/link';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchJson } from '@/app/_hooks/use-fetch';
import { apiUrl } from '@/app/_lib/api';
import { prefetchUser, type UserDetail } from '../../_hooks/use-user';
import { prefetchUserPosts } from '@/app/_hooks/use-user-posts';
import { prefetchUserTodos } from '@/app/_hooks/use-user-todos';
import { UserCard } from './user-card';
import { PostsSection } from './posts-section';
import { TodosSection } from './todos-section';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const user = await fetchJson<UserDetail>(apiUrl(`/users/${id}`));
    return {
      title: `${user.name} (@${user.username})`,
      description: `Profile for ${user.name} — ${user.company.name}. Contact: ${user.email}`,
      openGraph: {
        title: `${user.name} (@${user.username})`,
        description: user.company.catchPhrase,
      },
    };
  } catch {
    return {
      title: `User ${id}`,
      description: 'User profile',
    };
  }
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await Promise.all([
    prefetchUser(queryClient, id),
    prefetchUserPosts(queryClient, id),
    prefetchUserTodos(queryClient, id),
  ]);

  return (
    <main className="container mx-auto p-6">
      <Link
        href="/users"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
      >
        ← Back to users
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-6">
          <UserCard id={id} />
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 [&>*]:min-w-0">
            <PostsSection id={id} />
            <TodosSection id={id} />
          </div>
        </div>
      </HydrationBoundary>
    </main>
  );
}
