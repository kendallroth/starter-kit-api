import { HttpStatus, pick } from "#shared/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unknown server issues */
export class ServerError extends BaseError {
  static status = HttpStatus.INTERNAL_SERVER_ERROR;
  static message = "Server error";

  constructor(message?: string) {
    super(message ?? ServerError.message, ServerError.status);
  }

  toResponse(): ServerErrorResponse {
    return pick(this, ["message"]);
  }
}

export interface ServerErrorResponse extends BaseErrorResponse {}
