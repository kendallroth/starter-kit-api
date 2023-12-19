import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";

import copyfiles from "copyfiles";
import { defineConfig } from "tsup";

const production = process.env.NODE_ENV === "production";

export default defineConfig((options) => {
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
      const swaggerOutputs = ["./build", "./docs"];

      console.info("TSU Copying generated Swagger doc (after build)");
      for (const output of swaggerOutputs) {
        copyfiles([swaggerPath, output], { up: 2 }, () => {});
      }

      let serverProcess: ChildProcessWithoutNullStreams | undefined;

      // Restart dev server when changes are detected (but only if run in "watch" mode)
      // NOTE: Must use hacky workaround for restarting server due to `tsup` configuration,
      //         as it is not possible to import the server from source or build files.
      //       Importing build files unfortunately results in import errors (ESM or other)...
      if (options.watch) {
        console.info("API Restarting dev server");

        // Start the compiled CLI with default arguments (sufficient for dev reloads)
        serverProcess = spawn("./build/cli.js");
        serverProcess.stdout.on("data", (data) => {
          console.info(`API ${data.toString().trim()}`);
        });
        serverProcess.stderr.on("data", (data) => {
          console.error(`API ${data.toString().trim()}`);
        });
        serverProcess.on("close", () => {
          console.info("API Closing dev server");
        });
      }

      return () => {
        serverProcess?.kill();
      }
    },
  };
});
