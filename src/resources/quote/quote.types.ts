import { QuoteEntity } from "./quote.entity";

export interface QuoteCreateBody
  extends Pick<QuoteEntity, "text" | "description" | "author" | "tags" | "public"> {}

export interface QuoteUpdateBody
  extends Partial<Pick<QuoteEntity, "text" | "description" | "author" | "tags" | "public">> {}

export interface QuoteResponse extends QuoteEntity {
  account: {
    id: string;
    name: string;
  }
}
