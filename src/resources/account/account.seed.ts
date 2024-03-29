import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import { generateRandomList, mapToArray, randomBool } from "#common/utilities";
import { AccountEntity, stubAccount } from "./account.entity";

export const seedAccountIds = {
  user: "71800e2e-33a1-4413-abd4-45ea1671f911",
  other: "2879f8a9-ec66-4e65-863b-b02e79ec4031",
};

const generateAccount = (): AccountEntity => {
  const createdAt = faker.date.past({ years: 2 });

  return {
    ...stubAccount({
      createdAt: createdAt.toISOString(),
      email: faker.internet.email(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      password: faker.internet.password({ length: 24 }),
      verifiedAt: randomBool(0.75)
        ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
        : null,
    }),
  };
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
    ...generateRandomList(20, generateAccount),
  ];

  return new Map(accountList.map((a) => [a.id, a]));
};

export const seededAccountMap = seedAccounts();
export const seededAccountList = mapToArray(seededAccountMap);
