import {
  Body,
  Controller,
  Get,
  NoSecurity,
  Patch,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";

import {
  UnauthorizedError,
  UnauthorizedErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from "#common/errors";
import { HttpStatus } from "#common/utilities";
import { AuthenticationResponse } from "#resources/auth/auth.types";
import { AuthenticatedRequest } from "#server/authentication";
import { AccountService } from "./account.service";
import { AccountCreateBody, AccountResponse, AccountUpdateBody } from "./account.types";

@Tags("Account")
@Security("jwt")
@Route("account")
export class AccountController extends Controller {
  /**
   * @summary Get authenticated user details
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Get("/current")
  public async getCurrentAccount(
    @Request() request: AuthenticatedRequest,
  ): Promise<AccountResponse> {
    return AccountService.getAccount(request.user.id);
  }

  /**
   * @summary Update authenticated user profile
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Patch("/current")
  public async updateCurrentAccount(
    @Request() request: AuthenticatedRequest,
    @Body() body: AccountUpdateBody,
  ): Promise<AccountResponse> {
    return AccountService.updateAccount(request.user, body);
  }

  /**
   * @summary Create an account
   */
  @SuccessResponse(HttpStatus.CREATED)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @NoSecurity()
  @Post("/")
  public async createAccount(@Body() body: AccountCreateBody): Promise<AuthenticationResponse> {
    this.setStatus(HttpStatus.CREATED);
    return AccountService.createAccount(body);
  }
}
