import dayjs from "dayjs";
import { sort } from "fast-sort";

import { NotFoundError } from "#common/errors";
import { FilterOperators, PaginatedResult } from "#common/types";
import { getSortList } from "#common/utilities";
import { mapToArray, paginate } from "#common/utilities";
import { AccountEntity } from "#resources/account/account.entity";
import { database } from "#server/database";
import { TodoEntity, stubTodo } from "./todo.entity";
import { TodoCreateBody, TodoStatsResponse, TodoUpdateBody } from "./todo.types";

class TodoService {
  public getTodos(account: AccountEntity, options?: FilterOperators): PaginatedResult<TodoEntity> {
    const todosRef = database.data!.todos;
    const todos = mapToArray(todosRef).filter((t) => t.accountId === account.id);

    const validSortKeys: (keyof TodoEntity)[] = ["completedAt", "createdAt", "dueAt"];
    const sortList = getSortList(options?.sort, validSortKeys, "createdAt");
    const sortedTodos = sortList.length ? sort(todos).by(sortList) : todos;

    const paginatedTodos = paginate(sortedTodos, options);
    return paginatedTodos;
  }

  public getTodoById(id: string): TodoEntity | undefined {
    const todosRef = database.data!.todos;
    return todosRef.get(id);
  }

  public getTodo(account: AccountEntity, id: string): TodoEntity {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    return todo;
  }

  public getTodoStats(account?: AccountEntity): TodoStatsResponse {
    const todosRef = database.data!.todos;
    const todos = mapToArray(todosRef).filter((t) => (account ? t.accountId === account.id : true));

    return todos.reduce((accum, todo) => {
      const completed = !!todo.completedAt;
      const overdue = todo.dueAt && dayjs(todo.dueAt).isBefore();
      const upcoming = todo.dueAt && dayjs(todo.dueAt).isAfter();
      const starred = !!todo.starredAt;

      return {
        completed: (accum.completed ?? 0) + (completed ? 1 : 0),
        overdue: (accum.overdue ?? 0) + (overdue ? 1 : 0),
        starred: (accum.overdue ?? 0) + (starred ? 1 : 0),
        total: (accum.total ?? 0) + 1,
        upcoming: (accum.upcoming ?? 0) + (upcoming ? 1 : 0),
        uncompleted: (accum.uncompleted ?? 0) + (!completed ? 1 : 0),
      };
    }, {} as TodoStatsResponse);
  }

  public async createTodo(account: AccountEntity, body: TodoCreateBody): Promise<TodoEntity> {
    const todo = stubTodo({
      accountId: account.id,
      ...body,
    });

    database.data?.todos.set(todo.id, todo);
    await database.write();

    return todo;
  }

  public async deleteTodo(account: AccountEntity, id: string): Promise<TodoEntity> {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    database.data?.todos.delete(id);
    await database.write();

    return todo;
  }

  public async updateTodo(account: AccountEntity, id: string, body: TodoUpdateBody): Promise<TodoEntity> {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    const updatedTodo = {
      ...todo,
      ...body,
    };

    database.data?.todos.set(todo.id, updatedTodo);
    await database.write();

    return updatedTodo;
  }
}

const singleton = new TodoService();
export { singleton as TodoService };
