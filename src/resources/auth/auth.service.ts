import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import { ClientError, UnauthorizedError } from "#common/errors";
import { mapToArray } from "#common/utilities";
import { AccountService } from "#resources/account/account.service";
import { AccountResponse } from "#resources/account/account.types";
import { serverConfig } from "#server/config";
import { database } from "#server/database";
import { RefreshTokenEntity, stubRefreshToken } from "./auth.entity";
import { AuthLoginBody, AuthenticationResponse, TokenRefreshBody } from "./auth.types";

class AuthService {
  /** Authenticate account credentials */
  public authenticate(body: AuthLoginBody): AuthenticationResponse {
    const account = AccountService.getAccountByCredentials(body.email, body.password);
    if (!account) {
      throw new UnauthorizedError("Invalid credentials", "CREDENTIALS_INVALID");
    }

    const accessToken = this.generateAccessToken(account);
    const refreshToken = this.createRefreshToken(account);

    return {
      account,
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  private generateAccessToken(account: AccountResponse): string {
    return jwt.sign(
      {
        accountId: account.id,
        email: account.email,
      },
      serverConfig.auth.jwtSecret,
      { expiresIn: serverConfig.auth.jwtExpiry },
    );
  }

  /** Clean up any non-valid or expired refresh tokens */
  private cleanupRefreshTokens() {
    const refreshTokens = mapToArray(database.data!.refreshTokens);
    for (const token of refreshTokens) {
      if (dayjs(token.expiresAt).isBefore()) {
        this.deleteRefreshToken(token.id);
      }
    }
  }

  private getRefreshToken(token: string): RefreshTokenEntity {
    const refreshToken = mapToArray(database.data!.refreshTokens).find((t) => t.token === token);
    if (!refreshToken) {
      throw new ClientError("Invalid refresh token", "REFRESH_TOKEN_INVALID");
    }
    return refreshToken;
  }

  private createRefreshToken(account: AccountResponse): RefreshTokenEntity {
    const tokenString = `${uuid()}${uuid()}`.replace(/-/g, "");

    // Ensure invalid refresh tokens are cleaned up
    this.cleanupRefreshTokens();

    const refreshToken = stubRefreshToken({
      accountId: account.id,
      expiresAt: dayjs().add(serverConfig.auth.refreshExpiry, "second").toISOString(),
      token: tokenString,
    });

    database.data?.refreshTokens.set(refreshToken.id, refreshToken);
    database.write();

    return refreshToken;
  }

  private deleteRefreshToken(id: string) {
    const refreshTokensRef = database.data!.refreshTokens;
    refreshTokensRef.delete(id);
    database.write();
  }

  /** Exchange refresh token for new access token */
  public refreshAuthToken(body: TokenRefreshBody): AuthenticationResponse {
    const refreshToken = this.getRefreshToken(body.refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedError("Invalid refresh token", "REFRESH_TOKEN_INVALID");
    }

    if (dayjs(refreshToken.expiresAt).isBefore()) {
      throw new UnauthorizedError("Refresh token expired", "REFRESH_TOKEN_EXPIRED");
    }

    const account = AccountService.getAccountById(refreshToken.accountId);
    if (!account) {
      throw new UnauthorizedError();
    }

    const accessToken = this.generateAccessToken(account);
    const newRefreshToken = this.createRefreshToken(account);

    // Remove current refresh token, as well as any other expired ones
    this.deleteRefreshToken(refreshToken.id);
    this.cleanupRefreshTokens();

    return {
      account,
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}

const singleton = new AuthService();
export { singleton as AuthService };
