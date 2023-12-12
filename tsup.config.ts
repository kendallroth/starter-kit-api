import { defineConfig } from "tsup";

const production = process.env.NODE_ENV === "production";

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: true,
    entry: {
      server: "./src/server/index.ts",
      shared: "./src/shared/index.ts"
    },
    format: ["cjs", "esm"],
    splitting: true,
    metafile: !production,
    minify: true,
    outDir: "build",
  };
});
