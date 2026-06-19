"use client";

import { useState, useEffect, useCallback } from "react";
import type { Todo } from "@/types/todo";

const STORAGE_KEY = "todos_v1";

function loadFromStorage(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

function saveToStorage(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export interface UseTodosReturn {
  todos: Todo[];
  addTodo: (title: string) => { error?: string };
  updateTodo: (id: string, title: string) => { error?: string };
  deleteTodo: (id: string) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setTodos(loadFromStorage());
  }, []);

  const persist = useCallback((updated: Todo[]) => {
    setTodos(updated);
    saveToStorage(updated);
  }, []);

  const addTodo = useCallback(
    (title: string): { error?: string } => {
      const trimmed = title.trim();
      if (!trimmed) {
        return { error: "Tiêu đề không được để trống" };
      }
      const newTodo: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: trimmed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      persist([...todos, newTodo]);
      return {};
    },
    [todos, persist]
  );

  const updateTodo = useCallback(
    (id: string, title: string): { error?: string } => {
      const trimmed = title.trim();
      if (!trimmed) {
        return { error: "Tiêu đề không được để trống" };
      }
      persist(
        todos.map((t) =>
          t.id === id ? { ...t, title: trimmed, updatedAt: Date.now() } : t
        )
      );
      return {};
    },
    [todos, persist]
  );

  const deleteTodo = useCallback(
    (id: string): void => {
      persist(todos.filter((t) => t.id !== id));
    },
    [todos, persist]
  );

  return { todos, addTodo, updateTodo, deleteTodo };
}
