import { Toast } from "react-bootstrap";
import { NotificationIcon, NotificationIconProps } from "./NotificationIcon";

export const NotificationToast = ({
  notification,
  onClear,
}: NotificationToastProps) => (
  <Toast autohide={true} onClose={() => onClear && onClear()}>
    <Toast.Header>
      <NotificationIcon variant={notification.variant}></NotificationIcon>
      <strong className="ms-2 me-auto text-truncate">
        {notification.title}
      </strong>
    </Toast.Header>
    {notification.body && <Toast.Body>{notification.body}</Toast.Body>}
  </Toast>
);

export interface NotificationToastProps {
  readonly notification: {
    readonly id: string | number;
    readonly title: string;
    readonly body?: string;
    readonly variant?: NotificationIconProps["variant"];
  };
  readonly onClear?: () => void;
}
