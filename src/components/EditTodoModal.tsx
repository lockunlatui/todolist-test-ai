import { useState, useEffect, type FormEvent } from 'react'
import type { Todo, UpdateTodoInput } from '../types/todo'

interface Props {
  todo: Todo
  onSave: (id: string, input: UpdateTodoInput) => void
  onClose: () => void
}

export function EditTodoModal({ todo, onSave, onClose }: Props) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description ?? '')
  const [status, setStatus] = useState(todo.status)
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(todo.title)
    setDescription(todo.description ?? '')
    setStatus(todo.status)
    setError('')
  }, [todo])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tiêu đề không được để trống')
      return
    }
    onSave(todo.id, { title, description: description || undefined, status })
    onClose()
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Chỉnh sửa todo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-content">
        <h2>Chỉnh Sửa Todo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-todo-title">
              Tiêu đề <span aria-hidden="true">*</span>
            </label>
            <input
              id="edit-todo-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              aria-required="true"
              aria-describedby={error ? 'edit-title-error' : undefined}
            />
            {error && (
              <span id="edit-title-error" className="field-error" role="alert">
                {error}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-todo-description">Mô tả (tùy chọn)</label>
            <textarea
              id="edit-todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-todo-status">Trạng thái</label>
            <select
              id="edit-todo-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'pending' | 'completed')
              }
            >
              <option value="pending">Đang chờ</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
