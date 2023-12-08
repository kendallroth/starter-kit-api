import { Controller, Get, Request, Response, Route, Security, Tags } from "tsoa";

import { AuthenticatedRequest } from "#authentication";
import { UnauthorizedError, UnauthorizedErrorResponse } from "#common/errors";
import { AccountService } from "./account.service";
import { AccountResponse } from "./account.types";

@Route("account")
@Tags("Account")
export class AccountController extends Controller {
  /**
   * @summary Get authenticated user details
   */
  @Get("current")
  @Security("jwt")
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  public async getCurrent(@Request() request: AuthenticatedRequest): Promise<AccountResponse> {
    return AccountService.getAccount(request.user.id);
  }
}
