import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
