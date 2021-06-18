import { Todo } from "../../../../models/Todo";
import { mockDB } from "../../../mockDB";

export type SerializedTodo = Todo & {
  assignees: Array<{
    userId: number;
    userName: string;
  }>;
};

export const serializeTodo = (todo: Todo): SerializedTodo => {
  const relations = mockDB.assignees.getItemsByTodoId(todo.id);
  return {
    ...todo,
    assignees: relations.map((relation) => {
      const user = mockDB.users.getItem(relation.userId)!;
      return {
        userId: user.id,
        userName: user.name,
      };
    }),
  };
};
