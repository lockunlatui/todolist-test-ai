"use client";

import { useTodos } from "@/hooks/useTodos";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function Home() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📝 Todolist
      </h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onUpdate={updateTodo} onDelete={deleteTodo} />
    </main>
  );
}
