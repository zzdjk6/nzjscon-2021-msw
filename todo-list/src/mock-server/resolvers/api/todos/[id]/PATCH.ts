import { MockedRequest, ResponseResolver, RestContext } from "msw";
import toInteger from "lodash/toInteger";
import { mockDB } from "../../../../mockDB";
import has from "lodash/has";
import { Todo } from "../../../../../models/Todo";
import get from "lodash/get";
import { serializeTodo } from "../utils";

const resolver: ResponseResolver<MockedRequest<string>, RestContext> = (req, res, ctx) => {
  const id = toInteger(get(req, "params.id"));
  const todo = mockDB.todos.getItem(id);

  if (!todo) {
    return res(ctx.status(404));
  }

  const bodyJson = JSON.parse(req.body);

  if (!has(bodyJson, "completed")) {
    return res(
      ctx.status(400),
      ctx.json({
        message: "invalid payload",
      })
    );
  }

  const updatedTodo: Todo = {
    ...todo,
    completed: Boolean(get(bodyJson, "completed")),
    updateAt: new Date().toISOString(),
  };
  mockDB.todos.setItem(id, updatedTodo);

  return res(
    ctx.status(200),
    ctx.json({
      data: serializeTodo(updatedTodo),
    })
  );
};

export default resolver;
