import { screen } from '@testing-library/react';
import UserPage from '@/app/users/page';
import { apiUrl } from '@/app/_lib/api';
import { usersFixture, postsFixture, todosFixture } from '../fixtures';
import { jsonResponse, renderWithClient } from '../test-utils';

jest.mock('../../app/users/users-table', () => ({
  UsersTable: () => <div data-testid="users-table" />,
}));
jest.mock('../../app/users/summary-cards', () => ({
  SummaryCards: () => <div data-testid="summary-cards" />,
}));

describe('UserPage (server component)', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url: RequestInfo | URL) => {
      const u = String(url);
      if (u === apiUrl('/users')) return Promise.resolve(jsonResponse(usersFixture));
      if (u === apiUrl('/posts')) return Promise.resolve(jsonResponse(postsFixture));
      if (u === apiUrl('/todos')) return Promise.resolve(jsonResponse(todosFixture));
      return Promise.reject(new Error(`Unmocked URL: ${u}`));
    }) as unknown as typeof fetch;
  });

  it('renders the heading and both child sections', async () => {
    const ui = await UserPage();
    renderWithClient(ui);

    expect(
      screen.getByRole('heading', { level: 1, name: /users list/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('summary-cards')).toBeInTheDocument();
    expect(screen.getByTestId('users-table')).toBeInTheDocument();
  });

  it('prefetches users, posts, and todos before rendering', async () => {
    await UserPage();

    const calledUrls = (global.fetch as jest.Mock).mock.calls.map((args) =>
      String(args[0]),
    );
    expect(calledUrls).toEqual(
      expect.arrayContaining([apiUrl('/users'), apiUrl('/posts'), apiUrl('/todos')]),
    );
    expect(calledUrls).toHaveLength(3);
  });
});
