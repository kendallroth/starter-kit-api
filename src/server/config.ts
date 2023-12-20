import merge from "ts-deepmerge";

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
  /** Whether request logging is enabled */
  logging: boolean;
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
  logging: true,
  production,
  port: 3001,
};

/** Override global server configuration */
export const setServerConfig = (config: Partial<ServerConfig>): ServerConfig => {
  serverConfig = merge.withOptions(
    { allowUndefinedOverrides: false },
    serverConfig,
    config,
  ) as ServerConfig;
  return serverConfig;
};
