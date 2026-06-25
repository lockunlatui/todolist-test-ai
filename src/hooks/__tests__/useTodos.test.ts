import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'

describe('useTodos', () => {
  describe('createTodo', () => {
    it('creates a todo with required title', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Buy groceries' })
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].title).toBe('Buy groceries')
      expect(result.current.todos[0].status).toBe('pending')
    })

    it('trims whitespace from title', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: '  Buy groceries  ' })
      })

      expect(result.current.todos[0].title).toBe('Buy groceries')
    })

    it('throws when title is empty', () => {
      const { result } = renderHook(() => useTodos())

      expect(() => {
        act(() => {
          result.current.createTodo({ title: '' })
        })
      }).toThrow('Title is required')
    })

    it('throws when title is only whitespace', () => {
      const { result } = renderHook(() => useTodos())

      expect(() => {
        act(() => {
          result.current.createTodo({ title: '   ' })
        })
      }).toThrow('Title is required')
    })

    it('creates a todo with optional description', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({
          title: 'Buy groceries',
          description: 'Milk, eggs, bread',
        })
      })

      expect(result.current.todos[0].description).toBe('Milk, eggs, bread')
    })

    it('new todo appears at the top of the list', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'First' })
      })
      act(() => {
        result.current.createTodo({ title: 'Second' })
      })

      expect(result.current.todos[0].title).toBe('Second')
      expect(result.current.todos[1].title).toBe('First')
    })

    it('sets default status to pending', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Test' })
      })

      expect(result.current.todos[0].status).toBe('pending')
    })

    it('returns the created todo', () => {
      const { result } = renderHook(() => useTodos())
      let created: ReturnType<typeof result.current.createTodo> | undefined

      act(() => {
        created = result.current.createTodo({ title: 'Test' })
      })

      expect(created).toBeDefined()
      expect(created!.title).toBe('Test')
      expect(created!.id).toBeTruthy()
    })
  })

  describe('updateTodo', () => {
    it('updates the title of an existing todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Old title' })
      })
      const id = result.current.todos[0].id

      act(() => {
        result.current.updateTodo(id, { title: 'New title' })
      })

      expect(result.current.todos[0].title).toBe('New title')
    })

    it('updates the description of an existing todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Test', description: 'Old desc' })
      })
      const id = result.current.todos[0].id

      act(() => {
        result.current.updateTodo(id, { description: 'New desc' })
      })

      expect(result.current.todos[0].description).toBe('New desc')
    })

    it('updates the status of an existing todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Test' })
      })
      const id = result.current.todos[0].id

      act(() => {
        result.current.updateTodo(id, { status: 'completed' })
      })

      expect(result.current.todos[0].status).toBe('completed')
    })

    it('returns null when todo not found', () => {
      const { result } = renderHook(() => useTodos())
      let updated: ReturnType<typeof result.current.updateTodo> | undefined

      act(() => {
        updated = result.current.updateTodo('nonexistent', { title: 'X' })
      })

      expect(updated).toBeNull()
    })

    it('returns the updated todo (not null) when update succeeds', () => {
      const { result } = renderHook(() => useTodos())
      let updated: ReturnType<typeof result.current.updateTodo> | undefined

      act(() => {
        result.current.createTodo({ title: 'Old title' })
      })
      const id = result.current.todos[0].id

      act(() => {
        updated = result.current.updateTodo(id, { title: 'New title' })
      })

      expect(updated).not.toBeNull()
      expect(updated!.id).toBe(id)
      expect(updated!.title).toBe('New title')
    })

    it('does not change other todos when updating one', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Todo A' })
        result.current.createTodo({ title: 'Todo B' })
      })
      const idA = result.current.todos[1].id // A is second (newest first)

      act(() => {
        result.current.updateTodo(idA, { title: 'Todo A Updated' })
      })

      expect(result.current.todos[0].title).toBe('Todo B')
      expect(result.current.todos[1].title).toBe('Todo A Updated')
    })
  })

  describe('deleteTodo', () => {
    it('removes a todo from the list', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'To delete' })
      })
      const id = result.current.todos[0].id

      act(() => {
        result.current.deleteTodo(id)
      })

      expect(result.current.todos).toHaveLength(0)
    })

    it('returns true when deletion succeeds', () => {
      const { result } = renderHook(() => useTodos())
      let deleted: boolean | undefined

      act(() => {
        result.current.createTodo({ title: 'To delete' })
      })
      const id = result.current.todos[0].id

      act(() => {
        deleted = result.current.deleteTodo(id)
      })

      expect(deleted).toBe(true)
    })

    it('returns false when todo not found', () => {
      const { result } = renderHook(() => useTodos())
      let deleted: boolean | undefined

      act(() => {
        deleted = result.current.deleteTodo('nonexistent')
      })

      expect(deleted).toBe(false)
    })

    it('only removes the targeted todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Keep me' })
        result.current.createTodo({ title: 'Delete me' })
      })
      const deleteId = result.current.todos[0].id // newest first

      act(() => {
        result.current.deleteTodo(deleteId)
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].title).toBe('Keep me')
    })
  })

  describe('persistence (localStorage)', () => {
    it('persists created todos to localStorage', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Persisted todo' })
      })

      const stored = JSON.parse(localStorage.getItem('todos') ?? '[]')
      expect(stored).toHaveLength(1)
      expect(stored[0].title).toBe('Persisted todo')
    })

    it('rehydrates todos from localStorage on mount (survives reload)', () => {
      const seeded = [
        {
          id: 'todo-seed',
          title: 'From storage',
          status: 'pending',
          createdAt: 1,
          updatedAt: 1,
        },
      ]
      localStorage.setItem('todos', JSON.stringify(seeded))

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].title).toBe('From storage')
    })

    it('falls back to empty list when storage is corrupted', () => {
      localStorage.setItem('todos', 'not-json')

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos).toEqual([])
    })
  })

  describe('getTodo', () => {
    it('returns the todo by id', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.createTodo({ title: 'Find me' })
      })
      const id = result.current.todos[0].id

      const found = result.current.getTodo(id)
      expect(found?.title).toBe('Find me')
    })

    it('returns undefined when not found', () => {
      const { result } = renderHook(() => useTodos())
      const found = result.current.getTodo('nonexistent')
      expect(found).toBeUndefined()
    })
  })
})
