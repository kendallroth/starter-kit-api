import type { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "#server/authentication";

interface RequestLoggerOptions {
  /** Whether request logging is disabled */
  disabled?: boolean;
  /** Which events should be logged */
  events?: {
    /**
     * Whether requests should be logged
     * @default false
     */
    request?: boolean;
    /**
     * Whether responses should be logged
     * @default true
     */
    response?: boolean;
  };
  /**
   * Route paths to ignore logs
   *
   * @example
   * // Ignores all routes starting with `/docs`, or including `test`
   * ["/docs", "test"]
   */
  ignore?: string[];
}

/** Log API requests */
export const requestLogger =
  (options: RequestLoggerOptions = {}) => (req: Request, res: Response, next: NextFunction) => {
    if (options.disabled) return next();

    const method = req.method.padStart(5, " ");
    const url = req.url;

    // Skip logging for ignored routes
    for (const ignore of options.ignore ?? []) {
      if (ignore.startsWith("/")) {
        if (url.startsWith(ignore)) return next();
      } else {
        if (url.includes(ignore)) return next();
      }
    }

    const requestLog = `[Request]  ${method} ${url}`;
    if (options.events?.request ?? false) {
      console.info(requestLog);
    }

    const requestTimeStart = new Date().getTime();

    res.on("finish", () => {
      const requestTime = new Date().getTime() - requestTimeStart;
      let accountId = (req as AuthenticatedRequest).user?.id ?? "";
      accountId = accountId ? ` accountId:${accountId}` : "";

      const responseLog = `[Response] ${method} ${res.statusCode} ${url} (${requestTime}ms)${accountId}`;
      if (options.events?.response ?? true) {
        console.info(responseLog);
      }
    });

    next();
  };
