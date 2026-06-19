import type { Todo, UpdateTodoInput } from '../types/todo'
import { TodoItem } from './TodoItem'

interface Props {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, input: UpdateTodoInput) => void
}

export function TodoList({ todos, onEdit, onDelete, onToggleStatus }: Props) {
  if (todos.length === 0) {
    return (
      <p className="empty-state" data-testid="empty-state">
        Chưa có todo nào. Hãy tạo mới!
      </p>
    )
  }

  return (
    <ul className="todo-list" aria-label="Danh sách todo">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ul>
  )
}
