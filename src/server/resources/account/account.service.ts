import { mapToArray, omit } from "#shared/utilities";

import { ClientError, NotFoundError } from "#server/common/errors";
import { AccountEntity, stubAccount } from "#server/resources/account/account.entity";
import { AuthService } from "#server/resources/auth/auth.service";
import { AuthenticationResponse } from "#server/resources/auth/auth.types";
import { database } from "#server/server";
import { AccountCreateBody, AccountResponse } from "./account.types";

/** Scrub dangerous information from account */
const scrubAccount = (entity: AccountEntity): AccountResponse => omit(entity, ["password"]);

class AccountService {
  public getAccountByFilter(filter: (item: AccountEntity) => boolean): AccountResponse | undefined {
    const accountsRef = database.data!.accounts;
    const account = mapToArray(accountsRef).find(filter);
    return account ? scrubAccount(account) : undefined;
  }

  public getAccountById(id: string): AccountResponse | undefined {
    return this.getAccountByFilter((a) => a.id === id);
  }

  public getAccountByCredentials(email: string, password: string): AccountResponse | undefined {
    return this.getAccountByFilter((a) => a.email === email && a.password === password);
  }

  public getAccountByEmail(email: string): AccountResponse | undefined {
    return this.getAccountByFilter((a) => a.email === email);
  }

  public getAccountByIdOrEmail(idOrEmail: string) {
    return idOrEmail.includes("@")
      ? this.getAccountByEmail(idOrEmail)
      : this.getAccountById(idOrEmail);
  }

  /**
   * Get an account (by ID or email)
   *
   * @throws Error if account does not exist
   */
  public getAccount(idOrEmail: string): AccountResponse {
    const account = this.getAccountByIdOrEmail(idOrEmail);
    if (!account) {
      throw new NotFoundError();
    }

    return account;
  }

  /**
   * Creates an account
   *
   * @throws Error if account already exists with email
   */
  public createAccount = (body: AccountCreateBody): AuthenticationResponse => {
    const existingAccount = this.getAccountByEmail(body.email);
    if (existingAccount) {
      throw new ClientError("Account already exists");
    }

    const account = stubAccount({
      ...body,
    });

    return AuthService.authenticate(account);
  };
}

const singleton = new AccountService();
export { singleton as AccountService };
