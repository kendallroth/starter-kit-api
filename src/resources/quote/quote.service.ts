import { sort } from "fast-sort";

import { getCurrentDate } from "#common/entities";
import { NotFoundError } from "#common/errors";
import { FilterOperators, PaginatedResult } from "#common/types";
import { getSortList } from "#common/utilities";
import { mapToArray, paginate } from "#common/utilities";
import { AccountEntity } from "#resources/account/account.entity";
import { database } from "#server/database";
import { QuoteEntity, stubQuote } from "./quote.entity";
import { QuoteCreateBody, QuoteUpdateBody } from "./quote.types";

class QuoteService {
  public getQuotes(account?: AccountEntity, options?: FilterOperators): PaginatedResult<QuoteEntity> {
    const quotesRef = database.data!.quotes;
    const quotes = mapToArray(quotesRef).filter((t) => account ? t.accountId === account.id : t.public);

    const validSortKeys: (keyof QuoteEntity)[] = ["author", "createdAt"];
    const sortList = getSortList(options?.sort, validSortKeys, "-createdAt");
    const sortedQuotes = sortList.length ? sort(quotes).by(sortList) : quotes;

    const paginatedQuotes = paginate(sortedQuotes, options);
    return paginatedQuotes;
  }

  public getQuoteById(id: string): QuoteEntity | undefined {
    const quotesRef = database.data!.quotes;
    return quotesRef.get(id);
  }

  public getQuote(account: AccountEntity, id: string): QuoteEntity {
    const quote = this.getQuoteById(id);
    if (!quote || (quote.accountId !== account.id && !quote.public)) {
      throw new NotFoundError();
    }

    return quote;
  }

  public async createQuote(account: AccountEntity, body: QuoteCreateBody): Promise<QuoteEntity> {
    const quote = stubQuote({
      accountId: account.id,
      ...body,
    });

    database.data?.quotes.set(quote.id, quote);
    await database.write();

    return quote;
  }

  public async deleteQuote(account: AccountEntity, id: string): Promise<QuoteEntity> {
    const quote = this.getQuoteById(id);
    if (!quote || quote.accountId !== account.id) {
      throw new NotFoundError();
    }

    database.data?.quotes.delete(id);
    await database.write();

    return quote;
  }

  public async updateQuote(account: AccountEntity, id: string, body: QuoteUpdateBody): Promise<QuoteEntity> {
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

    return updatedQuote;
  }
}

const singleton = new QuoteService();
export { singleton as QuoteService };

