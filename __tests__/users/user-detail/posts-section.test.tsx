import { screen, fireEvent, waitFor } from '@testing-library/react';
import { PostsSection } from '@/app/users/[id]/posts-section';
import { queryKeys } from '@/app/_lib/api';
import {
  createTestQueryClient,
  jsonResponse,
  renderWithClient,
} from '../../test-utils';
import { userPostsFixture } from '../../fixtures';

describe('PostsSection', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('shows nothing data-related while loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithClient(<PostsSection id="1" />);

    expect(screen.queryByText(/^Posts \(/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to load posts/)).not.toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    renderWithClient(<PostsSection id="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load posts/)).toBeInTheDocument();
    });
  });

  it('shows "No posts yet." when the list is empty', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userPosts('1'), []);

    renderWithClient(<PostsSection id="1" />, { client });

    expect(screen.getByText('No posts yet.')).toBeInTheDocument();
  });

  it('renders the count and each post title on success', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userPosts('1'), userPostsFixture);

    renderWithClient(<PostsSection id="1" />, { client });

    expect(screen.getByRole('heading', { name: `Posts (${userPostsFixture.length})` })).toBeInTheDocument();
    for (const post of userPostsFixture) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    }
  });

  it('toggles aria-expanded and line-clamp when a post is clicked', () => {
    const client = createTestQueryClient();
    client.setQueryData(queryKeys.userPosts('1'), userPostsFixture);

    renderWithClient(<PostsSection id="1" />, { client });

    const firstPost = userPostsFixture[0];
    const button = screen.getByText(firstPost.title).closest('button')!;
    const bodyParagraph = screen.getByText(firstPost.body);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(bodyParagraph).toHaveClass('line-clamp-2');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(bodyParagraph).not.toHaveClass('line-clamp-2');
  });
});
