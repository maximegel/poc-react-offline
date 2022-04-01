import { AnyAction, createReducer } from "@reduxjs/toolkit";
import { offline, online, outboxRequests } from "./networkActions";

export const NETWORK_SLICE = "_network";
export type NetworkSlice = Record<typeof NETWORK_SLICE, NetworkState>;

export interface NetworkState {
  online: boolean;
  outbox: AnyAction[];
}

const initialState: NetworkState = {
  online: true,
  outbox: [],
};

export const networkReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(online, (state) => {
      state.online = true;
    })
    .addCase(offline, (state) => {
      state.online = false;
    })
    .addCase(outboxRequests, (state, { payload }) => {
      state.outbox = [...state.outbox, ...payload];
    }),
);
