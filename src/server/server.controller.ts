import { Controller, Delete, Get, Path, Route, Tags } from "tsoa";

import { NotFoundError } from "#common/errors";
import { appConfig } from "#config";
import { database, seededData } from "#database";

const serializedDatabase = () => Object.entries(database.data!).reduce((accum, [key, value]) => {
  return { ...accum, [key]: Object.fromEntries(value) };
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
      deployment: appConfig.gitHash,
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
  public async viewDatabaseEntityList(
    @Path("entity") entity: string,
  ) {
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
  public async viewDatabaseEntity(
    @Path("entity") entity: string,
    @Path("id") id: string,
  ) {
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
