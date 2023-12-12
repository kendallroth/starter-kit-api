import { mapToArray } from "@starter-kit-api/shared";
import dayjs from "dayjs";

import { AccountEntity, stubAccount } from "./account.entity";

export const seedAccountIds = {
  user: "71800e2e-33a1-4413-abd4-45ea1671f911",
  other: "2879f8a9-ec66-4e65-863b-b02e79ec4031",
};

const seedAccounts = (): Map<string, AccountEntity> => {
  const accountList: AccountEntity[] = [
    stubAccount({
      id: seedAccountIds.user,
      name: "Dev User",
      email: "dev@example.com",
      password: "Passw0rd!",
      createdAt: dayjs().subtract(5, "day").toISOString(),
      verifiedAt: dayjs().subtract(5, "day").toISOString(),
    }),
    stubAccount({
      id: seedAccountIds.other,
      name: "Other User",
      email: "other@example.com",
      password: "password",
      createdAt: dayjs().subtract(3, "day").toISOString(),
    }),
  ];

  return new Map(accountList.map((a) => [a.id, a]));
};

export const seededAccountMap = seedAccounts();
export const seededAccountList = mapToArray(seededAccountMap);
