import { Adapter, Low as LowDB, Memory as MemoryAdapter, TextFile } from "lowdb";

import { AccountEntity } from "#resources/account/account.entity";
import { seededAccountMap } from "#resources/account/account.seed";
import { RefreshTokenEntity } from "#resources/auth/auth.entity";
import { QuoteEntity } from "#resources/quote/quote.entity";
import { seededQuoteMap } from "#resources/quote/quote.seed";
import { TodoEntity } from "#resources/todo/todo.entity";
import { seededTodoMap } from "#resources/todo/todo.seed";

/** Database uses `Map` for easy CRUD operations; however, this has caveats (serialization, etc)! */
export interface Database {
  accounts: Map<string, AccountEntity>;
  todos: Map<string, TodoEntity>;
  refreshTokens: Map<string, RefreshTokenEntity>;
  quotes: Map<string, QuoteEntity>;
}

/**
 * Get a copy of default data
 *
 * Clones all data to avoid mutations!
 */
export const getDefaultData = (): Database => ({
  accounts: new Map(seededAccountMap),
  todos: new Map(seededTodoMap),
  refreshTokens: new Map(),
  quotes: new Map(seededQuoteMap),
});

// biome-ignore lint/suspicious/noExplicitAny: Serialized database needs no type safety
type SerializedDatabase = Record<string, any>;

/** Serialize database to JSON object */
export const serializeDatabase = (typedData: Database): SerializedDatabase =>
  Object.entries(typedData).reduce((accum, [key, value]) => {
    return { ...accum, [key]: Object.fromEntries(value) };
  }, {} as SerializedDatabase);

/** Restore database from JSON object */
export const deSerializeDatabase = (anyData: Record<string, object>): Database =>
  Object.entries(anyData).reduce((accum, [key, value]) => {
    return {
      ...accum,
      [key]: new Map(Object.entries(value)),
    };
  }, getDefaultData());

/** Custom database adapter for top-level table `Map`s */
class JsonMapAdapter<Database> implements Adapter<Database> {
  private adapter: TextFile;

  constructor(filename: string) {
    this.adapter = new TextFile(filename);
  }

  async read(): Promise<Database | null> {
    const data = await this.adapter.read();
    if (data === null) return null;

    return deSerializeDatabase(JSON.parse(data)) as Database;
  }

  async write(database: Database): Promise<void> {
    // biome-ignore lint/suspicious/noExplicitAny: Any type is necessary for unknown/incorrect TS error
    const serializedData = serializeDatabase(database as any);
    return this.adapter.write(JSON.stringify(serializedData, null, 2));
  }
}

/**
 * Initialize database
 *
 * Uses JSON file adapter if persistence path is provided; otherwise it defaults to in-memory.
 *
 * NOTE: Must be called before referencing `database` anywhere!
 *
 * @param persistencePath Database file persistence path
 */
export const createDatabase = async (persistencePath?: string) => {
  const adapter = persistencePath
    ? new JsonMapAdapter<Database>(persistencePath)
    : new MemoryAdapter<Database>();
  const localDatabase = new LowDB(adapter);

  // Read existing database (if any)
  await localDatabase.read();

  localDatabase.data ||= getDefaultData();
  await localDatabase.write();

  database = localDatabase;
};

export let database: LowDB<Database> = undefined as unknown as LowDB<Database>;
