import { HttpStatus, pick } from "@starter-kit-api/shared";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate unknown client issues */
export class ClientError extends BaseError {
  static status = HttpStatus.BAD_REQUEST;
  static message = "Bad request";

  constructor(message?: string) {
    super(message ?? ClientError.message, ClientError.status);
  }

  toResponse(): ClientErrorResponse {
    return pick(this, ["message"]);
  }
}

export interface ClientErrorResponse extends BaseErrorResponse {}
