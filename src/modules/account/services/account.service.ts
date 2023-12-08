import jwt from "jsonwebtoken";

import { JWT_SECRET } from "#authentication";
import { NotFoundError, UnauthorizedError } from "#common/errors";
import { mapToArray } from "#common/utilities/list";
import { database } from "#database";
import { AccountEntity, AccountLoginBody, AuthenticateResponse } from "#modules/account/entities";

class AccountService {
  /** Authenticate account credentials */
  public authenticate = (body: AccountLoginBody): AuthenticateResponse => {
    const account = this.getAccountByEmail(body.email);
    if (!account) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        accountId: account.id,
        email: account.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      account,
      token,
    };
  };

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
