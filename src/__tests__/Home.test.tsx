import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from '../pages/Home';

beforeEach(() => {
  localStorage.clear();
});

describe('Home page (integration)', () => {
  it('renders the page title', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /todolist/i })).toBeInTheDocument();
  });

  it('shows empty state on first load', () => {
    render(<Home />);
    expect(screen.getByText(/chưa có công việc nào/i)).toBeInTheDocument();
  });

  it('adds a todo and displays it in the list', async () => {
    render(<Home />);
    await userEvent.type(screen.getByRole('textbox'), 'Kiểm tra tích hợp');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    expect(screen.getByText('Kiểm tra tích hợp')).toBeInTheDocument();
  });

  it('marks a todo as complete', async () => {
    render(<Home />);
    await userEvent.type(screen.getByRole('textbox'), 'Việc cần làm');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('deletes a todo', async () => {
    render(<Home />);
    await userEvent.type(screen.getByRole('textbox'), 'Sẽ bị xóa');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    expect(screen.queryByText('Sẽ bị xóa')).not.toBeInTheDocument();
  });

  it('shows empty state again after all todos are deleted', async () => {
    render(<Home />);
    await userEvent.type(screen.getByRole('textbox'), 'Tạm thời');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    await userEvent.click(screen.getByRole('button', { name: /xóa/i }));
    expect(screen.getByText(/chưa có công việc nào/i)).toBeInTheDocument();
  });
});
