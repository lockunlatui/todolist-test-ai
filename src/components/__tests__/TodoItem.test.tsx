import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '../TodoItem'
import type { Todo } from '../../types/todo'

const baseTodo: Todo = {
  id: 'todo-1',
  title: 'Test Todo',
  status: 'pending',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

describe('TodoItem', () => {
  it('renders todo title', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    const todo = { ...baseTodo, description: 'Some description' }
    render(
      <TodoItem
        todo={todo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.queryByText('Some description')).not.toBeInTheDocument()
  })

  it('shows pending badge for pending status', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByText(/đang chờ/i)).toBeInTheDocument()
  })

  it('shows completed badge for completed status', () => {
    const todo = { ...baseTodo, status: 'completed' as const }
    render(
      <TodoItem
        todo={todo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getAllByText(/hoàn thành/i).length).toBeGreaterThan(0)
  })

  it('checkbox is unchecked for pending todo', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked for completed todo', () => {
    const todo = { ...baseTodo, status: 'completed' as const }
    render(
      <TodoItem
        todo={todo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggleStatus when checkbox is clicked', async () => {
    const onToggleStatus = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={onToggleStatus}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggleStatus).toHaveBeenCalledWith(baseTodo.id, { status: 'completed' })
  })

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /sửa/i }))
    expect(onEdit).toHaveBeenCalledWith(baseTodo)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onToggleStatus={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }))
    expect(onDelete).toHaveBeenCalledWith(baseTodo.id)
  })
})
