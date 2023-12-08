import { NotFoundError } from "#common/errors";
import { mapToArray, omit } from "#common/utilities";
import { database } from "#database";
import { AccountEntity } from "#resources/account/account.entity";
import { AccountResponse } from "./account.types";

/** Scrub dangerous information from account */
const scrubAccount = (entity: AccountEntity): AccountResponse => omit(entity, ["password"]);

class AccountService {
  public getAccountByFilter = (filter: (item: AccountEntity) => boolean): AccountResponse | undefined => {
    const accountsRef = database.data!.accounts;
    const account = mapToArray(accountsRef).find(filter);
    return account ? scrubAccount(account) : undefined;
  };

  public getAccountById = (id: string): AccountResponse | undefined => {
    return this.getAccountByFilter((a) => a.id === id);
  };

  public getAccountByCredentials = (email: string, password: string): AccountResponse | undefined => {
    return this.getAccountByFilter((a) => a.email === email && a.password === password);
  };

  public getAccountByEmail = (email: string): AccountResponse | undefined => {
    return this.getAccountByFilter((a) => a.email === email);
  };

  public getAccountByIdOrEmail = (idOrEmail: string) =>
    idOrEmail.includes("@") ? this.getAccountByEmail(idOrEmail) : this.getAccountById(idOrEmail);

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
}

const singleton = new AccountService();
export { singleton as AccountService };
