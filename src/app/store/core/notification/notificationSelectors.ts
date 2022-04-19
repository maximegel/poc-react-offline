import { createSelector } from "@reduxjs/toolkit";
import {
  adapter,
  NotificationSlice,
  NOTIFICATION_SLICE,
} from "./notificationReducer";

const selectSlice = (s: NotificationSlice) => s[NOTIFICATION_SLICE];
const fromSlice = adapter.getSelectors();

export const selectAll = createSelector(selectSlice, fromSlice.selectAll);
