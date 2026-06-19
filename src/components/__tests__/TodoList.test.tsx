import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from '../TodoList'
import type { Todo } from '../../types/todo'

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `todo-${Math.random()}`,
  title: 'Test Todo',
  status: 'pending',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
})

describe('TodoList', () => {
  it('shows empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders all todos', () => {
    const todos = [
      makeTodo({ title: 'Todo A' }),
      makeTodo({ title: 'Todo B' }),
    ]
    render(
      <TodoList
        todos={todos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByText('Todo A')).toBeInTheDocument()
    expect(screen.getByText('Todo B')).toBeInTheDocument()
  })

  it('renders correct number of todo items', () => {
    const todos = [makeTodo(), makeTodo(), makeTodo()]
    render(
      <TodoList
        todos={todos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getAllByTestId('todo-item')).toHaveLength(3)
  })

  it('does not show empty state when todos exist', () => {
    const todos = [makeTodo()]
    render(
      <TodoList
        todos={todos}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })
})
