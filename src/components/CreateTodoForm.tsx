import { useState, type FormEvent } from 'react'
import type { CreateTodoInput } from '../types/todo'

interface Props {
  onSubmit: (input: CreateTodoInput) => void
}

export function CreateTodoForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tiêu đề không được để trống')
      return
    }
    onSubmit({ title, description: description || undefined })
    setTitle('')
    setDescription('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="create-todo-form" aria-label="Tạo todo mới">
      <h2>Tạo Todo Mới</h2>

      <div className="form-group">
        <label htmlFor="todo-title">
          Tiêu đề <span aria-hidden="true">*</span>
        </label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          placeholder="Nhập tiêu đề todo..."
          aria-required="true"
          aria-describedby={error ? 'title-error' : undefined}
        />
        {error && (
          <span id="title-error" className="field-error" role="alert">
            {error}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="todo-description">Mô tả (tùy chọn)</label>
        <textarea
          id="todo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả..."
          rows={3}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Tạo mới
      </button>
    </form>
  )
}
