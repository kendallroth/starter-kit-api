import { TodoEntity } from "./todo.entity";

export interface TodoCreateBody
  extends Pick<TodoEntity, "text" | "description" | "dueAt" | "starredAt"> {}

export interface TodoUpdateBody
  extends Partial<Pick<TodoEntity, "text" | "description" | "dueAt" | "starredAt">> {}
