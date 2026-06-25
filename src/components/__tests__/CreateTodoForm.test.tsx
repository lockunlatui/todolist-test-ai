import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateTodoForm } from '../CreateTodoForm'

describe('CreateTodoForm', () => {
  it('renders title and description fields', () => {
    render(<CreateTodoForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/tiêu đề/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mô tả/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<CreateTodoForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /tạo mới/i })).toBeInTheDocument()
  })

  it('calls onSubmit with title when form submitted', async () => {
    const onSubmit = vi.fn()
    render(<CreateTodoForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Buy groceries')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Buy groceries',
      description: undefined,
    })
  })

  it('calls onSubmit with title and description', async () => {
    const onSubmit = vi.fn()
    render(<CreateTodoForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/tiêu đề/i), 'Buy groceries')
    await userEvent.type(screen.getByLabelText(/mô tả/i), 'Milk, eggs')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Buy groceries',
      description: 'Milk, eggs',
    })
  })

  it('shows error and does not submit when title is empty', async () => {
    const onSubmit = vi.fn()
    render(<CreateTodoForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/tiêu đề không được để trống/i)
  })

  it('clears fields after successful submission', async () => {
    render(<CreateTodoForm onSubmit={vi.fn()} />)

    const titleInput = screen.getByLabelText(/tiêu đề/i)
    await userEvent.type(titleInput, 'Buy groceries')
    await userEvent.click(screen.getByRole('button', { name: /tạo mới/i }))

    expect(titleInput).toHaveValue('')
  })
})
