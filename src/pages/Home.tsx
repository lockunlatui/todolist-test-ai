import { useTodos } from '../hooks/useTodos';
import { AddTodo } from '../components/AddTodo';
import { TodoList } from '../components/TodoList';
import './Home.css';

export function Home() {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">📝 Todolist</h1>
        <p className="home__subtitle">Quản lý công việc hàng ngày của bạn</p>
      </header>

      <main className="home__main">
        <div className="home__add-section">
          <AddTodo onAdd={addTodo} />
        </div>

        <div className="home__list-section">
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </main>
    </div>
  );
}
