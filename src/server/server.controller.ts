import { Controller, Delete, Get, Path, Route, Tags } from "tsoa";

import { NotFoundError } from "#common/errors";
import { database, seededData, serializeDatabase } from "#server/database";

@Route("/")
@Tags("Api")
export class ServerController extends Controller {
  /**
   * @summary API information
   */
  @Get("")
  public async apiInfo() {
    return { status: "ok" };
  }

  /** @summary Reset database */
  @Delete("db/reset")
  public async resetDatabase() {
    database.data = { ...seededData };
    await database.write();
  }

  /**
   * @summary View serialized database (for development)
   */
  @Get("db")
  public async viewDatabase() {
    // biome-ignore lint/suspicious/noExplicitAny: Cannot return `Database` type (TSOA issue)
    return serializeDatabase(database.data!) as any;
  }

  /**
   * @summary View serialized database entity list (for development)
   */
  @Get("db/{entity}")
  public async viewDatabaseEntityList(@Path("entity") entity: string) {
    // biome-ignore lint/suspicious/noExplicitAny: No need for type safety
    const entities = (serializeDatabase(database.data!) as any)[entity];
    if (!entities) {
      throw new NotFoundError("Invalid list", "INVALID_LIST");
    }
    return entities;
  }

  /**
   * @summary View serialized database individual entity (for development)
   */
  @Get("db/{entity}/{id}")
  public async viewDatabaseEntity(@Path("entity") entity: string, @Path("id") id: string) {
    // biome-ignore lint/suspicious/noExplicitAny: No need for type safety
    const list = (serializeDatabase(database.data!) as any)[entity];
    if (!list) {
      throw new NotFoundError("Invalid list", "INVALID_LIST");
    }
    const item = list[id];
    if (!item) {
      throw new NotFoundError("Invalid entity", "INVALID_ENTITY");
    }
    return item;
  }
}
