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

export interface NotificationIconProps {
  readonly variant?: "success" | "error" | "warning" | "info";
}
