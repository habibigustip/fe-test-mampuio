import { screen, waitFor } from '@testing-library/react';
import { SummaryCards } from '@/app/users/summary-cards';
import {
  createTestQueryClient,
  jsonResponse,
  renderWithClient,
  seedAllFixtures,
} from '../test-utils';
import { postsFixture, todosFixture } from '../fixtures';

describe('SummaryCards', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('renders skeletons while loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithClient(<SummaryCards />);

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.queryByText(String(postsFixture.length))).not.toBeInTheDocument();
  });

  it('shows counts when queries succeed', () => {
    const client = createTestQueryClient();
    seedAllFixtures(client);

    renderWithClient(<SummaryCards />, { client });

    expect(screen.getByText(String(postsFixture.length))).toBeInTheDocument();
    expect(screen.getByText(String(todosFixture.length))).toBeInTheDocument();
  });

  it('shows an error message when a query fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse(todosFixture));

    renderWithClient(<SummaryCards />);

    await waitFor(() => {
      expect(screen.getByText(/Request failed: 500/)).toBeInTheDocument();
    });
    expect(screen.getByText(String(todosFixture.length))).toBeInTheDocument();
  });
});
