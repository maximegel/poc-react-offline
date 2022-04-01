import { createSelector } from "@reduxjs/toolkit";
import { NetworkSlice, NETWORK_SLICE } from "./networkReducer";

const selectSlice = (s: NetworkSlice) => s[NETWORK_SLICE];

export const selectOnline = createSelector(selectSlice, (s) => s.online);

export const selectNextRequest = createSelector(
  selectSlice,
  (s) => s.outbox[0],
);
