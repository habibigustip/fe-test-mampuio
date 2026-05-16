import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '@/app/_hooks/use-users';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { usersFixture } from '../fixtures';

describe('useUsers', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches users from /users', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(usersFixture));

    const { result } = renderHook(() => useUsers(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/users'), undefined);
    expect(result.current.data).toEqual(usersFixture);
  });

  it('surfaces errors when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      jsonResponse({ message: 'boom' }, 500),
    );

    const { result } = renderHook(() => useUsers(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
