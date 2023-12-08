import { AccountEntity } from "./account.entity";

export interface AccountResponse extends Omit<AccountEntity, "password"> {}

export interface AccountLoginBody {
  email: string;
  password: string;
}

export interface AccountCreateBody extends Pick<AccountEntity, "email" | "name" | "password"> {}
