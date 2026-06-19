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

  it('hides completion summary (no layout shift) when all remaining todos start deleting', async () => {
    // onDelete is a mock — the todos prop stays static during this test so we
    // can observe the intermediate "all pending delete" state in isolation.
    const todos = [makeTodo({ title: 'Sole task' })];
    const { container } = render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    // Summary is visible before any deletion starts
    const summary = container.querySelector('.todo-list__summary') as HTMLElement;
    expect(summary).not.toHaveStyle({ visibility: 'hidden' });

    // Trigger delete — animation begins, all remaining items are now pending deletion
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));

    // Summary should be hidden (visibility:hidden keeps its space so the list
    // height doesn't jump — no layout shift). EmptyState is NOT rendered yet;
    // it appears only once todos.length reaches 0.
    await waitFor(() => expect(summary).toHaveStyle({ visibility: 'hidden' }));

    // The animating item is still in the DOM (ul keeps rendering for animation)
    expect(screen.getByText('Sole task')).toBeInTheDocument();
    expect(screen.queryByText(/chưa có công việc nào/i)).not.toBeInTheDocument();
  });
});
