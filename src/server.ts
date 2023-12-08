import express, { Request, Response, json, urlencoded } from "express";
import swaggerUi from "swagger-ui-express";

// NOTE: Patches Express routes to support errors in async flows
import "express-async-errors";

import { HttpStatus } from "#common/utilities";
import { appConfig } from "#config";
import { RegisterRoutes as RegisterGeneratedRoutes } from "./generated/routes";
import { requestLogger, routeDelayHandler, routeErrorHandler } from "./middleware";

export const app = express();

app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(json());
app.use(requestLogger({
  ignore: ["/docs"]
}));

const swaggerDoc = swaggerUi.generateHTML(import("./generated/swagger.json"));
app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  // Import Swagger doc for every request in development, but only on startup in production
  if (appConfig.development) {
    return res.send(swaggerUi.generateHTML(await import("./generated/swagger.json")));
  }
  return res.send(swaggerDoc);
});

// Introduce brief delay on all other endpoints (to simulate network traffic)
app.use(routeDelayHandler);

// Root API route handler
app.get("/", (_req, res) => {
  res.status(HttpStatus.OK).json({
    status: "ok",
    deployment: appConfig.gitHash,
  });
});

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

app.listen(appConfig.port, () =>
  console.info(`⚡ Server listening at http://localhost:${appConfig.port}`),
);
