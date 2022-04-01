import { createAction } from "@reduxjs/toolkit";
import { serializeError } from "serialize-error";
import { v4 as uuid } from "uuid";
import { InventoryItemEntity } from "./inventoryItemEntity";

const prefix = "inventoryItem";

export const add = createAction(
  `${prefix}/ADD_REQUEST`,
  (payload: AddPayload) => ({
    payload: { ...payload, id: uuid() },
    meta: { transactionId: uuid() },
  }),
);
export const addSuccess = createAction(
  `${prefix}/ADD_SUCCESS`,
  (action: ReturnType<typeof add>) => ({
    payload: undefined,
    meta: { transactionId: action.meta.transactionId },
  }),
);
export const addFailure = createAction(
  `${prefix}/ADD_FAILURE`,
  <E = unknown>({
    action,
    error,
  }: {
    action: ReturnType<typeof add>;
    error: E;
  }) => ({
    payload: action.payload,
    meta: { transactionId: action.meta.transactionId },
    error: serializeError(error),
  }),
);
export type AddPayload = Omit<InventoryItemEntity, "id">;

export const loadMany = createAction(`${prefix}/LOAD_MANY`);
export const loadManySuccess = createAction<LoadManySuccessPayload>(
  `${prefix}/LOAD_MANY_SUCCESS`,
);
export const loadManyFailure = createAction(`${prefix}/LOAD_MANY_FAILURE`);
export type LoadManySuccessPayload = InventoryItemEntity[];

export const remove = createAction<RemovePayload>(`${prefix}/REMOVE`);
export const removeSuccess = createAction(`${prefix}/REMOVE_SUCCESS`);
export const removeFailure = createAction<RemoveFailurePayload>(
  `${prefix}/REMOVE_FAILURE`,
);
export type RemovePayload = InventoryItemEntity;
export type RemoveFailurePayload = InventoryItemEntity;
