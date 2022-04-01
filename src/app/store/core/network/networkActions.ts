import { AnyAction, createAction } from "@reduxjs/toolkit";

const prefix = "network";

export const online = createAction(`${prefix}/ONLINE`);

export const offline = createAction(`${prefix}/OFFLINE`);

export const outboxRequests = createAction(
  `${prefix}/OUTBOX_REQUESTS`,
  (actions: AnyAction[]) => ({ payload: actions }),
);
