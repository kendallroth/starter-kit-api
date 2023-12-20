import type { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

import { BaseError, ServerError, ValidationError } from "#common/errors";

/** Error handler, converting thrown errors into suitable shape for clients */
export const routeErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TSOA validation errors are thrown when failing type annotation checks
  if (err instanceof ValidateError) {
    return res.status(422).json({
      code: ValidationError.code,
      message: ValidationError.message,
      fields: err.fields,
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.status).json(err.toResponse());
  }

  if (err instanceof Error) {
    console.error(err);
    return res.status(ServerError.status).json({
      code: ServerError.code,
      message: ServerError.message,
    });
  }

  // TODO: Decide how to handle other unexpected errors (ie plain objects, etc)?

  return next();
};
