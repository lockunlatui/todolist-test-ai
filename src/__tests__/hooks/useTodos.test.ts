import { renderHook, act } from "@testing-library/react";
import { useTodos } from "@/hooks/useTodos";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
});

describe("useTodos", () => {
  describe("addTodo", () => {
    it("adds a todo with a valid title", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Buy groceries");
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe("Buy groceries");
    });

    it("trims whitespace from title before adding", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("  Trimmed title  ");
      });

      expect(result.current.todos[0].title).toBe("Trimmed title");
    });

    it("returns error when title is empty", () => {
      const { result } = renderHook(() => useTodos());
      let response: { error?: string } = {};

      act(() => {
        response = result.current.addTodo("");
      });

      expect(response.error).toBeDefined();
      expect(result.current.todos).toHaveLength(0);
    });

    it("returns error when title is only whitespace", () => {
      const { result } = renderHook(() => useTodos());
      let response: { error?: string } = {};

      act(() => {
        response = result.current.addTodo("   ");
      });

      expect(response.error).toBeDefined();
      expect(result.current.todos).toHaveLength(0);
    });

    it("returns no error on successful add", () => {
      const { result } = renderHook(() => useTodos());
      let response: { error?: string } = { error: "initial" };

      act(() => {
        response = result.current.addTodo("Valid title");
      });

      expect(response.error).toBeUndefined();
    });

    it("assigns unique ids to each todo", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("First");
      });
      act(() => {
        result.current.addTodo("Second");
      });

      const ids = result.current.todos.map((t) => t.id);
      expect(new Set(ids).size).toBe(2);
    });
  });

  describe("updateTodo", () => {
    it("updates the title of an existing todo", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Original title");
      });

      const id = result.current.todos[0].id;

      act(() => {
        result.current.updateTodo(id, "Updated title");
      });

      expect(result.current.todos[0].title).toBe("Updated title");
    });

    it("returns error when update title is empty", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Original");
      });

      const id = result.current.todos[0].id;
      let response: { error?: string } = {};

      act(() => {
        response = result.current.updateTodo(id, "");
      });

      expect(response.error).toBeDefined();
      expect(result.current.todos[0].title).toBe("Original");
    });

    it("returns no error on successful update", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Original");
      });

      const id = result.current.todos[0].id;
      let response: { error?: string } = { error: "initial" };

      act(() => {
        response = result.current.updateTodo(id, "New title");
      });

      expect(response.error).toBeUndefined();
    });
  });

  describe("deleteTodo", () => {
    it("removes a todo by id", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("To delete");
      });
      act(() => {
        result.current.addTodo("To keep");
      });

      const idToDelete = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(idToDelete);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe("To keep");
    });

    it("does nothing when id does not exist", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Existing");
      });

      act(() => {
        result.current.deleteTodo("nonexistent-id");
      });

      expect(result.current.todos).toHaveLength(1);
    });
  });

  describe("persistence", () => {
    it("persists todos to localStorage on add", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Persisted todo");
      });

      const stored = localStorageMock.getItem("todos_v1");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe("Persisted todo");
    });

    it("loads todos from localStorage on mount", () => {
      // Pre-seed localStorage
      const existing = [
        {
          id: "seed-1",
          title: "Seeded todo",
          createdAt: 1000,
          updatedAt: 1000,
        },
      ];
      localStorageMock.setItem("todos_v1", JSON.stringify(existing));

      const { result } = renderHook(() => useTodos());

      // After the useEffect, todos should be loaded
      act(() => {
        // trigger re-render cycle
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe("Seeded todo");
    });

    it("persists todos to localStorage on delete", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo("Todo A");
      });
      act(() => {
        result.current.addTodo("Todo B");
      });

      const idToDelete = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(idToDelete);
      });

      const stored = JSON.parse(localStorageMock.getItem("todos_v1")!);
      expect(stored).toHaveLength(1);
    });
  });
});
