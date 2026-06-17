import { useState } from 'react';
import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  /** Called synchronously when the delete animation starts (before the item is removed). */
  onStartDelete?: (id: string) => void;
}

/** Duration must match the longest transition in `.todo-item--deleting` CSS. */
const DELETE_ANIMATION_MS = 300;

export function TodoItem({ todo, onToggle, onDelete, onStartDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  // Unique id links the checkbox to its visible label, enabling "click title to toggle"
  // while keeping the input's aria-label as the sole accessible name (prevents
  // screen-reader double-announce that occurs when an aria-label'd input is nested
  // directly inside a <label> element).
  const checkboxId = `todo-item-checkbox-${todo.id}`;

  function handleDelete() {
    setIsDeleting(true);
    onStartDelete?.(todo.id); // notify parent immediately so layout can adjust
    setTimeout(() => onDelete(todo.id), DELETE_ANIMATION_MS);
  }

  const className = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDeleting ? 'todo-item--deleting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      <input
        id={checkboxId}
        type="checkbox"
        className="todo-item__checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={
          todo.completed
            ? `Bỏ đánh dấu "${todo.title}" hoàn thành`
            : `Đánh dấu "${todo.title}" hoàn thành`
        }
      />
      <label htmlFor={checkboxId} className="todo-item__label">
        <span className="todo-item__title">
          {todo.title}
        </span>
      </label>
      <button
        className="todo-item__delete"
        onClick={handleDelete}
        aria-label={`Xóa "${todo.title}"`}
        title="Xóa"
      >
        {/* Trash SVG — aria-hidden because accessible name comes from aria-label above */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </li>
  );
}
