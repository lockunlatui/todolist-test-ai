"use client";

import { useState, type FormEvent } from "react";

interface TodoFormProps {
  onAdd: (title: string) => { error?: string };
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = onAdd(title);
    if (result.error) {
      setError(result.error);
    } else {
      setTitle("");
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          placeholder="Nhập tiêu đề todo..."
          aria-label="Tiêu đề todo"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Thêm
        </button>
      </div>
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </form>
  );
}
