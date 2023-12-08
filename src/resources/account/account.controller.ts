import { Controller, Get, Response, Route, Security, Tags } from "tsoa";

import { UnauthorizedError, UnauthorizedErrorResponse } from "#common/errors";
import { AccountEntity } from "./account.entity";
import { AccountService } from "./account.service";

@Route("account")
@Tags("Account")
export class AccountController extends Controller {
  /**
   * @summary Get authenticated user details
   */
  @Get("current")
  @Security("jwt")
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  public async getTodos(): Promise<AccountEntity> {
    return AccountService.getAccount("1");
  }
}
