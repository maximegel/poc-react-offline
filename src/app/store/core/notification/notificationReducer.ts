import {
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import { clear, show } from "./notificationActions";
import { NotificationEntity } from "./notificationEntity";

export const NOTIFICATION_SLICE = "_notifications";
export type NotificationSlice = Record<
  typeof NOTIFICATION_SLICE,
  NotificationState
>;

export type NotificationState = EntityState<NotificationEntity>;

export const adapter = createEntityAdapter<NotificationEntity>();
const initialState = adapter.getInitialState();

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(show, (state, { payload }) => {
      adapter.upsertOne(state, payload);
    })
    .addCase(clear, (state, { payload }) => {
      adapter.removeOne(state, payload.id);
    }),
);

export const notificationReducer = reducer;
