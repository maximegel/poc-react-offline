import { createSelector } from "@reduxjs/toolkit";
import {
  adapter,
  InventoryItemSlice,
  INVENTORY_ITEM_SLICE,
} from "./inventoryItemReducer";

const selectSlice = (s: InventoryItemSlice) => s[INVENTORY_ITEM_SLICE];
const fromSlice = adapter.getSelectors();

export const selectActive = createSelector(
  selectSlice,
  (s) => s.activeId && fromSlice.selectById(s, s.activeId),
);

export const selectAll = createSelector(selectSlice, fromSlice.selectAll);
