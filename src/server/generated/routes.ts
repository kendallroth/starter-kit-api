/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {
  Controller,
  FieldErrors,
  HttpStatusCodeLiteral,
  TsoaResponse,
  TsoaRoute,
  ValidateError,
  ValidationService,
  fetchMiddlewares,
} from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AccountController } from "./../resources/account/account.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from "./../resources/auth/auth.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TodoController } from "./../resources/todo/todo.controller";
import { expressAuthentication } from "./../server/authentication";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ServerController } from "./../server/server.controller";
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require("promise.any");
import type { RequestHandler, Router } from "express";

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  Timestamp: {
    dataType: "refAlias",
    type: { dataType: "string", validators: {} },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UUID: {
    dataType: "refAlias",
    type: {
      dataType: "string",
      validators: {
        pattern: {
          value:
            "[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}",
        },
      },
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AccountResponse: {
    dataType: "refObject",
    properties: {
      email: { dataType: "string", required: true },
      name: { dataType: "string", required: true },
      verifiedAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
      id: { ref: "UUID", required: true },
      createdAt: { ref: "Timestamp", required: true },
      updatedAt: { ref: "Timestamp" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AuthenticationResponse: {
    dataType: "refObject",
    properties: {
      account: { ref: "AccountResponse", required: true },
      accessToken: { dataType: "string", required: true },
      refreshToken: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UnauthorizedErrorResponse: {
    dataType: "refObject",
    properties: {
      message: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AccountLoginBody: {
    dataType: "refObject",
    properties: {
      email: { dataType: "string", required: true },
      password: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ClientErrorResponse: {
    dataType: "refObject",
    properties: {
      message: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TokenRefreshBody: {
    dataType: "refObject",
    properties: {
      refreshToken: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TodoEntity: {
    dataType: "refObject",
    properties: {
      id: { ref: "UUID", required: true },
      createdAt: { ref: "Timestamp", required: true },
      updatedAt: { ref: "Timestamp" },
      accountId: { ref: "UUID", required: true },
      text: { dataType: "string", required: true },
      description: {
        dataType: "union",
        subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
      },
      dueAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
      completedAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
      starredAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Pagination: {
    dataType: "refObject",
    properties: {
      page: { dataType: "double", required: true },
      size: { dataType: "double", required: true },
      totalItems: { dataType: "double", required: true },
      totalPages: { dataType: "double", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PaginatedResult_TodoEntity_: {
    dataType: "refObject",
    properties: {
      data: {
        dataType: "array",
        array: { dataType: "refObject", ref: "TodoEntity" },
        required: true,
      },
      pagination: { ref: "Pagination", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PaginationQuery: {
    dataType: "refObject",
    properties: {
      size: { dataType: "integer", validators: { minimum: { value: 1 } } },
      page: { dataType: "integer", validators: { minimum: { value: 1 } } },
      sort: { dataType: "string" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TodoStatsResponse: {
    dataType: "refObject",
    properties: {
      completed: { dataType: "double", required: true },
      starred: { dataType: "double", required: true },
      total: { dataType: "double", required: true },
      overdue: { dataType: "double", required: true },
      upcoming: { dataType: "double", required: true },
      uncompleted: { dataType: "double", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  NotFoundErrorResponse: {
    dataType: "refObject",
    properties: {
      message: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ValidationErrorResponse: {
    dataType: "refObject",
    properties: {
      message: { dataType: "string", required: true },
      fields: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {},
        additionalProperties: { dataType: "string" },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TodoUpdateBody: {
    dataType: "refObject",
    properties: {
      text: { dataType: "string" },
      description: {
        dataType: "union",
        subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
      },
      dueAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
      starredAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TodoCreateBody: {
    dataType: "refObject",
    properties: {
      text: { dataType: "string", required: true },
      description: {
        dataType: "union",
        subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
      },
      dueAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
      starredAt: {
        dataType: "union",
        subSchemas: [{ ref: "Timestamp" }, { dataType: "enum", enums: [null] }],
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AccountCreateBody: {
    dataType: "refObject",
    properties: {
      password: { dataType: "string", required: true },
      email: { dataType: "string", required: true },
      name: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  app.post(
    "/auth/login",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.login),

    function AuthController_login(request: any, response: any, next: any) {
      const args = {
        body: { in: "body", name: "body", required: true, ref: "AccountLoginBody" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new AuthController();

        const promise = controller.login.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post(
    "/auth/refresh",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.refreshToken),

    function AuthController_refreshToken(request: any, response: any, next: any) {
      const args = {
        body: { in: "body", name: "body", required: true, ref: "TokenRefreshBody" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new AuthController();

        const promise = controller.refreshToken.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/todo",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodos),

    function TodoController_getTodos(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
        query: { in: "queries", name: "query", required: true, ref: "PaginationQuery" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.getTodos.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/todo/stats",
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodoStats),

    function TodoController_getTodoStats(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.getTodoStats.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/todo/stats/account",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getAccountTodoStats),

    function TodoController_getAccountTodoStats(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.getAccountTodoStats.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/todo/:id",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodo),

    function TodoController_getTodo(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
        todoId: { in: "path", name: "id", required: true, dataType: "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.getTodo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.patch(
    "/todo/:id",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.updateTodo),

    function TodoController_updateTodo(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
        todoId: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "TodoUpdateBody" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.updateTodo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post(
    "/todo",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.createTodo),

    function TodoController_createTodo(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
        body: { in: "body", name: "body", required: true, ref: "TodoCreateBody" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.createTodo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, 201, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete(
    "/todo/:id",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(TodoController),
    ...fetchMiddlewares<RequestHandler>(TodoController.prototype.deleteTodo),

    function TodoController_deleteTodo(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
        todoId: { in: "path", name: "id", required: true, dataType: "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new TodoController();

        const promise = controller.deleteTodo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/",
    ...fetchMiddlewares<RequestHandler>(ServerController),
    ...fetchMiddlewares<RequestHandler>(ServerController.prototype.apiInfo),

    function ServerController_apiInfo(request: any, response: any, next: any) {
      const args = {};

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new ServerController();

        const promise = controller.apiInfo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete(
    "/db/reset",
    ...fetchMiddlewares<RequestHandler>(ServerController),
    ...fetchMiddlewares<RequestHandler>(ServerController.prototype.resetDatabase),

    function ServerController_resetDatabase(request: any, response: any, next: any) {
      const args = {};

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new ServerController();

        const promise = controller.resetDatabase.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/db",
    ...fetchMiddlewares<RequestHandler>(ServerController),
    ...fetchMiddlewares<RequestHandler>(ServerController.prototype.viewDatabase),

    function ServerController_viewDatabase(request: any, response: any, next: any) {
      const args = {};

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new ServerController();

        const promise = controller.viewDatabase.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/db/:entity",
    ...fetchMiddlewares<RequestHandler>(ServerController),
    ...fetchMiddlewares<RequestHandler>(ServerController.prototype.viewDatabaseEntityList),

    function ServerController_viewDatabaseEntityList(request: any, response: any, next: any) {
      const args = {
        entity: { in: "path", name: "entity", required: true, dataType: "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new ServerController();

        const promise = controller.viewDatabaseEntityList.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/db/:entity/:id",
    ...fetchMiddlewares<RequestHandler>(ServerController),
    ...fetchMiddlewares<RequestHandler>(ServerController.prototype.viewDatabaseEntity),

    function ServerController_viewDatabaseEntity(request: any, response: any, next: any) {
      const args = {
        entity: { in: "path", name: "entity", required: true, dataType: "string" },
        id: { in: "path", name: "id", required: true, dataType: "string" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new ServerController();

        const promise = controller.viewDatabaseEntity.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    "/account/current",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(AccountController),
    ...fetchMiddlewares<RequestHandler>(AccountController.prototype.getCurrent),

    function AccountController_getCurrent(request: any, response: any, next: any) {
      const args = {
        request: { in: "request", name: "request", required: true, dataType: "object" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new AccountController();

        const promise = controller.getCurrent.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, undefined, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post(
    "/account",
    ...fetchMiddlewares<RequestHandler>(AccountController),
    ...fetchMiddlewares<RequestHandler>(AccountController.prototype.createTodo),

    function AccountController_createTodo(request: any, response: any, next: any) {
      const args = {
        body: { in: "body", name: "body", required: true, ref: "AccountCreateBody" },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);

        const controller = new AccountController();

        const promise = controller.createTodo.apply(controller, validatedArgs as any);
        promiseHandler(controller, promise, response, 201, next);
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      // keep track of failed auth attempts so we can hand back the most
      // recent one.  This behavior was previously existing so preserving it
      // here
      const failedAttempts: any[] = [];
      const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
      };

      const secMethodOrPromises: Promise<any>[] = [];
      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          const secMethodAndPromises: Promise<any>[] = [];

          for (const name in secMethod) {
            secMethodAndPromises.push(
              expressAuthentication(request, name, secMethod[name]).catch(pushAndRethrow),
            );
          }

          // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

          secMethodOrPromises.push(
            Promise.all(secMethodAndPromises).then((users) => {
              return users[0];
            }),
          );
        } else {
          for (const name in secMethod) {
            secMethodOrPromises.push(
              expressAuthentication(request, name, secMethod[name]).catch(pushAndRethrow),
            );
          }
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      try {
        request["user"] = await promiseAny.call(Promise, secMethodOrPromises);
        next();
      } catch (err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;
        next(error);
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return "getHeaders" in object && "getStatus" in object && "setStatus" in object;
  }

  function promiseHandler(
    controllerObj: any,
    promise: any,
    response: any,
    successStatus: any,
    next: any,
  ) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode = successStatus;
        let headers;
        if (isController(controllerObj)) {
          headers = controllerObj.getHeaders();
          statusCode = controllerObj.getStatus() || statusCode;
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        returnHandler(response, statusCode, data, headers);
      })
      .catch((error: any) => next(error));
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
    if (response.headersSent) {
      return;
    }
    Object.keys(headers).forEach((name: string) => {
      response.set(name, headers[name]);
    });
    if (
      data &&
      typeof data.pipe === "function" &&
      data.readable &&
      typeof data._read === "function"
    ) {
      response.status(statusCode || 200);
      data.pipe(response);
    } else if (data !== null && data !== undefined) {
      response.status(statusCode || 200).json(data);
    } else {
      response.status(statusCode || 204).end();
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown> {
    return (status, data, headers) => {
      returnHandler(response, status, data, headers);
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, request: any, response: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case "request":
          return request;
        case "query":
          return validationService.ValidateParam(
            args[key],
            request.query[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "queries":
          return validationService.ValidateParam(
            args[key],
            request.query,
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "path":
          return validationService.ValidateParam(
            args[key],
            request.params[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "header":
          return validationService.ValidateParam(
            args[key],
            request.header(name),
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "body":
          return validationService.ValidateParam(
            args[key],
            request.body,
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "body-prop":
          return validationService.ValidateParam(
            args[key],
            request.body[name],
            name,
            fieldErrors,
            "body.",
            { noImplicitAdditionalProperties: "throw-on-extras" },
          );
        case "formData":
          if (args[key].dataType === "file") {
            return validationService.ValidateParam(
              args[key],
              request.file,
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: "throw-on-extras" },
            );
          } else if (args[key].dataType === "array" && args[key].array.dataType === "file") {
            return validationService.ValidateParam(
              args[key],
              request.files,
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: "throw-on-extras" },
            );
          } else {
            return validationService.ValidateParam(
              args[key],
              request.body[name],
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: "throw-on-extras" },
            );
          }
        case "res":
          return responder(response);
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, "");
    }
    return values;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
