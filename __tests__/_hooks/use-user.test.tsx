import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from '@/app/_hooks/use-user';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { userDetailFixture } from '../fixtures';

describe('useUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches the user detail from /users/:id', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(userDetailFixture));

    const { result } = renderHook(() => useUser('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/users/1'), undefined);
    expect(result.current.data).toEqual(userDetailFixture);
  });

  it('surfaces errors when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    const { result } = renderHook(() => useUser('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
