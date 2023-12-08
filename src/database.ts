import { Low as LowDB, Memory as MemoryAdapter } from "lowdb";

import { AccountEntity } from "#resources/account/account.entity";
import { seededAccountMap } from "#resources/account/account.seed";
import { TodoEntity } from "#resources/todo/todo.entity";
import { seededTodoMap } from "#resources/todo/todo.seed";

export interface Database {
  accounts: Map<string, AccountEntity>;
  todos: Map<string, TodoEntity>;
}

const createDatabase = (): LowDB<Database> => {
  const adapter = new MemoryAdapter<Database>();
  const database = new LowDB(adapter);

  database.data = {
    accounts: seededAccountMap,
    todos: seededTodoMap,
  };

  database.write();
  return database;
};

export const database = createDatabase();
