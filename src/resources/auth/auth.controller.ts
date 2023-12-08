import { Body, Controller, Post, Response, Route, Tags } from "tsoa";

import { UnauthorizedError, UnauthorizedErrorResponse } from "#common/errors";
import { AccountLoginBody } from "#resources/account/account.types";
import { AuthService } from "./auth.service";
import { AuthenticationResponse } from "./auth.types";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  /**
   * @summary Authenticate user via credentials
   */
  @Post("login")
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  public async login(@Body() body: AccountLoginBody): Promise<AuthenticationResponse> {
    return AuthService.authenticate(body);
  }
}
