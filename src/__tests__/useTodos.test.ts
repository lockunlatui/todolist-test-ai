import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
});
