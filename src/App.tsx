import { useState } from 'react'
import type { Todo } from './types/todo'
import { useTodos } from './hooks/useTodos'
import { CreateTodoForm } from './components/CreateTodoForm'
import { TodoList } from './components/TodoList'
import { EditTodoModal } from './components/EditTodoModal'
import './App.css'

export function App() {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodos()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa todo này không?')) {
      deleteTodo(id)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todolist</h1>
      </header>

      <main className="app-main">
        <section className="app-create-section" aria-label="Tạo todo">
          <CreateTodoForm onSubmit={createTodo} />
        </section>

        <section className="app-list-section" aria-label="Danh sách todo">
          <h2>Danh Sách Todo ({todos.length})</h2>
          <TodoList
            todos={todos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={updateTodo}
          />
        </section>
      </main>

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onSave={updateTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  )
}
