import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  const done = todos.filter((t) => t.completed).length;

  return (
    <section className="todo-list" aria-label="Danh sách công việc">
      <p className="todo-list__summary" aria-live="polite">
        {done}/{todos.length} công việc hoàn thành
      </p>
      <ul className="todo-list__items" role="list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );
}
