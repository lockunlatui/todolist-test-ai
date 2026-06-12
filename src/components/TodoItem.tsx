import type { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
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
        onClick={() => onDelete(todo.id)}
        aria-label={`Xóa "${todo.title}"`}
        title="Xóa"
      >
        ×
      </button>
    </li>
  );
}
