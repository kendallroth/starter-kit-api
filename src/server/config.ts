const production = process.env.NODE_ENV === "production";

/** App configuration */
export const appConfig = {
  auth: {
    /** JWT expiry (in seconds) */
    jwtExpiry: 60 * 15,
    jwtSecret: "secret",
    /** Refresh token expiry (in seconds) */
    refreshExpiry: 60 * 60 * 24 * 7
  },
  development: !production,
  gitHash: process.env.GIT_HASH?.slice(0, 8) ?? "N/A",
  production,
  port: parseInt(process.env.PORT ?? "3001", 10),
};
