import { Low as LowDB, Memory as MemoryAdapter } from "lowdb";

import { AccountEntity } from "#server/resources/account/account.entity";
import { seededAccountMap } from "#server/resources/account/account.seed";
import { RefreshTokenEntity } from "#server/resources/auth/auth.entity";
import { TodoEntity } from "#server/resources/todo/todo.entity";
import { seededTodoMap } from "#server/resources/todo/todo.seed";

export interface Database {
  accounts: Map<string, AccountEntity>;
  todos: Map<string, TodoEntity>;
  refreshTokens: Map<string, RefreshTokenEntity>;
}

export const seededData: Database = {
  accounts: seededAccountMap,
  todos: seededTodoMap,
  refreshTokens: new Map(),
};

const createDatabase = (): LowDB<Database> => {
  const adapter = new MemoryAdapter<Database>();
  const database = new LowDB(adapter);

  database.data = { ...seededData };
  database.write();

  return database;
};

export const database = createDatabase();
