import { createAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { NotificationEntity } from "./notificationEntity";

const scope = "notification";

export const show = createAction(`${scope}/SHOW`, (payload: ShowPayload) => ({
  payload: { ...payload, id: uuid() },
}));
export type ShowPayload = Omit<NotificationEntity, "id">;

export const clear = createAction(
  `${scope}/CLEAR`,
  (payload: ClearPayload) => ({ payload }),
);
export type ClearPayload = Pick<NotificationEntity, "id">;
