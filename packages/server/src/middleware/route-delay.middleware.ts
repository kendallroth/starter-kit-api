import { randomFromRange } from "@starter-kit-api/shared";
import type { NextFunction, Request, Response } from "express";

/** Introduce brief delay on all other endpoints (to simulate network traffic) */
export const routeDelayHandler = (_req: Request, _res: Response, next: NextFunction) => {
  setTimeout(next, randomFromRange(50, 500));
};
