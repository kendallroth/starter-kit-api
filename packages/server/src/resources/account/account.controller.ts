import { HttpStatus } from "@starter-kit-api/shared";
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";

import { AuthenticatedRequest } from "#authentication";
import {
  UnauthorizedError,
  UnauthorizedErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from "#common/errors";
import { AuthenticationResponse } from "#resources/auth/auth.types";
import { AccountService } from "./account.service";
import { AccountCreateBody, AccountResponse } from "./account.types";

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

  /**
   * @summary Create an account
   */
  @SuccessResponse(HttpStatus.CREATED)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Post()
  public async createTodo(@Body() body: AccountCreateBody): Promise<AuthenticationResponse> {
    this.setStatus(HttpStatus.CREATED);
    return AccountService.createAccount(body);
  }
}
