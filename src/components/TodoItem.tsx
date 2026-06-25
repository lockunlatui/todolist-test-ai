import type { Todo, UpdateTodoInput } from '../types/todo'

interface Props {
  todo: Todo
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, input: UpdateTodoInput) => void
}

export function TodoItem({ todo, onEdit, onDelete, onToggleStatus }: Props) {
  const isCompleted = todo.status === 'completed'

  const handleToggle = () => {
    onToggleStatus(todo.id, {
      status: isCompleted ? 'pending' : 'completed',
    })
  }

  return (
    <li
      className={`todo-item ${isCompleted ? 'todo-item--completed' : ''}`}
      data-testid="todo-item"
    >
      <div className="todo-item__check">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={isCompleted}
          onChange={handleToggle}
          aria-label={`Đánh dấu "${todo.title}" là ${isCompleted ? 'đang chờ' : 'hoàn thành'}`}
        />
      </div>

      <div className="todo-item__body">
        <label
          htmlFor={`todo-check-${todo.id}`}
          className="todo-item__title"
        >
          {todo.title}
        </label>
        {todo.description && (
          <p className="todo-item__description">{todo.description}</p>
        )}
        <span className={`todo-item__badge todo-item__badge--${todo.status}`}>
          {isCompleted ? 'Hoàn thành' : 'Đang chờ'}
        </span>
      </div>

      <div className="todo-item__actions">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(todo)}
          aria-label={`Sửa "${todo.title}"`}
        >
          Sửa
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`Xóa "${todo.title}"`}
        >
          Xóa
        </button>
      </div>
    </li>
  )
}
