import { mapToArray } from "@starter-kit-api/shared";
import dayjs from "dayjs";

import { seedAccountIds } from "#resources/account/account.seed";
import { TodoEntity, stubTodo } from "./todo.entity";

export const seedTodoIds = {
  user_todo1: "1da2a171-37ff-43b0-8911-d02cf536bd4e",
  other_todo1: "8b1b8eab-8cf7-4555-83ec-c5813d6e3953",
};

const seedTodos = (): Map<string, TodoEntity> => {
  const todoList: TodoEntity[] = [
    stubTodo({
      accountId: seedAccountIds.user,
      id: seedTodoIds.user_todo1,
      createdAt: dayjs().subtract(0.5, "day").toISOString(),
      dueAt: dayjs().add(3, "day").toISOString(),
      text: "Wash floors",
    }),
    stubTodo({
      accountId: seedAccountIds.user,
      text: "Wax floors",
      createdAt: dayjs().subtract(2, "day").toISOString(),
      completedAt: dayjs().subtract(1, "day").toISOString(),
    }),
    stubTodo({
      accountId: seedAccountIds.other,
      id: seedTodoIds.other_todo1,
      text: "U2 Clean storage area",
      createdAt: dayjs().subtract(1, "day").toISOString(),
    }),
  ];

  return new Map(todoList.map((t) => [t.id, t]));
};

export const seededTodoMap = seedTodos();
export const seededTodoList = mapToArray(seededTodoMap);
