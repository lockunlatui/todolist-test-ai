import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';
import type { UseTodosReturn } from '../hooks/useTodos';

// Ensure localStorage is clean between tests
beforeEach(() => {
  localStorage.clear();
});

describe('useTodos', () => {
  it('starts with an empty list', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toHaveLength(0);
  });

  it('adds a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('Mua sữa');
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Mua sữa');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('ignores blank titles', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('   ');
    });
    expect(result.current.todos).toHaveLength(0);
  });

  it('trims whitespace from title', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('  Học tiếng Anh  ');
    });
    expect(result.current.todos[0].title).toBe('Học tiếng Anh');
  });

  it('toggles completion', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Task A'));
    const id = result.current.todos[0].id;

    act(() => result.current.toggleTodo(id));
    expect(result.current.todos[0].completed).toBe(true);

    act(() => result.current.toggleTodo(id));
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Task B'));
    const id = result.current.todos[0].id;

    act(() => result.current.deleteTodo(id));
    expect(result.current.todos).toHaveLength(0);
  });

  it('persists todos to localStorage on add', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Saved item'));
    const stored = JSON.parse(localStorage.getItem('todolist_todos') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Saved item');
  });

  // --- fetch / API integration ---

  it('calls fetch on mount targeting /todos (with AbortSignal for timeout)', () => {
    renderHook(() => useTodos());
    expect(fetch).toHaveBeenCalledWith(
      '/todos',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('loads todos from API when fetch succeeds', async () => {
    const apiTodos = [
      { id: 'api-1', title: 'Từ API', completed: false, createdAt: new Date().toISOString() },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiTodos),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    expect(result.current.todos[0].title).toBe('Từ API');
    expect(result.current.todos[0].createdAt).toBeInstanceOf(Date);
  });

  it('fetch returns 5 todos — renders 5 items', async () => {
    const apiTodos = Array.from({ length: 5 }, (_, i) => ({
      id: `t${i}`,
      title: `Công việc ${i + 1}`,
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiTodos),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(5));
    expect(result.current.todos.map((t) => t.title)).toEqual(
      Array.from({ length: 5 }, (_, i) => `Công việc ${i + 1}`),
    );
  });

  it('fetch returns [] — todos list is empty (empty state)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toHaveLength(0);
  });

  it('fetch returns 25 todos — all 25 items available (scrollable list)', async () => {
    const apiTodos = Array.from({ length: 25 }, (_, i) => ({
      id: `item${i}`,
      title: `Todo ${i + 1}`,
      completed: i % 3 === 0,
      createdAt: new Date().toISOString(),
    }));
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiTodos),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(25));
  });

  it('keeps localStorage data when fetch returns non-OK response', async () => {
    localStorage.setItem(
      'todolist_todos',
      JSON.stringify([
        { id: 'ls-1', title: 'Offline todo', completed: false, createdAt: new Date().toISOString() },
      ]),
    );
    // fetch mock already returns 503 (from setup.ts); just render
    const { result } = renderHook(() => useTodos());
    // Give the effect a chance to run and fail
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(result.current.todos[0].title).toBe('Offline todo');
  });

  it('keeps localStorage data when fetch throws a network error', async () => {
    localStorage.setItem(
      'todolist_todos',
      JSON.stringify([
        { id: 'ls-2', title: 'Network down', completed: false, createdAt: new Date().toISOString() },
      ]),
    );
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(result.current.todos[0].title).toBe('Network down');
  });

  // --- loading state ---

  it('loading starts true while fetch is in-flight', () => {
    // Suspend the fetch indefinitely so we can observe the initial loading state
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));
    const { result } = renderHook(() => useTodos());
    expect(result.current.loading).toBe(true);
  });

  it('loading becomes false after fetch resolves (non-OK)', async () => {
    // Default mock returns 503; loading must clear regardless
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('loading becomes false after fetch succeeds', async () => {
    const apiTodos = [
      { id: 'ld-1', title: 'Loaded', completed: false, createdAt: new Date().toISOString() },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiTodos),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos[0].title).toBe('Loaded');
  });

  // --- PATCH / DELETE API sync ---

  it('calls PATCH /todos/:id with new completed value when toggling', async () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Toggle me'));
    const id = result.current.todos[0].id;

    // Reset fetch mock so we can assert on the PATCH call specifically
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);

    act(() => result.current.toggleTodo(id));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `/todos/${id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ completed: true }),
        }),
      ),
    );
    expect(result.current.todos[0].completed).toBe(true);
  });

  it('return value satisfies UseTodosReturn shape', () => {
    const { result } = renderHook(() => useTodos());
    const hook: UseTodosReturn = result.current;
    expect(Array.isArray(hook.todos)).toBe(true);
    expect(typeof hook.loading).toBe('boolean');
    expect(hook.error).toBeNull();
    expect(typeof hook.clearError).toBe('function');
    expect(typeof hook.addTodo).toBe('function');
    expect(typeof hook.deleteTodo).toBe('function');
    expect(typeof hook.toggleTodo).toBe('function');
  });

  it('calls DELETE /todos/:id when deleting a todo', async () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Delete me'));
    const id = result.current.todos[0].id;

    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);

    act(() => result.current.deleteTodo(id));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `/todos/${id}`,
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
    expect(result.current.todos).toHaveLength(0);
  });

  // --- rollback when backend is reachable but returns an error ---

  it('rolls back toggle and sets error when PATCH fails (backend was reachable)', async () => {
    // Initial GET succeeds — backend is marked as available
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Rollback test'));
    const id = result.current.todos[0].id;

    // PATCH will fail
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    act(() => result.current.toggleTodo(id));

    // Optimistic update fires immediately
    expect(result.current.todos[0].completed).toBe(true);

    // After PATCH fails, state rolls back and error is set
    await waitFor(() => expect(result.current.todos[0].completed).toBe(false));
    expect(result.current.error).toBe('Cập nhật không thành công. Vui lòng thử lại.');
  });

  it('rolls back delete and sets error when DELETE fails (backend was reachable)', async () => {
    // Initial GET succeeds — backend is marked as available
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Will be restored'));
    const id = result.current.todos[0].id;

    // DELETE will fail
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    act(() => result.current.deleteTodo(id));

    // Optimistic removal fires immediately
    expect(result.current.todos).toHaveLength(0);

    // After DELETE fails, state rolls back
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    expect(result.current.todos[0].id).toBe(id);
    expect(result.current.error).toBe('Xóa không thành công. Vui lòng thử lại.');
  });

  it('clearError resets the error state', async () => {
    // Trigger an error via failed PATCH (backend was reachable)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Clear error test'));
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    act(() => result.current.toggleTodo(result.current.todos[0].id));

    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  it('clears error banner automatically when the next PATCH succeeds', async () => {
    // Backend becomes available
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Error then success'));
    const id = result.current.todos[0].id;

    // First toggle — PATCH fails → banner appears
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    act(() => result.current.toggleTodo(id));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    // Second toggle — PATCH succeeds → banner must be cleared automatically
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
    act(() => result.current.toggleTodo(id));
    await waitFor(() => expect(result.current.error).toBeNull());
  });

  it('clears error banner automatically when the next DELETE succeeds', async () => {
    // Backend becomes available
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('First'));
    act(() => result.current.addTodo('Second'));

    const firstId = result.current.todos[0].id;
    const secondId = result.current.todos[1].id;

    // Delete first item — fails → banner appears
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    act(() => result.current.deleteTodo(firstId));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    // Delete second item — succeeds → banner must be cleared automatically
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
    act(() => result.current.deleteTodo(secondId));
    await waitFor(() => expect(result.current.error).toBeNull());
  });

  it('does NOT rollback when no backend is deployed (fire-and-forget offline mode)', async () => {
    // Default setup: GET returns 503, backendAvailableRef stays false
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Offline task'));
    const id = result.current.todos[0].id;

    // toggleTodo fires PATCH which returns 503 (default mock), but no rollback expected
    act(() => result.current.toggleTodo(id));

    // Give the microtask queue time to flush
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Optimistic state is preserved (no rollback in offline-first mode)
    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // --- Finding 1: setLoading(false) in both success and error branches ---

  it('loading becomes false when fetch is aborted (AbortController timeout path)', async () => {
    // Mock fetch to reject with AbortError — simulates what happens when
    // the 5 s timeout fires and controller.abort() is called.
    vi.mocked(fetch).mockImplementationOnce(() =>
      Promise.reject(new DOMException('The operation was aborted.', 'AbortError')),
    );

    const { result } = renderHook(() => useTodos());
    // loading starts true, then the AbortError is caught; loading must become false.
    await waitFor(() => expect(result.current.loading).toBe(false));
    // localStorage fallback is intact; no data is lost.
    expect(result.current.todos).toHaveLength(0);
  });

  // --- Finding 3: auto-clear error on action dispatch ---

  it('clears error immediately when addTodo is called while an error banner is visible', async () => {
    // Backend becomes available
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Trigger error'));
    const id = result.current.todos[0].id;

    // PATCH fails → error banner appears
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    act(() => result.current.toggleTodo(id));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    // addTodo must clear the error immediately (synchronously inside act)
    act(() => result.current.addTodo('After error'));
    expect(result.current.error).toBeNull();
  });

  it('clears error immediately when deleteTodo is called while an error banner is visible', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response);

    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.addTodo('Item A'));
    act(() => result.current.addTodo('Item B'));
    const idA = result.current.todos[0].id;
    const idB = result.current.todos[1].id;

    // Force error via failed PATCH
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    act(() => result.current.toggleTodo(idA));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    // deleteTodo must clear the error immediately
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
    act(() => result.current.deleteTodo(idB));
    expect(result.current.error).toBeNull();
  });

  // --- Finding 4: pure reducer — saveToStorage is a useEffect, not a reducer side-effect ---

  it('saveToStorage runs via useEffect after state changes (todos persisted after act flushes)', () => {
    // This test verifies that even though saveToStorage is no longer called inside
    // the reducer, todos are still persisted because the useEffect fires during act().
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Effect-persisted item'));

    const stored = JSON.parse(localStorage.getItem('todolist_todos') ?? '[]') as Array<{ title: string }>;
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Effect-persisted item');
  });

  it('deleting a todo also persists the updated list via useEffect', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Will be removed'));
    const id = result.current.todos[0].id;

    act(() => result.current.deleteTodo(id));

    const stored = JSON.parse(localStorage.getItem('todolist_todos') ?? '[]') as unknown[];
    expect(stored).toHaveLength(0);
  });
});
