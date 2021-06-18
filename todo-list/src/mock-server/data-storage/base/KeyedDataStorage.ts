import { IDataStorage } from "./types";
import { nanoid } from "nanoid";

export class KeyedDataStorage<DATA extends { id: string }> implements IDataStorage<string, DATA> {
  readonly store: Map<string, DATA>;

  constructor() {
    this.store = new Map<string, DATA>();
  }

  getItem(id: string): DATA | null {
    return this.store.get(id) || null;
  }

  getAllItems(): DATA[] {
    return Array.from(this.store.values());
  }

  setItem(id: string, item: DATA): void {
    this.store.set(id, item);
  }

  deleteItem(id: string): void {
    this.store.delete(id);
  }

  reset(): void {
    this.store.clear();
  }

  addItem(item: Omit<DATA, "id">): DATA {
    const id = this.getNextId();
    const newItem: DATA = {
      ...item,
      id,
    } as any;
    this.setItem(id, newItem);
    return newItem;
  }

  getNextId(): string {
    return nanoid();
  }
}
