import { BaseEntity, getEntityStub } from "#common/entities";
import { UUID } from "#common/types";

export interface QuoteEntity extends BaseEntity {
  // Relationships
  accountId: UUID;

  text: string;
  description?: string | null;
  author?: string | null;
  tags: string[];
  public: boolean;
}

export const stubQuote = getEntityStub<QuoteEntity>({
  description: null,
  public: false,
  tags: [],
});
