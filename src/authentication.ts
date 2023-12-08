import * as express from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "#common/errors";
import { appConfig } from "#config";
import { AccountEntity } from "#resources/account/account.entity";
import { AccountService } from "#resources/account/account.service";
import { AccountResponse } from "#resources/account/account.types";

export interface AuthenticatedRequest extends express.Request {
  user: AccountResponse;
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
        const account = AccountService.getAccount(accountId);
        if (!account) {
          return reject(unauthorizedError);
        }

        resolve(account);
      });
    });
  }

  throw unauthorizedError;
};
