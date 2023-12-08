import { BaseEntity, stubEntity } from "#common/entities";

export interface AccountEntity extends BaseEntity {
  email: string;
  name: string;
  verifiedAt?: string | null;
}

export const stubAccount = stubEntity<AccountEntity>;
