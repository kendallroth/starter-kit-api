#!/usr/bin/env node

import { InvalidArgumentError, program } from "commander";

import { createServer } from "#server/server";
import { pick } from "./shared";
const { version } = require("../package.json");

interface SkApiOptions {
  /** Expiry time for JWT access token (min) */
  authJwtExpiry?: number;
  /** Whether request/response logs are disabled */
  logs?: boolean;
  /** Whether requests should be logged (along with responses) */
  logRequests?: boolean;
  /** Database file path for API data persistence */
  persist?: string;
  /** Server port */
  port?: number;
}

/** Transform CLI argument as a integer */
const parseIntOption =
  (options?: { min?: number; max?: number }) =>
  (value: string): number => {
    const parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue)) {
      throw new InvalidArgumentError("Not a number");
    }
    if (options?.min !== undefined && parsedValue < options.min) {
      throw new InvalidArgumentError(`Must be greater than ${options.min}`);
    }
    if (options?.max !== undefined && parsedValue > options.max) {
      throw new InvalidArgumentError(`Must be less than ${options.max}`);
    }
    return parsedValue;
  };

program
  .name("sk-api")
  .description("Simple API for `starter-kit-*` projects")
  .helpOption("-h, --help", "Display help for command")
  .version(version, "-v, --version", "Display CLI version")
  .option(
    "--auth-jwt-expiry <time>",
    "Auth JWT token expiry time (min)",
    parseIntOption({ min: 0 }),
    15,
  )
  .option("--persist <path>", "Database persistence file path (JSON)")
  .option("--no-logs", "Whether request/response logs are disabled")
  .option("--log-requests", "Whether requests are logged (alongside responses)", false)
  .option("-p, --port <number>", "Server port", parseIntOption({ min: 0 }), 3001)
  .action((options: SkApiOptions) => {
    createServer({
      ...pick(options, ["persist", "port"]),
      auth: {
        jwtExpiry: (options.authJwtExpiry?? 15) * 60,
      },
      logging: {
        enabled: options.logs,
        logRequests: options.logRequests,
      },
    });
  });

program.parse();
