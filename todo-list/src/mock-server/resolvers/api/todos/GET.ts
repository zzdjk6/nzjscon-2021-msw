import { MockedRequest, ResponseResolver, RestContext } from "msw";
import { mockDB } from "../../../mockDB";
import { serializeTodo } from "./utils";

const resolver: ResponseResolver<MockedRequest, RestContext> = (req, res, ctx) => {
  const statusFilter = req.url.searchParams.get("status") || "all";

  const todos = mockDB.todos.getAllItems();

  const data = todos
    .filter((todo) => {
      switch (statusFilter) {
        case "active":
          return !todo.completed;
        case "completed":
          return todo.completed;
        default:
          return true;
      }
    })
    .map(serializeTodo);

  const json = {
    data,
  };

  return res(ctx.status(200), ctx.json(json));
};

export default resolver;
