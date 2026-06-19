import { useState, useCallback, type CSSProperties } from 'react';
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
  // Track IDs whose delete animation has started but hasn't completed yet.
  // When ALL remaining todos are pending deletion, show EmptyState immediately
  // so the user sees the empty message while items animate out — not after.
  const [pendingDelete, setPendingDelete] = useState<ReadonlySet<string>>(new Set());

  // Add the id to the pending set and, in the same update, prune any ids that
  // have already left the list. Pruning here (an event handler) instead of in an
  // effect keeps memory bounded without a cascading set-state-in-effect render.
  // The item being deleted is still present in `todos` at this point (it is
  // removed only after its animation finishes), so its id is always retained.
  const handleStartDelete = useCallback(
    (id: string) => {
      const todoIds = new Set(todos.map((t) => t.id));
      setPendingDelete((prev) =>
        new Set([...prev, id].filter((pendingId) => todoIds.has(pendingId))),
      );
    },
    [todos],
  );

  if (todos.length === 0) {
    return <EmptyState />;
  }

  const done = todos.filter((t) => t.completed).length;
  const allPendingDelete = todos.every((t) => pendingDelete.has(t.id));

  // When every remaining item is animating out, hide the summary with CSS so
  // the list height doesn't jump (EmptyState would add extra height alongside
  // the still-visible ul). The natural EmptyState appears once todos.length
  // reaches 0 via the early-return above.
  const summaryStyle: CSSProperties | undefined = allPendingDelete
    ? { visibility: 'hidden' }
    : undefined;

  return (
    <section className="todo-list" aria-label="Danh sách công việc">
      <p className="todo-list__summary" aria-live="polite" style={summaryStyle}>
        {done}/{todos.length} công việc hoàn thành
      </p>
      <ul className="todo-list__items" role="list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onStartDelete={handleStartDelete}
          />
        ))}
      </ul>
    </section>
  );
}
