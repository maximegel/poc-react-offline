import { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  notificationActions,
  notificationSelectors,
} from "../../store/core/notification";
import { NotificationEntity } from "../../store/core/notification/notificationEntity";
import {
  inventoryItemActions,
  inventoryItemSelectors,
} from "../../store/inventoryItem";

let counter = 1;

export const InventoryItems = () => {
  const items = useAppSelector(inventoryItemSelectors.selectAll);
  const notifications = useAppSelector(notificationSelectors.selectAll);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(inventoryItemActions.loadMany());
  }, [dispatch]);

  return (
    <div className="container-fluid">
      <h1>Inventory</h1>
      <table className="table w-auto">
        <thead>
          <tr>
            <th className="w-75">Model</th>
            <th className="w-25">Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.model}</td>
              <td>{item.category}</td>
              <td style={{ width: "auto" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch(inventoryItemActions.remove(item))}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() =>
            dispatch(
              inventoryItemActions.add({
                model: "La Sportiva Spire GTX " + counter++,
                category: "Shoes",
              }),
            )
          }
        >
          Add
        </button>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClear={() => dispatch(notificationActions.clear(notification))}
          ></NotificationToast>
        ))}
      </ToastContainer>
    </div>
  );
};

export const NotificationToast = ({
  notification,
  onClear,
}: NotificationToastProps) => {
  return (
    <Toast
      key={notification.id}
      autohide={true}
      onClose={() => onClear && onClear()}
    >
      <Toast.Header>
        <NotificationIcon variant={notification.variant}></NotificationIcon>
        <strong className="ms-2 me-auto text-truncate">
          {notification.title}
        </strong>
      </Toast.Header>
      {notification.body && <Toast.Body>{notification.body}</Toast.Body>}
    </Toast>
  );
};

export interface NotificationToastProps {
  readonly notification: NotificationEntity;
  readonly onClear?: () => void;
}

export const NotificationIcon = ({ variant }: NotificationIconProps) =>
  (variant === "success" && (
    <i className="fa fa-circle-check text-success"></i>
  )) ||
  (variant === "error" && (
    <i className="fa fa-circle-exclamation text-danger"></i>
  )) ||
  (variant === "warning" && (
    <i className="fa fa-triangle-exclamation text-warning"></i>
  )) || <i className="fa fa-circle-info text-info"></i>;

export type NotificationIconProps = Pick<NotificationEntity, "variant">;
