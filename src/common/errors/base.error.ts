import { HttpStatusCodeLiteral } from "tsoa";

/** Base error class for internal exceptions */
export abstract class BaseError extends Error {
  status: HttpStatusCodeLiteral;

  constructor(message: string, httpStatus: HttpStatusCodeLiteral) {
    super(message);
    this.status = httpStatus;
    this.name = this.constructor.name;
  }

  abstract toResponse(): BaseErrorResponse;
}

/** Base error shape for API error responses */
export interface BaseErrorResponse {
  message: string;
}
