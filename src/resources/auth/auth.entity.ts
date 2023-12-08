import { BaseEntity, stubEntity } from "#common/entities";
import { Timestamp, UUID } from "#common/types";

export interface RefreshTokenEntity extends BaseEntity {
  // Relationships
  accountId: UUID;

  token: string;
  /** When token expires (ISO timestamp) */
  expiresAt: Timestamp;
}

export const stubRefreshToken = stubEntity<RefreshTokenEntity>;

