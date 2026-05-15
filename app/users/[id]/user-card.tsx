'use client';

import { Card } from '@/app/_components/card';
import { Skeleton } from '@/app/_components/skeleton';
import { useUser } from '../../_hooks/use-user';

type Props = { id: string };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
      {children}
    </h3>
  );
}

export function UserCard({ id }: Props) {
  const { data: user, isLoading, isError, error } = useUser(id);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  if (isError) {
    return (
      <p className="text-sm text-red-600 py-12">
        Failed to load user:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    );
  }

  if (!user) {
    return <p className="text-sm text-gray-500 py-12">User not found.</p>;
  }

  return (
    <Card title={user.name} subtitle={`@${user.username}`}>
      <section className="border-t border-gray-100 pt-4 mb-6">
        <SectionHeading>Contact</SectionHeading>
        <dl className="grid grid-cols-[100px_1fr] gap-y-2">
          <Field label="Email">
            <a className="text-blue-600 hover:underline" href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </Field>
          <Field label="Phone">
            <a className="text-blue-600 hover:underline" href={`tel:${user.phone}`}>
              {user.phone}
            </a>
          </Field>
          <Field label="Website">
            <a
              className="text-blue-600 hover:underline"
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website}
            </a>
          </Field>
        </dl>
      </section>

      <section className="border-t border-gray-100 pt-4 mb-6">
        <SectionHeading>Company</SectionHeading>
        <p className="text-sm font-semibold text-gray-900">{user.company.name}</p>
        <p className="text-sm italic text-gray-600 mt-1">
          <i>{user.company.catchPhrase}</i>
        </p>
      </section>

      <section className="border-t border-gray-100 pt-4">
        <SectionHeading>Address</SectionHeading>
        <address className="not-italic text-sm text-gray-900">
          <p>
            {user.address.street}, {user.address.suite}
          </p>
          <p>
            {user.address.city}, {user.address.zipcode}
          </p>
        </address>
      </section>
    </Card>
  );
}
