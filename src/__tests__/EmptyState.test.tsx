import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  it('renders the empty state heading', () => {
    render(<EmptyState />);
    expect(screen.getByText(/chưa có công việc nào/i)).toBeInTheDocument();
  });

  it('renders guidance text to add a new item', () => {
    render(<EmptyState />);
    expect(screen.getByText(/thêm/i)).toBeInTheDocument();
  });

  it('does not carry role="status" (avoids aria-live conflict with loading spinner)', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('has aria-live="polite" so screen readers announce the empty state', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });
});
