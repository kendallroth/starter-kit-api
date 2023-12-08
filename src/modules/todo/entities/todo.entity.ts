import { BaseEntity, stubEntity } from "#common/entities";

export interface TodoEntity extends BaseEntity {
  accountId: string;

  text: string;
  description?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  starredAt?: string | null;
}

export const stubTodo = stubEntity<TodoEntity>;
