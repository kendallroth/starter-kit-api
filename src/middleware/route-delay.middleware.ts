import type { NextFunction, Request, Response } from "express";

import { randomFromRange } from "#common/utilities";

/** Introduce brief delay on all other endpoints (to simulate network traffic) */
export const routeDelayHandler = (_error: Error, _req: Request, _res: Response, next: NextFunction) => {
  setTimeout(next, randomFromRange(100, 1000));
};
