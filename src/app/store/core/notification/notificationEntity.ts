import { AnyAction } from "@reduxjs/toolkit";

export interface NotificationEntity {
  id: string | number;
  title: string;
  body?: string;
  priority?: NotificationPriority;
  variant?: NotificationVariant;
  actions?: AnyAction[];
}

export type NotificationVariant = "success" | "error" | "warning" | "info";
export type NotificationPriority = "low" | "medium" | "high";
