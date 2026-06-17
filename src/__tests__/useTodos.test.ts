import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';

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
});
