import { NotificationEntity } from "./notificationEntity";

export const withSuccessNotification = (notification: NotificationMeta) =>
  withNotification({ priority: "low", ...notification, variant: "success" });

export const withErrorNotification = (notification: NotificationMeta) =>
  withNotification({ priority: "high", ...notification, variant: "error" });

export const withWarnNotification = (notification: NotificationMeta) =>
  withNotification({ priority: "medium", ...notification, variant: "warning" });

export const withInfoNotification = (notification: NotificationMeta) =>
  withNotification({ priority: "low", ...notification, variant: "info" });

export const withNotification = (notification: NotificationMeta) => ({
  notification,
});

export type NotificationMeta = Omit<NotificationEntity, "id">;
