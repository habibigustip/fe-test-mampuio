import { screen } from '@testing-library/react';
import UserDetailPage, { generateMetadata } from '@/app/users/[id]/page';
import { apiUrl } from '@/app/_lib/api';
import {
  jsonResponse,
  renderWithClient,
} from '../../test-utils';
import {
  userDetailFixture,
  userPostsFixture,
  userTodosFixture,
} from '../../fixtures';

jest.mock('../../../app/users/[id]/user-card', () => ({
  UserCard: () => <div data-testid="user-card" />,
}));
jest.mock('../../../app/users/[id]/posts-section', () => ({
  PostsSection: () => <div data-testid="posts-section" />,
}));
jest.mock('../../../app/users/[id]/todos-section', () => ({
  TodosSection: () => <div data-testid="todos-section" />,
}));

function stubFetchSuccess() {
  global.fetch = jest.fn().mockImplementation((url: RequestInfo | URL) => {
    const u = String(url);
    if (u === apiUrl('/users/1')) return Promise.resolve(jsonResponse(userDetailFixture));
    if (u === apiUrl('/posts?userId=1')) return Promise.resolve(jsonResponse(userPostsFixture));
    if (u === apiUrl('/todos?userId=1')) return Promise.resolve(jsonResponse(userTodosFixture));
    return Promise.reject(new Error(`Unmocked URL: ${u}`));
  }) as unknown as typeof fetch;
}

describe('UserDetailPage (server component)', () => {
  beforeEach(() => {
    stubFetchSuccess();
  });

  it('renders the heading, Back link, and three child sections', async () => {
    const ui = await UserDetailPage({ params: Promise.resolve({ id: '1' }) });
    renderWithClient(ui);

    expect(
      screen.getByRole('heading', { level: 1, name: /users detail/i }),
    ).toBeInTheDocument();

    const back = screen.getByRole('link', { name: /back/i });
    expect(back).toHaveAttribute('href', '/users');

    expect(screen.getByTestId('user-card')).toBeInTheDocument();
    expect(screen.getByTestId('posts-section')).toBeInTheDocument();
    expect(screen.getByTestId('todos-section')).toBeInTheDocument();
  });

  it('prefetches user, user-posts, and user-todos for the given id', async () => {
    await UserDetailPage({ params: Promise.resolve({ id: '1' }) });

    const calledUrls = (global.fetch as jest.Mock).mock.calls.map((args) => String(args[0]));
    expect(calledUrls).toEqual(
      expect.arrayContaining([
        apiUrl('/users/1'),
        apiUrl('/posts?userId=1'),
        apiUrl('/todos?userId=1'),
      ]),
    );
    expect(calledUrls).toHaveLength(3);
  });
});

describe('generateMetadata', () => {
  it('returns rich metadata when the user is found', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(userDetailFixture)) as unknown as typeof fetch;

    const meta = await generateMetadata({ params: Promise.resolve({ id: '1' }) });

    expect(meta.title).toBe('Ada Lovelace (@ada)');
    expect(meta.description).toContain('Ada Lovelace');
    expect(meta.description).toContain('Analytical Engines');
    expect(meta.description).toContain('ada@example.com');
    expect(meta.openGraph?.title).toBe('Ada Lovelace (@ada)');
    expect(meta.openGraph?.description).toBe('Computing the future');
  });

  it('falls back to a generic title when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 500)) as unknown as typeof fetch;

    const meta = await generateMetadata({ params: Promise.resolve({ id: '1' }) });

    expect(meta).toEqual({ title: 'User 1', description: 'User profile' });
  });
});
