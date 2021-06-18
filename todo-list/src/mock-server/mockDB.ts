import { TodoDataStorage } from "./data-storage/TodoDataStorage";
import { UserDataStorage } from "./data-storage/UserDataStorage";
import { AssigneeDataStorage } from "./data-storage/AssigneeDataStorage";

const todos = new TodoDataStorage();
const users = new UserDataStorage();
const assignees = new AssigneeDataStorage({
  todos,
  users,
});

export const mockDB = {
  todos,
  users,
  assignees,
};

export const resetMockDB = () => {
  Object.values(mockDB).forEach((dataStorage) => dataStorage.reset());
};

// @ts-ignore
window.mockDB = mockDB;
