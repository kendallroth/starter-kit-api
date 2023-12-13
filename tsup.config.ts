import { defineConfig } from "tsup";

const production = process.env.NODE_ENV === "production";

export default defineConfig((_options) => {
  return {
    clean: true,
    dts: true,
    entry: {
      cli: "./src/cli.ts",
      shared: "./src/shared.ts"
    },
    format: ["cjs", "esm"],
    splitting: production,
    metafile: !production,
    minify: production,
    outDir: "build",
  };
});
