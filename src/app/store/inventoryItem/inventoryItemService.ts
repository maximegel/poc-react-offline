import * as actions from "./inventoryItemActions";
import { InventoryItemEntity } from "./inventoryItemEntity";

export const add = async (
  payload: ReturnType<typeof actions.add>["payload"],
) => {
  await fetch(`http://localhost:3333/inventoryItems/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res;
  });
};

export const list = () =>
  fetch("http://localhost:3333/inventoryItems")
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res;
    })
    .then((res) => res.json())
    .then((data) => data as InventoryItemEntity[]);

export const remove = async ({
  id,
}: ReturnType<typeof actions.remove>["payload"]) => {
  await fetch(`http://localhost:3333/inventoryItems/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res;
  });
};
