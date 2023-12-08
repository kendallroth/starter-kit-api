import { AccountResponse } from "#resources/account/account.types";

export interface AuthenticationResponse {
  account: AccountResponse;
  token: string;
}
