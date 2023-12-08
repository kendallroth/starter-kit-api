import * as express from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "#common/errors";
import { appConfig } from "#config";
import { database } from "#database";
import { AccountEntity } from "#resources/account/account.entity";

export interface AuthenticatedRequest extends express.Request {
  user: AccountEntity;
}

export const expressAuthentication = async (
  request: express.Request,
  securityName: string,
  _scopes?: string[],
): Promise<AccountEntity> => {
  const unauthorizedError = new UnauthorizedError();

  if (securityName === "jwt") {
    const authHeader = request.headers.authorization;
    if (!authHeader || Array.isArray(authHeader)) {
      throw unauthorizedError;
    }

    const [, token] = authHeader.split(" ");
    if (!token) {
      throw unauthorizedError;
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, appConfig.auth.jwtSecret, (err, decoded) => {
        if (err) {
          return reject(unauthorizedError);
        }

        // @ts-expect-error
        const accountId = decoded.accountId as string;
        // Directly access accounts table to get password (filtered out in other locations)
        const account = database.data?.accounts.get(accountId);
        if (!account) {
          return reject(unauthorizedError);
        }

        resolve(account);
      });
    });
  }

  throw unauthorizedError;
};
