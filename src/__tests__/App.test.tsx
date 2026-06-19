import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'

// window.confirm is used before deletion
beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

describe('App – CRUD integration', () => {
  // AC1: create todo and see it in list immediately
  it('AC1: creates a todo and shows it in the list immediately', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Buy groceries')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })

  it('AC1: shows empty state before any todo is created', () => {
    render(<App />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('AC1: creates multiple todos and shows all', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Todo A')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Todo B')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(screen.getByText('Todo A')).toBeInTheDocument()
    expect(screen.getByText('Todo B')).toBeInTheDocument()
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2)
  })

  it('AC1: does not create todo when title is empty', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  // AC2: edit a todo and see it updated
  it('AC2: edits a todo title and saves successfully', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Original title')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.click(screen.getByRole('button', { name: /sửa "original title"/i }))

    const dialog = screen.getByRole('dialog')
    const titleInput = within(dialog).getByLabelText(/tiêu đề/i)
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated title')
    await userEvent.click(within(dialog).getByRole('button', { name: /lưu/i }))

    expect(screen.getByText('Updated title')).toBeInTheDocument()
    expect(screen.queryByText('Original title')).not.toBeInTheDocument()
  })

  it('AC2: edits todo status to completed', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Test todo')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.click(screen.getByRole('button', { name: /sửa "test todo"/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.selectOptions(within(dialog).getByLabelText(/trạng thái/i), 'completed')
    await userEvent.click(within(dialog).getByRole('button', { name: /lưu/i }))

    const todoItem = screen.getByTestId('todo-item')
    expect(within(todoItem).getByRole('checkbox')).toBeChecked()
  })

  it('AC2: closes edit modal without saving on cancel', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Original title')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.click(screen.getByRole('button', { name: /sửa "original title"/i }))
    const dialog = screen.getByRole('dialog')
    const titleInput = within(dialog).getByLabelText(/tiêu đề/i)
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Changed')
    await userEvent.click(within(dialog).getByRole('button', { name: /hủy/i }))

    expect(screen.getByText('Original title')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // AC3: delete a todo and it's gone from the list
  it('AC3: deletes a todo and it disappears from the list', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'To delete')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.click(screen.getByRole('button', { name: /xóa "to delete"/i }))

    expect(screen.queryByText('To delete')).not.toBeInTheDocument()
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('AC3: deletes only the targeted todo', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Keep me')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Delete me')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    await userEvent.click(screen.getByRole('button', { name: /xóa "delete me"/i }))

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByText('Keep me')).toBeInTheDocument()
  })

  // Toggle status via checkbox
  it('toggling checkbox marks todo as completed', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Test todo')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('toggling checkbox twice restores pending status', async () => {
    render(<App />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Test todo')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
