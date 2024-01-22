import {
  Body,
  Controller,
  Delete,
  Get,
  NoSecurity,
  Patch,
  Path,
  Post,
  Queries,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";

import {
  NotFoundError,
  NotFoundErrorResponse,
  UnauthorizedError,
  UnauthorizedErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from "#common/errors";
import { PaginatedResult, PaginationQuery } from "#common/types";
import { HttpStatus } from "#common/utilities";
import { AuthenticatedRequest } from "#server/authentication";
import { TodoEntity } from "./todo.entity";
import { TodoService } from "./todo.service";
import { TodoCreateBody, TodoStatsResponse, TodoUpdateBody } from "./todo.types";

@Tags("Todo")
@Security("jwt")
@Route("todo")
export class TodoController extends Controller {
  /**
   * @summary Get all of user's todos (supports sorting)
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Get()
  public async getTodos(
    @Request() request: AuthenticatedRequest,
    @Queries() query: PaginationQuery,
  ): Promise<PaginatedResult<TodoEntity>> {
    return TodoService.getTodos(request.user, query);
  }

  /**
   * @summary View platform todo stats
   */
  // NOTE: Must be registered BEFORE ":id" route!
  @NoSecurity()
  @Get("stats")
  public async getAllTodoStats(
    @Request() request: AuthenticatedRequest,
  ): Promise<TodoStatsResponse> {
    return TodoService.getTodoStats(request.user);
  }

  /**
   * @summary View account todo stats
   */
  // NOTE: Must be registered BEFORE ":id" route!
  @Get("stats/account")
  public async getAccountTodoStats(
    @Request() request: AuthenticatedRequest,
  ): Promise<TodoStatsResponse> {
    return TodoService.getTodoStats(request.user);
  }

  /**
   * @summary Get a todo
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<NotFoundErrorResponse>(NotFoundError.status, NotFoundError.message)
  @Get("{id}")
  public async getTodo(
    @Request() request: AuthenticatedRequest,
    @Path("id") todoId: string,
  ): Promise<TodoEntity> {
    return TodoService.getTodo(request.user, todoId);
  }

  /**
   * @summary Update a todo
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<NotFoundErrorResponse>(NotFoundError.status, NotFoundError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Patch("{id}")
  public async updateTodo(
    @Request() request: AuthenticatedRequest,
    @Path("id") todoId: string,
    @Body() body: TodoUpdateBody,
  ): Promise<TodoEntity> {
    return TodoService.updateTodo(request.user, todoId, body);
  }

  /**
   * @summary Add a todo
   */
  @SuccessResponse(HttpStatus.CREATED)
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Post()
  public async createTodo(
    @Request() request: AuthenticatedRequest,
    @Body() body: TodoCreateBody,
  ): Promise<TodoEntity> {
    this.setStatus(HttpStatus.CREATED);
    return TodoService.createTodo(request.user, body);
  }

  /**
   * @summary Remove a todo
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Delete("{id}")
  public async deleteTodo(
    @Request() request: AuthenticatedRequest,
    @Path("id") todoId: string,
  ): Promise<TodoEntity> {
    return TodoService.deleteTodo(request.user, todoId);
  }
}
