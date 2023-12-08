import { BaseEntity, stubEntity } from "#common/entities";
import { Timestamp } from "#common/types";

export interface AccountEntity extends BaseEntity {
  /**
   * Account email
   * @format email
   */
  email: string;
  name: string;
  /** When account was verified */
  verifiedAt?: Timestamp | null;
}

export const stubAccount = stubEntity<AccountEntity>;
