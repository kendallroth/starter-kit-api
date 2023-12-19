import copyfiles, { type Options as CopyOptions } from "copyfiles";
import { defineConfig } from "tsup";

const production = process.env.NODE_ENV === "production";

export default defineConfig((_options) => {
  return {
    // NOTE: Cleaning build directory will also remove Swagger file if present!
    clean: true,
    dts: true,
    entry: {
      cli: "./src/cli.ts",
      shared: "./src/shared.ts",
    },
    format: ["cjs", "esm"],
    splitting: production,
    metafile: !production,
    minify: production,
    outDir: "build",
    onSuccess: async () => {
      // Copy Swagger docs after bundling (ie. build/, docs/)
      const swaggerPath = "./src/generated/swagger.json";
      const options: CopyOptions = { up: 2 };
      const noOp = () => {};

      console.info("CLI Copying generated Swagger doc (after build)");
      copyfiles([swaggerPath, "./build"], options, noOp);
      copyfiles([swaggerPath, "./docs"], options, noOp);
    },
  };
});
