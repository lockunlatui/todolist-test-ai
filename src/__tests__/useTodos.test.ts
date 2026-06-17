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

  it('calls fetch on mount targeting /todos', () => {
    renderHook(() => useTodos());
    expect(fetch).toHaveBeenCalledWith('/todos');
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
});
