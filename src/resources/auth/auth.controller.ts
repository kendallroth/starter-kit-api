import { Body, Controller, Patch, Post, Request, Response, Route, Security, Tags } from "tsoa";

import {
  ClientError,
  ClientErrorResponse,
  UnauthorizedError,
  UnauthorizedErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from "#common/errors";
import { AuthenticatedRequest } from "#server/authentication";
import { AuthService } from "./auth.service";
import { AuthLoginBody, AuthenticationResponse, PasswordChangeBody, TokenRefreshBody } from "./auth.types";
import { PasswordService } from "./password.service";

@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
  /**
   * @summary Authenticate user via credentials
   */
  @Post("/login")
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  public async login(@Body() body: AuthLoginBody): Promise<AuthenticationResponse> {
    return AuthService.authenticate(body);
  }

  /**
   * @summary Refresh authentication token
   */
  @Response<ClientErrorResponse>(ClientError.status, ClientError.message)
  @Post("/refresh")
  public async refreshToken(@Body() body: TokenRefreshBody): Promise<AuthenticationResponse> {
    return AuthService.refreshAuthToken(body);
  }

  /**
   * @summary Change user's password
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Security("jwt")
  @Patch("/password/change")
  public async changePassword(
    @Request() request: AuthenticatedRequest,
    @Body() body: PasswordChangeBody,
  ): Promise<void> {
    return PasswordService.changePassword(request.user, body);
  }
}
