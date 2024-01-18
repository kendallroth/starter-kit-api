import dayjs from "dayjs";
import { mapToArray } from "#common/utilities";

import { seedAccountIds } from "#resources/account/account.seed";
import { QuoteEntity, stubQuote } from "./quote.entity";

export const seedQuoteIds = {
  user_quote1: "d654731f-b4e2-450f-b392-41e538f82892",
  other_quote1: "efad6929-e16b-4341-b5c7-317ab52529d2",
};

const seedQuotes = (): Map<string, QuoteEntity> => {
  const todoList: QuoteEntity[] = [
    stubQuote({
      accountId: seedAccountIds.user,
      id: seedQuoteIds.user_quote1,
      createdAt: dayjs().subtract(8.5, "day").toISOString(),
      text: "Never wash floors!",
      description: "Hilarious anecdote from January 1 at New Year's Eve party",
      author: "Johann Kleider",
      public: true,
      tags: ["funny", "clean"],
    }),
    stubQuote({
      accountId: seedAccountIds.user,
      createdAt: dayjs().subtract(7, "day").toISOString(),
      text: "Always wax floors!",
      description: "Response to Johann at New Year's Eve party",
      author: "Myself",
      public: false,
      tags: ["response"],
    }),
    stubQuote({
      accountId: seedAccountIds.user,
      createdAt: dayjs().subtract(183, "day").toISOString(),
      text: "Well...this is going to hurt!",
      description: null,
      author: null,
      public: false,
      tags: [],
    }),
    stubQuote({
      accountId: seedAccountIds.other,
      id: seedQuoteIds.other_quote1,
      createdAt: dayjs().subtract(199, "day").toISOString(),
      text: "[A2] When in doubt...run!",
      description: null,
      author: null,
      public: true,
      tags: [],
    }),
    stubQuote({
      accountId: seedAccountIds.other,
      createdAt: dayjs().subtract(38, "day").toISOString(),
      text: "[A2] When running...run fast!",
      description: null,
      author: null,
      public: false,
      tags: [],
    }),
  ];

  return new Map(todoList.map((t) => [t.id, t]));
};

export const seededQuoteMap = seedQuotes();
export const seededQuoteList = mapToArray(seededQuoteMap);

