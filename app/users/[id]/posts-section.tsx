'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useUserPosts } from '@/app/_hooks/use-user-posts';
import { Skeleton } from '@/app/_components/skeleton';

type Props = { id: string };

export function PostsSection({ id }: Props) {
  const { data: posts, isLoading, isError, error } = useUserPosts(id);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (postId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError) {
    return (
      <SectionFallback tone="error">
        Failed to load posts:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </SectionFallback>
    );
  }
  if (!posts || posts.length === 0) {
    return <SectionFallback>No posts yet.</SectionFallback>;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Posts ({posts.length})
      </h3>
      <ul className="divide-y divide-gray-100">
        {posts.map((post) => {
          const isOpen = expanded.has(post.id);
          return (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => toggle(post.id)}
                aria-expanded={isOpen}
                className="w-full py-3 text-left flex items-start gap-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
              >
                {isOpen ? (
                  <ChevronDown aria-hidden="true" className="mt-0.5 h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {post.title}
                  </p>
                  <p
                    className={`text-sm text-gray-600 mt-1 ${
                      isOpen ? '' : 'line-clamp-2'
                    }`}
                  >
                    {post.body}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
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
