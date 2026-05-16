import { screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersTable } from '@/app/users/users-table';
import {
  createTestQueryClient,
  renderWithClient,
  seedAllFixtures,
} from '../test-utils';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function jsonResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
  } as unknown as Response;
}

describe('UsersTable', () => {
  beforeEach(() => {
    push.mockReset();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('shows the loading skeleton while users are loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { container } = renderWithClient(<UsersTable />);

    expect(container.querySelector('table')).not.toBeInTheDocument();
  });

  it('shows an error message when users fail to load', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    renderWithClient(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load users/)).toBeInTheDocument();
    });
  });

  it('renders one row per user with derived activity counts', () => {
    const client = createTestQueryClient();
    seedAllFixtures(client);

    renderWithClient(<UsersTable />, { client });

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Alan Turing')).toBeInTheDocument();

    const ada = screen.getByText('Ada Lovelace').closest('tr')!;
    expect(ada).toHaveTextContent('ada@example.com');
    expect(ada).toHaveTextContent('ada.dev');
    expect(ada.querySelectorAll('td')[3]).toHaveTextContent('2');
    expect(ada.querySelectorAll('td')[4]).toHaveTextContent('1');
    expect(ada.querySelectorAll('td')[5]).toHaveTextContent('1');

    const alan = screen.getByText('Alan Turing').closest('tr')!;
    expect(alan.querySelectorAll('td')[3]).toHaveTextContent('1');
    expect(alan.querySelectorAll('td')[4]).toHaveTextContent('2');
    expect(alan.querySelectorAll('td')[5]).toHaveTextContent('0');
  });

  it('renders email and website cells as links with correct hrefs', () => {
    const client = createTestQueryClient();
    seedAllFixtures(client);

    renderWithClient(<UsersTable />, { client });

    const emailLink = screen.getByRole('link', { name: 'ada@example.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:ada@example.com');

    const websiteLink = screen.getByRole('link', { name: 'ada.dev' });
    expect(websiteLink).toHaveAttribute('href', 'https://ada.dev');
    expect(websiteLink).toHaveAttribute('target', '_blank');
  });

  it('navigates to the user detail page when a row is clicked', () => {
    const client = createTestQueryClient();
    seedAllFixtures(client);

    renderWithClient(<UsersTable />, { client });

    const ada = screen.getByText('Ada Lovelace').closest('tr')!;
    fireEvent.click(ada);

    expect(push).toHaveBeenCalledWith('users/1');
  });
});
