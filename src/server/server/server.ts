import express, { Request, Response, json, urlencoded } from "express";
import swaggerUi from "swagger-ui-express";

// NOTE: Patches Express routes to support errors in async flows
import "express-async-errors";

import { RegisterRoutes as RegisterGeneratedRoutes } from "../generated/routes";
import { requestLogger, routeDelayHandler, routeErrorHandler } from "../middleware";
import { type ServerConfig, setServerConfig } from "./config";

export const initServer = (configOverride: Partial<ServerConfig> = {}) => {
  const config = setServerConfig(configOverride);

  const app = express();

  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(json());
  app.use(
    requestLogger({
      ignore: ["/docs"],
    }),
  );

  // Generated Swagger file is included in bundle during `build` step
  const swaggerPublicPath = "./swagger.json";
  const swaggerDoc = swaggerUi.generateHTML(require(swaggerPublicPath));
  app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    // Import Swagger doc for every request in development, but only on startup in production
    if (config.development) {
      return res.send(swaggerUi.generateHTML(require(swaggerPublicPath)));
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

  if (config.port) {
    app.listen(config.port, () =>
      console.info(`⚡ Server listening at http://localhost:${config.port}`),
    );
  }

  return app;
};
