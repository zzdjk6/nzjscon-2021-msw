import { rest } from "msw";

// Polyfill require.context on node.js, refer: https://github.com/facebook/create-react-app/issues/517#issuecomment-417943099
if (process.env.NODE_ENV === "test") {
  const fs = require("fs");
  // Unify file path format on different OS
  const upath = require("upath");

  // @ts-ignore
  require.context = (base = ".", scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = {};

    function readDirectory(directory: any) {
      fs.readdirSync(directory).forEach((file: any) => {
        const fullPath = upath.resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) {
            readDirectory(fullPath);
          }

          return;
        }

        if (!regularExpression.test(fullPath)) {
          return;
        }

        // @ts-ignore
        files[fullPath] = true;
      });
    }

    const basePath = upath.resolve(__dirname, base);
    readDirectory(basePath);

    function Module(file: string) {
      return require(file.replace("./", `${basePath}/`));
    }

    // @ts-ignore
    Module.keys = () => Object.keys(files).map((str) => str.replace(basePath, "."));
    return Module;
  };
}

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const getHandlerFactory = (httpMethod: HTTPMethod) => {
  const mapping = {
    [HTTPMethod.GET]: rest.get,
    [HTTPMethod.POST]: rest.post,
    [HTTPMethod.PUT]: rest.put,
    [HTTPMethod.PATCH]: rest.patch,
    [HTTPMethod.DELETE]: rest.delete,
  };

  return mapping[httpMethod];
};

/**
 * Detect API Path by import path
 * @param importPath (e.g., ./todos/[id]/GET.ts)
 * @return string (e.g., /todos/:id)
 */
const detectAPIPath = (importPath: string): string => {
  const path = importPath
    .split("/")
    .slice(1, -1)
    .join("/")
    .replace(/\[(\w+)\]/gi, ":$1");
  const apiPath = `/${path}`;
  return apiPath;
};

/**
 * Detect HTTP method by import path
 * @param importPath (e.g., ./authorities/detection/GET.ts)
 * @return string (e.g., GET)
 */
const detectHTTPMethod = (importPath: string): HTTPMethod => {
  const str = importPath.split("/").slice(-1).join("/").replace(".ts", "").toUpperCase();
  const availableHttpMethods = [HTTPMethod.GET, HTTPMethod.POST, HTTPMethod.PUT, HTTPMethod.PATCH, HTTPMethod.DELETE];
  for (const httpMethod of availableHttpMethods) {
    if (httpMethod === str) {
      return httpMethod;
    }
  }

  return HTTPMethod.GET;
};

/**
 * Convert object to json string
 * @param obj
 * @return string
 */
export const objectToJSONString = (obj: any): string => {
  const jsonStr = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "function") {
        return value.toString().slice(0, 128) + "...";
      }
      return value;
    },
    2
  );
  return jsonStr;
};

const resolveHandlers = () => {
  const resolvedHandlers: Array<any> = [];

  const req = require.context("./resolvers", true, /(GET|POST|PUT|PATCH|DELETE)\.ts$/);
  const importPaths = req.keys();
  for (const importPath of importPaths) {
    const resolver = req(importPath).default;
    const apiPath = detectAPIPath(importPath);
    const httpMethod = detectHTTPMethod(importPath);
    const handlerFactory = getHandlerFactory(httpMethod);

    console.log(
      "resolveHandlers:",
      objectToJSONString({
        importPath,
        apiPath,
        httpMethod,
        resolver,
      })
    );

    resolvedHandlers.push(handlerFactory(apiPath, resolver));
  }

  return resolvedHandlers;
};

export const handlers = resolveHandlers();
