import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '@/app/_hooks/use-posts';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { postsFixture } from '../fixtures';

describe('usePosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches posts from /posts', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(postsFixture));

    const { result } = renderHook(() => usePosts(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/posts'), undefined);
    expect(result.current.data).toEqual(postsFixture);
  });

  it('surfaces errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    const { result } = renderHook(() => usePosts(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
