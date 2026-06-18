import { useReducer, useCallback, useEffect, useState, useRef } from 'react';
import type { Todo, TodoAction } from '../types/todo';

// NOTE: This app works offline-first via localStorage.
// The GET /todos call below is for future backend integration.
// If no backend is available the fetch fails silently and localStorage data is used.
// Once the backend responds successfully, PATCH/DELETE failures will rollback optimistic
// updates and surface an inline error message so users are not misled.
const STORAGE_KEY = 'todolist_todos';
const API_URL = '/todos';

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<Todo, 'createdAt'> & { createdAt: string }>;
    return parsed.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return [];
  }
}

function saveToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // storage might be unavailable; ignore
  }
}

function parseApiTodos(
  raw: Array<Omit<Todo, 'createdAt'> & { createdAt: string }>,
): Todo[] {
  return raw.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
}

function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'LOAD':
      // Pure: side-effect (saveToStorage) is handled by useEffect in the hook.
      return action.todos;
    case 'ADD':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          title: action.title.trim(),
          completed: false,
          createdAt: new Date(),
        },
      ];
    case 'DELETE':
      return state.filter((t) => t.id !== action.id);
    case 'TOGGLE':
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
    default:
      return state;
  }
}

export interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  /** Non-null when a PATCH or DELETE request failed after the backend was reachable. */
  error: string | null;
  clearError: () => void;
  addTodo: (title: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadFromStorage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to always-current todos so callbacks don't go stale
  const todosRef = useRef(todos);
  todosRef.current = todos;

  // Finding 4: persist todos via effect instead of inside the reducer (pure function rule).
  // Runs after every render where todos changes; covers ADD, DELETE, TOGGLE, and LOAD.
  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  // Track whether the backend has ever responded successfully.
  // Only rollback optimistic updates when the backend is known to be reachable
  // (i.e. the initial GET /todos returned 200). When no backend is deployed,
  // PATCH/DELETE are fire-and-forget and all data stays in localStorage.
  const backendAvailableRef = useRef(false);

  // Sync from backend on mount; silently fall back to localStorage on failure.
  // An AbortController with a 5 s timeout prevents the spinner from hanging
  // indefinitely when the server is slow or unreachable.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GET ${API_URL} → ${res.status}`);
        return res.json() as Promise<
          Array<Omit<Todo, 'createdAt'> & { createdAt: string }>
        >;
      })
      .then((data) => {
        if (!cancelled) {
          backendAvailableRef.current = true;
          dispatch({ type: 'LOAD', todos: parseApiTodos(data) });
          // Finding 1: setLoading(false) explicitly in the success branch.
          setLoading(false);
        }
      })
      .catch(() => {
        // Network unavailable, request timed out, backend not deployed, or
        // AbortController fired (timeout/unmount) — localStorage cache is used.
        // Finding 1: setLoading(false) explicitly in the error branch so the
        // spinner never hangs when fetch rejects or the abort signal fires.
        if (!cancelled) setLoading(false);
      })
      .finally(() => {
        // Cleanup only — loading state is already cleared in then/catch above.
        clearTimeout(timeoutId);
      });
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const addTodo = useCallback((title: string) => {
    if (!title.trim()) return;
    // Finding 3: clear stale error banner when the user initiates a new action.
    setError(null);
    dispatch({ type: 'ADD', title });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    const snapshot = todosRef.current;
    // Finding 3: clear stale error banner when the user initiates a new action.
    setError(null);
    dispatch({ type: 'DELETE', id });
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error(`DELETE ${API_URL}/${id} → ${res.status}`);
        setError(null);
      })
      .catch(() => {
        if (backendAvailableRef.current) {
          // Backend was reachable but rejected — undo the optimistic delete
          dispatch({ type: 'LOAD', todos: snapshot });
          setError('Xóa không thành công. Vui lòng thử lại.');
        }
      });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    const snapshot = todosRef.current;
    // Finding 3: clear stale error banner when the user initiates a new action.
    setError(null);
    dispatch({ type: 'TOGGLE', id });
    // Compute new completed value from snapshot (avoids stale closure)
    const todo = snapshot.find((t) => t.id === id);
    if (todo) {
      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`PATCH ${API_URL}/${id} → ${res.status}`);
          setError(null);
        })
        .catch(() => {
          if (backendAvailableRef.current) {
            // Backend was reachable but rejected — undo the optimistic toggle
            dispatch({ type: 'LOAD', todos: snapshot });
            setError('Cập nhật không thành công. Vui lòng thử lại.');
          }
        });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { todos, loading, error, clearError, addTodo, deleteTodo, toggleTodo };
}
