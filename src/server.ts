import express, { NextFunction, Request, Response, json, urlencoded } from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";

import { BaseError } from "#common/errors";
import { HttpStatus } from "#common/utilities";
import { randomFromRange } from "#common/utilities/list";
import { RegisterRoutes as RegisterGeneratedRoutes } from "./generated/routes";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(json());

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  // TODO: Only import file on app startup in production!
  return res.send(swaggerUi.generateHTML(await import("./generated/swagger.json")));
});

// Introduce brief delay on all other endpoints (to simulate network traffic)
app.use((_req, _res, next) => {
  setTimeout(next, randomFromRange(100, 1000));
});

// Root API route handler
app.get("/", (_req, res) => {
  res.status(HttpStatus.OK).json({
    status: "ok",
  });
});

// Generated routes should be last routes registered (other than catch-all)!
RegisterGeneratedRoutes(app);

// Invalid route handler
app.use((_req, res: Response) => {
  res.status(404).send({
    message: "Not Found",
  });
});

// Error handler, converting thrown errors into suitable shape for clients
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation failed",
      details: err.fields,
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }

  // TODO: Decide how to handle other unexpected errors (ie plain objects, etc)?

  return next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.info(`Server listening at http://localhost:${port}`));
