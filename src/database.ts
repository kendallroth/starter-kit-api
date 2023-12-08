import { Low as LowDB, Memory as MemoryAdapter } from "lowdb";

import { AccountEntity, seededAccountMap } from "#modules/account/entities";
import { TodoEntity, seededTodoMap } from "#modules/todo/entities";

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
