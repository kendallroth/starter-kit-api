import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate validation issues */
export class ValidationError extends BaseError {
  static status = HttpStatus.UNPROCESSABLE_ENTITY;
  static code = "VALIDATION_ERRORS";
  static message = "Validation errors";

  fields: Record<string, string>;

  constructor(fields: Record<string, string>, message?: string, code?: string) {
    super(code ?? ValidationError.code, message ?? ValidationError.message, ValidationError.status);
    this.fields = fields;
  }

  toResponse(): ValidationErrorResponse {
    return pick(this, ["code", "message", "fields"]);
  }
}

export interface ValidationErrorResponse extends BaseErrorResponse {
  fields: { [x: string]: string };
}
