import { AccountEntity } from "./account.entity";

export interface AccountResponse extends Omit<AccountEntity, "password"> {}

export interface AccountLoginBody {
  email: string;
}

export interface AuthenticateResponse {
  account: AccountResponse;
  token: string;
}
