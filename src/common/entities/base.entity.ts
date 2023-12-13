import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

import { Timestamp, UUID } from "#common/types";

export interface BaseEntity {
  id: UUID;
  /** When entity was created (ISO timestamp) */
  createdAt: Timestamp;
  /** When entity was last updated (ISO timestamp) */
  updatedAt?: Timestamp;
}

/** Mark all base entity fields as optional */
export type OptionalEntityBase<T extends BaseEntity> = Partial<Pick<T, keyof BaseEntity>> &
  WithoutEntityBase<T>;

/** Omit base entity fields from a type */
export type WithoutEntityBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export const createEntityBase = (override: Partial<BaseEntity> = {}): BaseEntity => ({
  createdAt: dayjs().toISOString(),
  id: uuid(),
  ...override,
});

export const stubEntity = <T extends BaseEntity>(data: OptionalEntityBase<T>): T => ({
  ...createEntityBase(),
  ...(data as T),
});
