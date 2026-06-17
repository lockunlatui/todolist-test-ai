import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('calls onDelete with the todo id after delete animation completes', async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    // onDelete is called after the exit animation (≤300 ms); waitFor polls until it fires
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith('test-1'));
  });

  it('applies deleting class immediately on delete click', async () => {
    const { container } = render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    expect(container.querySelector('.todo-item')).toHaveClass('todo-item--deleting');
  });

  it('applies completed class when todo is completed', () => {
    const { container } = render(
      <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(container.querySelector('.todo-item')).toHaveClass('todo-item--completed');
  });

  it('checkbox aria-label says "Đánh dấu" when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(
      screen.getByRole('checkbox', { name: /đánh dấu "uống nước đủ 2 lít" hoàn thành/i }),
    ).toBeInTheDocument();
  });

  it('checkbox aria-label says "Bỏ đánh dấu" when todo is completed', () => {
    render(
      <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(
      screen.getByRole('checkbox', { name: /bỏ đánh dấu "uống nước đủ 2 lít" hoàn thành/i }),
    ).toBeInTheDocument();
  });

  it('completed todo title has no inline style — line-through comes from CSS class', () => {
    render(
      <TodoItem todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    const title = screen.getByText('Uống nước đủ 2 lít');
    // Inline style was removed; visual strikethrough is applied via
    // `.todo-item--completed .todo-item__title` CSS rule only.
    expect(title).not.toHaveAttribute('style');
  });

  it('non-completed todo title has no inline style', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const title = screen.getByText('Uống nước đủ 2 lít');
    expect(title).not.toHaveAttribute('style');
  });

  it('delete button uses trash SVG icon with aria-hidden (WCAG 2.5.5 touch target)', () => {
    const { container } = render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    // Icon SVG must be hidden from screen readers — accessible name is on the button's aria-label
    const hiddenSvg = container.querySelector('.todo-item__delete svg[aria-hidden="true"]');
    expect(hiddenSvg).toBeInTheDocument();
    // No stray text content — purely SVG paths
    expect(container.querySelector('.todo-item__delete')?.textContent?.trim()).toBe('');
  });
});
