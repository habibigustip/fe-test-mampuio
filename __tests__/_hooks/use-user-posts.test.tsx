import { renderHook, waitFor } from '@testing-library/react';
import { useUserPosts } from '@/app/_hooks/use-user-posts';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { userPostsFixture } from '../fixtures';

describe('useUserPosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches posts for a specific user', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(userPostsFixture));

    const { result } = renderHook(() => useUserPosts('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/posts?userId=1'), undefined);
    expect(result.current.data).toEqual(userPostsFixture);
  });

  it('surfaces errors when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    const { result } = renderHook(() => useUserPosts('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
