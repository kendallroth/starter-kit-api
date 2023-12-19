import { HttpStatusCodeLiteral } from "tsoa";

/** Base error class for internal exceptions */
export abstract class BaseError extends Error {
  /**
   * Error code for consuming applications
   *
   * @example "EMAIL_ALREADY_USED"
   */
  code: string;
  status: HttpStatusCodeLiteral;

  constructor(code: string, message: string, httpStatus: HttpStatusCodeLiteral) {
    super(message);
    this.code = code;
    this.status = httpStatus;
    this.name = this.constructor.name;
  }

  abstract toResponse(): BaseErrorResponse;
}

/** Base error shape for API error responses */
export interface BaseErrorResponse {
  /**
   * Error code for consuming applications
   *
   * @example "EMAIL_ALREADY_USED"
   */
  code: string;
  /** Error message */
  message: string;
}
