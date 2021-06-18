import { IndexedDataStorage } from "./base/IndexedDataStorage";
import { Assignee } from "../../models/Assignee";
import { TodoDataStorage } from "./TodoDataStorage";
import { UserDataStorage } from "./UserDataStorage";

export class AssigneeDataStorage extends IndexedDataStorage<Assignee> {
  private todos: TodoDataStorage;
  private users: UserDataStorage;

  constructor({ todos, users }: { todos: TodoDataStorage; users: UserDataStorage }) {
    super();
    this.todos = todos;
    this.users = users;

    this.reset();
  }

  reset() {
    super.reset();

    // Reload fixtures
    this.addItem({
      todoId: 1,
      userId: this.users.getItemByName("A")!.id,
    });
    this.addItem({
      todoId: 1,
      userId: this.users.getItemByName("B")!.id,
    });
  }

  getItemsByTodoId(todoId: number) {
    return this.getAllItems().filter((item) => item.todoId === todoId);
  }
}
