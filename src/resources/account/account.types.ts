import { AccountEntity } from "./account.entity";

export interface AccountResponse extends Omit<AccountEntity, "password"> {}

export interface AccountCreateBody extends Pick<AccountEntity, "email" | "name" | "password"> {}
