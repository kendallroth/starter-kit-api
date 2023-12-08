import { Body, Controller, Get, Post, Response, Route, Security, Tags } from "tsoa";

import { UnauthorizedError, UnauthorizedErrorResponse } from "#common/errors";
import { AccountEntity} from "./account.entity";
import { AccountService } from "./account.service";
import { AccountLoginBody, AuthenticationResponse } from "./account.types";

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

  /**
   * @summary Authenticate user via credentials
   */
  @Post("login")
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  public async login(@Body() body: AccountLoginBody): Promise<AuthenticationResponse> {
    return AccountService.authenticate(body);
  }
}
