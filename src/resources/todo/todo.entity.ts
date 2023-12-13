import { BaseEntity, stubEntity } from "#common/entities";
import { Timestamp, UUID } from "#common/types";

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
