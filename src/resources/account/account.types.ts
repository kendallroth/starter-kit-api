import { AccountEntity } from "./account.entity";

export interface AccountResponse extends Omit<AccountEntity, "password"> {}

export interface AccountLoginBody {
  email: string;
}

export interface AuthenticationResponse {
  account: AccountResponse;
  token: string;
}
