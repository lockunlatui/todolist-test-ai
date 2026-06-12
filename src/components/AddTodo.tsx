import { useState, type FormEvent } from 'react';
import './AddTodo.css';

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit} noValidate>
      <input
        className="add-todo__input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nhập tên công việc..."
        aria-label="Tên công việc mới"
        maxLength={200}
      />
      <button
        className="add-todo__button"
        type="submit"
        disabled={!value.trim()}
        aria-label="Thêm công việc"
      >
        Thêm
      </button>
    </form>
  );
}
