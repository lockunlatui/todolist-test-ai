import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "@/components/TodoForm";

describe("TodoForm", () => {
  it("renders input and submit button", () => {
    render(<TodoForm onAdd={() => ({})} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /thêm/i })).toBeInTheDocument();
  });

  it("calls onAdd with the typed title on submit", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue({});
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "Buy milk");
    await user.click(screen.getByRole("button", { name: /thêm/i }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("clears input after successful add", async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={() => ({})} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Some task");
    await user.click(screen.getByRole("button", { name: /thêm/i }));

    expect(input).toHaveValue("");
  });

  it("shows error message when onAdd returns an error", async () => {
    const user = userEvent.setup();
    const onAdd = jest
      .fn()
      .mockReturnValue({ error: "Tiêu đề không được để trống" });
    render(<TodoForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: /thêm/i }));

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Tiêu đề không được để trống");
  });

  it("does not clear input when onAdd returns an error", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue({ error: "Error" });
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByRole("textbox");
    // Click submit with empty field (error case)
    await user.click(screen.getByRole("button", { name: /thêm/i }));

    expect(input).toHaveValue("");
    // error is shown
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    const onAdd = jest
      .fn()
      .mockReturnValueOnce({ error: "Error" })
      .mockReturnValue({});
    render(<TodoForm onAdd={onAdd} />);

    // Trigger error
    await user.click(screen.getByRole("button", { name: /thêm/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Start typing — error should clear
    await user.type(screen.getByRole("textbox"), "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("submits on Enter key press", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockReturnValue({});
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "Task via enter{enter}");
    expect(onAdd).toHaveBeenCalledWith("Task via enter");
  });
});
