import { NotificationToastStack } from "../../shared/notifications/NotificationToastStack";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  notificationActions,
  notificationSelectors,
} from "../../store/core/notification";

export const ShellContainer = ({ children }: ShellContainerProps) => {
  const notifications = useAppSelector(notificationSelectors.selectAll);
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="container-fluid">{children}</div>
      <NotificationToastStack
        notifications={notifications}
        onClear={(notification) =>
          dispatch(notificationActions.clear(notification))
        }
      />
    </>
  );
};

export interface ShellContainerProps {
  readonly children: React.ReactNode;
}
