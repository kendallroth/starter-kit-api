#!/usr/bin/env node

import { InvalidArgumentError, program } from "commander";

import { createServer } from "#server/server";
import { pick } from "./shared";
const { version } = require("../package.json");

interface SkApiOptions {
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
const parseIntOption = (value: string): number => {
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number");
  }
  return parsedValue;
};

program
  .name("sk-api")
  .description("Simple API for `starter-kit-*` projects")
  .helpOption("-h, --help", "Display help for command")
  .version(version, "-v, --version", "Display CLI version")
  .option("--persist <path>", "Database persistence file path (JSON)")
  .option("--no-logs", "Whether request/response logs are disabled")
  .option("--log-requests", "Whether requests are logged (alongside responses)", false)
  .option("-p, --port <number>", "Server port", parseIntOption, 3001)
  .action((options: SkApiOptions) => {
    createServer({
      ...pick(options, ["persist", "port"]),
      logging: {
        enabled: options.logs,
        logRequests: options.logRequests,
      }
    });
  });

program.parse();
