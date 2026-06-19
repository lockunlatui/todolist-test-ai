import { useState, useCallback, useEffect } from 'react'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo'

const STORAGE_KEY = 'todos'

const generateId = (): string =>
  `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

function loadTodos(fallback: Todo[]): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Todo[]) : fallback
  } catch {
    // Corrupted or unavailable storage — fall back to initial todos.
    return fallback
  }
}

export interface UseTodosReturn {
  todos: Todo[]
  createTodo: (input: CreateTodoInput) => Todo
  updateTodo: (id: string, input: UpdateTodoInput) => Todo | null
  deleteTodo: (id: string) => boolean
  getTodo: (id: string) => Todo | undefined
}

export function useTodos(initialTodos: Todo[] = []): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(initialTodos))

  // Persist to localStorage so todos survive a page reload.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // Ignore write failures (e.g. storage full or unavailable).
    }
  }, [todos])

  const createTodo = useCallback((input: CreateTodoInput): Todo => {
    if (!input.title.trim()) {
      throw new Error('Title is required')
    }
    const now = Date.now()
    const todo: Todo = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }
    setTodos((prev) => [todo, ...prev])
    return todo
  }, [])

  const updateTodo = useCallback(
    (id: string, input: UpdateTodoInput): Todo | null => {
      // Compute the updated todo synchronously so the return value is correct
      // even though setTodos is asynchronous.
      const existing = todos.find((t) => t.id === id)
      if (!existing) return null
      const updated: Todo = {
        ...existing,
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.description !== undefined && {
          description: input.description.trim() || undefined,
        }),
        ...(input.status !== undefined && { status: input.status }),
        updatedAt: Date.now(),
      }
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
      return updated
    },
    [todos],
  )

  const deleteTodo = useCallback(
    (id: string): boolean => {
      const exists = todos.some((t) => t.id === id)
      if (exists) {
        setTodos((prev) => prev.filter((t) => t.id !== id))
      }
      return exists
    },
    [todos],
  )

  const getTodo = useCallback(
    (id: string): Todo | undefined => todos.find((t) => t.id === id),
    [todos],
  )

  return { todos, createTodo, updateTodo, deleteTodo, getTodo }
}
