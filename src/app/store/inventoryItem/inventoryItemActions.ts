import { createAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import {
  asFailureOf,
  asRequest,
  asSuccessOf,
  withMeta,
  withoutPayload,
  withoutRetries,
  withPayload,
  withPayloadOf,
} from "../core/network";
import { withErrorNotification } from "../core/notification";
import { InventoryItemEntity } from "./inventoryItemEntity";

const scope = "inventoryItem";

export const add = createAction(
  `${scope}/ADD_REQUEST`,
  asRequest((payload: AddPayload) => ({
    ...withPayload({ ...payload, id: uuid() }),
  })),
);
export const addSuccess = createAction(
  `${scope}/ADD_SUCCESS`,
  asSuccessOf(add, ({ request }) => withPayloadOf(request)),
);
export const addFailure = createAction(
  `${scope}/ADD_FAILURE`,
  asFailureOf(add, ({ request }) => ({
    ...withPayloadOf(request),
    ...withMeta({
      ...withErrorNotification({
        title: `Failed to add item "${request.payload.model}"`,
      }),
    }),
  })),
);
export type AddPayload = Omit<InventoryItemEntity, "id">;

export const loadMany = createAction(
  `${scope}/LOAD_MANY_REQUEST`,
  asRequest(() => ({
    ...withoutPayload(),
    ...withMeta({ ...withoutRetries() }),
  })),
);
export const loadManySuccess = createAction(
  `${scope}/LOAD_MANY_SUCCESS`,
  asSuccessOf(loadMany, (_, payload: LoadManySuccessPayload) =>
    withPayload(payload),
  ),
);
export const loadManyFailure = createAction(
  `${scope}/LOAD_MANY_FAILURE`,
  asFailureOf(loadMany, ({ request }) => withPayloadOf(request)),
);
export type LoadManySuccessPayload = InventoryItemEntity[];

export const remove = createAction(
  `${scope}/REMOVE_REQUEST`,
  asRequest((payload: RemovePayload) => ({
    ...withPayload(payload),
  })),
);
export const removeSuccess = createAction(
  `${scope}/REMOVE_SUCCESS`,
  asSuccessOf(remove, ({ request }) => withPayloadOf(request)),
);
export const removeFailure = createAction(
  `${scope}/REMOVE_FAILURE`,
  asFailureOf(remove, ({ request }) => ({
    ...withPayloadOf(request),
    ...withMeta({
      ...withErrorNotification({
        title: `Failed to remove item "${request.payload.model}"`,
      }),
    }),
  })),
);
export type RemovePayload = InventoryItemEntity;
export type RemoveFailurePayload = InventoryItemEntity;
