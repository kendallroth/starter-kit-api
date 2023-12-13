import { TodoEntity } from "./todo.entity";

export interface TodoCreateBody
  extends Pick<TodoEntity, "text" | "description" | "dueAt" | "starredAt"> {}

export interface TodoUpdateBody
  extends Partial<Pick<TodoEntity, "text" | "description" | "dueAt" | "starredAt">> {}

export interface TodoStatsResponse {
  /** Completed todos */
  completed: number;
  /** Starred todos */
  starred: number;
  /** Total todos */
  total: number;
  /** Overdue todos (based on `dueDate`) */
  overdue: number;
  /** Upcoming todos (based on `dueDate`) */
  upcoming: number;
  /** Uncompleted todos */
  uncompleted: number;
}
