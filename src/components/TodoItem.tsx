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

  function handleDelete() {
    setIsDeleting(true);
    onStartDelete?.(todo.id); // notify parent immediately so EmptyState can appear
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
      <label className="todo-item__label">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Đánh dấu "${todo.title}" hoàn thành`}
        />
        <span className="todo-item__title">{todo.title}</span>
      </label>
      <button
        className="todo-item__delete"
        onClick={handleDelete}
        aria-label={`Xóa "${todo.title}"`}
        title="Xóa"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}
