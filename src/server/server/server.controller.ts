import { Controller, Delete, Get, Path, Route, Tags } from "tsoa";

import { NotFoundError } from "#server/common/errors";
import { database, seededData, serverConfig } from "#server/server";

const serializedDatabase = () =>
  Object.entries(database.data!).reduce((accum, [key, value]) => {
    // biome-ignore lint/suspicious/noExplicitAny: No need for type safety
    return { ...accum, [key]: Object.fromEntries(value as any) };
  }, {});

@Route("/")
@Tags("Api")
export class ServerController extends Controller {
  /**
   * @summary API information
   */
  @Get("")
  public async apiInfo() {
    return {
      status: "ok",
      deployment: serverConfig.gitHash,
    };
  }

  /** @summary Reset database */
  @Delete("db/reset")
  public async resetDatabase() {
    database.data = { ...seededData };
    database.write();
  }

  /**
   * @summary View serialized database (for development)
   */
  @Get("db")
  public async viewDatabase() {
    return serializedDatabase();
  }

  /**
   * @summary View serialized database entity list (for development)
   */
  @Get("db/{entity}")
  public async viewDatabaseEntityList(@Path("entity") entity: string) {
    // biome-ignore lint/suspicious/noExplicitAny: No need for type safety
    const entities = (serializedDatabase() as any)[entity];
    if (!entities) {
      throw new NotFoundError("Invalid list");
    }
    return entities;
  }

  /**
   * @summary View serialized database individual entity (for development)
   */
  @Get("db/{entity}/{id}")
  public async viewDatabaseEntity(@Path("entity") entity: string, @Path("id") id: string) {
    // biome-ignore lint/suspicious/noExplicitAny: No need for type safety
    const list = (serializedDatabase() as any)[entity];
    if (!list) {
      throw new NotFoundError("Invalid list");
    }
    const item = list[id];
    if (!item) {
      throw new NotFoundError("Invalid entity");
    }
    return item;
  }
}
