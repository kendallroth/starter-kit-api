import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate a resource does not exist */
export class NotFoundError extends BaseError {
  static status = HttpStatus.NOT_FOUND;
  static code = "NOT_FOUND";
  static message = "Not found";

  constructor(message?: string, code?: string) {
    super(code ?? NotFoundError.code, message ?? NotFoundError.message, NotFoundError.status);
  }

  toResponse(): NotFoundErrorResponse {
    return pick(this, ["code", "message"]);
  }
}

export interface NotFoundErrorResponse extends BaseErrorResponse {}
