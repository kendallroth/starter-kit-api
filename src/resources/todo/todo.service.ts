import { NotFoundError } from "#common/errors";
import { PaginatedResult } from "#common/types";
import { mapToArray, paginate } from "#common/utilities";
import { database } from "#database";
import { AccountEntity } from "#resources/account/account.entity";
import { TodoEntity, stubTodo } from "./todo.entity";
import { TodoCreateBody, TodoUpdateBody } from "./todo.types";

class TodoService {
  public getTodos(account: AccountEntity): PaginatedResult<TodoEntity> {
    const todosRef = database.data!.todos;
    const todos = mapToArray(todosRef).filter((t) => t.accountId === account.id);

    const paginatedTodos = paginate(todos, { page: 1, size: 5 });
    return paginatedTodos;
  }

  public getTodoById = (id: string): TodoEntity | undefined => {
    const todosRef = database.data!.todos;
    return todosRef.get(id);
  };

  public getTodo(account: AccountEntity, id: string): TodoEntity {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    return todo;
  }

  public createTodo(account: AccountEntity, body: TodoCreateBody): TodoEntity {
    const todo = stubTodo({
      accountId: account.id,
      ...body,
    });

    database.data?.todos.set(todo.id, todo);
    database.write();

    return todo;
  }

  public deleteTodo(account: AccountEntity, id: string): TodoEntity {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    database.data?.todos.delete(id);
    database.write();

    return todo;
  }

  public updateTodo(account: AccountEntity, id: string, body: TodoUpdateBody): TodoEntity {
    const todo = this.getTodoById(id);
    if (!todo || todo.accountId !== account.id) {
      throw new NotFoundError();
    }

    const updatedTodo = {
      ...todo,
      ...body,
    }

    database.data?.todos.set(todo.id, updatedTodo);
    database.write();

    return updatedTodo;
  }
}

const singleton = new TodoService();
export { singleton as TodoService };
