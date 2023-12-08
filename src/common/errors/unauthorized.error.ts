import { HttpStatus, pick } from "#common/utilities";
import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unauthorized access to a resource */
export class UnauthorizedError extends BaseError {
  static status = HttpStatus.UNAUTHORIZED;
  static message = "Unauthorized";

  constructor(message?: string) {
    super(message ?? UnauthorizedError.message, UnauthorizedError.status);
  }

  toResponse(): UnauthorizedErrorResponse {
    return pick(this, ["message"]);
  }
}

export interface UnauthorizedErrorResponse extends BaseErrorResponse {}
