import { renderHook, waitFor } from '@testing-library/react';
import { useTodos } from '@/app/_hooks/use-todos';
import { apiUrl } from '@/app/_lib/api';
import { createQueryWrapper, jsonResponse } from '../test-utils';
import { todosFixture } from '../fixtures';

describe('useTodos', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('fetches todos from /todos', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse(todosFixture));

    const { result } = renderHook(() => useTodos(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith(apiUrl('/todos'), undefined);
    expect(result.current.data).toEqual(todosFixture);
  });

  it('surfaces errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({}, 500));

    const { result } = renderHook(() => useTodos(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toMatch(/500/);
  });
});
