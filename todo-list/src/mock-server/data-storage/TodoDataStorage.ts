import { Todo } from "../../models/Todo";
import { IndexedDataStorage } from "./base/IndexedDataStorage";

export class TodoDataStorage extends IndexedDataStorage<Todo> {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();

    // Reload fixtures
    this.addItem({
      description: "TODO1: Active",
      completed: false,
      createAt: "2021-01-09T04:42:56.912Z",
      updateAt: "2021-01-09T04:42:56.912Z",
    });

    this.addItem({
      description: "TODO2: Completed",
      completed: true,
      createAt: "2021-01-09T04:43:25.994Z",
      updateAt: "2021-01-09T04:43:25.994Z",
    });

    this.addItem({
      description: "TODO3: Can't delete",
      completed: true,
      createAt: "2021-01-09T04:43:25.994Z",
      updateAt: "2021-01-09T04:43:25.994Z",
    });
  }
}
