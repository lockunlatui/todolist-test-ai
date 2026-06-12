import { useReducer, useCallback } from 'react';
import type { Todo, TodoAction } from '../types/todo';

const STORAGE_KEY = 'todolist_todos';

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

function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  let next: Todo[];
  switch (action.type) {
    case 'ADD':
      next = [
        ...state,
        {
          id: crypto.randomUUID(),
          title: action.title.trim(),
          completed: false,
          createdAt: new Date(),
        },
      ];
      break;
    case 'DELETE':
      next = state.filter((t) => t.id !== action.id);
      break;
    case 'TOGGLE':
      next = state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
      break;
    default:
      return state;
  }
  saveToStorage(next);
  return next;
}

export function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadFromStorage);

  const addTodo = useCallback((title: string) => {
    if (!title.trim()) return;
    dispatch({ type: 'ADD', title });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE', id });
  }, []);

  return { todos, addTodo, deleteTodo, toggleTodo };
}
