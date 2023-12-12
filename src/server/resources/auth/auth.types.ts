import { AccountResponse } from "#server/resources/account/account.types";

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
