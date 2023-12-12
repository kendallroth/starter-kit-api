import { BaseEntity, stubEntity } from "#server/common/entities";
import { Timestamp, UUID } from "#server/common/types";

export interface TodoEntity extends BaseEntity {
  // Relationships
  accountId: UUID;

  text: string;
  description?: string | null;
  dueAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  starredAt?: Timestamp | null;
}

export const stubTodo = stubEntity<TodoEntity>;
