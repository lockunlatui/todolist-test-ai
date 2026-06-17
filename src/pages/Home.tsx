import { useTodos } from '../hooks/useTodos';
import { AddTodo } from '../components/AddTodo';
import { TodoList } from '../components/TodoList';
import './Home.css';

export function Home() {
  const { todos, loading, addTodo, deleteTodo, toggleTodo } = useTodos();

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title"><span aria-hidden="true">📝</span> Todolist</h1>
        <p className="home__subtitle">Quản lý công việc hàng ngày của bạn</p>
      </header>

      <main className="home__main">
        <div className="home__add-section">
          <AddTodo onAdd={addTodo} />
        </div>

        <div className="home__list-section">
          {loading ? (
            <div className="home__loading" role="status" aria-label="Đang tải danh sách công việc">
              <span className="home__spinner" aria-hidden="true" />
              <span className="home__loading-text">Đang tải...</span>
            </div>
          ) : (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
        </div>
      </main>
    </div>
  );
}
