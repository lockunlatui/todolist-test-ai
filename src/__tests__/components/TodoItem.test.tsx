import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "test-id-1",
  title: "Test todo",
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
});

describe("TodoItem", () => {
  it("displays the todo title", () => {
    render(
      <TodoItem
        todo={makeTodo({ title: "My task" })}
        onUpdate={() => ({})}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText("My task")).toBeInTheDocument();
  });

  it("shows edit and delete buttons", () => {
    render(
      <TodoItem
        todo={makeTodo()}
        onUpdate={() => ({})}
        onDelete={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /sửa/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /xóa/i })).toBeInTheDocument();
  });

  it("calls onDelete with todo id when delete clicked", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    const todo = makeTodo({ id: "abc-123" });
    render(<TodoItem todo={todo} onUpdate={() => ({})} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /xóa/i }));
    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });

  it("switches to edit mode when edit button clicked", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={makeTodo({ title: "Original" })}
        onUpdate={() => ({})}
        onDelete={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /sửa/i }));

    expect(
      screen.getByRole("textbox", { name: /chỉnh sửa tiêu đề todo/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lưu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hủy/i })).toBeInTheDocument();
  });

  it("pre-fills edit input with current title", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={makeTodo({ title: "Existing title" })}
        onUpdate={() => ({})}
        onDelete={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /sửa/i }));

    expect(
      screen.getByRole("textbox", { name: /chỉnh sửa tiêu đề todo/i })
    ).toHaveValue("Existing title");
  });

  it("calls onUpdate and exits edit mode on save", async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn().mockReturnValue({});
    const todo = makeTodo({ id: "xyz", title: "Old" });
    render(<TodoItem todo={todo} onUpdate={onUpdate} onDelete={() => {}} />);

    await user.click(screen.getByRole("button", { name: /sửa/i }));
    const input = screen.getByRole("textbox", {
      name: /chỉnh sửa tiêu đề todo/i,
    });
    await user.clear(input);
    await user.type(input, "New title");
    await user.click(screen.getByRole("button", { name: /lưu/i }));

    expect(onUpdate).toHaveBeenCalledWith("xyz", "New title");
    // Should exit edit mode
    expect(
      screen.queryByRole("button", { name: /lưu/i })
    ).not.toBeInTheDocument();
  });

  it("shows error message when onUpdate returns error", async () => {
    const user = userEvent.setup();
    const onUpdate = jest
      .fn()
      .mockReturnValue({ error: "Tiêu đề không được để trống" });
    render(
      <TodoItem
        todo={makeTodo()}
        onUpdate={onUpdate}
        onDelete={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /sửa/i }));
    const input = screen.getByRole("textbox", {
      name: /chỉnh sửa tiêu đề todo/i,
    });
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: /lưu/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Tiêu đề không được để trống"
    );
  });

  it("cancels edit and restores original title", async () => {
    const user = userEvent.setup();
    render(
      <TodoItem
        todo={makeTodo({ title: "Original" })}
        onUpdate={() => ({})}
        onDelete={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /sửa/i }));
    const input = screen.getByRole("textbox", {
      name: /chỉnh sửa tiêu đề todo/i,
    });
    await user.clear(input);
    await user.type(input, "Changed");
    await user.click(screen.getByRole("button", { name: /hủy/i }));

    // Should show original title and exit edit mode
    expect(screen.getByText("Original")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /lưu/i })
    ).not.toBeInTheDocument();
  });
});
