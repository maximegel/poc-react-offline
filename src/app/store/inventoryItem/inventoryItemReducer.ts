import {
  createEntityAdapter,
  createReducer,
  EntityState,
} from "@reduxjs/toolkit";
import {
  add,
  addFailure,
  loadManySuccess,
  remove,
  removeFailure,
} from "./inventoryItemActions";
import { InventoryItemEntity } from "./inventoryItemEntity";

export type InventoryItemState = EntityState<InventoryItemEntity> & StateExtras;
interface StateExtras {
  activeId: string | number | null;
}

export const adapter = createEntityAdapter<InventoryItemEntity>();
const initialState = adapter.getInitialState<StateExtras>({ activeId: null });

export const inventoryItemReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(add, (state, { payload }) => {
      adapter.addOne(state, payload);
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
      adapter.addOne(state, payload);
    }),
);
