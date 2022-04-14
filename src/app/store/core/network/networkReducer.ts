import {
  AnyAction,
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer as persist } from "redux-persist";
import {
  offline,
  online,
  outboxRequests,
  sendRequests,
} from "./networkActions";

export const NETWORK_SLICE = "_network";
export type NetworkSlice = Record<typeof NETWORK_SLICE, NetworkState>;

export interface NetworkState {
  online: boolean;
  outbox: EntityState<AnyAction>;
}

export const outboxAdapter = createEntityAdapter<AnyAction>({
  selectId: (a) => a.meta.requestId,
});

const initialState: NetworkState = {
  online: true,
  outbox: outboxAdapter.getInitialState(),
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(online, (state) => {
      state.online = true;
    })
    .addCase(offline, (state) => {
      state.online = false;
    })
    .addCase(outboxRequests, (state, { payload }) => {
      outboxAdapter.upsertMany(state.outbox, payload);
    })
    .addCase(sendRequests, (state, { payload }) => {
      const ids = payload.map(outboxAdapter.selectId);
      outboxAdapter.removeMany(state.outbox, ids);
    }),
);

export const networkReducer = persist(
  { key: NETWORK_SLICE, storage: localforage, blacklist: ["online", "outbox"] },
  reducer,
);
