import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTodoModal } from '../EditTodoModal'
import type { Todo } from '../../types/todo'

const baseTodo: Todo = {
  id: 'todo-1',
  title: 'Original Title',
  description: 'Original description',
  status: 'pending',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

describe('EditTodoModal', () => {
  it('renders with pre-filled values from todo', () => {
    render(
      <EditTodoModal todo={baseTodo} onSave={vi.fn()} onClose={vi.fn()} />,
    )
    expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Original description')).toBeInTheDocument()
  })

  it('calls onSave with updated values when form submitted', async () => {
    const onSave = vi.fn()
    render(
      <EditTodoModal todo={baseTodo} onSave={onSave} onClose={vi.fn()} />,
    )

    const titleInput = screen.getByLabelText(/tiêu đề/i)
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Title')

    await userEvent.click(screen.getByRole('button', { name: /lưu/i }))

    expect(onSave).toHaveBeenCalledWith(
      baseTodo.id,
      expect.objectContaining({ title: 'Updated Title' }),
    )
  })

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <EditTodoModal todo={baseTodo} onSave={vi.fn()} onClose={onClose} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /hủy/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows error and does not call onSave when title is cleared', async () => {
    const onSave = vi.fn()
    render(
      <EditTodoModal todo={baseTodo} onSave={onSave} onClose={vi.fn()} />,
    )

    const titleInput = screen.getByLabelText(/tiêu đề/i)
    await userEvent.clear(titleInput)
    await userEvent.click(screen.getByRole('button', { name: /lưu/i }))

    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('allows changing status from select', async () => {
    const onSave = vi.fn()
    render(
      <EditTodoModal todo={baseTodo} onSave={onSave} onClose={vi.fn()} />,
    )

    await userEvent.selectOptions(
      screen.getByLabelText(/trạng thái/i),
      'completed',
    )
    await userEvent.click(screen.getByRole('button', { name: /lưu/i }))

    expect(onSave).toHaveBeenCalledWith(
      baseTodo.id,
      expect.objectContaining({ status: 'completed' }),
    )
  })

  it('calls onClose when overlay backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <EditTodoModal todo={baseTodo} onSave={vi.fn()} onClose={onClose} />,
    )
    const overlay = screen.getByRole('dialog')
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })
})
