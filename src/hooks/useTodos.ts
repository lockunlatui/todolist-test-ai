import { useState, useCallback } from 'react'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo'

const generateId = (): string =>
  `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export interface UseTodosReturn {
  todos: Todo[]
  createTodo: (input: CreateTodoInput) => Todo
  updateTodo: (id: string, input: UpdateTodoInput) => Todo | null
  deleteTodo: (id: string) => boolean
  getTodo: (id: string) => Todo | undefined
}

export function useTodos(initialTodos: Todo[] = []): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

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
      let updated: Todo | null = null
      setTodos((prev) =>
        prev.map((todo) => {
          if (todo.id !== id) return todo
          updated = {
            ...todo,
            ...(input.title !== undefined && { title: input.title.trim() }),
            ...(input.description !== undefined && {
              description: input.description.trim() || undefined,
            }),
            ...(input.status !== undefined && { status: input.status }),
            updatedAt: Date.now(),
          }
          return updated
        }),
      )
      return updated
    },
    [],
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
