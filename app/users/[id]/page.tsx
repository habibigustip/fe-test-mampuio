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
import { UserCard } from './user-card';

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
  await prefetchUser(queryClient, id);

  return (
    <main className="container mx-auto p-6">
      <Link
        href="/users"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
      >
        ← Back to users
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserCard id={id} />
      </HydrationBoundary>
    </main>
  );
}
