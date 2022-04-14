import { AnyAction, createAction } from "@reduxjs/toolkit";

const scope = "network";

export const online = createAction(`${scope}/ONLINE`);

export const offline = createAction(`${scope}/OFFLINE`);

export const outboxRequests = createAction(
  `${scope}/OUTBOX_REQUESTS`,
  (actions: AnyAction[]) => ({ payload: actions }),
);

export const sendRequests = createAction(
  `${scope}/SEND_REQUESTS`,
  (actions: AnyAction[]) => ({ payload: actions }),
);
