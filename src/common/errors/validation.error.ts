import { HttpStatus, pick } from "#common/utilities";

import { BaseError, BaseErrorResponse } from "./base.error";

/** Error to indicate validation issues */
export class ValidationError extends BaseError {
  static status = HttpStatus.UNPROCESSABLE_ENTITY;
  static message = "Validation errors";

  fields: Record<string, string>;

  constructor(fields: Record<string, string>, message?: string) {
    super(message ?? ValidationError.message, ValidationError.status);
    this.fields = fields;
  }

  toResponse(): ValidationErrorResponse {
    return pick(this, ["message", "fields"]);
  }
}

export interface ValidationErrorResponse extends BaseErrorResponse {
  fields: { [x: string]: string };
}
