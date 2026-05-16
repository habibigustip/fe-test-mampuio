import { renderHook, waitFor } from '@testing-library/react';
import { useUserTodos } from '@/app/_hooks/use-user-todos';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { userTodosFixture } from '../fixtures';

describe('useUserTodos', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches todos for a specific user', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(userTodosFixture));

    const { result } = renderHook(() => useUserTodos('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/todos?userId=1'), undefined);
    expect(result.current.data).toEqual(userTodosFixture);
  });

  it('surfaces errors when the request fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    const { result } = renderHook(() => useUserTodos('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
