import {
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer as persist } from "redux-persist";
import {
  add,
  addFailure,
  loadManySuccess,
  remove,
  removeFailure,
} from "./inventoryItemActions";
import { InventoryItemEntity } from "./inventoryItemEntity";

export const INVENTORY_ITEM_SLICE = "inventoryItems";
export type InventoryItemSlice = Record<
  typeof INVENTORY_ITEM_SLICE,
  InventoryItemState
>;

export type InventoryItemState = EntityState<InventoryItemEntity> & StateExtras;
interface StateExtras {
  activeId: string | number | null;
}

export const adapter = createEntityAdapter<InventoryItemEntity>();
const initialState = adapter.getInitialState<StateExtras>({ activeId: null });

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(add, (state, { payload }) => {
      adapter.upsertOne(state, payload);
    })
    .addCase(addFailure, (state, { payload }) => {
      adapter.removeOne(state, payload.id);
    })
    .addCase(loadManySuccess, (state, { payload }) => {
      adapter.setAll(state, payload);
    })
    .addCase(remove, (state, { payload }) => {
      adapter.removeOne(state, payload.id);
    })
    .addCase(removeFailure, (state, { payload }) => {
      adapter.upsertOne(state, payload);
    }),
);

export const inventoryItemReducer = persist(
  { key: INVENTORY_ITEM_SLICE, storage: localforage },
  reducer,
);
