import { screen, waitFor } from '@testing-library/react';
import { UserCard } from '@/app/users/[id]/user-card';
import { queryKeys } from '@/app/_lib/api';
import {
  createTestQueryClient,
  jsonResponse,
  renderWithClient,
} from '../../test-utils';
import { userDetailFixture } from '../../fixtures';

describe('UserCard', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('shows nothing data-related while loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithClient(<UserCard id="1" />);

    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to load user/)).not.toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    renderWithClient(<UserCard id="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load user/)).toBeInTheDocument();
    });
  });

  it('shows "User not found." when the query resolves with null', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.user('1'), null);

    renderWithClient(<UserCard id="1" />, { client });

    expect(screen.getByText('User not found.')).toBeInTheDocument();
  });

  it('renders all user fields on success', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.user('1'), userDetailFixture);

    renderWithClient(<UserCard id="1" />, { client });

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('@ada')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: 'ada@example.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:ada@example.com');

    const phoneLink = screen.getByRole('link', { name: '555-1234' });
    expect(phoneLink).toHaveAttribute('href', 'tel:555-1234');

    const websiteLink = screen.getByRole('link', { name: 'ada.dev' });
    expect(websiteLink).toHaveAttribute('href', 'https://ada.dev');
    expect(websiteLink).toHaveAttribute('target', '_blank');

    expect(screen.getByText('Analytical Engines')).toBeInTheDocument();
    expect(screen.getByText('Computing the future')).toBeInTheDocument();

    expect(screen.getByText('10 Math Lane, Apt 1')).toBeInTheDocument();
    expect(screen.getByText('London, NW1 1AA')).toBeInTheDocument();
  });
});
