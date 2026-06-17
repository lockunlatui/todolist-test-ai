import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../components/TodoList';
import type { Todo } from '../types/todo';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Default task',
  completed: false,
  createdAt: new Date(),
  ...overrides,
});

describe('TodoList', () => {
  it('shows EmptyState when todos array is empty', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/chưa có công việc nào/i)).toBeInTheDocument();
  });

  it('renders a list of todos when provided', () => {
    const todos = [makeTodo({ title: 'Task A' }), makeTodo({ title: 'Task B' })];
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  it('shows correct completion summary', () => {
    const todos = [
      makeTodo({ title: 'Done', completed: true }),
      makeTodo({ title: 'Not done', completed: false }),
    ];
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('1/2 công việc hoàn thành')).toBeInTheDocument();
  });

  it('renders 25 todos without throwing (scroll performance)', () => {
    const todos = Array.from({ length: 25 }, (_, i) =>
      makeTodo({ title: `Task ${i + 1}` }),
    );
    const { container } = render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );
    // All 25 items should render
    const items = container.querySelectorAll('.todo-item');
    expect(items).toHaveLength(25);
    // Summary should reflect all 25 tasks
    expect(screen.getByText('0/25 công việc hoàn thành')).toBeInTheDocument();
  });

  it('shows EmptyState immediately when last todo starts deleting', async () => {
    const onDelete = vi.fn();
    const todos = [makeTodo({ title: 'Sole task' })];
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={onDelete} />);

    // Trigger delete — EmptyState should appear before onDelete is called
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    await waitFor(() =>
      expect(screen.getByText(/chưa có công việc nào/i)).toBeInTheDocument(),
    );
  });
});
