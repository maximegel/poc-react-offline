import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { adapter } from "./inventoryItemReducer";

const state = (s: RootState) => s.inventoryItems;
const { selectAll: all, selectById: byId } = adapter.getSelectors();

export const selectActive = createSelector(
  state,
  (s) => s.activeId && byId(s, s.activeId),
);

export const selectAll = createSelector(state, all);
