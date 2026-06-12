import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTodo } from '../components/AddTodo';

describe('AddTodo', () => {
  it('renders the input and button', () => {
    render(<AddTodo onAdd={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<AddTodo onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /thêm/i })).toBeDisabled();
  });

  it('submit button becomes enabled when input has text', async () => {
    render(<AddTodo onAdd={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), 'Mới');
    expect(screen.getByRole('button', { name: /thêm/i })).toBeEnabled();
  });

  it('calls onAdd with trimmed title on submit', async () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), '  Đọc sách  ');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    expect(onAdd).toHaveBeenCalledWith('Đọc sách');
  });

  it('clears the input after successful submission', async () => {
    render(<AddTodo onAdd={vi.fn()} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Tập thể dục');
    await userEvent.click(screen.getByRole('button', { name: /thêm/i }));
    expect(input).toHaveValue('');
  });

  it('does not call onAdd for whitespace-only input', async () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    // Manually set value via keyboard (button stays disabled for blank)
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '   ');
    // button should remain disabled
    expect(screen.getByRole('button', { name: /thêm/i })).toBeDisabled();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
