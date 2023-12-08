import jwt from "jsonwebtoken";

import { UnauthorizedError } from "#common/errors";
import { appConfig } from "#config";
import { AccountService } from "#resources/account/account.service";
import { AccountLoginBody } from "#resources/account/account.types";
import { AuthenticationResponse } from "./auth.types";

class AuthService {
  /** Authenticate account credentials */
  public authenticate = (body: AccountLoginBody): AuthenticationResponse => {
    const account = AccountService.getAccountByEmail(body.email);
    if (!account) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        accountId: account.id,
        email: account.email,
      },
      appConfig.auth.jwtSecret,
      { expiresIn: appConfig.auth.jwtExpiry },
    );

    return {
      account,
      token,
    };
  };
}

const singleton = new AuthService();
export { singleton as AuthService };
