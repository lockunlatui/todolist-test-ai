import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TodoList from "@/components/TodoList";
import type { Todo } from "@/types/todo";

const makeTodo = (id: string, title: string): Todo => ({
  id,
  title,
  createdAt: 1000,
  updatedAt: 1000,
});

describe("TodoList", () => {
  it("shows empty state message when no todos", () => {
    render(
      <TodoList todos={[]} onUpdate={() => ({})} onDelete={() => {}} />
    );
    expect(screen.getByText(/chưa có todo nào/i)).toBeInTheDocument();
  });

  it("renders all todo items", () => {
    const todos = [
      makeTodo("1", "First task"),
      makeTodo("2", "Second task"),
      makeTodo("3", "Third task"),
    ];
    render(
      <TodoList todos={todos} onUpdate={() => ({})} onDelete={() => {}} />
    );

    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
    expect(screen.getByText("Third task")).toBeInTheDocument();
  });

  it("does not show empty state when todos exist", () => {
    const todos = [makeTodo("1", "Task")];
    render(
      <TodoList todos={todos} onUpdate={() => ({})} onDelete={() => {}} />
    );
    expect(screen.queryByText(/chưa có todo nào/i)).not.toBeInTheDocument();
  });
});
