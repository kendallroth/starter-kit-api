import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

import { Timestamp, UUID } from "#common/types";

export interface BaseEntity {
  id: UUID;
  /** When entity was created (ISO timestamp) */
  createdAt: Timestamp;
  /** When entity was last updated (ISO timestamp) */
  updatedAt?: Timestamp | null;
}

/** Mark all base entity fields as optional */
export type OptionalEntityBase<T extends BaseEntity> = Partial<Pick<T, keyof BaseEntity>> &
  WithoutEntityBase<T>;

/** Omit base entity fields from a type */
export type WithoutEntityBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export const createEntityBase = (override: Partial<BaseEntity> = {}): BaseEntity => ({
  createdAt: dayjs().toISOString(),
  updatedAt: null,
  id: uuid(),
  ...override,
});

/** Stub an entity (providing base fields) */
export const stubEntity = <T extends BaseEntity>(data: OptionalEntityBase<T>): T => ({
  ...createEntityBase(),
  ...(data as T),
});

/**
 * Generate an entity stub function (with default values)
 *
 * Entities with nullable fields should be stubbed with `null` values, as using `undefined` will
 *   omit the values from serialization (not ideal).
 *
 * @param defaults Default values for all stubs
 */
export const getEntityStub = <T extends BaseEntity>(defaults?: Partial<T>) => (data: OptionalEntityBase<T>): T => ({
  ...(defaults ?? {}),
  ...stubEntity(data),
});
