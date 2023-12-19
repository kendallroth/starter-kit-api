import { UnauthorizedError, ValidationError } from "#common/errors";
import { AccountEntity } from "#resources/account/account.entity";
import { database } from "#server/database";
import { PasswordChangeBody } from "./auth.types";

class PasswordService {
  public changePassword(account: AccountEntity, body: PasswordChangeBody): void {
    if (account.password !== body.oldPassword) {
      throw new UnauthorizedError("Invalid credentials", "CREDENTIALS_INVALID");
    }
    if (body.newPassword === body.oldPassword) {
      throw new ValidationError(
        { newPassword: "Must be different than old password", },
        "Passwords must be different",
        "PASSWORDS_SAME",
      );
    }

    const updatedAccount = {
      ...account,
      password: body.newPassword,
    };
    database.data?.accounts.set(updatedAccount.id, updatedAccount);
    database.write();
  }
}

const singleton = new PasswordService();
export { singleton as PasswordService };
