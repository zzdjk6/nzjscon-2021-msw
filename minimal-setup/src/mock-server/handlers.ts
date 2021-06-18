import { MockedRequest, ResponseResolver, rest, RestContext } from "msw";

const httpGetApiMeResolver: ResponseResolver<MockedRequest, RestContext> = (
  req,
  res,
  ctx
) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 1,
      name: "World",
    })
  );
};

// Handles a GET /api/me request
const httpGetApiMeHandler = rest.get("/api/me", httpGetApiMeResolver);

export const handlers = [httpGetApiMeHandler];
