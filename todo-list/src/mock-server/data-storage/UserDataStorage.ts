import { IndexedDataStorage } from "./base/IndexedDataStorage";
import { User } from "../../models/User";

export class UserDataStorage extends IndexedDataStorage<User> {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();

    // Reload fixtures
    this.addItem({ name: "A" });
    this.addItem({ name: "B" });
    this.addItem({ name: "C" });
  }

  getItemByName(name: string) {
    return this.getAllItems().find((item) => item.name === name) || null;
  }
}
