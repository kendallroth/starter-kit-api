import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import { generateRandomList, mapToArray, randomBool, randomFromList } from "#common/utilities";
import { seedAccountIds, seededAccountList } from "#resources/account/account.seed";
import { QuoteEntity, stubQuote } from "./quote.entity";

export const seedQuoteIds = {
  user_quote1: "d654731f-b4e2-450f-b392-41e538f82892",
  other_quote1: "efad6929-e16b-4341-b5c7-317ab52529d2",
};

const randomAuthors = generateRandomList(
  25,
  () => `${faker.person.firstName()} ${faker.person.lastName()}`,
);

const randomTags = generateRandomList(40, () => faker.word.words(1));

const generateQuote = (): QuoteEntity => {
  const createdAt = faker.date.past({ years: 50 });

  return {
    ...stubQuote({
      accountId: randomFromList(seededAccountList).id,
      createdAt: createdAt.toISOString(),
      text: faker.lorem.sentences({ max: 4, min: 1 }),
      description: faker.lorem.sentences({ max: 2, min: 0 }) || null,
      author: randomFromList(randomAuthors),
      public: randomBool(0.8),
      tags: faker.helpers.arrayElements(randomTags, { min: 0, max: 3 }),
      updatedAt: randomBool()
        ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
        : null,
    }),
  };
};

const seedQuotes = (): Map<string, QuoteEntity> => {
  const todoList: QuoteEntity[] = [
    stubQuote({
      accountId: seedAccountIds.user,
      id: seedQuoteIds.user_quote1,
      createdAt: dayjs().subtract(1, "day").toISOString(),
      text: "Never wash floors!",
      description: "Hilarious anecdote from January 1 at New Year's Eve party",
      author: "Johann Kleider",
      public: true,
      tags: ["funny", "clean"],
    }),
    stubQuote({
      accountId: seedAccountIds.user,
      createdAt: dayjs().subtract(3, "day").toISOString(),
      text: "Always wax floors!",
      description: "Response to Johann at New Year's Eve party",
      author: "Myself",
      public: false,
      tags: ["response"],
    }),
    stubQuote({
      accountId: seedAccountIds.user,
      createdAt: dayjs().subtract(2, "day").toISOString(),
      text: "Well...this is going to hurt!",
      description: null,
      author: null,
      public: false,
      tags: [],
    }),
    stubQuote({
      accountId: seedAccountIds.other,
      id: seedQuoteIds.other_quote1,
      createdAt: dayjs().subtract(4, "day").toISOString(),
      text: "[A2] When in doubt...run!",
      description: null,
      author: null,
      public: true,
      tags: [],
    }),
    stubQuote({
      accountId: seedAccountIds.other,
      createdAt: dayjs().subtract(9, "day").toISOString(),
      text: "[A2] When running...run fast!",
      description: null,
      author: null,
      public: false,
      tags: [],
    }),
    ...generateRandomList(100, generateQuote),
  ];

  return new Map(todoList.map((t) => [t.id, t]));
};

export const seededQuoteMap = seedQuotes();
export const seededQuoteList = mapToArray(seededQuoteMap);
