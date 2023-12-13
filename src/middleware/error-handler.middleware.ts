import type { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

import { BaseError } from "#common/errors";

/** Error handler, converting thrown errors into suitable shape for clients */
export const routeErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation failed",
      details: err.fields,
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }

  // TODO: Decide how to handle other unexpected errors (ie plain objects, etc)?

  return next();
};
