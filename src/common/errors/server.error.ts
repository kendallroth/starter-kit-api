import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unknown server issues */
export class ServerError extends BaseError {
  static status = HttpStatus.INTERNAL_SERVER_ERROR;
  static code = "SERVER_ERROR";
  static message = "Server error";

  constructor(message?: string, code?: string) {
    super(code ?? ServerError.code, message ?? ServerError.message, ServerError.status);
  }

  toResponse(): ServerErrorResponse {
    return pick(this, ["code", "message"]);
  }
}

export interface ServerErrorResponse extends BaseErrorResponse {}
