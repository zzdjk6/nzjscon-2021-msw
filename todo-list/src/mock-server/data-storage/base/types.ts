export interface IDataStorage<KEY = number, DATA extends { id: KEY } = { id: KEY }> {
  readonly store: Map<KEY, DATA>;
  reset: () => void;
  getItem: (id: KEY) => DATA | null;
  getAllItems: () => DATA[];
  setItem: (id: KEY, item: DATA) => void;
  addItem: (item: Omit<DATA, "id">) => DATA;
  deleteItem: (id: KEY) => void;
  getNextId: () => KEY;
}
