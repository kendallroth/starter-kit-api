import merge from "ts-deepmerge";
import type { PartialDeep } from "type-fest";

const production = process.env.NODE_ENV === "production";

export interface ServerConfig {
  /** Authentication config */
  auth: {
    /** JWT expiry (in seconds) */
    jwtExpiry: number;
    /** Secret used for JWT generation/verification */
    jwtSecret: string;
    /** Refresh token expiry (in seconds) */
    refreshExpiry: number;
  };
  /** Whether server is running in development */
  development: boolean;
  /** Server logging configuratino */
  logging: {
    /** Whether request/response logging is enabled */
    enabled: boolean;
    /** Whether requests are logged (alongside responses) */
    logRequests: boolean;
  }
  /**
   * Database persistence file path (JSON).
   *
   * If not set, defaults to using in-memory database adapter.
   */
  persist?: string;
  /** Whether server is running in production */
  production: boolean;
  /** Server port (auto-runs if provided) */
  port: number | null;
}

/** Server configuration (global) */
export let serverConfig: ServerConfig = {
  auth: {
    jwtExpiry: 60 * 15,
    jwtSecret: "secret",
    refreshExpiry: 60 * 60 * 24 * 7,
  },
  development: !production,
  logging: {
    enabled: true,
    logRequests: false,
  },
  production,
  port: 3001,
};

/** Override global server configuration */
export const setServerConfig = (config: PartialDeep<ServerConfig>): ServerConfig => {
  serverConfig = merge.withOptions(
    { allowUndefinedOverrides: false },
    serverConfig,
    config,
  ) as ServerConfig;
  return serverConfig;
};
