import { MockedRequest, ResponseResolver, RestContext } from "msw";
import toInteger from "lodash/toInteger";
import { mockDB } from "../../../../mockDB";
import get from "lodash/get";

const resolver: ResponseResolver<MockedRequest, RestContext> = (req, res, ctx) => {
  const id = toInteger(get(req, "params.id"));

  if (id === 3) {
    return res(ctx.status(400));
  }

  const todo = mockDB.todos.getItem(id);

  if (!todo) {
    return res(ctx.status(404));
  }

  mockDB.todos.deleteItem(id);

  return res(ctx.status(204));
};

export default resolver;
