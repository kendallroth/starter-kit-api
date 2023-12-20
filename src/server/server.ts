import express, { Request, Response, json, urlencoded } from "express";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import type { PartialDeep } from "type-fest";

// NOTE: Patches Express routes to support errors in async flows
import "express-async-errors";

import { RegisterRoutes as RegisterGeneratedRoutes } from "../generated/routes";
import { requestLogger, routeDelayHandler, routeErrorHandler } from "../middleware";
import { type ServerConfig, setServerConfig } from "./config";
import { createDatabase } from "./database";

/**
 * Create API server
 *
 * NOTE: Server is only started upon creation if a port is provided!
 */
export const createServer = async (configOverride: PartialDeep<ServerConfig> = {}) => {
  const config = setServerConfig(configOverride);

  // Configure global database (must be before any other references to database!)
  await createDatabase(config.persist);

  const app = express();

  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(json());
  app.use(
    requestLogger({
      disabled: !config.logging.enabled,
      events: {
        request: config.logging.logRequests,
        response: true,
      },
      ignore: ["/docs"],
    }),
  );

  // Generated Swagger file is included in bundle during `build` step
  const swaggerPublicPath = "./swagger.json";
  const swaggerOptions: SwaggerUiOptions = {
    // customJsStr: "",
    swaggerOptions: {
      // Expansion levels for "Schema" section models (-1 hides, 0 collapses, 1 default)
      defaultModelsExpandDepth: 2,
      // Expansion levels for operation "Schema" models (-1 hides, 0 collapses, 1 default, 2 expands)
      defaultModelExpandDepth: 2,
      // NOTE: Tag filtering currently appears broken 🤷
      filter: true,
    },
  };
  const swaggerDoc = swaggerUi.generateHTML(require(swaggerPublicPath), swaggerOptions);
  app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    // Import Swagger doc for every request in development, but only on startup in production
    if (config.development) {
      return res.send(swaggerUi.generateHTML(require(swaggerPublicPath), swaggerOptions));
    }
    return res.send(swaggerDoc);
  });

  // Introduce brief delay on all other endpoints (to simulate network traffic)
  app.use(routeDelayHandler);

  // Generated routes should be last routes registered (other than catch-all)!
  //   Authentication is implemented by tsoa based on "./authentication.ts".
  RegisterGeneratedRoutes(app);

  // Invalid route handler
  app.use((_req, res: Response) => {
    res.status(404).send({
      message: "Not Found",
    });
  });

  // Error handler, converting thrown errors into suitable shape for clients
  app.use(routeErrorHandler);

  // Server is only started upon creation if a port is provided
  if (config.port) {
    app.listen(config.port, () => {
      const serverUrl = `http://localhost:${config.port}`;
      console.info(`⚡ Server: ${serverUrl}`);
      console.info(`📃 Docs:   ${serverUrl}/docs`);
    });
  }

  return app;
};
