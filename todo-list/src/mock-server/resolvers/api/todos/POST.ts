import { MockedRequest, ResponseResolver, RestContext } from "msw";
import get from "lodash/get";
import { mockDB } from "../../../mockDB";
import { serializeTodo } from "./utils";

const resolver: ResponseResolver<MockedRequest<string>, RestContext> = (req, res, ctx) => {
  const description = get(JSON.parse(req.body), "description") || "";

  if (!description) {
    return res(
      ctx.status(400),
      ctx.json({
        message: "description cannot be empty",
      })
    );
  }

  const newTodo = mockDB.todos.addItem({
    completed: false,
    description,
    createAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
  });

  return res(
    ctx.status(201),
    ctx.json({
      data: serializeTodo(newTodo),
    })
  );
};

export default resolver;
