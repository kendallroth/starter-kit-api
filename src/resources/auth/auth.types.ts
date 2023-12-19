import { AccountResponse } from "#resources/account/account.types";

export interface AuthLoginBody {
  /** @example "dev@example.com" */
  email: string;
  /**
   * @format password
   * @minLength 8
   * @example "Passw0rd!"
   */
  password: string;
}

export interface AuthenticationResponse {
  account: AccountResponse;
  /**
   * Authorization token (short expiry)
   * @format jwt
   */
  accessToken: string;
  /** Refresh toke to exchange for new authorization token */
  refreshToken: string;
}

export interface TokenRefreshBody {
  refreshToken: string;
}

export interface PasswordChangeBody {
  /** @format password */
  oldPassword: string;
  /**
   * @format password
   * @minLength 8
   */
  newPassword: string;
}
