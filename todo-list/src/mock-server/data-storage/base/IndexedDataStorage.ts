import { IDataStorage } from "./types";
import max from "lodash/max";

export class IndexedDataStorage<DATA extends { id: number }> implements IDataStorage<number, DATA> {
  readonly store: Map<number, DATA>;

  constructor() {
    this.store = new Map<number, DATA>();
  }

  getItem(id: number): DATA | null {
    return this.store.get(id) || null;
  }

  getAllItems(): DATA[] {
    return Array.from(this.store.values());
  }

  setItem(id: number, item: DATA): void {
    this.store.set(id, item);
  }

  deleteItem(id: number): void {
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

  getNextId(): number {
    const ids = Array.from(this.store.keys());
    const maxId = max(ids) || 0;
    const nextId = maxId + 1;
    return nextId;
  }
}
