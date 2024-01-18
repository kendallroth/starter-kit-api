import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { sort } from "fast-sort";

import { getCurrentDate } from "#common/entities";
import { NotFoundError, ServerError } from "#common/errors";
import { FilterOperators, PaginatedResult } from "#common/types";
import { getSortList, pick } from "#common/utilities";
import { mapToArray, paginate } from "#common/utilities";
import { AccountEntity } from "#resources/account/account.entity";
import { database } from "#server/database";
import { QuoteEntity, stubQuote } from "./quote.entity";
import { QuoteCreateBody, QuoteResponse, QuoteUpdateBody } from "./quote.types";

class QuoteService {
  private mapQuoteEntityToResponse = (quote: QuoteEntity): QuoteResponse => {
    const accountsRef = database.data!.accounts;
    const account = accountsRef.get(quote.accountId);
    if (!account) throw new ServerError("Invalid account requested");

    return {
      ...quote,
      account: pick(account, ["id", "name"])
    };
  };

  public getQuotes(
    account?: AccountEntity,
    options?: FilterOperators
  ): PaginatedResult<QuoteResponse> {
    const quotesRef = database.data!.quotes;
    const quotes = mapToArray(quotesRef)
      .filter((q) => (account ? q.accountId === account.id : q.public))
      .map((q) => this.mapQuoteEntityToResponse(q));

    const validSortKeys: (keyof QuoteEntity)[] = ["author", "createdAt"];
    const sortList = getSortList(options?.sort, validSortKeys, "-createdAt");
    const sortedQuotes = sortList.length ? sort(quotes).by(sortList) : quotes;

    const paginatedQuotes = paginate(sortedQuotes, options);
    return paginatedQuotes;
  }

  public getQuoteOfTheDay(): QuoteResponse {
    const quotesRef = database.data!.quotes;
    const publicQuotes = mapToArray(quotesRef).filter((q) => q.public);
    faker.seed(dayjs().unix() / 86400);
    const quote = faker.helpers.arrayElement(publicQuotes);
    faker.seed();
    return this.mapQuoteEntityToResponse(quote);
  }

  public getQuoteById(id: string): QuoteEntity | undefined {
    const quotesRef = database.data!.quotes;
    return quotesRef.get(id);
  }

  public getQuote(account: AccountEntity, id: string): QuoteResponse {
    const quote = this.getQuoteById(id);
    if (!quote || (quote.accountId !== account.id && !quote.public)) {
      throw new NotFoundError();
    }

    return this.mapQuoteEntityToResponse(quote);
  }

  public async createQuote(
    account: AccountEntity,
    body: QuoteCreateBody
  ): Promise<QuoteResponse> {
    const quote = stubQuote({
      accountId: account.id,
      ...body,
    });

    database.data?.quotes.set(quote.id, quote);
    await database.write();

    return this.mapQuoteEntityToResponse(quote);
  }

  public async deleteQuote(
    account: AccountEntity,
    id: string
  ): Promise<QuoteResponse> {
    const quote = this.getQuoteById(id);
    if (!quote || quote.accountId !== account.id) {
      throw new NotFoundError();
    }

    database.data?.quotes.delete(id);
    await database.write();

    return this.mapQuoteEntityToResponse(quote);
  }

  public async updateQuote(
    account: AccountEntity,
    id: string,
    body: QuoteUpdateBody
  ): Promise<QuoteResponse> {
    const quote = this.getQuoteById(id);
    if (!quote || quote.accountId !== account.id) {
      throw new NotFoundError();
    }

    const updatedQuote: QuoteEntity = {
      ...quote,
      ...body,
      updatedAt: getCurrentDate(),
    };

    database.data?.quotes.set(quote.id, updatedQuote);
    await database.write();

    return this.mapQuoteEntityToResponse(updatedQuote);
  }
}

const singleton = new QuoteService();
export { singleton as QuoteService };
