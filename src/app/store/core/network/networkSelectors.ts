import { createSelector } from "@reduxjs/toolkit";
import { NetworkSlice, NETWORK_SLICE, outboxAdapter } from "./networkReducer";

const selectSlice = (s: NetworkSlice) => s[NETWORK_SLICE];

const selectOutbox = createSelector(selectSlice, (s) => s.outbox);
const fromOutbox = outboxAdapter.getSelectors();

export const selectOnline = createSelector(selectSlice, (s) => s.online);

export const selectPendingRequests = createSelector(
  selectOutbox,
  fromOutbox.selectAll,
);
