import { ToastContainer } from "react-bootstrap";
import { NotificationToast, NotificationToastProps } from "./NotificationToast";

export const NotificationToastStack = ({
  notifications,
  onClear,
}: NotificationToastStackProps) => (
  <ToastContainer position="bottom-end" className="p-3">
    {notifications.map((notification, i) => (
      <NotificationToast
        key={i}
        notification={notification}
        onClear={() => onClear && onClear(notification)}
      ></NotificationToast>
    ))}
  </ToastContainer>
);

export interface NotificationToastStackProps {
  readonly notifications: NotificationToastProps["notification"][];
  readonly onClear?: (
    notification: NotificationToastProps["notification"],
  ) => void;
}
