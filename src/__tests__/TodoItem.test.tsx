import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../components/TodoItem';
import type { Todo } from '../types/todo';

const mockTodo: Todo = {
  id: 'test-1',
  title: 'Uống nước đủ 2 lít',
  completed: false,
  createdAt: new Date(),
};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Uống nước đủ 2 lít')).toBeInTheDocument();
  });

  it('checkbox is unchecked when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when todo is completed', () => {
    render(
      <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('test-1');
  });

  it('calls onDelete with the todo id when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    expect(onDelete).toHaveBeenCalledWith('test-1');
  });

  it('applies completed class when todo is completed', () => {
    const { container } = render(
      <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.todo-item')).toHaveClass('todo-item--completed');
  });
});
