"use client";

import { useState, type FormEvent } from "react";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, title: string) => { error?: string };
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [error, setError] = useState("");

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = onUpdate(todo.id, editTitle);
    if (result.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
      setError("");
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setError("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex flex-col gap-1 border border-gray-200 rounded p-3">
        <form onSubmit={handleEditSubmit} className="flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (error) setError("");
            }}
            aria-label="Chỉnh sửa tiêu đề todo"
            className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors text-sm"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded transition-colors text-sm"
          >
            Hủy
          </button>
        </form>
        {error && (
          <p role="alert" className="text-red-500 text-sm">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between border border-gray-200 rounded p-3">
      <span className="flex-1 text-gray-800">{todo.title}</span>
      <div className="flex gap-2 ml-2">
        <button
          onClick={() => {
            setEditTitle(todo.title);
            setIsEditing(true);
          }}
          aria-label={`Chỉnh sửa: ${todo.title}`}
          className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          aria-label={`Xóa: ${todo.title}`}
          className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
        >
          Xóa
        </button>
      </div>
    </li>
  );
}
