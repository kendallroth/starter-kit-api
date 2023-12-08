import { NotFoundError } from "#common/errors";
import { mapToArray } from "#common/utilities";
import { database } from "#database";
import { AccountEntity } from "#resources/account/account.entity";

class AccountService {
  public getAccountById = (id: string): AccountEntity | undefined => {
    const accountsRef = database.data!.accounts;
    return accountsRef.get(id);
  };

  public getAccountByEmail = (email: string): AccountEntity | undefined => {
    const accountsRef = database.data!.accounts;
    return mapToArray(accountsRef).find((a) => a.email === email);
  };

  public getAccountByIdOrEmail = (idOrEmail: string) =>
    idOrEmail.includes("@") ? this.getAccountByEmail(idOrEmail) : this.getAccountById(idOrEmail);

  /**
   * Get an account (by ID or email)
   *
   * @throws Error if account does not exist
   */
  public getAccount(idOrEmail: string): AccountEntity {
    const account = this.getAccountByIdOrEmail(idOrEmail);
    if (!account) {
      throw new NotFoundError();
    }

    return account;
  }
}

const singleton = new AccountService();
export { singleton as AccountService };
