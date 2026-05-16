import { screen, fireEvent, waitFor } from '@testing-library/react';
import { TodosSection } from '@/app/users/[id]/todos-section';
import { queryKeys } from '@/app/_lib/api';
import {
  createTestQueryClient,
  jsonResponse,
  renderWithClient,
} from '../../test-utils';
import { userTodosFixture } from '../../fixtures';

describe('TodosSection', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('shows nothing data-related while loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithClient(<TodosSection id="1" />);

    expect(screen.queryByText(/^Todos \(/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to load todos/)).not.toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    renderWithClient(<TodosSection id="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load todos/)).toBeInTheDocument();
    });
  });

  it('shows "No todos yet." when the list is empty', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userTodos('1'), []);

    renderWithClient(<TodosSection id="1" />, { client });

    expect(screen.getByText('No todos yet.')).toBeInTheDocument();
  });

  it('renders the summary, progress bar, and all todos on success', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userTodos('1'), userTodosFixture);

    renderWithClient(<TodosSection id="1" />, { client });

    const done = userTodosFixture.filter((t) => t.completed).length;
    const pending = userTodosFixture.length - done;
    const percent = Math.round((done / userTodosFixture.length) * 100);

    expect(
      screen.getByRole('heading', { name: `Todos (${done} done / ${pending} pending)` }),
    ).toBeInTheDocument();

    const progressbar = screen.getByRole('progressbar', { name: /completed todos progress/i });
    expect(progressbar).toHaveAttribute('aria-valuenow', String(percent));

    expect(screen.getByText(/\bt1\b/)).toBeInTheDocument();
    expect(screen.getByText(/\bt2\b/)).toBeInTheDocument();
  });

  it('filters by completed and pending', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userTodos('1'), userTodosFixture);

    renderWithClient(<TodosSection id="1" />, { client });

    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText(/\bt1\b/)).toBeInTheDocument();
    expect(screen.queryByText(/\bt2\b/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pending' }));
    expect(screen.queryByText(/\bt1\b/)).not.toBeInTheDocument();
    expect(screen.getByText(/\bt2\b/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText(/\bt1\b/)).toBeInTheDocument();
    expect(screen.getByText(/\bt2\b/)).toBeInTheDocument();
  });
});
