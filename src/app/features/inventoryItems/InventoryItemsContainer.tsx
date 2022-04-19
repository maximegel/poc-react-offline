import { useEffect } from "react";
import { NotificationToastStack } from "../../shared/notifications/NotificationToastStack";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  notificationActions,
  notificationSelectors,
} from "../../store/core/notification";
import {
  inventoryItemActions,
  inventoryItemSelectors,
} from "../../store/inventoryItem";
import { InventoryItems } from "./InventoryItems";

let counter = 1;

export const InventoryItemsContainer = () => {
  const items = useAppSelector(inventoryItemSelectors.selectAll);
  const notifications = useAppSelector(notificationSelectors.selectAll);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(inventoryItemActions.loadMany());
  }, [dispatch]);

  return (
    <>
      <InventoryItems
        items={items}
        onAdd={() =>
          dispatch(
            inventoryItemActions.add({
              model: "La Sportiva Spire GTX " + counter++,
              category: "Shoes",
            }),
          )
        }
        onRemove={(item) => dispatch(inventoryItemActions.remove(item))}
      ></InventoryItems>

      <NotificationToastStack
        notifications={notifications}
        onClear={(notification) =>
          dispatch(notificationActions.clear(notification))
        }
      />
    </>
  );
};
