import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unknown client issues */
export class ClientError extends BaseError {
  static status = HttpStatus.BAD_REQUEST;
  static code = "BAD_REQUEST";
  static message = "Bad request";

  constructor(message?: string, code?: string) {
    super(code ?? ClientError.code, message ?? ClientError.message, ClientError.status);
  }

  toResponse(): ClientErrorResponse {
    return pick(this, ["code", "message"]);
  }
}

export interface ClientErrorResponse extends BaseErrorResponse {}
