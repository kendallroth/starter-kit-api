import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unauthorized access to a resource */
export class UnauthorizedError extends BaseError {
  static status = HttpStatus.UNAUTHORIZED;
  static code = "UNAUTHORIZED";
  static message = "Unauthorized";

  constructor(message?: string, code?: string) {
    super(
      code ?? UnauthorizedError.code,
      message ?? UnauthorizedError.message,
      UnauthorizedError.status,
    );
  }

  toResponse(): UnauthorizedErrorResponse {
    return pick(this, ["code", "message"]);
  }
}

export interface UnauthorizedErrorResponse extends BaseErrorResponse {}
