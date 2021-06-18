import { Todo } from "../models/Todo";
import get from "lodash/get";
import toInteger from "lodash/toInteger";
import toString from "lodash/toString";
import { TodoStatusFilter } from "../models/TodoStatusFilter";

export const todoApi = {
  fetchTodos: async (statusFilter: TodoStatusFilter) => {
    // TODO: API request
    const response = await fetch(`/api/todos?status=${statusFilter}`);
    if (!response.ok) {
      throw new Error("Fail to fetch todos");
    }

    const json = await response.json();
    const data = get(json, "data");

    if (!Array.isArray(data)) {
      throw new Error("Malformed response");
    }

    return data.map(parseTodo);
  },
  addTodo: async (description: string) => {
    // TODO: API request
    const response = await fetch(`/api/todos`, {
      method: "POST",
      body: JSON.stringify({
        description,
      }),
    });
    if (!response.ok) {
      throw new Error("Fail to add todo");
    }

    const json = await response.json();
    const data = get(json, "data");
    return parseTodo(data);
  },
  deleteTodo: async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fail to delete todo");
    }
  },
  markTodoCompleted: async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: true,
      }),
    });
    if (!response.ok) {
      throw new Error("Fail to mark todo completed");
    }

    const json = await response.json();
    const data = get(json, "data");
    return parseTodo(data);
  },
  markTodoInCompleted: async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Fail to mark todo incompleted");
    }

    const json = await response.json();
    const data = get(json, "data");
    return parseTodo(data);
  },
};

const parseTodo = (item: any) => {
  const todo: Todo = {
    id: toInteger(get(item, "id")),
    description: toString(get(item, "description")),
    completed: Boolean(get(item, "completed")),
    createAt: toString(get(item, "createAt")),
    updateAt: toString(get(item, "updateAt")),
  };

  return todo;
};
