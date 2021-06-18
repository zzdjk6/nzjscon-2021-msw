import { Todo } from "../models/Todo";
import { useEffect, useState } from "react";
import { todoApi } from "../api/todo";
import { compareDesc } from "date-fns";
import { TodoStatusFilter } from "../models/TodoStatusFilter";

export const useTodos = (statusFilter: TodoStatusFilter) => {
  const [fetchedTodos, setFetchedTodos] = useState<Todo[]>([]);

  const [error, setError] = useState<string | null>(null);

  const addTodo = async (description: string) => {
    try {
      const newTodo = await todoApi.addTodo(description);
      setFetchedTodos((prevState) => {
        return [...prevState, newTodo];
      });
    } catch (e) {
      setError("Fail to add todo");
      console.error(e);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setFetchedTodos((prevState) => {
        return prevState.filter((todo) => todo.id !== id);
      });
    } catch (e) {
      setError("Fail to delete todo");
      console.error(e);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todo = fetchedTodos.find((todo) => todo.id === id);

      if (!todo) {
        return;
      }

      let updatedTodo: Todo;

      if (todo.completed) {
        updatedTodo = await todoApi.markTodoInCompleted(id);
      } else {
        updatedTodo = await todoApi.markTodoCompleted(id);
      }

      setFetchedTodos((prevState) => {
        return prevState.map((todo) => {
          if (todo.id !== id) {
            return todo;
          }

          return updatedTodo;
        });
      });
    } catch (e) {
      setError("Fail to update todo");
      console.error(e);
    }
  };

  useEffect(() => {
    todoApi.fetchTodos(statusFilter).then(setFetchedTodos);
  }, [statusFilter]);

  const todos = fetchedTodos
    .filter((todo) => {
      switch (statusFilter) {
        case TodoStatusFilter.All:
          return true;
        case TodoStatusFilter.Active:
          return !todo.completed;
        case TodoStatusFilter.Completed:
          return todo.completed;
        default:
          return false;
      }
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        const weightA = a.completed ? 1 : 0;
        const weightB = b.completed ? 1 : 0;
        return weightA - weightB;
      }

      const dateA = new Date(a.updateAt);
      const dateB = new Date(b.updateAt);
      return compareDesc(dateA, dateB);
    });

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    error,
    setError,
  };
};
