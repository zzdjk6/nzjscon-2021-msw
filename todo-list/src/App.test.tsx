import { render, screen, within } from "@testing-library/react";
import App from "./App";
import { waitFor } from "./test-utils/waitFor";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import React from "react";
import { mockServer } from "./mock-server/mockServer.node";

// Constants and Helpers
const TODO_1_TEXT = "TODO1: Active";
const TODO_2_TEXT = "TODO2: Completed";
const TODO_3_TEXT = "TODO3: Can't delete";

const getTodoItems = () => screen.getAllByTestId("TodoItem");

const queryTodoItems = () => screen.queryAllByTestId("TodoItem");

const renderApp = async () => {
  const renderResult = render(<App />);
  await waitFor(() => {
    expect(getTodoItems()).toHaveLength(3);
  });
  return renderResult;
};

describe("Fetch and display todo items", () => {
  it("should fetch and display all todo items", async () => {
    // Init
    await renderApp();

    // Assert items with correct texts and order
    const todoItems = getTodoItems();
    expect(within(todoItems[0]).getByText(TODO_1_TEXT)).toBeInTheDocument();
    expect(within(todoItems[1]).getByText(TODO_2_TEXT)).toBeInTheDocument();
    expect(within(todoItems[2]).getByText(TODO_3_TEXT)).toBeInTheDocument();
  });

  it("should fetch and display active todo items", async () => {
    await renderApp();

    // Change to tab "active"
    const tabActive = screen.getByRole("tab", { name: /active/i });
    userEvent.click(tabActive);

    // Assert active items
    await waitFor(() => {
      expect(within(getTodoItems()[0]).getByText(TODO_1_TEXT)).toBeInTheDocument();
    });
    expect(screen.getByText(TODO_1_TEXT)).toBeInTheDocument();
  });

  it("should fetch and display completed todo items", async () => {
    await renderApp();

    // Change to tab "completed"
    const completed = screen.getByRole("tab", { name: /completed/i });
    userEvent.click(completed);

    // Assert completed items
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });
    expect(screen.getByText(TODO_2_TEXT)).toBeInTheDocument();
  });
});

describe("Delete todo item", () => {
  it("can delete active todo item", async () => {
    // Init
    await renderApp();

    // Get an active item
    const todoItem = getTodoItems()[0];
    expect(within(todoItem).getByText(TODO_1_TEXT)).toBeInTheDocument();

    // Click delete button
    const deleteButton = within(todoItem).getByRole("button", {
      name: /delete/i,
    });
    userEvent.click(deleteButton);

    // Assert the active item disappear
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });
    expect(screen.queryByText(TODO_1_TEXT)).not.toBeInTheDocument();
  });

  it("can delete completed todo item", async () => {
    // Init
    await renderApp();

    // Get a completed item
    const todoItem = getTodoItems()[1];
    expect(within(todoItem).getByText(TODO_2_TEXT)).toBeInTheDocument();

    // Click delete button
    const deleteButton = within(todoItem).getByRole("button", {
      name: /delete/i,
    });
    userEvent.click(deleteButton);

    // Assert the completed item disappear
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });
    expect(screen.queryByText(TODO_2_TEXT)).not.toBeInTheDocument();
  });

  it("should show error message when fail to delete todo item", async () => {
    // Init
    await renderApp();

    // Get a completed item
    const todoItem = getTodoItems()[1];
    expect(within(todoItem).getByText(TODO_2_TEXT)).toBeInTheDocument();

    // Temporarily force delete api to return error
    mockServer.use(
      rest.delete("/api/todos/:id", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    // Click delete button
    const deleteButton = within(todoItem).getByRole("button", {
      name: /delete/i,
    });
    userEvent.click(deleteButton);

    // Expect error message displays
    await waitFor(() => {
      expect(screen.queryByText(/Fail to delete/i)).toBeInTheDocument();
    });

    // Assert the item is still there
    expect(screen.queryByText(TODO_2_TEXT)).toBeInTheDocument();
  });
});

describe("Add todo item", () => {
  it("can add todo item in tab ALL", async () => {
    // Init
    await renderApp();

    // Create a new item
    const input = screen.getByLabelText("Add todo...");
    await userEvent.type(input, "TODO4: XXX{enter}");

    // Assert new item
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(4);
    });
    expect(screen.getByText("TODO4: XXX")).toBeInTheDocument();
  });

  it("can add todo item in tab Active", async () => {
    // Init
    await renderApp();

    // Change to tab "active"
    userEvent.click(screen.getByRole("tab", { name: /active/i }));
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(1);
    });

    // Create a new item
    const input = screen.getByLabelText("Add todo...");
    await userEvent.type(input, "TODO4: XXX{enter}");

    // Assert the new item
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });
    expect(screen.getByText("TODO4: XXX")).toBeInTheDocument();
  });

  it("cannot add todo item in tab Completed", async () => {
    // Init
    await renderApp();

    // Change to tab "completed"
    userEvent.click(screen.getByRole("tab", { name: /completed/i }));
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });

    // Assert no input to create item
    const input = screen.queryByLabelText("Add todo...");
    expect(input).not.toBeInTheDocument();
  });
});

describe("Change status of todo item", () => {
  it("can mark active item as completed", async () => {
    // Init
    await renderApp();

    // Get an active item
    const checkBox = within(getTodoItems()[0]).getByRole("checkbox");
    expect(checkBox).not.toBeChecked();

    // Mark active item as completed
    userEvent.click(checkBox);
    await waitFor(() => {
      expect(checkBox).toBeChecked();
    });

    // Assert no active items in tab "active"
    userEvent.click(screen.getByRole("tab", { name: /active/i }));
    await waitFor(() => {
      expect(queryTodoItems()).toHaveLength(0);
    });

    // Assert 3 completed items in tab "completed"
    userEvent.click(screen.getByRole("tab", { name: /completed/i }));
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(3);
    });
  });

  it("can mark completed item as active", async () => {
    // Init
    await renderApp();

    // Get a completed item
    const checkBox = within(getTodoItems()[1]).getByRole("checkbox");
    expect(checkBox).toBeChecked();

    // Mark completed item as active
    userEvent.click(checkBox);
    await waitFor(() => {
      expect(checkBox).not.toBeChecked();
    });

    // Assert 2 active items in tab "active"
    userEvent.click(screen.getByRole("tab", { name: /active/i }));
    await waitFor(() => {
      expect(getTodoItems()).toHaveLength(2);
    });

    // Assert no completed items in tab "completed"
    userEvent.click(screen.getByRole("tab", { name: /completed/i }));
    await waitFor(() => {
      expect(queryTodoItems()).toHaveLength(0);
    });
  });
});
